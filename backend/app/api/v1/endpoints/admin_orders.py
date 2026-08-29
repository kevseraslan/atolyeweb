from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.order import Order
from app.models.order_admin_note import OrderAdminNote
from app.schemas.admin import (
    AdminOrderDetailRead,
    AdminOrderStatusUpdate,
    AdminOrderPriceUpdate,
    AdminOrderNoteCreate,
    AdminOrderNoteRead,
)
from app.services.admin_auth_service import get_current_admin
from app.services.admin_order_service import AdminOrderService
from app.core.exceptions import NotFoundException

router = APIRouter()

@router.get("", response_model=List[AdminOrderDetailRead])
async def list_admin_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> List[AdminOrderDetailRead]:
    stmt = (
        select(Order)
        .options(
            selectinload(Order.admin_notes).selectinload(OrderAdminNote.admin)
        )
        .order_by(Order.created_at.desc())
    )

    if status_filter:
        stmt = stmt.where(Order.status == status_filter)

    if search:
        s = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Order.tracking_number.ilike(s),
                Order.customer_name.ilike(s),
                Order.phone.ilike(s),
            )
        )

    stmt = stmt.offset(offset).limit(limit)

    res = await db.execute(stmt)
    orders = res.scalars().all()

    result = []
    for o in orders:
        product_name = o.snapshot_product_name or o.custom_product_name or "Özel Mobilya"
        notes = [
            AdminOrderNoteRead(
                id=n.id,
                note=n.note,
                admin_name=n.admin.full_name if n.admin else "Admin",
                created_at=n.created_at,
            )
            for n in o.admin_notes
        ]
        result.append(
            AdminOrderDetailRead(
                id=o.id,
                tracking_number=o.tracking_number,
                customer_name=o.customer_name,
                phone=o.phone,
                email=o.email,
                city=o.city,
                product_name=product_name,
                custom_product_name=o.custom_product_name,
                color_name=o.snapshot_color_name,
                material_name=o.snapshot_material_name,
                requested_width=o.requested_width,
                requested_height=o.requested_height,
                requested_depth=o.requested_depth,
                quantity=o.quantity,
                custom_note=o.custom_note,
                status=o.status,
                quoted_price=o.quoted_price,
                approved_price=o.approved_price,
                quoted_at=o.quoted_at,
                created_at=o.created_at,
                updated_at=o.updated_at,
                notes=notes,
            )
        )
    return result

@router.get("/{order_id}", response_model=AdminOrderDetailRead)
async def get_admin_order_detail(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> AdminOrderDetailRead:
    stmt = (
        select(Order)
        .options(selectinload(Order.admin_notes).selectinload(OrderAdminNote.admin))
        .where(Order.id == order_id)
    )
    res = await db.execute(stmt)
    o = res.scalar_one_or_none()
    if not o:
        raise NotFoundException(f"Order {order_id} not found.")

    product_name = o.snapshot_product_name or o.custom_product_name or "Özel Mobilya"
    notes = [
        AdminOrderNoteRead(
            id=n.id,
            note=n.note,
            admin_name=n.admin.full_name if n.admin else "Admin",
            created_at=n.created_at,
        )
        for n in o.admin_notes
    ]

    return AdminOrderDetailRead(
        id=o.id,
        tracking_number=o.tracking_number,
        customer_name=o.customer_name,
        phone=o.phone,
        email=o.email,
        city=o.city,
        product_name=product_name,
        custom_product_name=o.custom_product_name,
        color_name=o.snapshot_color_name,
        material_name=o.snapshot_material_name,
        requested_width=o.requested_width,
        requested_height=o.requested_height,
        requested_depth=o.requested_depth,
        quantity=o.quantity,
        custom_note=o.custom_note,
        status=o.status,
        quoted_price=o.quoted_price,
        approved_price=o.approved_price,
        quoted_at=o.quoted_at,
        created_at=o.created_at,
        updated_at=o.updated_at,
        notes=notes,
    )

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: int,
    data: AdminOrderStatusUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await AdminOrderService.update_status(
        db=db,
        order_id=order_id,
        admin_id=current_admin.id,
        new_status=data.new_status,
        note=data.note,
    )
    return {"message": "Sipariş durumu başarıyla güncellendi."}

@router.patch("/{order_id}/price")
async def update_order_price(
    order_id: int,
    data: AdminOrderPriceUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await AdminOrderService.update_price(
        db=db,
        order_id=order_id,
        admin_id=current_admin.id,
        quoted_price=float(data.quoted_price) if data.quoted_price is not None else None,
        approved_price=float(data.approved_price) if data.approved_price is not None else None,
    )
    return {"message": "Sipariş fiyat bilgileri başarıyla güncellendi."}

@router.post("/{order_id}/notes", response_model=AdminOrderNoteRead, status_code=status.HTTP_201_CREATED)
async def add_order_admin_note(
    order_id: int,
    data: AdminOrderNoteCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> AdminOrderNoteRead:
    return await AdminOrderService.add_admin_note(
        db=db,
        order_id=order_id,
        admin=current_admin,
        note_text=data.note,
    )
