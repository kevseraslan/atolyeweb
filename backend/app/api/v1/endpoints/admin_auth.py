from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.admin import AdminLoginRequest, AdminRead
from app.services.admin_auth_service import AdminAuthService, get_current_admin
from app.models.admin import Admin
from app.core.rate_limit import login_limiter
from app.core.csrf import validate_origin_and_referer, generate_csrf_token

router = APIRouter()

@router.post("/login", response_model=AdminRead)
async def login(
    request: Request,
    data: AdminLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> AdminRead:
    # 1. Rate Limiting Check for Login (Max 5 attempts per IP per 15 mins)
    login_limiter.check(request)

    # 2. Origin / Referer Validation for Login
    validate_origin_and_referer(request)

    try:
        user_data = await AdminAuthService.login(
            db=db,
            email=data.email,
            password=data.password,
            response=response,
        )
        return AdminRead(
            id=user_data["id"],
            email=user_data["email"],
            full_name=user_data["full_name"],
            role=user_data["role"],
            csrf_token=user_data["csrf_token"],
        )
    except Exception:
        login_limiter.record_failure(request)
        raise

@router.post("/logout")
async def logout(
    response: Response,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await AdminAuthService.logout(db=db, admin=current_admin, response=response)

@router.get("/me", response_model=AdminRead)
async def get_me(
    current_admin: Admin = Depends(get_current_admin),
) -> AdminRead:
    csrf_token = generate_csrf_token(current_admin.id, current_admin.session_version)
    return AdminRead(
        id=current_admin.id,
        email=current_admin.email,
        full_name=current_admin.full_name,
        role=current_admin.role,
        last_login_at=current_admin.last_login_at,
        csrf_token=csrf_token,
    )
