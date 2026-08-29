import random
import string
import datetime
import logging
import re
import phonenumbers
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    AppException,
    NotFoundException,
    BadRequestException,
)
from app.models.category import Category
from app.models.product import Product
from app.models.color import Color
from app.models.material import Material
from app.models.product_color import ProductColor
from app.models.product_material import ProductMaterial
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory
from app.schemas.order import (
    OrderCreate,
    OrderCreatedResponse,
    OrderTrackingRequest,
    OrderTrackingResponse,
    OrderTrackingHistoryItem,
)

logger = logging.getLogger("app.order_service")

TRACKING_PREFIX = getattr(settings, "TRACKING_PREFIX", "ATL")
ALPHANUM = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"  # Excludes confusing characters O, I, 0, 1
TRACKING_PATTERN = re.compile(r"^[A-Z0-9]{2,8}-\d{4}-[A-Z0-9]{4,10}$")

def generate_tracking_number() -> str:
    year = datetime.datetime.now(datetime.timezone.utc).year
    random_str = "".join(random.choices(ALPHANUM, k=6))
    return f"{TRACKING_PREFIX}-{year}-{random_str}"

def normalize_phone_number(raw_phone: str) -> str:
    try:
        parsed = phonenumbers.parse(raw_phone, "TR")
        if not phonenumbers.is_valid_number(parsed):
            raise ValueError()
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except Exception:
        raise BadRequestException(
            message="Lütfen geçerli bir telefon numarası giriniz.",
            code="INVALID_PHONE_NUMBER",
        )

