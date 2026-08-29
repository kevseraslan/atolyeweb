import pytest
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.color import Color
from app.models.material import Material
from app.models.product import Product
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory

@pytest.mark.anyio
async def test_create_catalog_order_success(async_client, db_session: AsyncSession):
    cat = Category(name="Masalar Cat", slug="masalar-cat", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    color = Color(name="Ceviz Cila", hex_code="#5d4037", is_active=True)
    mat = Material(name="Masif Meşe", is_active=True)
    db_session.add_all([color, mat])
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Yemek Masası", slug="yemek-masasi", is_active=True)
    prod.colors.append(color)
    prod.materials.append(mat)
    db_session.add(prod)
    await db_session.commit()

    payload = {
        "product_id": prod.id,
        "color_id": color.id,
        "material_id": mat.id,
        "requested_width": 200.0,
        "requested_height": 75.0,
        "requested_depth": 90.0,
        "quantity": 2,
        "customer_name": "Ahmet Yılmaz",
        "phone": "05321234567",
        "email": "ahmet@example.com",
        "city": "İstanbul",
        "custom_note": "Özel cila talebi",
    }

    res = await async_client.post("/api/v1/orders", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert data["tracking_number"].startswith("ATL-")
    assert data["status"] == OrderStatus.RECEIVED.value

    # Verify DB record & snapshots
    stmt = select(Order).where(Order.tracking_number == data["tracking_number"])
    db_res = await db_session.execute(stmt)
    order = db_res.scalar_one()

    assert order.customer_name == "Ahmet Yılmaz"
    assert order.phone == "+905321234567"  # Normalized E.164
    assert order.snapshot_product_name == "Yemek Masası"
    assert order.snapshot_color_name == "Ceviz Cila"
    assert order.snapshot_material_name == "Masif Meşe"
    assert order.status == "RECEIVED"

    # Verify initial status history
    hist_stmt = select(OrderStatusHistory).where(OrderStatusHistory.order_id == order.id)
    hist_res = await db_session.execute(hist_stmt)
    hist = hist_res.scalar_one()
    assert hist.old_status is None
    assert hist.new_status == "RECEIVED"

@pytest.mark.anyio
async def test_create_custom_order_success_without_email(async_client, db_session: AsyncSession):
    payload = {
        "custom_product_name": "Özel Kütüphane Ünitesi",
        "requested_width": 300.0,
        "requested_height": 240.0,
        "requested_depth": 40.0,
        "quantity": 1,
        "customer_name": "Mehmet Demir",
        "phone": "+90 533 987 6543",
        "email": None,  # Optional email omitted
        "city": "Ankara",
    }

    res = await async_client.post("/api/v1/orders", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "RECEIVED"

    stmt = select(Order).where(Order.tracking_number == data["tracking_number"])
    db_res = await db_session.execute(stmt)
    order = db_res.scalar_one()
    assert order.email is None
    assert order.custom_product_name == "Özel Kütüphane Ünitesi"

@pytest.mark.anyio
async def test_order_validation_failures(async_client, db_session: AsyncSession):
    # 1. Neither product_id nor custom_product_name -> 400
    res1 = await async_client.post("/api/v1/orders", json={
        "customer_name": "Test", "phone": "05321234567", "city": "İzmir"
    })
    assert res1.status_code == 400
    assert res1.json()["error"]["code"] == "INVALID_PRODUCT_SELECTION"

    # 2. Invalid Phone (invalid E.164 number) -> 400
    res2 = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Masa", "customer_name": "Test", "phone": "0000000000", "city": "İzmir"
    })
    assert res2.status_code == 400
    assert res2.json()["error"]["code"] == "INVALID_PHONE_NUMBER"

    # 3. Invalid Dimension (> 1000cm) -> 422
    res3 = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Masa", "requested_width": 2000.0, "customer_name": "Test", "phone": "05321234567", "city": "İzmir"
    })
    assert res3.status_code == 422

    # 4. Invalid Quantity (> 100) -> 422
    res4 = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Masa", "quantity": 500, "customer_name": "Test", "phone": "05321234567", "city": "İzmir"
    })
    assert res4.status_code == 422

@pytest.mark.anyio
async def test_order_inactive_product_and_relation_failures(async_client, db_session: AsyncSession):
    cat_inact = Category(name="Pasif Cat", slug="pasif-cat-ord", is_active=False)
    db_session.add(cat_inact)
    await db_session.commit()

    prod_inact_cat = Product(category_id=cat_inact.id, name="Gizli Ürün", slug="gizli-urun-ord", is_active=True)
    db_session.add(prod_inact_cat)
    await db_session.commit()

    # Product under inactive category -> 400
    res = await async_client.post("/api/v1/orders", json={
        "product_id": prod_inact_cat.id,
        "customer_name": "Test User",
        "phone": "05321234567",
        "city": "Bursa",
    })
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_PRODUCT"
