import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import AppException, app_exception_handler
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.logging import logger

class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Always generate server-side trusted UUID for request tracing
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

class SensitiveCacheControlMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        path = request.url.path

        # Sensitive paths or mutating HTTP methods MUST NOT be cached
        if (
            path.startswith("/api/v1/admin")
            or path.startswith("/api/v1/orders/track")
            or request.method in ["POST", "PUT", "PATCH", "DELETE"]
        ):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
        elif request.method == "GET" and (path.startswith("/api/v1/products") or path.startswith("/api/v1/site-settings")):
            # Public catalog data can be cached for short duration
            response.headers["Cache-Control"] = "public, max-age=60"

        return response

from app.db.init_db import seed_initial_data_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} ({settings.APP_ENV})...")
    await seed_initial_data_if_empty()
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")

is_prod = settings.APP_ENV == "production"

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=None if is_prod else "/openapi.json",
    docs_url=None if is_prod else "/docs",
    redoc_url=None,
    lifespan=lifespan,
)

# Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SensitiveCacheControlMiddleware)
app.add_middleware(RequestIdMiddleware)

allowed_origins = list(set([
    settings.FRONTEND_URL.rstrip("/"),
    "https://atolyeweb-delta.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID", "X-CSRF-Token"],
)

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    if is_prod:
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "Bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.",
                }
            },
        )
    raise exc

# Include Master API v1 Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
