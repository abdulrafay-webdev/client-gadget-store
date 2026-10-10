# Hamza Gadget Store (Complete Production E-Commerce)

A full-stack luxury e-commerce platform built for high-performance gadgets (Earbuds, Smartwatches, GaN Chargers, Power Banks, Cables, and Protective Accessories) tailored for customers and fulfillment in Pakistan.

---

## Tech Stack Overview

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS (Black & Golden Luxury Theme).
- **Backend**: FastAPI (Python 3.13) + SQLModel ORM + Pydantic v2.
- **Database**: PostgreSQL (Neon Serverless with `sslmode=require`).
- **Media / Image CDN**: ImageKit (Real-time backend upload with automatic asset cleanup).
- **Security & Auth**: bcrypt password hashing, JWT token authorization for Admin Panel, brute-force rate limiter on login, guest checkout for shoppers.
- **Payment Method**: Cash on Delivery (COD) across Pakistan (Karachi, Lahore, Islamabad, etc.) with modular architecture for online payment gateways.

---

## Monorepo Project Structure

```text
E:/gadget store/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py          # Admin login & JWT verification
│   │   │       │   ├── categories.py    # Public & admin category management
│   │   │       │   ├── products.py      # Catalog filtering, search & admin CRUD
│   │   │       │   ├── orders.py        # Guest checkout & order tracking
│   │   │       │   ├── upload.py        # ImageKit upload & deletion
│   │   │       │   ├── banners.py       # Hero banner management
│   │   │       │   ├── settings.py      # Store settings (tariffs & contact)
│   │   │       │   └── dashboard.py     # Analytics & 7-day sales metrics
│   │   │       └── api.py               # Combined API v1 router
│   │   ├── core/
│   │   │   ├── config.py                # Environment configuration
│   │   │   ├── database.py              # SQLModel engine & session
│   │   │   ├── security.py              # Password hashing & JWT
│   │   │   ├── dependencies.py          # Admin OAuth2 dependencies
│   │   │   └── rate_limiter.py          # Login protection
│   │   ├── db/
│   │   │   └── seed.py                  # Initial admin & 14+ gadget seed script
│   │   ├── models/                      # SQLModel DB models
│   │   ├── schemas/                     # Pydantic schemas
│   │   ├── services/                    # ImageKit wrapper
│   │   └── main.py                      # FastAPI entrypoint (uvicorn app.main:app)
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (store)/                 # Customer-facing storefront
│   │   │   │   ├── page.tsx             # Home: Hero, categories, deals, best sellers
│   │   │   │   ├── shop/page.tsx        # Filterable catalog with search & pagination
│   │   │   │   ├── product/[slug]/page.tsx # Gallery, specs, and COD order button
│   │   │   │   ├── cart/page.tsx        # Persistent cart with free shipping meter
│   │   │   │   ├── checkout/page.tsx    # Pakistani guest checkout (COD)
│   │   │   │   ├── order-success/[orderNumber]/page.tsx # Order confirmation
│   │   │   │   ├── track-order/page.tsx # Live order tracker
│   │   │   │   ├── about/page.tsx       # Brand story & warranty terms
│   │   │   │   ├── contact/page.tsx     # Direct WhatsApp & message form
│   │   │   │   ├── shipping-returns/page.tsx # COD & checking warranty rules
│   │   │   │   ├── privacy/page.tsx     # Privacy statement
│   │   │   │   └── layout.tsx           # Store header & luxury footer
│   │   │   ├── admin/                   # Admin portal (JWT protected)
│   │   │   │   ├── login/page.tsx       # Sleek admin login
│   │   │   │   ├── dashboard/page.tsx   # Revenue, orders, 7-day sales chart
│   │   │   │   ├── products/            # Catalog CRUD & specs editor
│   │   │   │   ├── categories/          # Category CRUD & cover upload
│   │   │   │   ├── orders/              # Orders list & detail inspector
│   │   │   │   ├── banners/             # Promotional hero banners
│   │   │   │   └── settings/            # Tariffs & contact management
│   │   │   ├── sitemap.ts               # Dynamic SEO sitemap
│   │   │   ├── robots.ts                # Search bot crawler rules
│   │   │   └── globals.css              # Black & Gold luxury theme tokens
│   │   ├── components/                  # Store & Admin UI components
│   │   ├── context/                     # CartContext & AdminAuthContext
│   │   ├── lib/                         # Typed API client & PKR formatters
│   │   └── types/                       # TypeScript models
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── README.md
```

---

## Quickstart & Local Setup

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
```

Configure your credentials in `backend/.env`:
- `DATABASE_URL`: Your Neon PostgreSQL connection string (with `?sslmode=require`).
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: From your ImageKit Developer Options.
- `JWT_SECRET`: 32-byte secure key.
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Your chosen admin login credentials.

```bash
# Seed initial admin user, categories, and 14 sample gadgets:
python -m app.db.seed

