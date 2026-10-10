from typing import Optional, Dict, Any
from imagekitio import ImageKit
from app.core.config import settings
from fastapi import HTTPException, status
import base64

class ImageKitService:
    def __init__(self):
        self._client: Optional[ImageKit] = None

    @property
    def client(self) -> ImageKit:
        if not settings.IMAGEKIT_PRIVATE_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="ImageKit credentials are not configured. Please set IMAGEKIT_PRIVATE_KEY."
            )
        if self._client is None:
            try:
                # Modern ImageKit Python SDK v5+
                self._client = ImageKit(private_key=settings.IMAGEKIT_PRIVATE_KEY)
            except TypeError:
                # Fallback for legacy v3/v4 SDK
                self._client = ImageKit(
                    public_key=settings.IMAGEKIT_PUBLIC_KEY,
                    private_key=settings.IMAGEKIT_PRIVATE_KEY,
                    url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
                )
        return self._client

    def upload_image(self, file_bytes: bytes, file_name: str, folder: str = "/hamza-gadgets") -> Dict[str, Any]:
        try:
            # Check for ImageKit SDK v5+ (client.files.upload)
            if hasattr(self.client, "files") and hasattr(self.client.files, "upload"):
                response = self.client.files.upload(
                    file=file_bytes,
                    file_name=file_name,
                    folder=folder,
                    use_unique_file_name=True
                )
                url = getattr(response, "url", None)
                file_id = getattr(response, "file_id", None)
            else:
                encoded_file = base64.b64encode(file_bytes).decode("utf-8")
                response = self.client.upload_file(
                    file=encoded_file,
                    file_name=file_name,
                    options={
                        "folder": folder,
                        "use_unique_file_name": True
                    }
                )
                url = getattr(response, "url", None) or (response.get("url") if isinstance(response, dict) else None)
                file_id = getattr(response, "file_id", None) or (response.get("file_id") if isinstance(response, dict) else None)
                if not url or not file_id:
                    if hasattr(response, "response_dict") and response.response_dict:
                        url = response.response_dict.get("url")
                        file_id = response.response_dict.get("fileId") or response.response_dict.get("file_id")

            if not url or not file_id:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve file URL or ID from ImageKit response"
                )

            return {
                "url": url,
                "file_id": file_id
            }
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload image to ImageKit: {str(e)}"
            )

    def delete_image(self, file_id: str) -> bool:
        if not file_id:
            return False
        try:
            if hasattr(self.client, "files") and hasattr(self.client.files, "delete"):
                self.client.files.delete(file_id=file_id)
            else:
                self.client.delete_file(file_id=file_id)
            return True
        except Exception as e:
            # We don't fail deleting a product if imagekit deletion gives error, but log/notify
            print(f"Warning: Failed to delete image {file_id} from ImageKit: {e}")
            return False

imagekit_service = ImageKitService()
