import pytest

@pytest.mark.anyio
async def test_health_endpoint(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "Furniture Workshop API"
    assert "X-Request-ID" in response.headers

@pytest.mark.anyio
async def test_readiness_endpoint(async_client):
    response = await async_client.get("/api/v1/health/ready")
    # Status code 200 if DB container is online, 503 if DB container is offline
    assert response.status_code in (200, 503)
    data = response.json()
    if response.status_code == 200:
        assert data["status"] == "ready"
    else:
        assert data["error"]["code"] == "SERVICE_UNAVAILABLE"
