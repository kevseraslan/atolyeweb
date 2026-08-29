import datetime
import logging
from typing import Optional, List
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, NotFoundException
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory
from app.models.order_admin_note import OrderAdminNote
from app.models.admin import Admin
from app.schemas.admin import AdminOrderDetailRead, AdminOrderNoteRead

logger = logging.getLogger("app.admin_order_service")

ALLOWED_TRANSITIONS = {
    OrderStatus.RECEIVED.value: {OrderStatus.UNDER_REVIEW.value, OrderStatus.CONTACTED.value, OrderStatus.CANCELLED.value},
    OrderStatus.UNDER_REVIEW.value: {OrderStatus.CONTACTED.value, OrderStatus.QUOTED.value, OrderStatus.CANCELLED.value},
    OrderStatus.CONTACTED.value: {OrderStatus.QUOTED.value, OrderStatus.APPROVED.value, OrderStatus.CANCELLED.value},
    OrderStatus.QUOTED.value: {OrderStatus.APPROVED.value, OrderStatus.CANCELLED.value},
    OrderStatus.APPROVED.value: {OrderStatus.IN_PRODUCTION.value, OrderStatus.CANCELLED.value},
    OrderStatus.IN_PRODUCTION.value: {OrderStatus.FINISHING.value, OrderStatus.CANCELLED.value},
    OrderStatus.FINISHING.value: {OrderStatus.READY.value, OrderStatus.CANCELLED.value},
    OrderStatus.READY.value: {OrderStatus.DELIVERED.value, OrderStatus.CANCELLED.value},
    OrderStatus.DELIVERED.value: set(),
    OrderStatus.CANCELLED.value: set(),
}

class AdminOrderService:
    @staticmethod
    async def update_status(
        db: AsyncSession,
        order_id: int,
        admin_id: int,
        new_status: str,
        note: Optional[str] = None,
    ) -> Order:
        if new_status not in OrderStatus.__members__:
            raise BadRequestException(f"Geçersiz durum değeri: '{new_status}'.", code="INVALID_STATUS")

        stmt = select(Order).where(Order.id == order_id)
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()
        if not order:
            raise NotFoundException(f"ID'si {order_id} olan sipariş bulunamadı.")

        old_status = order.status
        allowed = ALLOWED_TRANSITIONS.get(old_status, set())

        if new_status not in allowed and new_status != old_status:
            raise BadRequestException(
                f"'{old_status}' durumundan '{new_status}' durumuna geçiş yapılamaz.",
                code="INVALID_STATUS_TRANSITION",
            )

        if new_status == old_status:
            return order

        # Atomic Status Update + History Insert with server-side admin_id
        order.status = new_status
        history = OrderStatusHistory(
            order_id=order.id,
            old_status=old_status,
            new_status=new_status,
            changed_by_admin_id=admin_id,
            note=note,
        )
        db.add(history)
        await db.commit()
        await db.refresh(order)
        return order

    @staticmethod
    async def update_price(
        db: AsyncSession,
        order_id: int,
        admin_id: int,
        quoted_price: Optional[float] = None,
        approved_price: Optional[float] = None,
    ) -> Order:
        stmt = select(Order).where(Order.id == order_id)
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()
        if not order:
            raise NotFoundException(f"ID'si {order_id} olan sipariş bulunamadı.")

        if quoted_price is not None:
            if quoted_price <= 0:
                raise BadRequestException("Teklif fiyatı 0'dan büyük olmalıdır.", code="INVALID_PRICE")
            order.quoted_price = quoted_price
            order.quoted_at = datetime.datetime.now(datetime.timezone.utc)

            # Automatically advance status to QUOTED if currently in CONTACTED or UNDER_REVIEW
            if order.status in [OrderStatus.UNDER_REVIEW.value, OrderStatus.CONTACTED.value]:
                old_st = order.status
                order.status = OrderStatus.QUOTED.value
                db.add(OrderStatusHistory(
                    order_id=order.id,
                    old_status=old_st,
                    new_status=OrderStatus.QUOTED.value,
                    changed_by_admin_id=admin_id,
                    note=f"Teklif fiyatı ({quoted_price} TL) tanımlandı.",
                ))

        if approved_price is not None:
            if approved_price <= 0:
                raise BadRequestException("Onaylanan fiyat 0'dan büyük olmalıdır.", code="INVALID_PRICE")
            order.approved_price = approved_price

        await db.commit()
        await db.refresh(order)
        return order

    @staticmethod
    async def add_admin_note(
        db: AsyncSession,
        order_id: int,
        admin: Admin,
        note_text: str,
    ) -> AdminOrderNoteRead:
        stmt = select(Order).where(Order.id == order_id)
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()
        if not order:
            raise NotFoundException(f"ID'si {order_id} olan sipariş bulunamadı.")

        if not note_text or not note_text.strip():
            raise BadRequestException("Dahili not boş olamaz.", code="EMPTY_NOTE")

        admin_note = OrderAdminNote(
            order_id=order.id,
            admin_id=admin.id,
            note=note_text.strip(),
        )
        db.add(admin_note)
        await db.commit()
        await db.refresh(admin_note)

        return AdminOrderNoteRead(
            id=admin_note.id,
            note=admin_note.note,
            admin_name=admin.full_name,
            created_at=admin_note.created_at,
        )
