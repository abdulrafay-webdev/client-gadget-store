from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

class Admin(SQLModel, table=True):
    __tablename__ = "admins"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    full_name: str = Field(default="Admin", max_length=150)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = Field(default=None)
