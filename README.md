# Furniture Workshop (Özel Üretim Mobilya Atölyesi)

Özel üretim mobilya atölyesi için geliştirilen profesyonel web uygulaması ve yönetim sistemi.

## Teknoloji Stack

* **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS)
* **Backend:** FastAPI (Python, SQLAlchemy 2.x Async, Alembic, Pydantic)
* **Veritabanı:** PostgreSQL (Local Docker Container / Managed PostgreSQL)
* **Medya Yönetimi:** Cloudinary CDN

## Monorepo Yapısı

```text
furniture-workshop/
├── frontend/         # Next.js Frontend Uygulaması
├── backend/          # FastAPI REST API Backend Uygulaması
├── docs/             # Mimari ve Sistem Dokümanları
├── docker-compose.yml# Local PostgreSQL Container Yapılandırması
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
