from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.color import Color
from app.schemas.product import ColorRead

router = APIRouter()

@router.get("", response_model=List[ColorRead])
async def list_active_colors(db: AsyncSession = Depends(get_db)) -> List[ColorRead]:
    stmt = (
        select(Color)
        .where(Color.is_active == True)
        .order_by(Color.sort_order.asc(), Color.name.asc())
    )
    res = await db.execute(stmt)
    colors = res.scalars().all()
    return [ColorRead.model_validate(c) for c in colors]
