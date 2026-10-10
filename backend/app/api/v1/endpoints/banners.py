from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.banner import Banner
from app.schemas.banner import BannerCreate, BannerUpdate, BannerResponse
from app.services.imagekit_service import imagekit_service
import uuid

router = APIRouter()

@router.get("", response_model=List[BannerResponse])
def get_active_banners(session: Session = Depends(get_session)):
    banners = session.exec(
        select(Banner).where(Banner.is_active == True).order_by(Banner.display_order, Banner.created_at.desc())
    ).all()
    return [BannerResponse.model_validate(b) for b in banners]

@router.get("/all", response_model=List[BannerResponse])
def get_all_banners_admin(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    banners = session.exec(select(Banner).order_by(Banner.display_order, Banner.created_at.desc())).all()
    return [BannerResponse.model_validate(b) for b in banners]

@router.post("", response_model=BannerResponse)
def create_banner(
    banner_in: BannerCreate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    banner = Banner(
        title=banner_in.title,
        subtitle=banner_in.subtitle,
        badge=banner_in.badge,
        link_url=banner_in.link_url,
        image_url=banner_in.image_url,
        image_file_id=banner_in.image_file_id,
        display_order=banner_in.display_order,
        is_active=banner_in.is_active
    )
    session.add(banner)
    session.commit()
    session.refresh(banner)
    return BannerResponse.model_validate(banner)

@router.put("/{banner_id}", response_model=BannerResponse)
def update_banner(
    banner_id: uuid.UUID,
    banner_in: BannerUpdate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    banner = session.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")

    update_dict = banner_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(banner, key, value)

    session.add(banner)
    session.commit()
    session.refresh(banner)
    return BannerResponse.model_validate(banner)

@router.delete("/{banner_id}")
def delete_banner(
    banner_id: uuid.UUID,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    banner = session.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")

    if banner.image_file_id:
        imagekit_service.delete_image(banner.image_file_id)

    session.delete(banner)
    session.commit()
    return {"message": "Banner deleted successfully"}
