# Release Verification & Testing Architecture Guide

## 1. Release Gates & Hiyerarşisi

### GATE 1: LOCAL RELEASE GATE
- **Backend Unit & Integration:** Pytest 50 adet test (`.\.venv\Scripts\pytest.exe`).
- **Database Migrations:** `alembic upgrade head` (Current head: `1e7e46d98cd9`).
- **Frontend Quality:** ESLint (`npm run lint`), TypeScript & Next.js Production Build (`npm run build`).
- **Local E2E Suite:** Playwright E2E tarayıcı testleri (`npm run test:e2e`).

### GATE 2: CI RELEASE GATE (GitHub Actions)
- **Konum:** `.github/workflows/ci.yml`
- **Tetikleyiciler:** `push: main`, `pull_request: main`
- **İş Yükleri (Jobs):**
  1. `backend-tests`: Python 3.13 + PostgreSQL 16 Service Container + Alembic Migrations + Pytest.
  2. `frontend-build`: Node.js 24 + `npm ci` + ESLint + `npm run build`.
  3. `e2e-tests`: `needs: [backend-tests, frontend-build]`. PostgreSQL 16 Service + FastAPI health polling (`/api/v1/health/ready`) + Node 24 Next.js Production Server polling (`http://127.0.0.1:3000`) + Playwright E2E testleri.

### GATE 3: DEPLOYMENT GATE (Aşama 18+)
- Canlı sunucu kurulumu (Contabo VPS, Nginx reverse proxy, SSL/TLS, prod secrets, firewall).

---

## 2. Test Katmanları & Senaryo Haritası

### Playwright E2E Senaryoları (`frontend/e2e/release.spec.ts`)
* **7 Mantıksal Senaryo × 2 Proje (Desktop 1440x900 & Mobile 375x812) = 14 Toplam Tarayıcı Çalıştırması (Executions):**
  1. `01. Public Catalog & Navigation E2E`: Ana sayfa, ürün kataloğu, ürün detay, 404 yönetimi, çerez kontrolü.
  2. `02. Catalog Product Order Flow E2E`: Katalog ürünü siparişi, boyutlar, renk/malzeme seçimi, başvuru ve takip numarası üretimi.
  3. `03. Custom Design Order Flow E2E`: Serbest özel tasarım metni ile sipariş, opsiyonel e-posta boş bırakma.
  4. `04. Order Tracking Flow E2E`: Başarılı takip sorgulama; yanlış telefon veya geçersiz takip numarasında jenerik güvenlik hatası.
  5. `05. Admin Auth, Session & Route Protection E2E`: Yetkisiz yönlendirme, jenerik giriş hatası, HttpOnly çerez testi.
  6. `06. Controlled API Network Failure UX E2E`: HTTP 500 sunucu hatasında kullanıcıya temiz jenerik mesaj gösterimi; stack trace gizleme.
  7. `07. Accessibility & Keyboard Focus Navigation Smoke E2E`: Tab tuşu odağı ve erişilebilir buton isimleri.

---

## 3. Test Çalıştırma Komutları

```bash
# Backend Testlerini Çalıştırma
cd backend
.\.venv\Scripts\pytest.exe

# Migration Durumunu Kontrol Etme
cd backend
.\.venv\Scripts\alembic.exe current

# Frontend Lint & Production Build
cd frontend
npm run lint
npm run build

# Playwright E2E Browser Testleri
cd frontend
npm run test:e2e
```

---

## 4. Bilinen Sınırlamalar (Known Limitations)
1. **Saha Core Web Vitals:** LCP, CLS, INP metrikleri canlı production deployment sonrasında Google Search Console ve Chrome UX raporları üzerinden izlenecektir.
2. **Cloudinary E2E Mocking:** Canlı Cloudinary hesabına E2E test esnasında atık görsel yüklenmemesi için test ortamında Cloudinary mock yapılandırması kullanılır.
3. **Anlık Ödeme / SMS / E-Posta:** İş gereksinimleri doğrultusunda sitede kredi kartı/anlık ödeme ve SMS entegrasyonu bulunmamaktadır.

---

## 5. Hukuki & Canlı Dağıtım Öncesi Engelleyiciler (Release Blockers - Aşama 18)
- [ ] Gerçek kamuya açık işletme adının (`NEXT_PUBLIC_SITE_NAME`) tanımlanması
- [ ] Gerçek canlı alan adının (`NEXT_PUBLIC_SITE_URL`) tanımlanması
- [ ] Canlı sunucuda `NEXT_PUBLIC_SITE_INDEXABLE=true` yapılması
- [ ] KVKK başvuru e-posta adresinin ve adres bilgilerinin gerçek işletme verileriyle doldurulması
- [ ] Veri saklama (Retention) sürelerinin resmi hukuk danışmanlığı ile onaylanması
- [ ] Contabo VPS provisioning, Nginx trusted proxy ve TLS sertifika kurulumları
