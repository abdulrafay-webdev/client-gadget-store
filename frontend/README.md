# Hamza Gadget Store - Frontend Application

Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS e-commerce storefront and admin panel for Hamza Gadget Store.

## Key Highlights
- **Luxury Theme**: Premium Black (#0A0A0A) & Golden (#D4AF37) visual identity.
- **Customer Storefront**:
  - Hero slider with promotional deals.
  - Category exploration with product counters.
  - Interactive product catalog with keyword search, category filters, and price sorting.
  - Product detail page with multi-image gallery, specs matrix, and Cash on Delivery CTAs.
  - Persistent cart (LocalStorage) with live free shipping meter.
  - Guest checkout with Pakistani cities dropdown and COD order submission.
  - Live order tracking with visual timeline.
- **Admin Control Panel (`/admin`)**:
  - JWT secured admin login.
  - Analytics dashboard with revenue, order statistics, low-stock alerts, and 7-day sales chart.
  - Products catalog CRUD with specs builder and ImageKit multi-image uploader.
  - Category manager with ImageKit cover uploads.
  - Order inspector with purchase-time snapshot views, status updater, and **Printable Invoice / Packing Slip**.
  - Hero banner manager and global store settings.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Set `NEXT_PUBLIC_API_URL` to your FastAPI backend endpoint (e.g., `http://localhost:8000/api/v1`).

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the storefront.
   Access `/admin` for the admin portal.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```
