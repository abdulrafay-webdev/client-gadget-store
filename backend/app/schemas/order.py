from datetime import datetime
from typing import Optional, List
import uuid
from pydantic import BaseModel, Field
from app.models.order import OrderStatus, PaymentStatus, PaymentMethod

class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(ge=1, default=1)

class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: Optional[uuid.UUID] = None
    product_name: str
    product_price: float
    product_image_url: Optional[str] = None
    quantity: int
    line_total: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=200)
    customer_phone: str = Field(min_length=7, max_length=50)
    customer_email: Optional[str] = None
    city: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=5, max_length=500)
    notes: Optional[str] = None
    payment_method: PaymentMethod = PaymentMethod.COD
    items: List[OrderItemCreate] = Field(min_length=1)

class OrderStatusUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None

class OrderTrackRequest(BaseModel):
    order_number: str
    phone: str

class OrderResponse(BaseModel):
    id: uuid.UUID
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    city: str
    address: str
    notes: Optional[str] = None
    total_amount: float
    shipping_fee: float
    grand_total: float
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int
    total_pages: int
