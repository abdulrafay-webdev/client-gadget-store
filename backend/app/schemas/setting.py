from datetime import datetime
from typing import Optional, Dict, Any
import uuid
from pydantic import BaseModel

class SettingItem(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingUpdateBatch(BaseModel):
    settings: Dict[str, str]

class StoreSettingsResponse(BaseModel):
    store_name: str
    store_phone: str
    store_whatsapp: str
    store_email: str
    store_address: str
    shipping_fee: float
    free_shipping_threshold: float
    facebook_url: Optional[str] = None
    tiktok_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    whatsapp_channel_url: Optional[str] = None
