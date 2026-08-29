from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.product import Product
from app.models.category import Category
from app.models.color import Color
from app.models.material import Material
from app.schemas.product import ProductDetail, ProductListItem, ProductImageRead
from app.schemas.admin import AdminProductCreate, AdminProductUpdate
from app.services.admin_auth_service import get_current_admin
from app.services.image_service import ImageService
from app.services.product_service import ProductService
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter()

@router.get("", response_model=List[ProductListItem])
async def list_admin_products(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> List[ProductListItem]:
    stmt = (
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.images),
            selectinload(Product.colors),
            selectinload(Product.materials),
        )
        .order_by(Product.created_at.desc())
    )
    res = await db.execute(stmt)
    products = res.scalars().all()
    return [ProductListItem.model_validate(p) for p in products]

@router.post("", response_model=ProductDetail, status_code=status.HTTP_201_CREATED)
async def create_admin_product(
    data: AdminProductCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ProductDetail:
    cat_stmt = select(Category).where(Category.id == data.category_id)
    cat_res = await db.execute(cat_stmt)
    if not cat_res.scalar_one_or_none():
        raise BadRequestException(f"Category {data.category_id} not found.")

    slug = data.slug or ProductService.generate_slug(data.name)
    chk_stmt = select(Product.id).where(Product.slug == slug)
    chk_res = await db.execute(chk_stmt)
    if chk_res.scalar_one_or_none():
        raise BadRequestException(f"Product slug '{slug}' already exists.")

    product = Product(
        category_id=data.category_id,
        name=data.name.strip(),
        slug=slug,
        short_description=data.short_description,
        description=data.description,
        default_width=data.default_width,
        default_height=data.default_height,
        default_depth=data.default_depth,
        is_customizable=data.is_customizable,
        is_featured=data.is_featured,
        is_active=data.is_active,
    )

    if data.color_ids:
        col_stmt = select(Color).where(Color.id.in_(data.color_ids))
        colors = (await db.execute(col_stmt)).scalars().all()
        product.colors = list(colors)

    if data.material_ids:
        mat_stmt = select(Material).where(Material.id.in_(data.material_ids))
        materials = (await db.execute(mat_stmt)).scalars().all()
        product.materials = list(materials)

    db.add(product)
    await db.commit()
    await db.refresh(product)

    return await ProductService.get_by_id_or_slug(db, str(product.id))

@router.patch("/{product_id}", response_model=ProductDetail)
async def update_admin_product(
    product_id: int,
    data: AdminProductUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ProductDetail:
    stmt = select(Product).where(Product.id == product_id)
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise NotFoundException(f"Product {product_id} not found.")

    if data.category_id is not None:
        cat_stmt = select(Category).where(Category.id == data.category_id)
        if not (await db.execute(cat_stmt)).scalar_one_or_none():
            raise BadRequestException(f"Category {data.category_id} not found.")
        product.category_id = data.category_id

    if data.name is not None:
        product.name = data.name.strip()
    if data.slug is not None:
        product.slug = data.slug.strip()
    if data.short_description is not None:
        product.short_description = data.short_description
    if data.description is not None:
        product.description = data.description
    if data.default_width is not None:
        product.default_width = data.default_width
    if data.default_height is not None:
        product.default_height = data.default_height
    if data.default_depth is not None:
        product.default_depth = data.default_depth
    if data.is_customizable is not None:
        product.is_customizable = data.is_customizable
    if data.is_featured is not None:
        product.is_featured = data.is_featured
    if data.is_active is not None:
        product.is_active = data.is_active

    if data.color_ids is not None:
        col_stmt = select(Color).where(Color.id.in_(data.color_ids))
        colors = (await db.execute(col_stmt)).scalars().all()
        product.colors = list(colors)

    if data.material_ids is not None:
        mat_stmt = select(Material).where(Material.id.in_(data.material_ids))
        materials = (await db.execute(mat_stmt)).scalars().all()
        product.materials = list(materials)

    await db.commit()
    return await ProductService.get_by_id_or_slug(db, str(product.id))

@router.delete("/{product_id}", response_model=ProductDetail)
async def deactivate_admin_product(
    product_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ProductDetail:
    stmt = select(Product).where(Product.id == product_id)
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise NotFoundException(f"Product {product_id} not found.")

    product.is_active = False
    await db.commit()
    return await ProductService.get_by_id_or_slug(db, str(product.id))

# Image Operations (Protected by get_current_admin)
@router.post("/{product_id}/images", response_model=ProductImageRead, status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    sort_order: int = Form(0),
    is_primary: bool = Form(False),
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ProductImageRead:
    file_bytes = await file.read()
    return await ImageService.upload_product_image(
        db=db,
        product_id=product_id,
        file_bytes=file_bytes,
        filename=file.filename or "image.jpg",
        alt_text=alt_text,
        sort_order=sort_order,
        is_primary=is_primary,
    )

@router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_image(
    product_id: int,
    image_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await ImageService.delete_product_image(
        db=db,
        product_id=product_id,
        image_id=image_id,
    )
    return None
