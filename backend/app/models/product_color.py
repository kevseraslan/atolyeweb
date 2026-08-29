from sqlalchemy import BigInteger, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ProductColor(Base):
    __tablename__ = "product_colors"

    product_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("products.id", ondelete="CASCADE"),
        primary_key=True,
    )
    color_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("colors.id", ondelete="RESTRICT"),
        primary_key=True,
    )