class OrderService:
    @staticmethod
    async def create_order(
        db: AsyncSession,
        data: OrderCreate,
    ) -> OrderCreatedResponse:
        customer_name = data.customer_name.strip()
        city = data.city.strip()
        custom_note = data.custom_note.strip() if data.custom_note and data.custom_note.strip() else None
        custom_product_name = data.custom_product_name.strip() if data.custom_product_name and data.custom_product_name.strip() else None

        # 1. Normalize Phone & Email
        normalized_phone = normalize_phone_number(data.phone)
        email: Optional[str] = None
        if data.email and data.email.strip():
            raw_email = data.email.strip().lower()
            if "@" not in raw_email or "." not in raw_email or raw_email.startswith("@") or raw_email.endswith("@"):
                raise BadRequestException(
                    message="Lütfen geçerli bir e-posta adresi giriniz.",
                    code="INVALID_EMAIL",
                )
            email = raw_email

        # 2. Product Selection XOR Check (Catalog vs Custom)
        has_catalog = data.product_id is not None
        has_custom = custom_product_name is not None

        if (has_catalog and has_custom) or (not has_catalog and not has_custom):
            raise BadRequestException(
                message="Lütfen bir katalog ürünü seçin VEYA özel ürün adı girin.",
                code="INVALID_PRODUCT_SELECTION",
            )

        snapshot_product_name: Optional[str] = None
        snapshot_color_name: Optional[str] = None
        snapshot_material_name: Optional[str] = None

        # 3. Product & Active State Validation (for Catalog request)
        if data.product_id:
            stmt = (
                select(Product)
                .join(Category, Product.category_id == Category.id)
                .where(Product.id == data.product_id)
                .where(Product.is_active == True)
                .where(Category.is_active == True)
            )
            res = await db.execute(stmt)
            product = res.scalar_one_or_none()
            if not product:
                raise BadRequestException(
                    message="Seçilen ürün mevcut değil veya yayından kaldırılmış.",
                    code="INVALID_PRODUCT",
                )
            snapshot_product_name = product.name

        # 4. Color Validation
        if data.color_id:
            col_stmt = select(Color).where(Color.id == data.color_id).where(Color.is_active == True)
            col_res = await db.execute(col_stmt)
            color = col_res.scalar_one_or_none()
            if not color:
                raise BadRequestException(
                    message="Seçilen renk mevcut değil veya aktif değil.",
                    code="INVALID_COLOR",
                )

            # Check product_color relation only for catalog request
            if data.product_id:
                pc_stmt = (
                    select(ProductColor)
                    .where(ProductColor.product_id == data.product_id)
                    .where(ProductColor.color_id == data.color_id)
                )
                pc_res = await db.execute(pc_stmt)
                if not pc_res.scalar_one_or_none():
                    raise BadRequestException(
                        message="Seçilen renk bu ürün için geçerli değil.",
                        code="INVALID_PRODUCT_COLOR_RELATION",
                    )
            snapshot_color_name = color.name

        # 5. Material Validation
        if data.material_id:
            mat_stmt = select(Material).where(Material.id == data.material_id).where(Material.is_active == True)
            mat_res = await db.execute(mat_stmt)
            material = mat_res.scalar_one_or_none()
            if not material:
                raise BadRequestException(
                    message="Seçilen malzeme mevcut değil veya aktif değil.",
                    code="INVALID_MATERIAL",
                )

            # Check product_material relation only for catalog request
            if data.product_id:
                pm_stmt = (
                    select(ProductMaterial)
                    .where(ProductMaterial.product_id == data.product_id)
                    .where(ProductMaterial.material_id == data.material_id)
                )
                pm_res = await db.execute(pm_stmt)
                if not pm_res.scalar_one_or_none():
                    raise BadRequestException(
                        message="Seçilen malzeme bu ürün için geçerli değil.",
                        code="INVALID_PRODUCT_MATERIAL_RELATION",
                    )
            snapshot_material_name = material.name

        # 6. Retry Loop for Tracking Number Creation & DB Commit
        for attempt in range(5):
            tracking_number = generate_tracking_number()
            try:
                async with db.begin_nested():
                    order = Order(
                        tracking_number=tracking_number,
                        product_id=data.product_id,
                        color_id=data.color_id,
                        material_id=data.material_id,
                        snapshot_product_name=snapshot_product_name,
                        snapshot_color_name=snapshot_color_name,
                        snapshot_material_name=snapshot_material_name,
                        custom_product_name=custom_product_name,
                        requested_width=data.requested_width,
                        requested_height=data.requested_height,
                        requested_depth=data.requested_depth,
                        custom_note=custom_note,
                        quantity=data.quantity,
                        customer_name=customer_name,
                        phone=normalized_phone,
                        email=email,
                        city=city,
                        status=OrderStatus.RECEIVED.value,
                    )
                    db.add(order)
                    await db.flush()

                    history = OrderStatusHistory(
                        order_id=order.id,
                        old_status=None,
                        new_status=OrderStatus.RECEIVED.value,
                        note="Yeni sipariş talebi başarıyla oluşturuldu.",
                    )
                    db.add(history)

                await db.commit()
                await db.refresh(order)

                return OrderCreatedResponse(
                    tracking_number=order.tracking_number,
                    status=order.status,
                    created_at=order.created_at,
                    message="Talebiniz başarıyla alındı. Müşteri temsilcimiz sizinle en kısa sürede iletişime geçecektir.",
                )
            except IntegrityError as exc:
                await db.rollback()
                if "tracking_number" in str(exc).lower() or "unique" in str(exc).lower():
                    logger.warning(f"Tracking number collision on attempt {attempt + 1}: {exc}")
                    continue
                logger.error(f"IntegrityError creating order: {exc}")
                raise AppException(
                    message="Sipariş talebi kaydedilemedi.",
                    code="ORDER_SAVE_FAILED",
                    status_code=500,
                )
            except Exception as exc:
                await db.rollback()
                logger.error(f"Failed to commit order: {exc}")
                raise AppException(
                    message="Sipariş talebi kaydedilemedi.",
                    code="ORDER_SAVE_FAILED",
                    status_code=500,
                )

        raise AppException(
            message="Sipariş takip numarası oluşturulamadı, lütfen tekrar deneyin.",
            code="TRACKING_COLLISION",
            status_code=500,
        )

    @staticmethod
    async def track_order(
        db: AsyncSession,
        data: OrderTrackingRequest,
    ) -> OrderTrackingResponse:
        # Generic error message to prevent tracking enumeration attacks
        generic_not_found = NotFoundException(
            message="Sipariş bilgileri doğrulanamadı.",
            code="ORDER_NOT_FOUND",
        )

        tracking_number = data.tracking_number.strip().upper()
        if not TRACKING_PATTERN.match(tracking_number):
            raise generic_not_found

        try:
            normalized_phone = normalize_phone_number(data.phone)
        except Exception:
            raise generic_not_found

        # Eager load status_history ordered chronologically to avoid N+1
        stmt = (
            select(Order)
            .options(selectinload(Order.status_history))
            .where(Order.tracking_number == tracking_number)
        )
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()

        if not order:
            raise generic_not_found

        # Exact normalized phone check
        if order.phone != normalized_phone:
            raise generic_not_found

        # Build chronological history
        sorted_history = sorted(
            order.status_history,
            key=lambda h: (h.created_at, h.id),
        )

        history_items = [
            OrderTrackingHistoryItem(
                status=item.new_status,
                created_at=item.created_at,
            )
            for item in sorted_history
        ]

        product_name = order.snapshot_product_name or order.custom_product_name or "Özel Mobilya"

        return OrderTrackingResponse(
            tracking_number=order.tracking_number,
            status=order.status,
            product_name=product_name,
            quantity=order.quantity,
            requested_width=order.requested_width,
            requested_height=order.requested_height,
            requested_depth=order.requested_depth,
            color_name=order.snapshot_color_name,
            material_name=order.snapshot_material_name,
            custom_note=order.custom_note,
            created_at=order.created_at,
            updated_at=order.updated_at,
            history=history_items,
        )
