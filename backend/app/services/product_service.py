import re
import unicodedata
from math import ceil
from typing import Optional, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage
from app.schemas.product import ProductListItem, ProductDetail, ProductImageRead, PaginatedResponse, CategoryRead, ColorRead, MaterialRead

class ProductService:
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
    async def get_active_products(
        db: AsyncSession,
        category_slug: Optional[str] = None,
        featured: Optional[bool] = None,
        page: int = 1,
        page_size: int = 12,
    ) -> PaginatedResponse[ProductListItem]:
        page = max(1, page)
        page_size = min(max(1, page_size), 100)

        # Base query enforcing both Product.is_active = True AND Category.is_active = True at SQL level
        base_stmt = (
            select(Product)
            .join(Category, Product.category_id == Category.id)
            .where(Product.is_active == True)
            .where(Category.is_active == True)
        )

        if category_slug:
            base_stmt = base_stmt.where(Category.slug == category_slug)

        if featured is not None:
            base_stmt = base_stmt.where(Product.is_featured == featured)

        # Count total matching products
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Query items with eager loading
        items_stmt = (
            base_stmt
            .options(
                selectinload(Product.category),
                selectinload(Product.images),
                selectinload(Product.colors),
            )
            .order_by(Product.is_featured.desc(), Product.created_at.desc(), Product.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result = await db.execute(items_stmt)
        products = result.scalars().all()

        items: List[ProductListItem] = []
        for p in products:
            # Deterministic image ordering: (not is_primary, sort_order, id)
            sorted_images = sorted(
                p.images,
                key=lambda img: (not img.is_primary, img.sort_order, img.id)
            )
            primary_img = sorted_images[0] if sorted_images else None

            primary_img_read = (
                ProductImageRead.model_validate(primary_img) if primary_img else None
            )

            items.append(
                ProductListItem(
                    id=p.id,
                    name=p.name,
                    slug=p.slug,
                    short_description=p.short_description,
                    category=CategoryRead.model_validate(p.category),
                    primary_image=primary_img_read,
                    is_featured=p.is_featured,
                    is_customizable=p.is_customizable,
                    colors=[ColorRead.model_validate(c) for c in p.colors if c.is_active],
                )
            )

        total_pages = ceil(total / page_size) if total > 0 else 0

        return PaginatedResponse[ProductListItem](
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    async def get_product_by_slug(db: AsyncSession, slug: str) -> ProductDetail:
        stmt = (
            select(Product)
            .join(Category, Product.category_id == Category.id)
            .where(Product.slug == slug)
            .where(Product.is_active == True)
            .where(Category.is_active == True)
            .options(
                selectinload(Product.category),
                selectinload(Product.images),
                selectinload(Product.colors),
                selectinload(Product.materials),
            )
        )

        result = await db.execute(stmt)
        product = result.scalar_one_or_none()

        if not product:
            raise NotFoundException(message=f"Product with slug '{slug}' not found")

        # Deterministic image ordering: (not is_primary, sort_order, id)
        sorted_images = sorted(
            product.images,
            key=lambda img: (not img.is_primary, img.sort_order, img.id)
        )

        return ProductDetail(
            id=product.id,
            name=product.name,
            slug=product.slug,
            short_description=product.short_description,
            description=product.description,
            default_width=product.default_width,
            default_height=product.default_height,
            default_depth=product.default_depth,
            is_customizable=product.is_customizable,
            is_featured=product.is_featured,
            category=CategoryRead.model_validate(product.category),
            images=[ProductImageRead.model_validate(img) for img in sorted_images],
            colors=[ColorRead.model_validate(c) for c in product.colors if c.is_active],
            materials=[MaterialRead.model_validate(m) for m in product.materials if m.is_active],
        )

    @staticmethod
    async def get_by_id_or_slug(db: AsyncSession, id_or_slug: str) -> ProductDetail:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.category),
                selectinload(Product.images),
                selectinload(Product.colors),
                selectinload(Product.materials),
            )
        )
        if id_or_slug.isdigit():
            stmt = stmt.where(Product.id == int(id_or_slug))
        else:
            stmt = stmt.where(Product.slug == id_or_slug)

        result = await db.execute(stmt)
        product = result.scalar_one_or_none()

        if not product:
            raise NotFoundException(message=f"Product '{id_or_slug}' not found")

        sorted_images = sorted(
            product.images,
            key=lambda img: (not img.is_primary, img.sort_order, img.id)
        )

        return ProductDetail(
            id=product.id,
            name=product.name,
            slug=product.slug,
            short_description=product.short_description,
            description=product.description,
            default_width=product.default_width,
            default_height=product.default_height,
            default_depth=product.default_depth,
            is_customizable=product.is_customizable,
            is_featured=product.is_featured,
            category=CategoryRead.model_validate(product.category) if product.category else None,
            images=[ProductImageRead.model_validate(img) for img in sorted_images],
            colors=[ColorRead.model_validate(c) for c in product.colors if c.is_active],
            materials=[MaterialRead.model_validate(m) for m in product.materials if m.is_active],
        )
