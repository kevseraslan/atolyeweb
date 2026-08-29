import pytest
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.category import Category
from app.models.color import Color
from app.models.material import Material
from app.models.product import Product
from app.models.product_image import ProductImage

@pytest.mark.anyio
async def test_active_categories_and_products_flow(async_client, db_session: AsyncSession):
    # 1. Create Categories (1 active, 1 inactive)
    cat_active = Category(name="Masalar Test", slug="masalar-test", sort_order=1, is_active=True)
    cat_inactive = Category(name="Gizli Kategori", slug="gizli-kategori", sort_order=2, is_active=False)
    db_session.add_all([cat_active, cat_inactive])
    await db_session.commit()
    await db_session.refresh(cat_active)
    await db_session.refresh(cat_inactive)

    # 2. Test GET /api/v1/categories
    cat_res = await async_client.get("/api/v1/categories")
    assert cat_res.status_code == 200
    cats_data = cat_res.json()
    slugs = [c["slug"] for c in cats_data]
    assert "masalar-test" in slugs
    assert "gizli-kategori" not in slugs

    # 3. Create Colors & Materials
    color1 = Color(name="Ceviz Cila", hex_code="#5d4037", is_active=True)
    mat1 = Material(name="Masif Meşe", is_active=True)
    db_session.add_all([color1, mat1])
    await db_session.commit()
    await db_session.refresh(color1)
    await db_session.refresh(mat1)

    # 4. Create Products (1 active in active cat, 1 inactive in active cat, 1 active in inactive cat)
    p_active = Product(
        category_id=cat_active.id,
        name="Ceviz Masa Test",
        slug="ceviz-masa-test",
        short_description="Özel meşe masa",
        description="Detaylı meşe masa açıklaması",
        default_width=Decimal("180.00"),
        default_height=Decimal("75.00"),
        default_depth=Decimal("90.00"),
        is_customizable=True,
        is_featured=True,
        is_active=True,
    )
    p_active.colors.append(color1)
    p_active.materials.append(mat1)

    p_inactive = Product(
        category_id=cat_active.id,
        name="Inaktif Ürün",
        slug="inaktif-urun",
        is_active=False,
    )
    p_hidden_cat = Product(
        category_id=cat_inactive.id,
        name="Gizli Kategori Ürünü",
        slug="gizli-kategori-urunu",
        is_active=True,
    )
    db_session.add_all([p_active, p_inactive, p_hidden_cat])
    await db_session.commit()
    await db_session.refresh(p_active)

    # 5. Add Product Images
    img1 = ProductImage(
        product_id=p_active.id,
        cloudinary_public_id="sample_sec_1",
        secure_url="https://res.cloudinary.com/demo/image/upload/sample2.jpg",
        sort_order=2,
        is_primary=False,
    )
    img_primary = ProductImage(
        product_id=p_active.id,
        cloudinary_public_id="sample_pri_1",
        secure_url="https://res.cloudinary.com/demo/image/upload/sample1.jpg",
        sort_order=1,
        is_primary=True,
    )
    db_session.add_all([img1, img_primary])
    await db_session.commit()

    # 6. Test GET /api/v1/products
    prod_res = await async_client.get("/api/v1/products")
    assert prod_res.status_code == 200
    prod_data = prod_res.json()
    p_slugs = [p["slug"] for p in prod_data["items"]]
    assert "ceviz-masa-test" in p_slugs
    assert "inaktif-urun" not in p_slugs
    assert "gizli-kategori-urunu" not in p_slugs

    # Verify primary image in product list item
    first_item = next(p for p in prod_data["items"] if p["slug"] == "ceviz-masa-test")
    assert first_item["primary_image"] is not None
    assert first_item["primary_image"]["is_primary"] is True
    assert first_item["primary_image"]["cloudinary_public_id"] == "sample_pri_1"

    # 7. Test Category Filter ?category=masalar-test
    filter_res = await async_client.get("/api/v1/products?category=masalar-test")
    assert filter_res.status_code == 200
    assert len(filter_res.json()["items"]) >= 1

    # 8. Test GET /api/v1/products/{slug} Detail
    detail_res = await async_client.get("/api/v1/products/ceviz-masa-test")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["name"] == "Ceviz Masa Test"
    assert len(detail_data["images"]) == 2
    assert detail_data["images"][0]["is_primary"] is True
    assert len(detail_data["colors"]) == 1
    assert detail_data["colors"][0]["name"] == "Ceviz Cila"
    assert len(detail_data["materials"]) == 1
    assert detail_data["materials"][0]["name"] == "Masif Meşe"

    # 9. Test Unknown Slug -> 404
    notfound_res = await async_client.get("/api/v1/products/non-existing-slug-xyz")
    assert notfound_res.status_code == 404
    assert notfound_res.json()["error"]["code"] == "NOT_FOUND"
