import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Hamza Gadget Store API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://neondb_owner:dummy@localhost:5432/neondb?sslmode=require"

    # JWT
    JWT_SECRET: str = "034a7064d994a233469a5186ef3c2c3344f0c8ea062ecb2e04228480dc0f7b1e"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # ImageKit
    IMAGEKIT_PUBLIC_KEY: str = ""
    IMAGEKIT_PRIVATE_KEY: str = ""
    IMAGEKIT_URL_ENDPOINT: str = ""

    # Initial Admin Seed
    ADMIN_EMAIL: str = "hamzagadgethouse@gmail.com"
    ADMIN_PASSWORD: str = "Gadget@1234"
    ADMIN_NAME: str = "Hamza Gadget Admin"

    # Store Settings Defaults
    STORE_NAME: str = "Hamza Gadget Store"
    STORE_PHONE: str = "03152720915"
    STORE_WHATSAPP: str = "03152720915"
    STORE_EMAIL: str = "hamzagadgethouse@gmail.com"
    STORE_ADDRESS: str = "Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan"
    SHIPPING_FEE: float = 250.0
    FREE_SHIPPING_THRESHOLD: float = 3500.0

    # CORS
    FRONTEND_URL: str = "https://hamza-gadget-store.vercel.app"
    ALLOWED_ORIGINS: Union[str, List[str]] = "https://hamza-gadget-store.vercel.app,http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip() and origin.strip() != "*"]
        return [o for o in self.ALLOWED_ORIGINS if o != "*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
