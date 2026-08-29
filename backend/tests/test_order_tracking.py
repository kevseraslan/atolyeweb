import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.enums import OrderStatus
from app.models.order import Order
from app.models.order_status_history import OrderStatusHistory

@pytest.mark.anyio
async def test_track_order_success_and_data_minimization(async_client, db_session: AsyncSession):
    # 1. Create order
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Masif Ahşap Kütüphane",
        "requested_width": 250.0,
        "requested_height": 220.0,
        "custom_note": "Açık adres ve gizli notlar burada yazıyor",
        "customer_name": "Zeynep Kaya",
        "phone": "0533 111 22 33",
        "email": "zeynep@example.com",
        "city": "İzmir",
    })
    assert create_res.status_code == 201
    tracking_num = create_res.json()["tracking_number"]

    # 2. Track order
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

    # Strict Privacy verification: sensitive fields MUST NOT be present in response keys
    data_keys = set(data.keys())
    assert "custom_note" not in data_keys  # custom_note explicitly minimized
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
async def test_partial_phone_and_malformed_tracking_rejection(async_client, db_session: AsyncSession):
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Komodin",
        "customer_name": "Ali",
        "phone": "05321234567",
        "city": "Adana",
    })
    tracking_num = create_res.json()["tracking_number"]

    # Partial phone (last 7 digits) -> Generic 404
    res_partial = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": tracking_num,
        "phone": "1234567",
    })
    assert res_partial.status_code == 404
    assert res_partial.json()["error"]["code"] == "ORDER_NOT_FOUND"

    # Malformed tracking numbers (length >= 5 but invalid pattern) -> Generic 404
    for malformed in ["ATL--", "ATL-INVALID-SHORT", "ATL-2026-WAYTOOOOOOLONGSTRING"]:
        res_malformed = await async_client.post("/api/v1/orders/track", json={
            "tracking_number": malformed,
            "phone": "05321234567",
        })
        assert res_malformed.status_code == 404
        assert res_malformed.json()["error"]["code"] == "ORDER_NOT_FOUND"

    # Short malformed tracking numbers (< 5 chars) -> Pydantic 422
    res_short = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": "foo",
        "phone": "05321234567",
    })
    assert res_short.status_code == 422

@pytest.mark.anyio
async def test_track_order_cancelled_and_delivered_states(async_client, db_session: AsyncSession):
    # 1. Test Cancelled State
    c_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "İptal Masa",
        "customer_name": "Veli",
        "phone": "05441234567",
        "city": "Konya",
    })
    t_num1 = c_res.json()["tracking_number"]

    stmt1 = select(Order).where(Order.tracking_number == t_num1)
    ord1 = (await db_session.execute(stmt1)).scalar_one()
    ord1.status = OrderStatus.CANCELLED.value
    db_session.add(OrderStatusHistory(order_id=ord1.id, old_status="RECEIVED", new_status="CANCELLED"))
    await db_session.commit()

    t_res1 = await async_client.post("/api/v1/orders/track", json={"tracking_number": t_num1, "phone": "05441234567"})
    assert t_res1.status_code == 200
    assert t_res1.json()["status"] == "CANCELLED"

    # 2. Test Delivered State
    d_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Teslim Masa",
        "customer_name": "Oya",
        "phone": "05451234567",
        "city": "Kars",
    })
    t_num2 = d_res.json()["tracking_number"]

    stmt2 = select(Order).where(Order.tracking_number == t_num2)
    ord2 = (await db_session.execute(stmt2)).scalar_one()
    ord2.status = OrderStatus.DELIVERED.value
    db_session.add(OrderStatusHistory(order_id=ord2.id, old_status="RECEIVED", new_status="DELIVERED"))
    await db_session.commit()

    t_res2 = await async_client.post("/api/v1/orders/track", json={"tracking_number": t_num2, "phone": "05451234567"})
    assert t_res2.status_code == 200
    assert t_res2.json()["status"] == "DELIVERED"

@pytest.mark.anyio
async def test_track_order_extra_fields_forbidden(async_client):
    res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": "ATL-2026-A7K39P",
        "phone": "05321234567",
        "email": "test@example.com",
    })
    assert res.status_code == 422
