from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

# Fix postgres:// prefix for SQLAlchemy compatibility if needed
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# SQLite fallback option for local testing if DATABASE_URL starts with sqlite
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
