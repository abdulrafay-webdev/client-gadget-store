from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    image_file_id: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    image_file_id: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class CategoryResponse(CategoryBase):
    id: uuid.UUID
    slug: str
    created_at: datetime
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True
