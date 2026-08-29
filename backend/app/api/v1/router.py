from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    categories,
    products,
    colors,
    materials,
    orders,
    site_settings,
    admin_auth,
    admin_dashboard,
    admin_products,
    admin_categories,
    admin_colors,
    admin_materials,
    admin_orders,
    admin_settings,
)

api_router = APIRouter()

# Public Routes
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(colors.router, prefix="/colors", tags=["Colors"])
api_router.include_router(materials.router, prefix="/materials", tags=["Materials"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(site_settings.router, prefix="/site-settings", tags=["Site Settings"])

# Admin Routes (Protected by Admin Auth)
api_router.include_router(admin_auth.router, prefix="/admin/auth", tags=["Admin Auth"])
api_router.include_router(admin_dashboard.router, prefix="/admin/dashboard", tags=["Admin Dashboard"])
api_router.include_router(admin_products.router, prefix="/admin/products", tags=["Admin Products"])
api_router.include_router(admin_categories.router, prefix="/admin/categories", tags=["Admin Categories"])
api_router.include_router(admin_colors.router, prefix="/admin/colors", tags=["Admin Colors"])
api_router.include_router(admin_materials.router, prefix="/admin/materials", tags=["Admin Materials"])
api_router.include_router(admin_orders.router, prefix="/admin/orders", tags=["Admin Orders"])
api_router.include_router(admin_settings.router, prefix="/admin/settings", tags=["Admin Settings"])
