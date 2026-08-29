from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.order import (
    OrderCreate,
    OrderCreatedResponse,
    OrderTrackingRequest,
    OrderTrackingResponse,
)
from app.services.order_service import OrderService
from app.core.rate_limit import order_create_limiter, tracking_limiter

router = APIRouter()

@router.post("", response_model=OrderCreatedResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: Request,
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
) -> OrderCreatedResponse:
    order_create_limiter.check(request)
    return await OrderService.create_order(db=db, data=data)

@router.post("/track", response_model=OrderTrackingResponse, status_code=status.HTTP_200_OK)
async def track_order(
    request: Request,
    data: OrderTrackingRequest,
    db: AsyncSession = Depends(get_db),
) -> OrderTrackingResponse:
    tracking_limiter.check(request)
    return await OrderService.track_order(db=db, data=data)
