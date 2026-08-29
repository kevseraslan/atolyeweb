# Furniture Workshop

> Özel üretim mobilya atölyeleri için katalog, teklif talebi, sipariş takip ve yönetim paneli sistemi.

Furniture Workshop, özel üretim yapan masif ahşap mobilya atölyeleri için geliştirilmiş, modern, güvenli ve performans odaklı bir web uygulamasıdır. Klasik stoklu e-ticaret sitelerinden farklı olarak; müşterilerin ürün modellerini inceleyebildiği, istedikleri ebat, ahşap türü ve renk tercihlerine göre özel sipariş / teklif talebi oluşturabildiği, taleplerini benzersiz takip kodu ve telefon numarasıyla şeffaf şekilde takip edebildiği bir yapı sunar. Arka planda ise atölye yöneticilerinin ürün kataloğunu, gelen talepleri, fiyatlandırma ve üretim aşamalarını kolayca yönetebileceği kapsamlı bir yönetim paneli barındırır.

> [!NOTE]
> Bu proje klasik e-ticaret checkout sistemi değildir. Online ödeme, kredi kartı veya sepet altyapısı bulunmaz. Siparişler özel üretim / teklif talebi olarak alınır ve ticari süreç atölye ile müşteri arasında doğrudan yürütülür.

---

## 🛋️ Özellikler

### Kullanıcı Özellikleri
- **Ürün Kataloğu & Filtreleme:** Kategori bazlı filtreleme ve detaylı ürün listeleme.
- **Ürün Detay Sayfaları:** Çoklu görsel galerisi, varsayılan ölçü bilgileri, malzeme ve renk seçenekleri.
- **Özel Ölçü & Teklif Talebi:** Katalogdan seçilen veya tamamen sıfırdan hayal edilen mobilyalar için genişlik, yükseklik, derinlik, adet ve özel not belirterek form üzerinden teklif oluşturma.
- **Güvenli Sipariş Takibi:** Müşteri hesabı veya şifre zorunluluğu olmadan, sipariş takip kodu ve telefon numarası doğrulaması ile anlık durum (Talep Alındı, İncelemede, Fiyatlandırıldı, Üretimde, Teslim Edildi) takibi.
- **Zanaat Odaklı Görsel Arayüz:** Doğal ahşap tonları, Stitch tasarım sistemi, duyarlı (responsive) mobil ve masaüstü yerleşim.
- **KVKK ve Gizlilik Bilgilendirmesi:** 6698 sayılı KVKK uyarınca açık aydınlatma metni ve çerez bilgilendirmesi.

### Yönetici Özellikleri
- **Güvenli Admin Kimlik Doğrulama:** Argon2id parola doğrulaması, HttpOnly Secure session çerezleri ve CSRF koruması.
- **Katalog & İçerik Yönetimi:** Ürün ekleme/düzenleme/silme, kategori, renk ve malzeme tanımlama.
- **Medya Yönetimi:** Ürünler için birincil ve ikincil katalog görsellerinin yönetimi.
- **Sipariş & Teklif Yönetimi:** Gelen talepleri listeleme, duruma ve tarihe göre filtreleme, sayfalama (pagination) ve detay inceleme.
- **Teklif & Durum Güncelleme:** Tahmini/onaylanan fiyat girişi, durum ilerletme ve müşteriye gösterilmeyen dahili atölye notları ekleme.
- **Site Ayarları & Dashboard:** Atölye iletişim bilgileri, sosyal medya bağlantıları ve özet sipariş metrikleri.

---

## 🛠️ Teknoloji Yığını

| Katman | Teknolojiler |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `next/image`, `next/font` |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2, `asyncpg` |
| **Veritabanı** | PostgreSQL 16 (Alpine Container / Native Service) |
| **Medya Sunucusu** | Cloudinary CDN *(Yalnızca yönetici tarafından yüklenen katalog görselleri için)* |
| **Test & Kalite** | Pytest (Asyncio), Playwright (E2E), ESLint, TypeScript Strict Check |
| **CI Pipeline** | GitHub Actions (Python 3.13, Node 24, PostgreSQL 16 Service Container) |
| **Hedef Prod Mimarisi** | Ubuntu LTS, Nginx Reverse Proxy, Systemd Servisleri, Let's Encrypt TLS |

