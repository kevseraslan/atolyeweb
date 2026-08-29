from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import (
    String,
    Text,
    Boolean,
    DateTime,
    Numeric,
    Integer,
    func,
    BigInteger,
    Identity,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), Identity(), primary_key=True, autoincrement=True
    )
    category_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    short_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    default_width: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    default_height: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    default_depth: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)

    is_customizable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="products")
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan"
    )
    colors: Mapped[List["Color"]] = relationship(
        "Color", secondary="product_colors", back_populates="products"
    )
    materials: Mapped[List["Material"]] = relationship(
        "Material", secondary="product_materials", back_populates="products"
    )

    __table_args__ = (
        Index("idx_products_category_active", "category_id", "is_active"),
        Index("idx_products_featured_active", "is_featured", "is_active"),
    )
