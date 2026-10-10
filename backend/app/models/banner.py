from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

class Banner(SQLModel, table=True):
    __tablename__ = "banners"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    title: str = Field(max_length=200)
    subtitle: Optional[str] = Field(default=None, max_length=300)
    badge: Optional[str] = Field(default=None, max_length=100) # e.g. "Exclusive Offer" / "Hot Deal"
    link_url: Optional[str] = Field(default=None, max_length=500)
    image_url: str = Field(max_length=1000)
    image_file_id: Optional[str] = Field(default=None, max_length=255)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
