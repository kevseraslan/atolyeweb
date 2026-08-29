from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.category import Category

class CategoryService:
    @staticmethod
    async def get_active_categories(db: AsyncSession) -> Sequence[Category]:
        stmt = (
            select(Category)
            .where(Category.is_active == True)
            .order_by(Category.sort_order.asc(), Category.name.asc())
        )
        result = await db.execute(stmt)
        return result.scalars().all()
