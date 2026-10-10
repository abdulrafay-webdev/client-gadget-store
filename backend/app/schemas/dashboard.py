from typing import List, Dict, Any
from pydantic import BaseModel
from app.schemas.order import OrderResponse

class DailySalesStat(BaseModel):
    date: str
    orders_count: int
    revenue: float

class LowStockProduct(BaseModel):
    id: str
    name: str
    sku: str
    stock: int
    price: float
    image_url: str | None = None

class DashboardStatsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    pending_orders: int
    confirmed_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    low_stock_count: int
    recent_orders: List[OrderResponse]
    low_stock_products: List[LowStockProduct]
    sales_chart: List[DailySalesStat]
