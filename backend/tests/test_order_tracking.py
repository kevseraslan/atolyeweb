import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory

@pytest.mark.anyio
async def test_track_order_success(async_client, db_session: AsyncSession):
    # 1. Create order
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Masif Ahşap Kütüphane",
        "requested_width": 250.0,
        "requested_height": 220.0,
        "customer_name": "Zeynep Kaya",
        "phone": "0533 111 22 33",
        "email": "zeynep@example.com",
        "city": "İzmir",
    })
    assert create_res.status_code == 201
    tracking_num = create_res.json()["tracking_number"]

    # 2. Track order with lowercase tracking and spaced phone
    track_res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": f" {tracking_num.lower()} ",
        "phone": "0533 111 22 33",
    })
    assert track_res.status_code == 200
    data = track_res.json()

    assert data["tracking_number"] == tracking_num
    assert data["status"] == "RECEIVED"
    assert data["product_name"] == "Masif Ahşap Kütüphane"
    assert data["quantity"] == 1
    assert float(data["requested_width"]) == 250.0
    assert len(data["history"]) == 1
    assert data["history"][0]["status"] == "RECEIVED"

    # Privacy verification: sensitive fields MUST NOT be present
    data_keys = set(data.keys())
    assert "phone" not in data_keys
    assert "email" not in data_keys
    assert "customer_name" not in data_keys
    assert "quoted_price" not in data_keys
    assert "approved_price" not in data_keys
    assert "admin_id" not in data_keys
    assert "changed_by_admin_id" not in data_keys

@pytest.mark.anyio
async def test_track_order_anti_enumeration_generic_404(async_client):
    # 1. Unknown tracking number -> 404 ORDER_NOT_FOUND
    res1 = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": "ATL-2026-UNKNOWN",
        "phone": "05321234567",
    })
    assert res1.status_code == 404
    err1 = res1.json()["error"]
    assert err1["code"] == "ORDER_NOT_FOUND"

    # 2. Real order created
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Sehpa",
        "customer_name": "Murat",
        "phone": "05321234567",
        "city": "Bursa",
    })
    tracking_num = create_res.json()["tracking_number"]

    # 3. Correct tracking number + wrong phone -> EXACT SAME 404 ORDER_NOT_FOUND
    res2 = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": tracking_num,
        "phone": "05399999999",  # Wrong phone
    })
    assert res2.status_code == 404
    err2 = res2.json()["error"]
    assert err2["code"] == "ORDER_NOT_FOUND"
    assert err1["message"] == err2["message"]  # Identical message

@pytest.mark.anyio
async def test_track_order_chronological_history_and_status_states(async_client, db_session: AsyncSession):
    # Create order
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Yemek Masası",
        "customer_name": "Fatma",
        "phone": "05421234567",
        "city": "Ankara",
    })
    tracking_num = create_res.json()["tracking_number"]

    # Add second status history manually for test
    stmt = select(Order).where(Order.tracking_number == tracking_num)
    order = (await db_session.execute(stmt)).scalar_one()
    order.status = OrderStatus.IN_PRODUCTION.value
    hist2 = OrderStatusHistory(
        order_id=order.id,
        old_status=OrderStatus.RECEIVED.value,
        new_status=OrderStatus.IN_PRODUCTION.value,
        note="Üretime alındı",
    )
    db_session.add(hist2)
    await db_session.commit()

    # Track order
    res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": tracking_num,
        "phone": "05421234567",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "IN_PRODUCTION"
    assert len(data["history"]) == 2
    assert data["history"][0]["status"] == "RECEIVED"
    assert data["history"][1]["status"] == "IN_PRODUCTION"

@pytest.mark.anyio
async def test_track_order_extra_fields_forbidden(async_client):
    res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": "ATL-2026-A7K39P",
        "phone": "05321234567",
        "email": "test@example.com",  # Forbidden extra field
    })
    assert res.status_code == 422
