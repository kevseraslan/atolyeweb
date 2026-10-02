from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.category import Category
from app.schemas.category import CategoryRead
from app.schemas.admin import AdminCategoryCreate, AdminCategoryUpdate
from app.services.admin_auth_service import get_current_admin
from app.services.category_service import CategoryService
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter()

@router.get("", response_model=List[CategoryRead])
async def list_admin_categories(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> List[CategoryRead]:
    stmt = select(Category).order_by(Category.sort_order.asc(), Category.name.asc())
    res = await db.execute(stmt)
    categories = res.scalars().all()
    return [CategoryRead.model_validate(c) for c in categories]

@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_admin_category(
    data: AdminCategoryCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    slug = data.slug or CategoryService.generate_slug(data.name)
    chk_stmt = select(Category.id).where(Category.slug == slug)
    if (await db.execute(chk_stmt)).scalar_one_or_none():
        raise BadRequestException(f"Category slug '{slug}' already exists.")

    cat = Category(
        name=data.name.strip(),
        slug=slug,
        description=data.description,
        sort_order=data.sort_order,
        is_active=data.is_active,
    )
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return CategoryRead.model_validate(cat)

@router.patch("/{category_id}", response_model=CategoryRead)
async def update_admin_category(
    category_id: int,
    data: AdminCategoryUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    stmt = select(Category).where(Category.id == category_id)
    res = await db.execute(stmt)
    cat = res.scalar_one_or_none()
    if not cat:
        raise NotFoundException(f"Category {category_id} not found.")

    if data.name is not None:
        cat.name = data.name.strip()
    if data.slug is not None:
        cat.slug = data.slug.strip()
    if data.description is not None:
        cat.description = data.description
    if data.sort_order is not None:
        cat.sort_order = data.sort_order
    if data.is_active is not None:
        cat.is_active = data.is_active

    await db.commit()
    await db.refresh(cat)
    return CategoryRead.model_validate(cat)
