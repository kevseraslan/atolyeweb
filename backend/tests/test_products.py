import pytest
from decimal import Decimal
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.category import Category
from app.models.color import Color
from app.models.material import Material
from app.models.product import Product
from app.models.product_color import ProductColor
from app.models.product_material import ProductMaterial
from app.models.product_image import ProductImage

@pytest.mark.anyio
async def test_active_categories_list_and_sorting(async_client, db_session: AsyncSession):
    cat2 = Category(name="Sehpalar", slug="sehpalar", sort_order=2, is_active=True)
    cat1 = Category(name="Masalar", slug="masalar", sort_order=1, is_active=True)
    cat_inactive = Category(name="Gizli", slug="gizli", sort_order=0, is_active=False)
    db_session.add_all([cat2, cat1, cat_inactive])
    await db_session.commit()

    res = await async_client.get("/api/v1/categories")
    assert res.status_code == 200
    data = res.json()
    slugs = [c["slug"] for c in data]
    assert slugs == ["masalar", "sehpalar"]

@pytest.mark.anyio
async def test_active_products_list_and_filters(async_client, db_session: AsyncSession):
    cat_active = Category(name="Masa Cat", slug="masa-cat", sort_order=1, is_active=True)
    cat_inactive = Category(name="Pasif Cat", slug="pasif-cat", sort_order=2, is_active=False)
    db_session.add_all([cat_active, cat_inactive])
    await db_session.commit()

    p_feat = Product(category_id=cat_active.id, name="Öne Çıkan", slug="one-cikan", is_featured=True, is_active=True)
    p_norm = Product(category_id=cat_active.id, name="Normal", slug="normal", is_featured=False, is_active=True)
    p_inact = Product(category_id=cat_active.id, name="Inaktif", slug="inaktif", is_active=False)
    p_hidden_cat = Product(category_id=cat_inactive.id, name="Gizli Cat Ürün", slug="gizli-cat-urun", is_active=True)
    db_session.add_all([p_feat, p_norm, p_inact, p_hidden_cat])
    await db_session.commit()

    # 1. Product List
    res = await async_client.get("/api/v1/products")
    assert res.status_code == 200
    items = res.json()["items"]
    slugs = [p["slug"] for p in items]
    assert "one-cikan" in slugs
    assert "normal" in slugs
    assert "inaktif" not in slugs
    assert "gizli-cat-urun" not in slugs

    # 2. Category Filter
    cat_res = await async_client.get("/api/v1/products?category=masa-cat")
    assert cat_res.status_code == 200
    assert len(cat_res.json()["items"]) == 2

    # 3. Featured Filter
    feat_res = await async_client.get("/api/v1/products?featured=true")
    assert feat_res.status_code == 200
    feat_items = feat_res.json()["items"]
    assert len(feat_items) == 1
    assert feat_items[0]["slug"] == "one-cikan"

    # 4. Pagination (valid max page_size=100)
    pag_res = await async_client.get("/api/v1/products?page=1&page_size=100")
    assert pag_res.status_code == 200
    assert pag_res.json()["page_size"] == 100

    # 5. Upper bound validation check (>100 returns 422)
    invalid_pag_res = await async_client.get("/api/v1/products?page=1&page_size=1000")
    assert invalid_pag_res.status_code == 422

@pytest.mark.anyio
async def test_product_detail_and_image_ordering(async_client, db_session: AsyncSession):
    cat = Category(name="Konsollar", slug="konsollar", is_active=True)
    db_session.add_all([cat])
    await db_session.commit()

    color = Color(name="Ceviz Cila", hex_code="#5d4037", texture_url="https://example.com/texture.jpg", is_active=True)
    mat = Material(name="Masif Ahşap", description="Ahşap detay", is_active=True)
    db_session.add_all([color, mat])
    await db_session.commit()

    prod = Product(
        category_id=cat.id,
        name="Konsol Ürünü",
        slug="konsol-urunu",
        short_description="Kısa",
        description="Uzun açıklama",
        default_width=Decimal("200.00"),
        default_height=Decimal("80.00"),
        default_depth=Decimal("45.00"),
        is_customizable=True,
        is_active=True,
    )
    prod.colors.append(color)
    prod.materials.append(mat)
    db_session.add(prod)
    await db_session.commit()

    img_sec = ProductImage(product_id=prod.id, cloudinary_public_id="sec", secure_url="https://example.com/sec.jpg", sort_order=1, is_primary=False)
    img_pri = ProductImage(product_id=prod.id, cloudinary_public_id="pri", secure_url="https://example.com/pri.jpg", sort_order=2, is_primary=True)
    db_session.add_all([img_sec, img_pri])
    await db_session.commit()

    res = await async_client.get("/api/v1/products/konsol-urunu")
    assert res.status_code == 200
    data = res.json()

    assert data["name"] == "Konsol Ürünü"
    assert data["default_width"] == "200.00"
    # Deterministic image ordering (is_primary=True first)
    assert data["images"][0]["is_primary"] is True
    assert data["images"][0]["secure_url"] == "https://example.com/pri.jpg"
    assert "cloudinary_public_id" not in data["images"][0]

    # Color & Material schema (no texture_public_id in public schema)
    assert data["colors"][0]["hex_code"] == "#5d4037"
    assert "texture_public_id" not in data["colors"][0]
    assert data["materials"][0]["name"] == "Masif Ahşap"

