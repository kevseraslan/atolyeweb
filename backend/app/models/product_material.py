from sqlalchemy import BigInteger, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ProductMaterial(Base):
    __tablename__ = "product_materials"

    product_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("products.id", ondelete="CASCADE"),
        primary_key=True,
    )
    material_id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"),
        ForeignKey("materials.id", ondelete="RESTRICT"),
        primary_key=True,
    )
