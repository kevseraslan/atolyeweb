import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product
from app.models.enums import OrderStatus
from app.models.order import Order
from app.services.admin_auth_service import hash_password, create_admin_token, COOKIE_NAME

@pytest.mark.anyio
async def test_admin_auth_flow(async_client, db_session: AsyncSession):
    # 1. Create super admin
    pass_hash = hash_password("SuperSecret12345!")
    admin = Admin(
        email="superadmin@example.com",
        password_hash=pass_hash,
        full_name="Super Admin",
        role="SUPER_ADMIN",
        is_active=True,
    )
    db_session.add(admin)
    await db_session.commit()

    # 2. Login with wrong password -> 401
    res_wrong_pass = await async_client.post("/api/v1/admin/auth/login", json={
        "email": "superadmin@example.com",
        "password": "WrongPassword123",
    })
    assert res_wrong_pass.status_code == 401

    # 3. Login with wrong email -> 401
    res_wrong_email = await async_client.post("/api/v1/admin/auth/login", json={
        "email": "nobody@example.com",
        "password": "SuperSecret12345!",
    })
    assert res_wrong_email.status_code == 401

    # 4. Correct login -> 200 + Cookie
    res_login = await async_client.post("/api/v1/admin/auth/login", json={
        "email": "superadmin@example.com",
        "password": "SuperSecret12345!",
    })
    assert res_login.status_code == 200
    assert COOKIE_NAME in async_client.cookies

    # 5. Access /admin/auth/me
    res_me = await async_client.get("/api/v1/admin/auth/me")
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "superadmin@example.com"
    assert "password_hash" not in res_me.json()

    # 6. Logout
    res_logout = await async_client.post("/api/v1/admin/auth/logout")
    assert res_logout.status_code == 200

    # 7. Unauthenticated access -> 401
    async_client.cookies.clear()
    res_unauth = await async_client.get("/api/v1/admin/auth/me")
    assert res_unauth.status_code == 401

@pytest.mark.anyio
async def test_admin_order_status_transition_policy(async_client, db_session: AsyncSession):
    # 1. Setup Admin & Login
    pass_hash = hash_password("SuperSecret12345!")
    admin = Admin(email="admin_ord@example.com", password_hash=pass_hash, full_name="Admin Ord", is_active=True)
    db_session.add(admin)
    await db_session.commit()

    token = create_admin_token(admin)
    async_client.cookies.set(COOKIE_NAME, token)

    # 2. Create customer order (Status RECEIVED)
    c_res = await async_client.post("/api/v1/orders", json={
        "custom_product_name": "Test Masa Trans",
        "customer_name": "Kaan",
        "phone": "05321234567",
        "city": "İstanbul",
    })
    tracking_num = c_res.json()["tracking_number"]

    stmt = select(Order).where(Order.tracking_number == tracking_num)
    order = (await db_session.execute(stmt)).scalar_one()

    # 3. Invalid Transition: RECEIVED -> IN_PRODUCTION (Must be rejected)
    res_invalid = await async_client.patch(f"/api/v1/admin/orders/{order.id}/status", json={
        "new_status": "IN_PRODUCTION",
        "note": "Erken üretime atlama",
    })
    assert res_invalid.status_code == 400
    assert res_invalid.json()["error"]["code"] == "INVALID_STATUS_TRANSITION"

    # 4. Valid Transition: RECEIVED -> UNDER_REVIEW
    res_valid1 = await async_client.patch(f"/api/v1/admin/orders/{order.id}/status", json={
        "new_status": "UNDER_REVIEW",
        "note": "Detaylar inceleniyor",
    })
    assert res_valid1.status_code == 200

    # 5. Set Quoted Price
    res_price = await async_client.patch(f"/api/v1/admin/orders/{order.id}/price", json={
        "quoted_price": 18500.50,
    })
    assert res_price.status_code == 200

    # 6. Add Admin Internal Note
    res_note = await async_client.post(f"/api/v1/admin/orders/{order.id}/notes", json={
        "note": "Müşteri özel cila örneği istedi.",
    })
    assert res_note.status_code == 201

    # 7. Verify Public Tracking DOES NOT leak internal notes or quoted price!
    track_res = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": tracking_num,
        "phone": "05321234567",
    })
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert "quoted_price" not in track_data
    assert "notes" not in track_data
    assert "custom_note" not in track_data

@pytest.mark.anyio
async def test_admin_site_settings(async_client, db_session: AsyncSession):
    pass_hash = hash_password("SuperSecret12345!")
    admin = Admin(email="admin_set@example.com", password_hash=pass_hash, full_name="Admin Set", is_active=True)
    db_session.add(admin)
    await db_session.commit()

    token = create_admin_token(admin)
    async_client.cookies.set(COOKIE_NAME, token)

    # Patch settings
    patch_res = await async_client.patch("/api/v1/admin/settings", json={
        "workshop_name": "Artisan Woodworks Kadıköy",
        "phone": "0216 123 45 67",
        "whatsapp": "+905321234567",
    })
    assert patch_res.status_code == 200
    assert patch_res.json()["workshop_name"] == "Artisan Woodworks Kadıköy"

    # Public safe read
    async_client.cookies.clear()
    public_res = await async_client.get("/api/v1/site-settings")
    assert public_res.status_code == 200
    assert public_res.json()["workshop_name"] == "Artisan Woodworks Kadıköy"
