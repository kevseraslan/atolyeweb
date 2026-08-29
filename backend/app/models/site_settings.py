from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, func, BigInteger, Identity
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), Identity(), primary_key=True, autoincrement=True
    )
    workshop_name: Mapped[str] = mapped_column(String(150), default="Artisan Woodworks", nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    whatsapp: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    working_hours: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    google_maps_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    instagram_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    hero_title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    about_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
