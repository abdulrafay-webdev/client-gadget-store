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
