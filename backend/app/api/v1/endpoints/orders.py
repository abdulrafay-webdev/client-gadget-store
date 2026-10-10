from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func, or_
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.core.config import settings
from app.models.admin import Admin
from app.models.product import Product
from app.models.setting import Setting
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.schemas.order import (
    OrderCreate,
    OrderStatusUpdate,
    OrderResponse,
    OrderListResponse,
    OrderItemResponse
)
import random
import uuid

router = APIRouter()

def get_store_setting_value(session: Session, key: str, default: float) -> float:
    setting = session.exec(select(Setting).where(Setting.key == key)).first()
    if setting:
        try:
            return float(setting.value)
        except ValueError:
            return default
    return default

def generate_order_number(session: Session) -> str:
    now = datetime.now(timezone.utc)
    prefix = f"HGS-{now.strftime('%Y%m')}"
    # Generate random 4-digit number and check uniqueness
    for _ in range(10):
        rand_num = random.randint(1000, 9999)
        candidate = f"{prefix}-{rand_num}"
        existing = session.exec(select(Order).where(Order.order_number == candidate)).first()
        if not existing:
            return candidate
    return f"{prefix}-{uuid.uuid4().hex[:6].upper()}"

@router.post("", response_model=OrderResponse)
def create_guest_order(order_in: OrderCreate, session: Session = Depends(get_session)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    shipping_fee_val = get_store_setting_value(session, "shipping_fee", settings.SHIPPING_FEE)
    free_shipping_threshold_val = get_store_setting_value(session, "free_shipping_threshold", settings.FREE_SHIPPING_THRESHOLD)

    # Validate stock and calculate totals
    subtotal = 0.0
    items_to_create = []

    for item in order_in.items:
        product = session.get(Product, item.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} is no longer available")
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Only {product.stock} available."
            )

        # Snapshot unit price (use discount_price if available and lower)
        effective_price = product.discount_price if (product.discount_price and product.discount_price < product.price) else product.price
        line_total = effective_price * item.quantity
        subtotal += line_total

        # Snapshot primary image
        thumbnail_img = None
        if product.images:
            sorted_imgs = sorted(product.images, key=lambda x: (not x.is_thumbnail, x.display_order))
            thumbnail_img = sorted_imgs[0].image_url

        items_to_create.append({
            "product": product,
            "quantity": item.quantity,
            "product_name": product.name,
            "product_price": effective_price,
            "product_image_url": thumbnail_img,
            "line_total": line_total
        })

    # Shipping fee calculation
    shipping_fee = 0.0 if subtotal >= free_shipping_threshold_val else shipping_fee_val
    grand_total = subtotal + shipping_fee

    order_number = generate_order_number(session)

    # Create Order
    new_order = Order(
        order_number=order_number,
        customer_name=order_in.customer_name.strip(),
        customer_phone=order_in.customer_phone.strip(),
        customer_email=order_in.customer_email.strip() if order_in.customer_email else None,
        city=order_in.city.strip(),
        address=order_in.address.strip(),
        notes=order_in.notes,
        total_amount=subtotal,
        shipping_fee=shipping_fee,
        grand_total=grand_total,
        status=OrderStatus.PENDING,
        payment_method=order_in.payment_method,
        payment_status=PaymentStatus.UNPAID,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    session.add(new_order)
    session.commit()
    session.refresh(new_order)

    # Create snapshot OrderItems & decrement stock
    for item_data in items_to_create:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data["product"].id,
            product_name=item_data["product_name"],
            product_price=item_data["product_price"],
            product_image_url=item_data["product_image_url"],
            quantity=item_data["quantity"],
            line_total=item_data["line_total"]
        )
        session.add(order_item)

        # Decrement product inventory
        prod = item_data["product"]
        prod.stock = max(0, prod.stock - item_data["quantity"])
        session.add(prod)

    session.commit()
    session.refresh(new_order)

    return OrderResponse.model_validate(new_order)

@router.get("/track", response_model=OrderResponse)
def track_order(
    order_number: str = Query(..., description="Order Number, e.g. HGS-202610-1001"),
    phone: str = Query(..., description="Customer phone number used during checkout"),
    session: Session = Depends(get_session)
):
    clean_order = order_number.strip().upper()
    clean_phone = phone.strip()

    # Search order by number and matching or containing phone
    order = session.exec(
        select(Order).where(Order.order_number == clean_order)
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found. Please verify the order number.")

    # Match normalized phone numbers (last 7-9 digits)
    p1 = re.sub(r"\D", "", order.customer_phone)
    p2 = re.sub(r"\D", "", clean_phone)

    if not (p1 == p2 or (len(p1) >= 7 and len(p2) >= 7 and (p1.endswith(p2) or p2.endswith(p1)))):
        raise HTTPException(status_code=400, detail="The phone number does not match this order.")

    return OrderResponse.model_validate(order)

@router.get("/admin", response_model=OrderListResponse)
def get_orders_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status_filter: Optional[OrderStatus] = None,
    payment_status_filter: Optional[PaymentStatus] = None,
    search: Optional[str] = None,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    query = select(Order)

    if status_filter:
        query = query.where(Order.status == status_filter)
    if payment_status_filter:
        query = query.where(Order.payment_status == payment_status_filter)

    if search:
        term = f"%{search.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Order.order_number).like(term),
                func.lower(Order.customer_name).like(term),
                func.lower(Order.customer_phone).like(term),
                func.lower(Order.city).like(term)
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.order_by(Order.created_at.desc())
    offset = (page - 1) * limit
    orders = session.exec(query.offset(offset).limit(limit)).all()

    total_pages = (total + limit - 1) // limit if total > 0 else 1
    items = [OrderResponse.model_validate(o) for o in orders]

    return OrderListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/admin/{order_id}", response_model=OrderResponse)
def get_order_detail_admin(
    order_id: uuid.UUID,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderResponse.model_validate(order)

@router.patch("/admin/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: uuid.UUID,
    status_in: OrderStatusUpdate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status

    if status_in.status is not None:
        new_status = status_in.status
        order.status = new_status

        # If order was cancelled now, restore product stock
        if new_status == OrderStatus.CANCELLED and old_status != OrderStatus.CANCELLED:
            for item in order.items:
                if item.product_id:
                    prod = session.get(Product, item.product_id)
                    if prod:
                        prod.stock += item.quantity
                        session.add(prod)
        # If order was uncancelled, reduce stock again
        elif old_status == OrderStatus.CANCELLED and new_status != OrderStatus.CANCELLED:
            for item in order.items:
                if item.product_id:
                    prod = session.get(Product, item.product_id)
                    if prod:
                        prod.stock = max(0, prod.stock - item.quantity)
                        session.add(prod)

        # If delivered and payment was unpaid COD, auto-mark paid
        if new_status == OrderStatus.DELIVERED and order.payment_method == PaymentMethod.COD:
            order.payment_status = PaymentStatus.PAID

    if status_in.payment_status is not None:
        order.payment_status = status_in.payment_status

    order.updated_at = datetime.now(timezone.utc)
    session.add(order)
    session.commit()
    session.refresh(order)
    return OrderResponse.model_validate(order)
