from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.product import ProductListItem, ProductDetail, PaginatedResponse
from app.services.product_service import ProductService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[ProductListItem])
async def list_products(
    category: Optional[str] = Query(None, description="Category slug filter"),
    featured: Optional[bool] = Query(None, description="Featured products filter"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ProductListItem]:
    return await ProductService.get_active_products(
        db=db,
        category_slug=category,
        featured=featured,
        page=page,
        page_size=page_size,
    )

@router.get("/{slug}", response_model=ProductDetail)
async def get_product_detail(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ProductDetail:
    return await ProductService.get_product_by_slug(db=db, slug=slug)
