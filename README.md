# Özel Mobilya Atölyesi — Web Uygulaması

Özel üretim masif ahşap mobilya atölyesi için geliştirilmiş, yüksek performanslı, güvenli ve zanaat kimliğini yansıtan modern web uygulaması.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### Frontend
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Dil:** TypeScript
- **Stil & Tasarım:** Tailwind CSS v4 (Stitch Design System)
- **Görsel & Medya:** `next/image` + Yerel SVG İllüstrasyonları + Cloudinary CDN
- **E2E Test:** Playwright

### Backend
- **Framework:** FastAPI (Python 3.13)
- **Veritabanı:** PostgreSQL 16 / 18
- **ORM & Migration:** SQLAlchemy 2.0 (Asyncpg) + Alembic
- **Güvenlik & Auth:** HTTP-only Strict Session Cookies, Argon2id, CSRF Protection, Rate Limiting
- **Test:** Pytest (Asyncio)

### DevOps & Deployment Altyapısı
- **Sistem Servisleri:** Systemd (`furniture-backend.service`, `furniture-frontend.service`)
- **Web Sunucusu & Reverse Proxy:** Nginx + Let's Encrypt TLS
- **CI / CD:** GitHub Actions (Python 3.13 + Node 24 + PostgreSQL CI Service)

---

## 📂 Proje Mimarisi

```text
├── .github/
│   └── workflows/
│       └── ci.yml               # CI Release Verification Pipeline
├── backend/
│   ├── alembic/                 # Veritabanı migration scriptleri
│   ├── app/
│   │   ├── api/v1/endpoints/    # REST API router & endpoint tanımları
│   │   ├── core/                # Config, CSRF, Rate Limiting, Security Headers
│   │   ├── db/                  # Veritabanı async session yönetimi
│   │   ├── models/              # SQLAlchemy Domain modelleri
│   │   ├── schemas/             # Pydantic validation şemaları
│   │   └── services/            # İş mantığı servisleri
│   ├── tests/                   # Backend unit & integration testleri
│   ├── .env.example             # Backend örnek ortam değişkenleri
│   └── requirements.txt         # Python bağımlılıkları
├── frontend/
│   ├── app/
│   │   ├── (public)/            # Kamusal vitrin sayfaları (/, /urunler, /ozel-siparis, /siparis-takip, /hakkimizda, /iletisim, /kvkk, /gizlilik)
│   │   └── admin/               # Yetkili yönetim paneli sayfaları
│   ├── components/              # Yeniden kullanılabilir UI bileşenleri
│   ├── features/                # Domain bazlı modüller (products, orders, tracking, admin)
│   ├── public/visuals/          # Yerel SVG görsel ve illüstrasyon varlıkları
│   ├── e2e/                     # Playwright release testleri
│   ├── .env.example             # Frontend örnek ortam değişkenleri
│   └── package.json
├── deploy/                      # Nginx, Systemd ve sunucu kurulum scriptleri
└── docs/                        # Güvenlik, SEO, performans, KVKK ve release dokümantasyonu
```

---

## 🚀 Yerel Geliştirme Ortamı (Local Setup)

### 1. Gereksinimler
- **Node.js:** `>=24 <25`
- **Python:** `3.13.x`
- **PostgreSQL:** `16+`

### 2. Veritabanı ve Migration
PostgreSQL üzerinde `furniture_db` veritabanı oluşturulduktan sonra backend dizininde:

```bash
cd backend
.\.venv\Scripts\alembic.exe upgrade head
```

### 3. Backend'i Başlatma
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Health:** `http://127.0.0.1:8000/api/v1/health`
* **API Readiness:** `http://127.0.0.1:8000/api/v1/health/ready`

### 4. Frontend'i Başlatma
```bash
cd frontend
npm install
npm run dev
```
* **Web Arayüzü:** `http://localhost:3000`

---

## 🧪 Test & Kalite Kontrolü

### Backend Testleri
```bash
cd backend
.\.venv\Scripts\pytest.exe
```

### Frontend Lint & Build
```bash
cd frontend
npm run lint
npm run build
```

---

## 🔒 Güvenlik & Gizlilik
- Gerçek secret anahtarları ve şifreler `.gitignore` kapsamında repodan izole edilmiştir.
- Online ödeme ve müşteri görsel yükleme riski barındırmaz.
- Tüm formlar ve yönetim paneli CSRF ve Rate Limiting koruması altındadır.
