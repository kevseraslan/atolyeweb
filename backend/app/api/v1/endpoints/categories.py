from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.category import CategoryRead
from app.services.category_service import CategoryService

router = APIRouter()

@router.get("", response_model=List[CategoryRead])
async def list_categories(db: AsyncSession = Depends(get_db)) -> List[CategoryRead]:
    categories = await CategoryService.get_active_categories(db)
    return [CategoryRead.model_validate(c) for c in categories]
