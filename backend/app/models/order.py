from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String,
    Text,
    Integer,
    Numeric,
    DateTime,
    func,
    BigInteger,
    Identity,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.enums import OrderStatus

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), Identity(), primary_key=True, autoincrement=True
    )
    tracking_number: Mapped[str] = mapped_column(
        String(30), unique=True, index=True, nullable=False
    )

    product_id: Mapped[Optional[int]] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    color_id: Mapped[Optional[int]] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("colors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    material_id: Mapped[Optional[int]] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("materials.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Snapshot fields from DB entities
    snapshot_product_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    snapshot_color_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    snapshot_material_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Fully custom product request
    custom_product_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # Requested Dimensions (cm)
    requested_width: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    requested_height: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    requested_depth: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)

    custom_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Customer Data
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    city: Mapped[str] = mapped_column(String(50), nullable=False)

    # Status
    status: Mapped[str] = mapped_column(
        String(30), default=OrderStatus.RECEIVED.value, index=True, nullable=False
    )

    # Quote fields (Admin managed)
    quoted_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    approved_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    quoted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    product: Mapped[Optional["Product"]] = relationship("Product")
    color: Mapped[Optional["Color"]] = relationship("Color")
    material: Mapped[Optional["Material"]] = relationship("Material")
    status_history: Mapped[List["OrderStatusHistory"]] = relationship(
        "OrderStatusHistory", back_populates="order", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_orders_status_created", "status", "created_at"),
    )
