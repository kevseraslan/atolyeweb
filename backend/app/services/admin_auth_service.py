import datetime
import logging
import jwt
from typing import Optional
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Response, Request, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.core.exceptions import (
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
)
from app.models.admin import Admin
from app.core.csrf import generate_csrf_token, verify_admin_csrf

logger = logging.getLogger("app.admin_auth_service")

ph = PasswordHasher()
SECRET_KEY = settings.AUTH_SECRET
ALGORITHM = "HS256"
COOKIE_NAME = "__Host-admin_session" if settings.APP_ENV == "production" else "admin_session"
TOKEN_EXPIRE_HOURS = 4  # Reduced lifetime from 8h to 4h for optimal UX/Security balance

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    try:
        ph.verify(hashed_password, password)
        return True
    except (VerifyMismatchError, Exception):
        return False

def create_admin_token(admin: Admin) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(admin.id),
        "sv": admin.session_version,
        "role": admin.role,
        "iat": now,
        "exp": now + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_admin_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise UnauthorizedException("Giriş oturumunuz geçersiz veya süresi dolmuş.")

class AdminAuthService:
    @staticmethod
    async def login(
        db: AsyncSession,
        email: str,
        password: str,
        response: Response,
    ) -> dict:
        generic_unauthorized = UnauthorizedException("E-posta veya şifre hatalı.")

        stmt = select(Admin).where(Admin.email == email.strip().lower())
        res = await db.execute(stmt)
        admin = res.scalar_one_or_none()

        if not admin:
            # Execute dummy Argon2 verify to mitigate timing attacks against non-existent users
            verify_password("dummy_password_12345", "$argon2id$v=19$m=65536,t=3,p=4$dummyhash$dummyhash")
            raise generic_unauthorized

        if not verify_password(password, admin.password_hash):
            raise generic_unauthorized

        if not admin.is_active:
            raise ForbiddenException("Hesabınız pasife alınmıştır. Lütfen yönetici ile iletişime geçiniz.")

        # Update last_login_at timestamp
        admin.last_login_at = datetime.datetime.now(datetime.timezone.utc)
        await db.commit()

        token = create_admin_token(admin)
        csrf_token = generate_csrf_token(admin.id, admin.session_version)
        is_prod = settings.APP_ENV == "production"

        response.set_cookie(
            key=COOKIE_NAME,
            value=token,
            httponly=True,
            samesite="none" if is_prod else "lax",
            secure=is_prod,
            path="/",
            max_age=TOKEN_EXPIRE_HOURS * 3600,
        )
        response.headers["X-CSRF-Token"] = csrf_token

        return {
            "id": admin.id,
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role,
            "csrf_token": csrf_token,
        }

    @staticmethod
    async def logout(
        db: AsyncSession,
        admin: Admin,
        response: Response,
    ) -> dict:
        # Invalidate all existing tokens by incrementing session_version in DB
        admin.session_version += 1
        await db.commit()

        is_prod = settings.APP_ENV == "production"
        response.delete_cookie(
            key=COOKIE_NAME,
            path="/",
            httponly=True,
            samesite="none" if is_prod else "lax",
            secure=is_prod,
        )
        return {"message": "Oturum başarıyla kapatıldı ve geçersiz kılındı."}

async def get_current_admin(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Admin:
    token = request.cookies.get(COOKIE_NAME) or request.cookies.get("admin_session") or request.cookies.get("__Host-admin_session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise UnauthorizedException("Admin yetkilendirmesi gereklidir.")

    payload = decode_admin_token(token)
    admin_id = int(payload.get("sub", 0))
    token_sv = payload.get("sv")

    stmt = select(Admin).where(Admin.id == admin_id)
    res = await db.execute(stmt)
    admin = res.scalar_one_or_none()

    if not admin:
        raise UnauthorizedException("Yönetici kullanıcı bulunamadı.")

    if not admin.is_active:
        raise ForbiddenException("Yönetici hesabı pasife alınmıştır.")

    # Session Revocation Check (Token version MUST match current DB session_version)
    if token_sv != admin.session_version:
        raise UnauthorizedException("Oturum sonlandırıldı veya başka bir cihazdan çıkış yapıldı.")

    # Execute CSRF & Origin Validation for state-changing requests
    verify_admin_csrf(request, admin.id, admin.session_version)

    return admin