---

## 📐 Sistem Mimarisi

### Yerel Geliştirme Akışı
```text
Browser (İstemci)
   │
   ├──────► Next.js (Port: 3000)
   │           │
   │           ▼ (API Requests / Proxy)
   └──────► FastAPI (Port: 8000)
               │
               ├──────► PostgreSQL (Port: 5432)
               │
               └──────► Cloudinary CDN (Yalnızca Admin Medya Yüklemeleri)
```

### Hedef Production Mimarisi
```text
İnternet / Kullanıcılar (HTTPS :443)
                 │
                 ▼
          Nginx Reverse Proxy
                 │
        ┌────────┴────────┐
        ▼                 ▼
     Next.js           FastAPI
 (127.0.0.1:3000)  (127.0.0.1:8000)
                          │
                          ▼
                     PostgreSQL
                  (127.0.0.1:5432)
```

---

## 📁 Proje Klasör Yapısı

```text
furniture-workshop/
├── frontend/          # Next.js 16 kullanıcı arayüzü, admin paneli ve görsel varlıklar
├── backend/           # FastAPI REST API servisi, modeller, servisler ve testler
├── deploy/            # Nginx, Systemd ve sunucu hazırlık şablonları
├── docs/              # Güvenlik, gizlilik, SEO, performans, test ve prod dokümantasyonu
├── .github/           # GitHub Actions CI iş akışı tanımları
├── compose.yaml       # Yerel PostgreSQL Docker Container konfigürasyonu
├── .gitignore         # Secret ve derleme çıktısı izolasyon kuralları
└── README.md          # Proje dokümantasyonu
```

* **`frontend/`** $\rightarrow$ Next.js 16 Server Components, Tailwind CSS, Playwright testleri ve yerel SVG illüstrasyonları.
* **`backend/`** $\rightarrow$ FastAPI endpointleri, SQLAlchemy 2.0 modelleri, Alembic migration zinciri ve Pytest test paketi.
* **`deploy/`** $\rightarrow$ Nginx konfigürasyonu, Systemd backend/frontend servis üniteleri ve sunucu kurulum betiği.
* **`docs/`** $\rightarrow$ Güvenlik, gizlilik (KVKK), SEO, performans, test ve production mimarisi rehberleri.
* **`.github/`** $\rightarrow$ Automated CI Release Gate doğrulamaları.

---

## ⚙️ Gereksinimler

### Yerel Geliştirme
- **Node.js:** `24.x` (LTS)
- **npm:** `11.x`
- **Python:** `3.13.x`
- **Docker Desktop** veya yerel **PostgreSQL 16+**
- **İşletim Sistemi:** Windows (PowerShell) / Linux / macOS

---

## 🚀 Yerel Geliştirme Kurulumu

### 1. Depoyu Klonlama
```bash
git clone <REPOSITORY_URL>
cd furniture-workshop
```

