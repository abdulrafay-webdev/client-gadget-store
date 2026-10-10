from datetime import datetime
from typing import Optional, List, Dict, Any
import uuid
from pydantic import BaseModel, Field

class ProductImageBase(BaseModel):
    image_url: str
    image_file_id: Optional[str] = None
    display_order: int = 0
    is_thumbnail: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: uuid.UUID
    product_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: Optional[str] = None
    sku: str
    description: str = ""
    price: float = Field(ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    category_id: uuid.UUID
    specs: Dict[str, Any] = {}
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category_id: Optional[uuid.UUID] = None
    specs: Optional[Dict[str, Any]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    images: Optional[List[ProductImageCreate]] = None

class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    sku: str
    description: str
    price: float
    discount_price: Optional[float] = None
    stock: int
    category_id: uuid.UUID
    category_name: Optional[str] = None
    specs: Dict[str, Any]
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
