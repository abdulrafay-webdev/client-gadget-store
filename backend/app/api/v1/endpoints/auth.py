from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_admin
from app.core.rate_limiter import login_limiter
from app.models.admin import Admin
from app.schemas.admin import AdminLoginRequest, TokenResponse, AdminResponse

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(
    req: AdminLoginRequest,
    request: Request,
    session: Session = Depends(get_session)
):
    client_ip = request.client.host if request.client else "unknown"
    login_limiter.check(f"{client_ip}:{req.email}")

    admin = session.exec(select(Admin).where(Admin.email == req.email.lower().strip())).first()
    if not admin or not verify_password(req.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This admin account has been deactivated"
        )

    admin.last_login = datetime.now(timezone.utc)
    session.add(admin)
    session.commit()
    session.refresh(admin)

    access_token = create_access_token(subject=str(admin.id))
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        admin=AdminResponse.model_validate(admin)
    )

@router.get("/me", response_model=AdminResponse)
def get_me(admin: Admin = Depends(get_current_admin)):
    return AdminResponse.model_validate(admin)