@pytest.mark.anyio
async def test_product_detail_inactive_category_returns_404(async_client, db_session: AsyncSession):
    cat_inact = Category(name="Gizli Cat 2", slug="gizli-cat-2", is_active=False)
    db_session.add(cat_inact)
    await db_session.commit()

    p = Product(category_id=cat_inact.id, name="Test Inact Cat", slug="test-inact-cat", is_active=True)
    db_session.add(p)
    await db_session.commit()

    res = await async_client.get("/api/v1/products/test-inact-cat")
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "NOT_FOUND"

@pytest.mark.anyio
async def test_db_constraint_duplicate_category_slug(db_session: AsyncSession):
    c1 = Category(name="Cat 1", slug="dup-cat-slug")
    c2 = Category(name="Cat 2", slug="dup-cat-slug")
    db_session.add(c1)
    await db_session.commit()

    db_session.add(c2)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

@pytest.mark.anyio
async def test_db_constraint_duplicate_product_slug(db_session: AsyncSession):
    c = Category(name="Cat Unique", slug="cat-unique")
    db_session.add(c)
    await db_session.commit()

    p1 = Product(category_id=c.id, name="P1", slug="dup-prod-slug")
    p2 = Product(category_id=c.id, name="P2", slug="dup-prod-slug")
    db_session.add(p1)
    await db_session.commit()

    db_session.add(p2)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

@pytest.mark.anyio
async def test_db_constraint_duplicate_product_color(db_session: AsyncSession):
    c = Category(name="Cat Unique 2", slug="cat-unique-2")
    col = Color(name="Mavi")
    db_session.add_all([c, col])
    await db_session.commit()

    p = Product(category_id=c.id, name="P3", slug="prod-color-test")
    db_session.add(p)
    await db_session.commit()

    pc1 = ProductColor(product_id=p.id, color_id=col.id)
    pc2 = ProductColor(product_id=p.id, color_id=col.id)
    db_session.add(pc1)
    await db_session.commit()

    db_session.add(pc2)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

@pytest.mark.anyio
async def test_db_constraint_duplicate_product_material(db_session: AsyncSession):
    c = Category(name="Cat Unique 3", slug="cat-unique-3")
    mat = Material(name="Alüminyum")
    db_session.add_all([c, mat])
    await db_session.commit()

    p = Product(category_id=c.id, name="P4", slug="prod-mat-test")
    db_session.add(p)
    await db_session.commit()

    pm1 = ProductMaterial(product_id=p.id, material_id=mat.id)
    pm2 = ProductMaterial(product_id=p.id, material_id=mat.id)
    db_session.add(pm1)
    await db_session.commit()

    db_session.add(pm2)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

@pytest.mark.anyio
async def test_db_constraint_multiple_primary_images(db_session: AsyncSession):
    c = Category(name="Cat Unique 4", slug="cat-unique-4")
    db_session.add(c)
    await db_session.commit()

    p = Product(category_id=c.id, name="P5", slug="prod-img-test")
    db_session.add(p)
    await db_session.commit()

    img1 = ProductImage(product_id=p.id, cloudinary_public_id="p1", secure_url="http://p1", is_primary=True)
    img2 = ProductImage(product_id=p.id, cloudinary_public_id="p2", secure_url="http://p2", is_primary=True)
    db_session.add(img1)
    await db_session.commit()

    db_session.add(img2)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()
