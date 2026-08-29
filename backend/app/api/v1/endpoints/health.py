from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AppException
from app.db.session import get_db
from app.schemas.health import HealthResponse, ReadinessResponse

router = APIRouter()

@router.get("", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        app=settings.APP_NAME,
        environment=settings.APP_ENV,
    )

@router.get("/ready", response_model=ReadinessResponse)
async def get_readiness(db: AsyncSession = Depends(get_db)) -> ReadinessResponse:
    try:
        result = await db.execute(text("SELECT 1"))
        result.scalar()
        return ReadinessResponse(status="ready")
    except Exception as e:
        raise AppException(
            message="Database readiness check failed",
            code="SERVICE_UNAVAILABLE",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        ) from e
