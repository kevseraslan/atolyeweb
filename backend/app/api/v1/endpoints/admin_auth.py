from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.admin import AdminLoginRequest, AdminRead
from app.services.admin_auth_service import AdminAuthService, get_current_admin
from app.models.admin import Admin

router = APIRouter()

@router.post("/login", response_model=AdminRead)
async def login(
    data: AdminLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> AdminRead:
    return await AdminAuthService.login(
        db=db,
        email=data.email,
        password=data.password,
        response=response,
    )

@router.post("/logout")
async def logout(response: Response):
    return AdminAuthService.logout(response=response)

@router.get("/me", response_model=AdminRead)
async def get_me(
    current_admin: Admin = Depends(get_current_admin),
) -> AdminRead:
    return AdminRead.model_validate(current_admin)
