import re
import unicodedata
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.category import Category

class CategoryService:
    @staticmethod
    def generate_slug(text: str) -> str:
        tr_map = {
            'ı': 'i', 'I': 'i', 'İ': 'i',
            'ğ': 'g', 'Ğ': 'g',
            'ü': 'u', 'Ü': 'u',
            'ş': 's', 'Ş': 's',
            'ö': 'o', 'Ö': 'o',
            'ç': 'c', 'Ç': 'c',
        }
        for tr_char, eng_char in tr_map.items():
            text = text.replace(tr_char, eng_char)
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
        text = re.sub(r'[^\w\s-]', '', text.lower()).strip()
        return re.sub(r'[-\s]+', '-', text)

    @staticmethod
    async def get_active_categories(db: AsyncSession) -> Sequence[Category]:
        stmt = (
            select(Category)
            .where(Category.is_active == True)
            .order_by(Category.sort_order.asc(), Category.name.asc())
        )
        result = await db.execute(stmt)
        return result.scalars().all()

