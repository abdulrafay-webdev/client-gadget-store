from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy.dialects.postgresql import JSON
import sqlalchemy as sa
import uuid

if TYPE_CHECKING:
    from app.models.category import Category

class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(index=True, max_length=255)
    slug: str = Field(unique=True, index=True, max_length=255)
    sku: str = Field(unique=True, index=True, max_length=100)
    description: str = Field(default="")
    price: float = Field(default=0.0)
    discount_price: Optional[float] = Field(default=None)
    stock: int = Field(default=0)
    is_featured: bool = Field(default=False)
    is_active: bool = Field(default=True)
    
    # Store specs as JSON (supports dict on Postgres and SQLite/generic)
    specs: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(sa.JSON, nullable=False, default={})
    )

    category_id: uuid.UUID = Field(foreign_key="categories.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    category: Optional["Category"] = Relationship(back_populates="products")
    images: List["ProductImage"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "lazy": "selectin"}
    )


class ProductImage(SQLModel, table=True):
    __tablename__ = "product_images"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    image_url: str = Field(max_length=1000)
    image_file_id: Optional[str] = Field(default=None, max_length=255)
    display_order: int = Field(default=0)
    is_thumbnail: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    product: Optional[Product] = Relationship(back_populates="images")
