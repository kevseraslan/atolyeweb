# Release Verification & Testing Architecture Guide

## 1. Test Katmanları & Mimarisi

### Katman 1: Backend Unit & Integration Tests (Pytest)
- **Konum:** `backend/tests/`
- **Kapsam:** 49 adet otomatik test
  - `test_admin_system.py`: Yetkilendirme, session token iptali, dahili admin notları.
  - `test_config.py`: Üretim ortamında `AUTH_SECRET` fail-fast denetimleri.
  - `test_health.py`: Sistem ve DB erişilebilirlik kontolü.
  - `test_image_service.py`: Görsel doğrulama, boyutlandırma, Cloudinary entegrasyonu.
  - `test_order_tracking.py`: Kişisel sipariş sorgulama, yanlış telefon jenerik hata koruması.
  - `test_orders.py`: Sipariş talebi oluşturma, snapshot verileri.
  - `test_performance.py`: Hassas `Cache-Control: no-store` başlıkları, sayfalama sınırları.
  - `test_privacy.py`: Müşteri kişisel verilerinin korunması, sahte email bulunmaması.
  - `test_products.py`: Ürün kataloğu, aktiflik filtreleri, DB kısıtlamaları.
  - `test_security_hardening.py`: Rate limiting, XSS/CSRF ve yetkisiz erişim engelleme.
  - `test_seo.py`: Kamusal metadata ve sitemap doğrulaması.

### Katman 2: Veritabanı Migration & Şema Doğrulaması
- **Komut:** `alembic upgrade head`, `alembic current`
- **Head Revision:** `1e7e46d98cd9 (head)`
- **Kapsam:** Sıfır PostgreSQL 16 veritabanında tüm şema tabloları ve kısıtlamaları (`alembic upgrade head`) bağımsız çalışmaktadır.

### Katman 3: Browser E2E Tests (Playwright)
- **Konum:** `frontend/e2e/release.spec.ts`
- **Konfigürasyon:** `frontend/playwright.config.ts`
- **Kapsam:**
  - Kamusal Ana Sayfa, Ürün Kataloğu, Ürün Detayı, 404 Sayfası
  - Özel Sipariş Formu (Katalog vs Özel Tasarım, opsiyonel e-posta, validasyonlar, çift submit koruması)
  - Sipariş Takip Akışı (Başarılı sorgulama, yanlış telefon jenerik hatası)
  - Admin Giriş & Rota Koruması (`/admin/login`, yetkisiz yönlendirme, HttpOnly çerez koruması)
  - Erişilebilirlik & Klavyeyle Gezinme (Tab tuşu ile form odağı)

### Katman 4: CI Workflow (GitHub Actions)
- **Konum:** `.github/workflows/ci.yml`
- **Kapsam:** Push & PR aşamasında PostgreSQL 16 service container üzerinde Alembic migration, Pytest, Next.js ESLint ve Production Build adımlarını çalıştırır.

---

## 2. Test Çalıştırma Komutları

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

## 3. Bilinen Sınırlamalar (Known Limitations)
1. **Saha Core Web Vitals:** LCP, CLS, INP metrikleri canlı production deployment sonrasında Google Search Console ve Chrome UX raporları üzerinden izlenecektir.
2. **Cloudinary E2E Mocking:** Canlı Cloudinary hesabına E2E test esnasında atık görsel yüklenmemesi için test ortamında Cloudinary mock yapılandırması kullanılır.
3. **Anlık Ödeme / SMS / E-Posta:** İş gereksinimleri doğrultusunda sitede kredi kartı/anlık ödeme ve SMS entegrasyonu bulunmamaktadır.

---

## 4. Hukuki & Canlı Dağıtım Öncesi Engelleyiciler (Release Blockers)
- [ ] Gerçek kamuya açık işletme adının (`NEXT_PUBLIC_SITE_NAME`) tanımlanması
- [ ] Gerçek canlı alan adının (`NEXT_PUBLIC_SITE_URL`) tanımlanması
- [ ] Canlı sunucuda `NEXT_PUBLIC_SITE_INDEXABLE=true` yapılması
- [ ] KVKK başvuru e-posta adresinin ve adres bilgilerinin gerçek işletme verileriyle doldurulması
- [ ] Veri saklama (Retention) sürelerinin resmi hukuk danışmanlığı ile onaylanması
