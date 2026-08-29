import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import Admin
from app.services.admin_auth_service import hash_password, create_admin_token, COOKIE_NAME
from app.core.csrf import generate_csrf_token
from app.core.rate_limit import login_limiter, tracking_limiter, order_create_limiter

@pytest.mark.anyio
async def test_security_headers_present(async_client):
    res = await async_client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.headers["X-Content-Type-Options"] == "nosniff"
    assert res.headers["X-Frame-Options"] == "DENY"
    assert res.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    assert "Content-Security-Policy" in res.headers

@pytest.mark.anyio
async def test_csrf_origin_and_header_enforcement(async_client, db_session: AsyncSession):
    # 1. Setup Admin
    pass_hash = hash_password("SuperSecret12345!")
    admin = Admin(email="sec_admin@example.com", password_hash=pass_hash, full_name="Sec Admin", is_active=True, session_version=1)
    db_session.add(admin)
    await db_session.commit()

    token = create_admin_token(admin)
    csrf_token = generate_csrf_token(admin.id, admin.session_version)
    async_client.cookies.set(COOKIE_NAME, token)

    # 2. Origin Mismatch -> 403
    res_bad_origin = await async_client.patch(
        "/api/v1/admin/settings",
        json={"workshop_name": "Hacked Workshop"},
        headers={"Origin": "http://evil-attacker.com", "X-CSRF-Token": csrf_token},
    )
    assert res_bad_origin.status_code == 403
    assert res_bad_origin.json()["error"]["code"] == "CSRF_ORIGIN_FORBIDDEN"

    # 3. Missing CSRF Token -> 403
    res_no_csrf = await async_client.patch(
        "/api/v1/admin/settings",
        json={"workshop_name": "Hacked Workshop"},
        headers={"Origin": "http://localhost:3000"},
    )
    assert res_no_csrf.status_code == 403

    # 4. Valid Origin + CSRF Token -> 200
    res_valid = await async_client.patch(
        "/api/v1/admin/settings",
        json={"workshop_name": "Kadıköy Masif"},
        headers={"Origin": "http://localhost:3000", "X-CSRF-Token": csrf_token},
    )
    assert res_valid.status_code == 200
    assert res_valid.json()["workshop_name"] == "Kadıköy Masif"

@pytest.mark.anyio
async def test_session_revocation_on_logout(async_client, db_session: AsyncSession):
    pass_hash = hash_password("SuperSecret12345!")
    admin = Admin(email="rev_admin@example.com", password_hash=pass_hash, full_name="Rev Admin", is_active=True, session_version=1)
    db_session.add(admin)
    await db_session.commit()

    token = create_admin_token(admin)
    csrf_token = generate_csrf_token(admin.id, admin.session_version)
    async_client.cookies.set(COOKIE_NAME, token)

    # Logout
    res_logout = await async_client.post(
        "/api/v1/admin/auth/logout",
        headers={"Origin": "http://localhost:3000", "X-CSRF-Token": csrf_token},
    )
    assert res_logout.status_code == 200

    # Old token used again -> Rejected 401 because session_version was incremented
    async_client.cookies.set(COOKIE_NAME, token)
    res_reused = await async_client.get("/api/v1/admin/auth/me")
    assert res_reused.status_code == 401

@pytest.mark.anyio
async def test_rate_limiter_throttling(async_client):
    tracking_limiter.reset()

    # Make 30 requests (limit threshold) -> OK
    for _ in range(30):
        res = await async_client.post("/api/v1/orders/track", json={
            "tracking_number": "ATL-2026-A7K39P",
            "phone": "05321234567",
        })
        assert res.status_code in [200, 404]

    # 31st request -> Exceeds rate limit -> 429 Too Many Requests
    res_exceeded = await async_client.post("/api/v1/orders/track", json={
        "tracking_number": "ATL-2026-A7K39P",
        "phone": "05321234567",
    })
    assert res_exceeded.status_code == 429
    assert res_exceeded.json()["error"]["code"] == "TOO_MANY_REQUESTS"
    assert "Retry-After" in res_exceeded.headers

    tracking_limiter.reset()
