from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderCreatedResponse
from app.services.order_service import OrderService

router = APIRouter()

@router.post("", response_model=OrderCreatedResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
) -> OrderCreatedResponse:
    return await OrderService.create_order(db=db, data=data)
