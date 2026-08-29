from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.site_settings import SiteSettings
from app.schemas.admin import SiteSettingsUpdate, PublicSiteSettingsRead
from app.services.admin_auth_service import get_current_admin

router = APIRouter()

async def _get_or_create_settings(db: AsyncSession) -> SiteSettings:
    stmt = select(SiteSettings).where(SiteSettings.id == 1)
    res = await db.execute(stmt)
    settings_obj = res.scalar_one_or_none()
    if not settings_obj:
        settings_obj = SiteSettings(id=1, workshop_name="Artisan Woodworks")
        db.add(settings_obj)
        await db.commit()
        await db.refresh(settings_obj)
    return settings_obj

@router.get("", response_model=PublicSiteSettingsRead)
async def get_admin_site_settings(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> PublicSiteSettingsRead:
    settings_obj = await _get_or_create_settings(db)
    return PublicSiteSettingsRead.model_validate(settings_obj)

@router.patch("", response_model=PublicSiteSettingsRead)
async def update_admin_site_settings(
    data: SiteSettingsUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> PublicSiteSettingsRead:
    settings_obj = await _get_or_create_settings(db)

    for field, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(settings_obj, field, val)

    await db.commit()
    await db.refresh(settings_obj)
    return PublicSiteSettingsRead.model_validate(settings_obj)
