from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.schemas.order import OrderResponse
from app.schemas.dashboard import DashboardStatsResponse, DailySalesStat, LowStockProduct

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    # Total revenue (exclude cancelled)
    revenue_res = session.exec(
        select(func.sum(Order.grand_total)).where(Order.status != OrderStatus.CANCELLED)
    ).one()
    total_revenue = float(revenue_res or 0.0)

    # Order counts
    total_orders = session.exec(select(func.count(Order.id))).one()
    pending_orders = session.exec(select(func.count(Order.id)).where(Order.status == OrderStatus.PENDING)).one()
    confirmed_orders = session.exec(select(func.count(Order.id)).where(Order.status == OrderStatus.CONFIRMED)).one()
    shipped_orders = session.exec(select(func.count(Order.id)).where(Order.status == OrderStatus.SHIPPED)).one()
    delivered_orders = session.exec(select(func.count(Order.id)).where(Order.status == OrderStatus.DELIVERED)).one()
    cancelled_orders = session.exec(select(func.count(Order.id)).where(Order.status == OrderStatus.CANCELLED)).one()

    # Low stock products (stock <= 5)
    low_stock_query = select(Product).where(Product.stock <= 5, Product.is_active == True).order_by(Product.stock.asc())
    low_stock_items = session.exec(low_stock_query.limit(10)).all()
    low_stock_count = session.exec(select(func.count(Product.id)).where(Product.stock <= 5, Product.is_active == True)).one()

    low_stock_products = []
    for p in low_stock_items:
        img_url = p.images[0].image_url if p.images else None
        low_stock_products.append(
            LowStockProduct(
                id=str(p.id),
                name=p.name,
                sku=p.sku,
                stock=p.stock,
                price=p.price,
                image_url=img_url
            )
        )

    # Recent orders (5 most recent)
    recent_orders_records = session.exec(
        select(Order).order_by(Order.created_at.desc()).limit(5)
    ).all()
    recent_orders = [OrderResponse.model_validate(o) for o in recent_orders_records]

    # Daily sales chart for past 7 days
    today = datetime.now(timezone.utc).date()
    sales_chart = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        start_dt = datetime(day.year, day.month, day.day, 0, 0, 0, tzinfo=timezone.utc)
        end_dt = datetime(day.year, day.month, day.day, 23, 59, 59, tzinfo=timezone.utc)

        day_orders = session.exec(
            select(Order).where(
                Order.created_at >= start_dt,
                Order.created_at <= end_dt,
                Order.status != OrderStatus.CANCELLED
            )
        ).all()

        day_rev = sum(o.grand_total for o in day_orders)
        sales_chart.append(
            DailySalesStat(
                date=day.strftime("%b %d"),
                orders_count=len(day_orders),
                revenue=day_rev
            )
        )

    return DashboardStatsResponse(
        total_revenue=total_revenue,
        total_orders=total_orders,
        pending_orders=pending_orders,
        confirmed_orders=confirmed_orders,
        shipped_orders=shipped_orders,
        delivered_orders=delivered_orders,
        cancelled_orders=cancelled_orders,
        low_stock_count=low_stock_count,
        recent_orders=recent_orders,
        low_stock_products=low_stock_products,
        sales_chart=sales_chart
    )
