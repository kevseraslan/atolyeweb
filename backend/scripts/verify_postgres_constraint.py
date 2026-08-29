import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage

async def verify_postgres_primary_image_constraint():
    print(f"[PostgreSQL Test] Connecting to: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as session:
        # Create Category & Product
        cat = Category(name="PG Test Cat", slug="pg-test-cat", is_active=True)
        session.add(cat)
        await session.commit()
        await session.refresh(cat)

        prod = Product(category_id=cat.id, name="PG Test Product", slug="pg-test-product", is_active=True)
        session.add(prod)
        await session.commit()
        await session.refresh(prod)

        # 1. First Primary Image -> SUCCESS
        img1 = ProductImage(
            product_id=prod.id,
            cloudinary_public_id="pg_img_1",
            secure_url="https://res.cloudinary.com/demo/image/upload/pg_img_1.jpg",
            is_primary=True,
            sort_order=1,
        )
        session.add(img1)
        await session.commit()
        print("[PostgreSQL Test] First primary image inserted successfully. ID:", img1.id)

        # 2. Second Primary Image for same product -> REJECTED by PostgreSQL partial unique index
        img2 = ProductImage(
            product_id=prod.id,
            cloudinary_public_id="pg_img_2",
            secure_url="https://res.cloudinary.com/demo/image/upload/pg_img_2.jpg",
            is_primary=True,
            sort_order=2,
        )
        session.add(img2)
        try:
            await session.commit()
            print("[PostgreSQL Test] ERROR: Second primary image was unexpectedly accepted!")
            sys.exit(1)
        except IntegrityError as exc:
            await session.rollback()
            print("[PostgreSQL Test] SUCCESS: Second primary image was correctly REJECTED by PostgreSQL!")
            print(f"[PostgreSQL Test] Exception message: {exc.orig}")

        # Cleanup test data
        await session.delete(img1)
        await session.delete(prod)
        await session.delete(cat)
        await session.commit()

    await engine.dispose()
    print("[PostgreSQL Test] All PostgreSQL partial unique index constraint tests PASSED cleanly.")

if __name__ == "__main__":
    asyncio.run(verify_postgres_primary_image_constraint())
