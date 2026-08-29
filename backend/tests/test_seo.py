import pytest
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.anyio
async def test_seo_public_product_slug_available(async_client, db_session: AsyncSession):
    res = await async_client.get("/api/v1/products")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    for item in data["items"]:
        assert "slug" in item
        assert "name" in item
        assert "is_active" in item

@pytest.mark.anyio
async def test_seo_no_pii_in_public_metadata(async_client, db_session: AsyncSession):
    res = await async_client.get("/api/v1/site-settings")
    assert res.status_code == 200
    data = res.json()
    assert "password" not in data
    assert "password_hash" not in data
