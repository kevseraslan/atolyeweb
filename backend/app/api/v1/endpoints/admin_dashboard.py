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
    # 1. Total products count
    total_products = (await db.execute(select(func.count()).select_from(Product))).scalar() or 0

    # 2. Status counts in a SINGLE GROUP BY query (optimized from N queries to 1 query)
    status_stmt = select(Order.status, func.count(Order.id)).group_by(Order.status)
    status_results = (await db.execute(status_stmt)).all()

    status_counts: Dict[str, int] = {st.value: 0 for st in OrderStatus}
    total_orders = 0
    for st_val, cnt in status_results:
        if st_val in status_counts:
            status_counts[st_val] = cnt
        total_orders += cnt

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "new_requests": status_counts.get(OrderStatus.RECEIVED.value, 0),
        "under_review": status_counts.get(OrderStatus.UNDER_REVIEW.value, 0),
        "in_production": status_counts.get(OrderStatus.IN_PRODUCTION.value, 0),
        "ready": status_counts.get(OrderStatus.READY.value, 0),
        "status_counts": status_counts,
    }
