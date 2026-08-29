from datetime import datetime
from typing import Optional
from sqlalchemy import (
    String,
    Integer,
    Boolean,
    DateTime,
    func,
    BigInteger,
    Identity,
    ForeignKey,
    Index,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), Identity(), primary_key=True, autoincrement=True
    )
    product_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cloudinary_public_id: Mapped[str] = mapped_column(String(255), nullable=False)
    secure_url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="images")

    __table_args__ = (
        Index(
            "uix_product_images_primary",
            "product_id",
            unique=True,
            postgresql_where=text("is_primary = true"),
            sqlite_where=text("is_primary = 1"),
        ),
    )
