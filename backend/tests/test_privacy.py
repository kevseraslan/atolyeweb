import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.admin import Admin
from app.services.admin_auth_service import COOKIE_NAME

@pytest.mark.anyio
async def test_public_endpoints_do_not_set_admin_cookie(async_client):
    res_health = await async_client.get("/api/v1/health")
    assert res_health.status_code == 200
    assert COOKIE_NAME not in res_health.cookies

    res_products = await async_client.get("/api/v1/products")
    assert res_products.status_code == 200
    assert COOKIE_NAME not in res_products.cookies

    res_settings = await async_client.get("/api/v1/site-settings")
    assert res_settings.status_code == 200
    assert COOKIE_NAME not in res_settings.cookies

@pytest.mark.anyio
async def test_order_tracking_data_minimization(async_client, db_session: AsyncSession):
    # 1. Create order
    create_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Özelleştirilmiş Yemek Masası",
        "customer_name": "Mehmet Yılmaz",
        "phone": "05329998877",
        "email": "mehmet@example.com",
        "city": "İzmir",
        "custom_note": "Gizli müşteri açıklaması 123",
    })
    assert create_res.status_code == 201
    tracking_num = create_res.json()["tracking_number"]

    # 2. Track order
    track_res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": tracking_num,
        "phone": "05329998877",
    })
    assert track_res.status_code == 200
    data = track_res.json()

    # 3. Assert strict data minimization (No PII leaks)
    assert "customer_name" not in data
    assert "phone" not in data
    assert "email" not in data
    assert "custom_note" not in data
    assert "quoted_price" not in data
    assert "approved_price" not in data
    assert "notes" not in data