# Start backend server:
uvicorn app.main:app --reload --port 8000
```

- Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health check: [http://localhost:8000/](http://localhost:8000/)

---

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install packages
npm install

# Setup environment variables
cp .env.example .env.local

# Run Next.js development server
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub/GitLab.
2. In the [Vercel Dashboard](https://vercel.com), select **Add New Project** and import the repository.
3. Set **Root Directory** to `frontend`.
4. Framework preset: **Next.js**.
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your production backend API URL (e.g., `https://your-backend.vercel.app/api/v1`).
   - `NEXT_PUBLIC_SITE_URL`: Your production custom domain (e.g., `https://hamzagadgets.pk`).
6. Click **Deploy**.

### Backend Deployment (Vercel + Python)
1. In the [Vercel Dashboard](https://vercel.com), create a new project and set the **Root Directory** to `backend`.
2. Vercel automatically detects the included `vercel.json` and `api/index.py` serverless entrypoint.
3. Add the following Environment Variables in Vercel:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_r8mnl4gqTKUX@ep-misty-dust-b5cdsr7k-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET`: `034a7064d994a233469a5186ef3c2c3344f0c8ea062ecb2e04228480dc0f7b1e`
   - `IMAGEKIT_PUBLIC_KEY`: `public_shAKPR5L5E3gctM8YYk3IOz9Ziw=`
   - `IMAGEKIT_PRIVATE_KEY`: `private_O+tl/OKCO8Fd3+m+tgAFLth76P8=`
   - `IMAGEKIT_URL_ENDPOINT`: `https://ik.imagekit.io/hamzagadget`
   - `ADMIN_EMAIL`: `hamzagadgethouse@gmail.com`
   - `ADMIN_PASSWORD`: `Gadget@1234`
   - `ADMIN_NAME`: `Hamza Gadget Admin`
   - `STORE_NAME`: `Hamza Gadget Store`
   - `STORE_PHONE`: `03152720915`
   - `STORE_WHATSAPP`: `03152720915`
   - `STORE_EMAIL`: `hamzagadgethouse@gmail.com`
   - `STORE_ADDRESS`: `"Shop #4, Gadget Plaza, Hall Road, Lahore, Pakistan"`
   - `FRONTEND_URL`: Your deployed frontend URL (e.g. `https://hamzagadget.vercel.app`)
   - `ALLOWED_ORIGINS`: Comma-separated allowed frontend origins
4. Click **Deploy**. Your FastAPI backend is live with automatic serverless execution!

---

## Completed Feature Checklist

- [x] **Monorepo Layout**: Clean `/frontend` and `/backend` with independent `.env.example` and documentation.
- [x] **Luxury Black & Gold Theme**: Defined across all components via Tailwind theme tokens (`#0A0A0A` base, `#D4AF37` gold accents, dark cards, glowing hover states, and contrast-checked text).
- [x] **Customer Storefront**:
  - [x] Home Page with Hero slider, categories, deal highlights, trust badges, and footer.
  - [x] Product Catalog with search, category filtering, price sorting, and pagination.
  - [x] Product Detail Page with multi-image gallery, rich specs matrix, stock indicators, and Cash on Delivery buttons.
  - [x] Persistent Shopping Cart (LocalStorage) with free delivery progress meter.
  - [x] Guest Checkout with Pakistani cities selector, address validation, and Cash on Delivery default.
  - [x] Order Success confirmation with distinct Order Number generator (`HGS-YYYYMM-XXXX`).
  - [x] Order Tracking page by Order Number + Phone with 4-stage visual progress timeline.
  - [x] Informational pages: About, Contact, Shipping & Returns, Privacy Policy.
- [x] **Admin Control Panel (`/admin`)**:
  - [x] JWT authentication with brute-force rate limiter.
  - [x] Dashboard with revenue metrics, pending orders, low-stock alerts, and 7-day sales chart.
  - [x] Full Product CRUD with specs builder and direct ImageKit multi-image upload & deletion.
  - [x] Category CRUD with image upload.
  - [x] Order Management with status filters and search.
  - [x] Order Detail Inspector rendering purchase-time snapshot items, images, and prices.
  - [x] **Printable Invoice / Packing Slip** with dedicated print stylesheet.
  - [x] Hero Banner slider manager and global store settings (tariffs, contact).
- [x] **Backend & Architecture**:
  - [x] SQLModel ORM models for Admin, Category, Product, ProductImage, Order, OrderItem, Banner, Setting.
  - [x] Purchase-time snapshot fields for accurate order records.
  - [x] ImageKit SDK integration with automated file cleanup.
  - [x] Database seed script with 14 realistic gadget products with PKR prices and specs.
  - [x] Full Swagger documentation at `/docs`.
  - [x] Production build passes with 0 errors and 0 warnings.
