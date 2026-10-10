from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
import re
import uuid

router = APIRouter()

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)

@router.get("", response_model=List[CategoryResponse])
def get_categories(session: Session = Depends(get_session)):
    categories = session.exec(
        select(Category).where(Category.is_active == True).order_by(Category.display_order, Category.name)
    ).all()
    
    result = []
    for cat in categories:
        count = session.exec(
            select(func.count(Product.id)).where(Product.category_id == cat.id, Product.is_active == True)
        ).one()
        cat_data = CategoryResponse.model_validate(cat)
        cat_data.product_count = count
        result.append(cat_data)
    return result

@router.get("/all", response_model=List[CategoryResponse])
def get_all_categories_admin(
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    categories = session.exec(select(Category).order_by(Category.display_order, Category.name)).all()
    result = []
    for cat in categories:
        count = session.exec(
            select(func.count(Product.id)).where(Product.category_id == cat.id)
        ).one()
        cat_data = CategoryResponse.model_validate(cat)
        cat_data.product_count = count
        result.append(cat_data)
    return result

@router.get("/{id_or_slug}", response_model=CategoryResponse)
def get_category_by_id_or_slug(id_or_slug: str, session: Session = Depends(get_session)):
    query = select(Category)
    try:
        val_uuid = uuid.UUID(id_or_slug)
        query = query.where(Category.id == val_uuid)
    except ValueError:
        query = query.where(Category.slug == id_or_slug)
    
    cat = session.exec(query).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    count = session.exec(
        select(func.count(Product.id)).where(Product.category_id == cat.id, Product.is_active == True)
    ).one()
    res = CategoryResponse.model_validate(cat)
    res.product_count = count
    return res

@router.post("", response_model=CategoryResponse)
def create_category(
    cat_in: CategoryCreate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    slug = cat_in.slug or slugify(cat_in.name)
    # Check existing slug
    existing = session.exec(select(Category).where(Category.slug == slug)).first()
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"

    category = Category(
        name=cat_in.name,
        slug=slug,
        description=cat_in.description,
        image_url=cat_in.image_url,
        image_file_id=cat_in.image_file_id,
        display_order=cat_in.display_order,
        is_active=cat_in.is_active
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return CategoryResponse.model_validate(category)

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: uuid.UUID,
    cat_in: CategoryUpdate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = cat_in.model_dump(exclude_unset=True)
    if "name" in update_data and not update_data.get("slug"):
        update_data["slug"] = slugify(update_data["name"])

    for key, value in update_data.items():
        setattr(category, key, value)

    session.add(category)
    session.commit()
    session.refresh(category)
    return CategoryResponse.model_validate(category)

@router.delete("/{category_id}")
def delete_category(
    category_id: uuid.UUID,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has products
    product_count = session.exec(
        select(func.count(Product.id)).where(Product.category_id == category_id)
    ).one()
    if product_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category with {product_count} existing product(s). Please reassign or delete them first."
        )

    session.delete(category)
    session.commit()
    return {"message": "Category deleted successfully"}
