from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func, or_, col
from app.core.database import get_session
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ProductImageResponse
)
from app.services.imagekit_service import imagekit_service
import re
import uuid

router = APIRouter()

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)

def build_product_response(product: Product, category_name: Optional[str] = None) -> ProductResponse:
    images = [ProductImageResponse.model_validate(img) for img in sorted(product.images, key=lambda x: x.display_order)]
    data = ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        sku=product.sku,
        description=product.description,
        price=product.price,
        discount_price=product.discount_price,
        stock=product.stock,
        category_id=product.category_id,
        category_name=category_name or (product.category.name if product.category else None),
        specs=product.specs or {},
        is_featured=product.is_featured,
        is_active=product.is_active,
        created_at=product.created_at,
        updated_at=product.updated_at,
        images=images
    )
    return data

@router.get("", response_model=ProductListResponse)
def get_products(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    sort: Optional[str] = Query(default="newest"), # newest, price_asc, price_desc, popular
    is_featured: Optional[bool] = None,
    session: Session = Depends(get_session)
):
    query = select(Product).where(Product.is_active == True)

    if category:
        # Check if category is uuid or slug
        try:
            cat_id = uuid.UUID(category)
            query = query.where(Product.category_id == cat_id)
        except ValueError:
            cat = session.exec(select(Category).where(Category.slug == category)).first()
            if cat:
                query = query.where(Product.category_id == cat.id)
            else:
                return ProductListResponse(items=[], total=0, page=page, limit=limit, total_pages=0)

    if search:
        search_term = f"%{search.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Product.name).like(search_term),
                func.lower(Product.description).like(search_term),
                func.lower(Product.sku).like(search_term)
            )
        )

    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if is_featured is not None:
        query = query.where(Product.is_featured == is_featured)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    # Sort
    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    # Pagination
    offset = (page - 1) * limit
    products = session.exec(query.offset(offset).limit(limit)).all()

    total_pages = (total + limit - 1) // limit if total > 0 else 1
    items = [build_product_response(p) for p in products]

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/featured", response_model=List[ProductResponse])
def get_featured_products(
    limit: int = Query(default=8, ge=1, le=20),
    session: Session = Depends(get_session)
):
    query = (
        select(Product)
        .where(Product.is_active == True, Product.is_featured == True)
        .order_by(Product.created_at.desc())
        .limit(limit)
    )
    products = session.exec(query).all()
    return [build_product_response(p) for p in products]

@router.get("/all", response_model=ProductListResponse)
def get_all_products_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[uuid.UUID] = None,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    query = select(Product)

    if category_id:
        query = query.where(Product.category_id == category_id)

    if search:
        search_term = f"%{search.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Product.name).like(search_term),
                func.lower(Product.sku).like(search_term)
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.order_by(Product.created_at.desc())
    offset = (page - 1) * limit
    products = session.exec(query.offset(offset).limit(limit)).all()

    total_pages = (total + limit - 1) // limit if total > 0 else 1
    items = [build_product_response(p) for p in products]

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/{id_or_slug}", response_model=ProductResponse)
def get_product(id_or_slug: str, session: Session = Depends(get_session)):
    query = select(Product)
    try:
        p_uuid = uuid.UUID(id_or_slug)
        query = query.where(Product.id == p_uuid)
    except ValueError:
        query = query.where(Product.slug == id_or_slug)

    product = session.exec(query).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return build_product_response(product)

@router.get("/{id_or_slug}/related", response_model=List[ProductResponse])
def get_related_products(
    id_or_slug: str,
    limit: int = Query(default=4, ge=1, le=12),
    session: Session = Depends(get_session)
):
    query = select(Product)
    try:
        p_uuid = uuid.UUID(id_or_slug)
        query = query.where(Product.id == p_uuid)
    except ValueError:
        query = query.where(Product.slug == id_or_slug)

    product = session.exec(query).first()
    if not product:
        return []

    related = session.exec(
        select(Product)
        .where(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.is_active == True
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
    ).all()

    return [build_product_response(p) for p in related]

@router.post("", response_model=ProductResponse)
def create_product(
    prod_in: ProductCreate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    # Verify category exists
    category = session.get(Category, prod_in.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category_id: category does not exist")

    # Generate slug if empty
    slug = prod_in.slug or slugify(prod_in.name)
    existing_slug = session.exec(select(Product).where(Product.slug == slug)).first()
    if existing_slug:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    # Check sku uniqueness
    existing_sku = session.exec(select(Product).where(Product.sku == prod_in.sku)).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail=f"A product with SKU '{prod_in.sku}' already exists")

    product = Product(
        name=prod_in.name,
        slug=slug,
        sku=prod_in.sku,
        description=prod_in.description,
        price=prod_in.price,
        discount_price=prod_in.discount_price,
        stock=prod_in.stock,
        category_id=prod_in.category_id,
        specs=prod_in.specs,
        is_featured=prod_in.is_featured,
        is_active=prod_in.is_active,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    session.add(product)
    session.commit()
    session.refresh(product)

    # Attach images
    for idx, img_data in enumerate(prod_in.images):
        p_image = ProductImage(
            product_id=product.id,
            image_url=img_data.image_url,
            image_file_id=img_data.image_file_id,
            display_order=img_data.display_order if img_data.display_order != 0 else idx,
            is_thumbnail=img_data.is_thumbnail or (idx == 0)
        )
        session.add(p_image)

    session.commit()
    session.refresh(product)
    return build_product_response(product, category.name)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: uuid.UUID,
    prod_in: ProductUpdate,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_dict = prod_in.model_dump(exclude_unset=True)
    images_data = update_dict.pop("images", None)

    if "name" in update_dict and not update_dict.get("slug"):
        update_dict["slug"] = slugify(update_dict["name"])

    if "category_id" in update_dict:
        category = session.get(Category, update_dict["category_id"])
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category_id")

    for key, value in update_dict.items():
        setattr(product, key, value)

    product.updated_at = datetime.now(timezone.utc)

    # Handle image replacement/update if provided
    if images_data is not None:
        # Determine images removed to optionally delete from ImageKit
        current_images = session.exec(select(ProductImage).where(ProductImage.product_id == product.id)).all()
        new_urls = {img["image_url"] for img in images_data}
        
        for old_img in current_images:
            if old_img.image_url not in new_urls and old_img.image_file_id:
                imagekit_service.delete_image(old_img.image_file_id)
            session.delete(old_img)

        # Add updated image list
        for idx, img_dict in enumerate(images_data):
            p_img = ProductImage(
                product_id=product.id,
                image_url=img_dict["image_url"],
                image_file_id=img_dict.get("image_file_id"),
                display_order=img_dict.get("display_order", idx),
                is_thumbnail=img_dict.get("is_thumbnail", idx == 0)
            )
            session.add(p_img)

    session.add(product)
    session.commit()
    session.refresh(product)
    return build_product_response(product)

@router.delete("/{product_id}")
def delete_product(
    product_id: uuid.UUID,
    session: Session = Depends(get_session),
    admin: Admin = Depends(get_current_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Delete all associated images from ImageKit
    for img in product.images:
        if img.image_file_id:
            imagekit_service.delete_image(img.image_file_id)

    session.delete(product)
    session.commit()
    return {"message": "Product and associated images deleted successfully"}
