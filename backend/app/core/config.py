from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator

class Settings(BaseSettings):
    APP_NAME: str = "Furniture Workshop API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = (
        "postgresql+asyncpg://furniture_user:furniture_pass@localhost:5432/furniture_db"
    )
    FRONTEND_URL: str = "http://localhost:3000"

    AUTH_SECRET: str = "artisan_woodworks_dev_secret_key_2026_change_in_prod"
    TRUST_PROXY: bool = False  # Opt-in for trusting Nginx X-Forwarded-For headers after Phase 18 deployment

    # Production Rate Limit Central Constants
    LOGIN_RATE_LIMIT: str = "10/15m"       # 10 attempts per 15 minutes
    TRACKING_RATE_LIMIT: str = "30/m"       # 30 requests per minute
    ORDER_CREATE_RATE_LIMIT: str = "30/m"   # 30 requests per minute

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.APP_ENV == "production":
            if not self.AUTH_SECRET or len(self.AUTH_SECRET) < 32 or self.AUTH_SECRET in ["change-me", "secret", "dev-secret", "artisan_woodworks_dev_secret_key_2026_change_in_prod"]:
                raise RuntimeError("FATAL: AUTH_SECRET must be explicitly set to a strong secret key (at least 32 chars) in production environment!")
        return self

settings = Settings()
