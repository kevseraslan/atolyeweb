from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Boolean, DateTime, func, BigInteger, Identity
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Color(Base):
    __tablename__ = "colors"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), Identity(), primary_key=True, autoincrement=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    hex_code: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    texture_public_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    texture_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary="product_colors", back_populates="colors"
    )
