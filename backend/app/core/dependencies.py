from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import decode_access_token
from app.models.admin import Admin
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_admin(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
    
    admin_id_str: Optional[str] = payload.get("sub")
    if not admin_id_str:
        raise credentials_exception
    
    try:
        admin_id = uuid.UUID(admin_id_str)
    except ValueError:
        raise credentials_exception

    admin = session.exec(select(Admin).where(Admin.id == admin_id)).first()
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive or non-existent admin account"
        )
    return admin
