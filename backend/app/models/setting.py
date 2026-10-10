from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

class Setting(SQLModel, table=True):
    __tablename__ = "settings"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    key: str = Field(unique=True, index=True, max_length=100)
    value: str = Field(max_length=2000)
    description: Optional[str] = Field(default=None, max_length=255)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
