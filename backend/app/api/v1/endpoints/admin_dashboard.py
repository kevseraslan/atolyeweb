from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.product import Product
from app.models.order import Order
from app.models.enums import OrderStatus
from app.services.admin_auth_service import get_current_admin

router = APIRouter()

@router.get("")
async def get_admin_dashboard_summary(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    # Active & Total Products
    prod_stmt = select(func.count()).select_from(Product)
    total_products = (await db.execute(prod_stmt)).scalar() or 0

    # Orders count by status
    status_counts: Dict[str, int] = {}
    for st in OrderStatus:
        st_stmt = select(func.count()).select_from(Order).where(Order.status == st.value)
        cnt = (await db.execute(st_stmt)).scalar() or 0
        status_counts[st.value] = cnt

    total_orders_stmt = select(func.count()).select_from(Order)
    total_orders = (await db.execute(total_orders_stmt)).scalar() or 0

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "new_requests": status_counts.get(OrderStatus.RECEIVED.value, 0),
        "under_review": status_counts.get(OrderStatus.UNDER_REVIEW.value, 0),
        "in_production": status_counts.get(OrderStatus.IN_PRODUCTION.value, 0),
        "ready": status_counts.get(OrderStatus.READY.value, 0),
        "status_counts": status_counts,
    }
