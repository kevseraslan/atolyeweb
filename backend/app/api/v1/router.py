from fastapi import APIRouter
from app.api.v1.endpoints import health, categories, products, colors, materials, orders

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(colors.router, prefix="/colors", tags=["Colors"])
api_router.include_router(materials.router, prefix="/materials", tags=["Materials"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
