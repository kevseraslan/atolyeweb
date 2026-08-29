import re
import pytest
from decimal import Decimal
from unittest.mock import patch
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.color import Color
from app.models.material import Material
from app.models.product import Product
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory
from app.services.order_service import OrderService

@pytest.mark.anyio
async def test_create_catalog_order_success(async_client, db_session: AsyncSession):
    cat = Category(name="Masalar Cat", slug="masalar-cat-t", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    color = Color(name="Ceviz Cila", hex_code="#5d4037", is_active=True)
    mat = Material(name="Masif Meşe", is_active=True)
    db_session.add_all([color, mat])
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Yemek Masası", slug="yemek-masasi-t", is_active=True)
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
        "phone": "0532 123 45 67",
        "email": " User@Example.COM ",
        "city": "İstanbul",
        "custom_note": "Özel cila talebi",
    }

    res = await async_client.post("/api/v1/orders", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert re.match(r"^ATL-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$", data["tracking_number"])
    assert data["status"] == OrderStatus.RECEIVED.value

    # Verify DB record & normalized values
    stmt = select(Order).where(Order.tracking_number == data["tracking_number"])
    db_res = await db_session.execute(stmt)
    order = db_res.scalar_one()

    assert order.customer_name == "Ahmet Yılmaz"
    assert order.phone == "+905321234567"
    assert order.email == "user@example.com"  # Lowercased and trimmed
    assert order.snapshot_product_name == "Yemek Masası"
    assert order.snapshot_color_name == "Ceviz Cila"
    assert order.snapshot_material_name == "Masif Meşe"

    # Verify initial status history
    hist_stmt = select(OrderStatusHistory).where(OrderStatusHistory.order_id == order.id)
    hist_res = await db_session.execute(hist_stmt)
    hist = hist_res.scalar_one()
    assert hist.old_status is None
    assert hist.new_status == "RECEIVED"

@pytest.mark.anyio
async def test_xor_product_selection(async_client, db_session: AsyncSession):
    cat = Category(name="Masa Cat", slug="masa-cat-xor", is_active=True)
    db_session.add(cat)
    await db_session.commit()
    prod = Product(category_id=cat.id, name="Katalog Masası", slug="katalog-masasi-xor", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    # Neither product_id nor custom_product_name -> 400
    res1 = await async_client.post("/api/v1/orders", json={
        "customer_name": "Ali", "phone": "05321234567", "city": "İzmir"
    })
    assert res1.status_code == 400
    assert res1.json()["error"]["code"] == "INVALID_PRODUCT_SELECTION"

    # Both product_id and custom_product_name -> 400
    res2 = await async_client.post("/api/v1/orders", json={
        "product_id": prod.id,
        "custom_product_name": "Özel Masa",
        "customer_name": "Ali",
        "phone": "05321234567",
        "city": "İzmir",
    })
    assert res2.status_code == 400
    assert res2.json()["error"]["code"] == "INVALID_PRODUCT_SELECTION"

@pytest.mark.anyio
async def test_forbidden_extra_fields(async_client):
    payload = {
        "custom_product_name": "Özel Kütüphane",
        "customer_name": "Mehmet",
        "phone": "05321234567",
        "city": "Ankara",
        "status": "DELIVERED",  # Forbidden
        "tracking_number": "CUSTOM-123",  # Forbidden
        "quoted_price": 5000,  # Forbidden
    }
    res = await async_client.post("/api/v1/orders", json=payload)
    assert res.status_code == 422  # Extra fields forbidden

@pytest.mark.anyio
async def test_quantity_boundaries(async_client):
    base_payload = {
        "custom_product_name": "Sandalye",
        "customer_name": "Can",
        "phone": "05321234567",
        "city": "Bursa",
    }

    # quantity 0 -> 422
    r0 = await async_client.post("/api/v1/orders", json={**base_payload, "quantity": 0})
    assert r0.status_code == 422

    # quantity 101 -> 422
    r101 = await async_client.post("/api/v1/orders", json={**base_payload, "quantity": 101})
    assert r101.status_code == 422

    # quantity 1 -> 201
    r1 = await async_client.post("/api/v1/orders", json={**base_payload, "quantity": 1})
    assert r1.status_code == 201

    # quantity 100 -> 201
    r100 = await async_client.post("/api/v1/orders", json={**base_payload, "quantity": 100})
    assert r100.status_code == 201

@pytest.mark.anyio
async def test_phone_normalization_matrix(async_client):
    valid_inputs = ["05321234567", "5321234567", "+905321234567", "0532 123 45 67"]
    for inp in valid_inputs:
        res = await async_client.post("/api/v1/orders", json={
            "custom_product_name": "Sehpa",
            "customer_name": "Test",
            "phone": inp,
            "city": "İstanbul",
        })
        assert res.status_code == 201

@pytest.mark.anyio
@patch("app.services.order_service.generate_tracking_number")
async def test_tracking_collision_retry_and_exhaustion(mock_gen, async_client, db_session: AsyncSession):
    # Setup mock to return a duplicate once, then a unique number
    mock_gen.side_effect = ["ATL-2026-DUP123", "ATL-2026-DUP123", "ATL-2026-UNIQ99"]

    payload = {
        "custom_product_name": "Masa",
        "customer_name": "Deniz",
        "phone": "05321234567",
        "city": "Antalya",
    }

    # First request
    res1 = await async_client.post("/api/v1/orders", json=payload)
    assert res1.status_code == 201
    assert res1.json()["tracking_number"] == "ATL-2026-DUP123"

    # Second request triggers collision on first attempt, retries and succeeds with UNIQ99
    res2 = await async_client.post("/api/v1/orders", json=payload)
    assert res2.status_code == 201
    assert res2.json()["tracking_number"] == "ATL-2026-UNIQ99"

@pytest.mark.anyio
@patch("app.services.order_service.generate_tracking_number")
async def test_tracking_collision_exhaustion(mock_gen, async_client, db_session: AsyncSession):
    mock_gen.return_value = "ATL-2026-ALWAYS"

    payload = {
        "custom_product_name": "Konsol",
        "customer_name": "Ece",
        "phone": "05321234567",
        "city": "Kocaeli",
    }

    # Pre-insert ALWAYS
    await async_client.post("/api/v1/orders", json=payload)

    # Next attempt fails 5 times and raises TRACKING_COLLISION
    res = await async_client.post("/api/v1/orders", json=payload)
    assert res.status_code == 500
    assert res.json()["error"]["code"] == "TRACKING_COLLISION"
