# Technical Performance Architecture Guide

## 1. Render Strategy & Client Boundary Matrix

### Server Components (`"use client"` YOK)
- `/` (Ana Sayfa)
- `/urunler` (Ürün Kataloğu)
- `/urunler/[slug]` (Dinamik Ürün Detay)
- `/hakkimizda`, `/kvkk`, `/gizlilik` (Statik Kurumsal Sayfalar)
- `app/layout.tsx`, `app/(public)/layout.tsx`
- `app/admin/layout.tsx` (Server Auth Guard & Server Meta)
- `app/admin/login/page.tsx` (Server Layout)

### Client Components (`"use client"` İzolasyonu)
- `SpecialOrderClient.tsx`: Özel sipariş formu state ve file/option seçimi.
- `OrderTrackingClient.tsx`: Sipariş sorgulama state ve kopyalama işlemi.
- `ContactClient.tsx`: İletişim formu interaktivitesi.
- `AdminLayoutClient.tsx`: Admin dashboard nav ve session state.
- `AdminLoginClient.tsx`: Admin giriş formu.
- Admin CRUD sayfaları (`/admin/urunler`, `/admin/siparisler`, vb.): Yetkili admin interaktivitesi.

---

## 2. Domain Cache & Revalidation Matrix

| Rota / Endpoint | Cache Stratejisi | Revalidation | Güvenlik / Açıklama |
| :--- | :--- | :--- | :--- |
| **Site Settings** (`GET /api/v1/site-settings`) | `public` / Revalidate | 300 saniye | Genel site görünüm verileri. |
| **Ürün Kataloğu** (`GET /api/v1/products`) | `public` / Revalidate | 60 saniye | Kamusal katalog ve ürün detayları. |
| **Sipariş Oluşturma** (`POST /api/v1/orders`) | `no-store` | 0 (No Cache) | Müşteri kişisel verisi ve sipariş talebi. |
| **Sipariş Takibi** (`POST /api/v1/orders/track`) | `no-store` | 0 (No Cache) | `Cache-Control: no-store` header'ı ile kişisel durum sorgulama. |
| **Admin API** (`/api/v1/admin/*`) | `no-store` | 0 (No Cache) | `Cache-Control: no-store, no-cache, must-revalidate` (Hassas PII ve yetkili verileri). |

---

## 3. Görsel & CLS (Layout Shift) Optimizasyonları
- **Sabit Aspect-Ratio Konteynerler:** Ürün kartlarında (`ProductCard.tsx`) ve galeri alanlarında `aspect-[4/3]` ve `aspect-square` boyutlandırılmış konteynerler kullanılarak resim yüklenirken olası sayfa kaymaları (CLS = 0) engellenmiştir.
- **Lazy Loading & Preload:** Above-the-fold ana LCP görseli dışındaki tüm ürün kartı ve galeri görselleri `loading="lazy"` ve `decoding="async"` olarak yüklenir.
- **Cloudinary / Fallback:** Cloudinary üzerinden sunulan görseller birincil kaynak olarak kullanılır. Başarısız görsel yüklemelerinde SVG fallback konteyner genişliği korunur.

---

## 4. Veritabanı Query Optimizasyonu & N+1 Engelleme
- **Eager Loading (`selectinload`):** `ProductService.get_active_products` ve `get_product_by_slug` metotlarında `Product.category`, `Product.images`, `Product.colors` ve `Product.materials` ilişkileri `selectinload` ile N+1 sorguları önlenerek çekilir.
- **Dashboard Aggregate Query:** Admin dashboard özeti (`admin_dashboard.py`), daha önce döngü içinde 10 ayrı SQL sorgusu atarken, `GROUP BY Order.status` ile **1 tek aggregate SQL sorgusuna** düşürülmüştür.
- **Sipariş Listesi Bounding:** Admin sipariş listeleme endpoint'ine `limit` (max 200) ve `offset` eklenerek sınırsız SQL bellek yükü önlenmiştir.

---

## 5. Web Vitals & Production Deployment Checklist (Aşama 18)
- [ ] Nginx katmanında `gzip` ve `brotli` sıkıştırmasının aktifleştirilmesi
- [ ] Nginx `Cache-Control` static asset (JS, CSS, font, svg) başlıklarının ayarlanması
- [ ] Production PostgreSQL bağlantı havuzu (`async_engine` pool size) ince ayarı
- [ ] Deployment sonrası Google Lighthouse Lab ve Search Console Chrome UX (INP, LCP, CLS) saha takibi
