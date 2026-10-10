from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel

class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    link_url: Optional[str] = None
    image_url: str
    image_file_id: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class BannerCreate(BannerBase):
    pass

class BannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    link_url: Optional[str] = None
    image_url: Optional[str] = None
    image_file_id: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class BannerResponse(BannerBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
