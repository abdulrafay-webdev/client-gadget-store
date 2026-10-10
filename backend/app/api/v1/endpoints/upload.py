from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.services.imagekit_service import imagekit_service

router = APIRouter()

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]

@router.post("", response_model=dict)
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin)
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Please upload JPEG, PNG, WEBP, GIF, or SVG."
        )

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024: # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10MB"
        )

    result = imagekit_service.upload_image(
        file_bytes=file_bytes,
        file_name=file.filename or "image.jpg"
    )
    return result

@router.delete("/{file_id}", response_model=dict)
def delete_image(
    file_id: str,
    admin: Admin = Depends(get_current_admin)
):
    success = imagekit_service.delete_image(file_id)
    return {"success": success, "file_id": file_id}
