# Hamza Gadget Store - Backend API

FastAPI backend with SQLModel ORM, PostgreSQL (Neon), ImageKit media CDN, JWT authentication, and guest checkout.

## Features
- **FastAPI + SQLModel**: Type-safe REST API with automatic Swagger docs at `/docs`.
- **Database**: PostgreSQL (Neon connection with SSL `sslmode=require`).
- **Media**: ImageKit integration for high-speed CDN image upload & automatic cleanup.
- **Security**: bcrypt password hashing, JWT admin authorization, login brute-force rate limiter.
- **Order Snapshots**: Snapshot of product title, price, and thumbnail preserved on purchase.
- **Pakistan E-commerce**: PKR pricing, Cash on Delivery (COD) default, Pakistani cities support.

## Local Setup

1. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```

4. **Seed Database**:
   ```bash
   python -m app.db.seed
   ```

5. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Vercel Deployment (Serverless Python)

This backend includes `vercel.json` and `api/index.py` configured for Vercel Python serverless deployment.

1. Deploy the `backend` directory directly to Vercel.
2. In the Vercel project settings, set the environment variables from `.env`.
3. Vercel automatically runs `api/index.py` which mounts `app.main:app`.
