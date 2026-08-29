from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.site_settings import SiteSettings
from app.schemas.admin import PublicSiteSettingsRead

router = APIRouter()

@router.get("", response_model=PublicSiteSettingsRead)
async def get_public_site_settings(
    db: AsyncSession = Depends(get_db),
) -> PublicSiteSettingsRead:
    stmt = select(SiteSettings).where(SiteSettings.id == 1)
    res = await db.execute(stmt)
    settings_obj = res.scalar_one_or_none()
    if not settings_obj:
        settings_obj = SiteSettings(id=1, workshop_name="Artisan Woodworks")
        db.add(settings_obj)
        await db.commit()
        await db.refresh(settings_obj)

    return PublicSiteSettingsRead.model_validate(settings_obj)
