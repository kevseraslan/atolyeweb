import hmac
import hashlib
import time
from urllib.parse import urlparse
from fastapi import Request
from app.core.config import settings
from app.core.exceptions import ForbiddenException, UnauthorizedException

CSRF_TOKEN_HEADER = "X-CSRF-Token"
CSRF_SECRET = settings.AUTH_SECRET

def get_allowed_origin() -> str:
    url = settings.FRONTEND_URL.strip().rstrip("/")
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"

def validate_origin_and_referer(request: Request) -> None:
    # Safe methods do not require origin check
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return

    allowed = get_allowed_origin()
    origin = request.headers.get("origin")
    referer = request.headers.get("referer")

    target_origin: str = ""
    if origin:
        parsed_origin = urlparse(origin.strip())
        target_origin = f"{parsed_origin.scheme}://{parsed_origin.netloc}"
    elif referer:
        parsed_ref = urlparse(referer.strip())
        target_origin = f"{parsed_ref.scheme}://{parsed_ref.netloc}"

    # In local testing or API test clients without origin header, check if origin is explicitly provided
    if target_origin and target_origin.lower() != allowed.lower():
        raise ForbiddenException("Geçersiz istek kaynağı (Origin mismatch).", code="CSRF_ORIGIN_FORBIDDEN")

def generate_csrf_token(admin_id: int, session_version: int) -> str:
    msg = f"{admin_id}:{session_version}"
    sig = hmac.new(CSRF_SECRET.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{msg}:{sig}"

def verify_csrf_token(token: str, admin_id: int, session_version: int) -> bool:
    try:
        parts = token.split(":")
        if len(parts) != 3:
            return False
        t_admin_id, t_sv, t_sig = int(parts[0]), int(parts[1]), parts[2]
        if t_admin_id != admin_id or t_sv != session_version:
            return False
        expected_msg = f"{admin_id}:{session_version}"
        expected_sig = hmac.new(CSRF_SECRET.encode("utf-8"), expected_msg.encode("utf-8"), hashlib.sha256).hexdigest()
        return hmac.compare_digest(t_sig, expected_sig)
    except Exception:
        return False

def verify_admin_csrf(request: Request, admin_id: int, session_version: int) -> None:
    # 1. Validate Origin / Referer
    validate_origin_and_referer(request)

    # 2. Safe methods do not require CSRF token
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        return

    # 3. State-changing admin endpoints MUST include valid X-CSRF-Token header
    token = request.headers.get(CSRF_TOKEN_HEADER)
    if not token or not verify_csrf_token(token, admin_id, session_version):
        raise ForbiddenException("Geçersiz veya eksik CSRF güvenlik token'ı.", code="CSRF_TOKEN_INVALID")
