from pydantic_settings import BaseSettings, SettingsConfigDict

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
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()

if settings.APP_ENV == "production":
    if not settings.AUTH_SECRET or settings.AUTH_SECRET in ["change-me", "secret", "dev-secret", "artisan_woodworks_dev_secret_key_2026_change_in_prod"]:
        raise RuntimeError("FATAL: AUTH_SECRET must be explicitly set to a strong secret key in production environment!")
