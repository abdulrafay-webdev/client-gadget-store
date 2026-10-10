from typing import Dict, List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.core.config import settings as app_settings
from app.models.admin import Admin
from app.models.setting import Setting
from app.schemas.setting import StoreSettingsResponse, SettingUpdateBatch, SettingItem
from datetime import datetime, timezone

router = APIRouter()

DEFAULT_SETTINGS = {
    "store_name": app_settings.STORE_NAME,
    "store_phone": app_settings.STORE_PHONE,
    "store_whatsapp": app_settings.STORE_WHATSAPP,
    "store_email": app_settings.STORE_EMAIL,
    "store_address": app_settings.STORE_ADDRESS,
    "shipping_fee": str(app_settings.SHIPPING_FEE),
    "free_shipping_threshold": str(app_settings.FREE_SHIPPING_THRESHOLD),
}

@router.get("", response_model=StoreSettingsResponse)
def get_public_settings(session: Session = Depends(get_session)):
    settings_records = session.exec(select(Setting)).all()
    settings_map = {s.key: s.value for s in settings_records}

    def get_val(key: str, default: Any):
        return settings_map.get(key, DEFAULT_SETTINGS.get(key, str(default)))

    return StoreSettingsResponse(
        store_name=get_val("store_name", app_settings.STORE_NAME),
        store_phone=get_val("store_phone", app_settings.STORE_PHONE),
        store_whatsapp=get_val("store_whatsapp", app_settings.STORE_WHATSAPP),
        store_email=get_val("store_email", app_settings.STORE_EMAIL),
        store_address=get_val("store_address", app_settings.STORE_ADDRESS),
        shipping_fee=float(get_val("shipping_fee", app_settings.SHIPPING_FEE)),
        free_shipping_threshold=float(get_val("free_shipping_threshold", app_settings.FREE_SHIPPING_THRESHOLD))
    )

@router.get("/admin", response_model=List[SettingItem])
def get_all_settings_admin(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    settings_records = session.exec(select(Setting)).all()
    existing_keys = {s.key for s in settings_records}

    # If any default is missing, add it to DB
    for key, val in DEFAULT_SETTINGS.items():
        if key not in existing_keys:
            new_s = Setting(key=key, value=val)
            session.add(new_s)
    session.commit()

    all_records = session.exec(select(Setting)).all()
    return [SettingItem(key=s.key, value=s.value, description=s.description) for s in all_records]

@router.put("/admin", response_model=Dict[str, str])
def update_settings_admin(
    batch: SettingUpdateBatch,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    for key, value in batch.settings.items():
        record = session.exec(select(Setting).where(Setting.key == key)).first()
        if record:
            record.value = str(value)
            record.updated_at = datetime.now(timezone.utc)
            session.add(record)
        else:
            new_record = Setting(key=key, value=str(value))
            session.add(new_record)
    session.commit()
    return {"message": "Settings updated successfully"}
