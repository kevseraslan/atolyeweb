from app.core.config import settings

def test_settings_loaded():
    assert settings.APP_NAME == "Furniture Workshop API"
    assert settings.API_V1_PREFIX == "/api/v1"
    assert settings.FRONTEND_URL == "http://localhost:3000"
