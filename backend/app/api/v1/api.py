from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    categories,
    products,
    orders,
    upload,
    banners,
    settings,
    dashboard
)

api_router = APIRouter()

# Authentication & Admin User
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Categories (Public & Admin)
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(categories.router, prefix="/admin/categories", tags=["Admin Categories"])

# Products (Public & Admin)
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(products.router, prefix="/admin/products", tags=["Admin Products"])

# Orders (Checkout & Admin)
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])

# Upload (ImageKit)
api_router.include_router(upload.router, prefix="/admin/upload", tags=["Upload"])

# Banners (Hero & Promo)
api_router.include_router(banners.router, prefix="/banners", tags=["Banners"])
api_router.include_router(banners.router, prefix="/admin/banners", tags=["Admin Banners"])

# Store Settings
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])

# Admin Dashboard Analytics
api_router.include_router(dashboard.router, prefix="/admin/dashboard", tags=["Admin Dashboard"])
