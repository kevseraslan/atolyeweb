# Furniture Workshop (Özel Üretim Mobilya Atölyesi)

Özel üretim mobilya atölyesi için geliştirilen profesyonel web uygulaması ve yönetim sistemi.

## Teknoloji Stack

* **Frontend:** Next.js 16 (App Router, TypeScript 5, Tailwind CSS v4)
* **Backend:** FastAPI 0.141 (Python 3.10, SQLAlchemy 2.0 Async, Alembic 1.19, Pydantic 2.13)
* **Veritabanı (Local):** PostgreSQL 16 (Local Docker Container)
* **Production Hedefi:** Self-Managed PostgreSQL on Contabo Ubuntu VPS + Nginx + Systemd
* **Medya Yönetimi:** Cloudinary Free CDN (Yalnız Admin içerikleri: ürünler ve dokular)

## Monorepo Yapısı

```text
furniture-workshop/
├── frontend/         # Next.js Frontend Uygulaması
├── backend/          # FastAPI REST API Backend Uygulaması
├── docs/             # Mimari ve Sistem Dokümanları
├── compose.yaml      # Local PostgreSQL Container Yapılandırması
└── README.md
```

## Yerel Geliştirme (Local Development Setup)

### 1. PostgreSQL Veritabanını Çalıştırma
```bash
docker compose up -d
```

### 2. Backend (FastAPI) Çalıştırma
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API adresi: `http://localhost:8000/api/v1/health`  
Swagger/OpenAPI Dokümanı: `http://localhost:8000/docs`

### 3. Frontend (Next.js) Çalıştırma
```bash
cd frontend
npm install
npm run dev
```
Frontend adresi: `http://localhost:3000`

## Environment Yapılandırması
* Frontend için `frontend/.env.example` dosyasını `frontend/.env.local` olarak kopyalayın.
* Backend için `backend/.env.example` dosyasını `backend/.env` olarak kopyalayın.
