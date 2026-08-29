import pytest
from app.core.config import Settings, settings

def test_settings_loaded():
    assert settings.APP_NAME == "Furniture Workshop API"
    assert settings.API_V1_PREFIX == "/api/v1"
    assert settings.FRONTEND_URL == "http://localhost:3000"

def test_production_auth_secret_fail_fast():
    with pytest.raises(RuntimeError, match="FATAL: AUTH_SECRET must be explicitly set"):
        Settings(
            APP_ENV="production",
            AUTH_SECRET="short_secret",
        )
