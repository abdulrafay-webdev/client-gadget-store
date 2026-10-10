from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
import uuid

if TYPE_CHECKING:
    from app.models.product import Product

class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(index=True, max_length=150)
    slug: str = Field(unique=True, index=True, max_length=150)
    description: Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None)
    image_file_id: Optional[str] = Field(default=None)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    products: List["Product"] = Relationship(back_populates="category")
