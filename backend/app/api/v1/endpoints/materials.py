from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.material import Material
from app.schemas.product import MaterialRead

router = APIRouter()

@router.get("", response_model=List[MaterialRead])
async def list_active_materials(db: AsyncSession = Depends(get_db)) -> List[MaterialRead]:
    stmt = (
        select(Material)
        .where(Material.is_active == True)
        .order_by(Material.sort_order.asc(), Material.name.asc())
    )
    res = await db.execute(stmt)
    materials = res.scalars().all()
    return [MaterialRead.model_validate(m) for m in materials]