### 2. Veritabanını Başlatma
Docker Compose kullanarak PostgreSQL container'ını başlatın:
```bash
docker compose up -d
```
*(Alternatif olarak mevcut container'ı başlatmak için: `docker start furniture_workshop_postgres`)*

---

### 3. Backend Kurulumu & Başlatma

1. Backend dizinine geçin ve sanal ortam oluşturun:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Ortam değişkenlerini hazırlayın:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Veritabanı şemasını uygulayın (Alembic Migration):
   ```bash
   alembic upgrade head
   ```

4. İlk Yönetici (Admin) Hesabını Oluşturun:
   ```bash
   python scripts/create_admin.py
   ```
   *(Sistem güvenliği için varsayılan parola veya kullanıcı bulunmaz; komut satırı üzerinden etkileşimli olarak tanımlanır.)*

5. Backend sunucusunu başlatın:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   - **Backend API:** `http://127.0.0.1:8000`
   - **Health Check:** `http://127.0.0.1:8000/api/v1/health`
   - **Readiness Check:** `http://127.0.0.1:8000/api/v1/health/ready`

---

### 4. Frontend Kurulumu & Başlatma

1. Frontend dizinine geçin ve bağımlılıkları yükleyin:
   ```bash
   cd frontend
   npm ci
   ```

2. Ortam değişkenlerini hazırlayın:
   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   - **Web Sitesi:** `http://localhost:3000`
   - **Admin Girişi:** `http://localhost:3000/admin/login`

---

## 🔑 Ortam Değişkenleri (Environment Variables)

> [!WARNING]
> Gerçek `.env` ve `.env.local` dosyaları asla Git'e commit edilmemelidir. Yalnızca `.env.example` şablonları depoda tutulur.

### Backend (`backend/.env.example`)
- `APP_NAME`: Uygulama adı
- `APP_ENV`: `development` | `production`
- `DEBUG`: `true` | `false`
- `DATABASE_URL`: PostgreSQL bağlantı dizesi (`postgresql+asyncpg://...`)
- `FRONTEND_URL`: İstemci kök adresi (`http://localhost:3000`)
- `AUTH_SECRET`: Oturum ve CSRF imzalama anahtarı (Prod ortamında minimum 32 karakter)
- `TRUST_PROXY`: Reverse proxy arkasında `true` yapılır
- `LOGIN_RATE_LIMIT`: Giriş istek sınırı (`10/15m`)
- `TRACKING_RATE_LIMIT`: Takip sorgulama sınırı (`30/m`)
- `ORDER_CREATE_RATE_LIMIT`: Sipariş oluşturma sınırı (`30/m`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Katalog medyası yapılandırması

### Frontend (`frontend/.env.example`)
- `NEXT_PUBLIC_API_URL`: Backend REST API URL (`http://localhost:8000/api/v1`)
- `NEXT_PUBLIC_SITE_URL`: Frontend public URL (`http://localhost:3000`)
- `NEXT_PUBLIC_SITE_NAME`: Site başlık şablon adı
- `NEXT_PUBLIC_SITE_INDEXABLE`: Arama motoru indexleme izni (`false` / `true`)

---

## 🗄️ Veritabanı Yönetimi (Alembic)

Veritabanı şeması doğrudan kod içinde `create_all()` ile üretilmez; her değişiklik Alembic üzerinden versiyonlanır:

```bash
# En güncel migration'ları uygula
alembic upgrade head

# Mevcut versiyonu görüntüle
alembic current

# Yeni migration oluştur (Model değişikliklerinden)
alembic revision --autogenerate -m "migration_aciklamasi"
```

---

## 🧪 Test & Kalite Doğrulaması

Proje; backend birim/entegrasyon testleri, frontend tip/lint kontrolleri ve Playwright E2E akışlarıyla doğrulanmaktadır.

### Backend Testleri (Pytest)
```bash
cd backend
pytest
```

### Frontend Lint & Build
```bash
cd frontend
npm run lint
npm run build
```

### E2E Testleri (Playwright)
```bash
cd frontend
npm run test:e2e
```

### CI / CD Pipeline (GitHub Actions)
`.github/workflows/ci.yml` iş akışı her push ve PR'da 3 aşamalı release gate çalıştırır:
1. **`backend-tests`:** Python 3.13, PostgreSQL 16 servis container'ı, migration ve Pytest suite.
2. **`frontend-build`:** Node 24, ESLint, TypeScript derleme ve Next.js optimize production build.
3. **`e2e-tests`:** Next.js + FastAPI canlı test sunucusu üzerinde Playwright masaüstü ve mobil test senaryoları.

---

## 🌐 Temel API Uç Noktaları

### Kamusal (Public) Endpoint'ler
- `GET  /api/v1/health` — Servis sağlık kontrolü
- `GET  /api/v1/health/ready` — Veritabanı hazır olma durumu
- `GET  /api/v1/products` — Ürün kataloğu listeleme
- `GET  /api/v1/products/{slug}` — Ürün detayı
- `GET  /api/v1/categories` — Aktif kategoriler
- `POST /api/v1/orders` — Yeni özel sipariş / teklif talebi oluşturma
- `POST /api/v1/orders/track` — Takip numarası ve telefon ile sipariş sorgulama

### Yönetici (Admin) Endpoint'leri *(Kimlik Doğrulama & CSRF Korumalı)*
- `POST /api/v1/admin/auth/login` — Yönetici oturumu başlatma
- `POST /api/v1/admin/auth/logout` — Oturumu sonlandırma
- `GET  /api/v1/admin/dashboard` — Dashboard özet istatistikleri
- `GET/POST/PUT/DELETE /api/v1/admin/products` — Ürün yönetimi
- `GET/PUT /api/v1/admin/orders` — Sipariş listeleme ve durum güncelleme
- `POST /api/v1/admin/products/{id}/images` — Katalog görseli yükleme

---

## 🔒 Güvenlik & Gizlilik

- **Şifreleme & Auth:** Admin parolaları Argon2id ile hash'lenir. Oturumlar `HttpOnly`, `SameSite=Lax`, `Secure` çerezler ile korunur.
- **CSRF & Rate Limiting:** State değiştiren tüm istekler CSRF token ve IP bazlı istek sınırlaması (slowdown & brute-force koruması) altındadır.
- **Veri Minimizasyonu:** Ziyaretçilerden şifre, kredi kartı, banka hesabı veya T.C. kimlik numarası talep edilmez.
- **Görsel İzolasyonu:** Ziyaretçi fotoğraf yüklemesi kapalıdır; Cloudinary CDN yalnızca yetkili yöneticilerin yüklediği public ürün fotoğraflarını barındırır.
- Detaylı bilgi için: [docs/security.md](docs/security.md) ve [docs/privacy.md](docs/privacy.md).

---

## 📈 SEO & Performans

- **SEO:** Dinamik Metadata API, canonical URL'ler, otomatik XML sitemap, `robots.txt`, BreadcrumbList ve Product JSON-LD yapılandırılmıştır. Yönetim ve takip alanları arama motorlarına kapatılmıştır (`noindex`). Detaylar: [docs/seo.md](docs/seo.md).
- **Performans:** Next.js Server Components, Turbopack, `next/image` ile CLS önleme, optimize edilmiş SQL sorguları ve server-side önbellekleme uygulanmıştır. Detaylar: [docs/performance.md](docs/performance.md).

---

## 📊 Proje ve Canlı Yayın Durumu

**Mevcut Durum:** `Release Candidate (RC)`

| Aşama / Alan | Durum | Açıklama |
| :--- | :---: | :--- |
| **Uygulama Geliştirme** | ✅ Tamamlandı | Tüm public vitrin ve admin panel işlevleri hazır. |
| **Birim & E2E Testleri** | ✅ Tamamlandı | Pytest ve Playwright testleri eksiksiz geçiyor. |
| **CI / CD Pipeline** | ✅ Tamamlandı | GitHub Actions 3 aşamalı release gate aktif. |
| **Production Şablonları** | ✅ Tamamlandı | Nginx, Systemd ve setup scriptleri repo içinde hazır. |
| **Canlı VPS Kurulumu** | ⏳ Bekliyor | Canlı sunucu (Contabo VPS) konfigürasyonu yapılacak. |
| **Domain & TLS Aktivasyonu** | ⏳ Bekliyor | DNS yönlendirmesi ve Let's Encrypt sertifikası kurulacak. |
| **Yedekleme & İzleme** | ⏳ Bekliyor | Üretim veritabanı yedekleme ve log takip altyapısı. |

---

## 📚 Dokümantasyon

Detaylı teknik mimari ve süreç kılavuzları `docs/` dizininde yer almaktadır:
- [docs/security.md](docs/security.md) — Güvenlik politikaları, session yönetimi ve rate limit kuralları.
- [docs/privacy.md](docs/privacy.md) — KVKK uyumu ve veri işleme politikası.
- [docs/seo.md](docs/seo.md) — Arama motoru indeksleme, sitemap ve JSON-LD şemaları.
- [docs/performance.md](docs/performance.md) — Önbellekleme, veritabanı optimizasyonu ve Core Web Vitals ilkeleri.
- [docs/testing.md](docs/testing.md) — Test stratejisi ve release gate kriterleri.
- [docs/production-environment.md](docs/production-environment.md) — Hedef sunucu mimarisi ve Nginx/Systemd kurulum detayları.

---

## 📌 Notlar & Katkı
Bu proje özel bir zanaat atölyesi için geliştirilmiş bağımsız bir projedir. Geliştirme ve sürüm yönetimi repo üzerinden sürdürülmektedir.
