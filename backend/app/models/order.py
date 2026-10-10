from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
import uuid

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    PAID = "paid"

class PaymentMethod(str, Enum):
    COD = "COD"
    ONLINE = "ONLINE"

class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    order_number: str = Field(unique=True, index=True, max_length=50)
    
    # Customer details
    customer_name: str = Field(max_length=200)
    customer_phone: str = Field(max_length=50, index=True)
    customer_email: Optional[str] = Field(default=None, max_length=200)
    city: str = Field(max_length=100)
    address: str = Field(max_length=500)
    notes: Optional[str] = Field(default=None)

    # Financials
    total_amount: float = Field(default=0.0)
    shipping_fee: float = Field(default=0.0)
    grand_total: float = Field(default=0.0)

    # Statuses
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    payment_method: PaymentMethod = Field(default=PaymentMethod.COD)
    payment_status: PaymentStatus = Field(default=PaymentStatus.UNPAID)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    items: List["OrderItem"] = Relationship(
        back_populates="order",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "selectin"}
    )


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    order_id: uuid.UUID = Field(foreign_key="orders.id", index=True)
    product_id: Optional[uuid.UUID] = Field(default=None, foreign_key="products.id", nullable=True)

    # Snapshot fields (must preserve state at time of purchase)
    product_name: str = Field(max_length=255)
    product_price: float = Field(default=0.0)
    product_image_url: Optional[str] = Field(default=None, max_length=1000)

    quantity: int = Field(default=1)
    line_total: float = Field(default=0.0)

    order: Optional[Order] = Relationship(back_populates="items")
