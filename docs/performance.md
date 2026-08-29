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

## 2. Cache Matrix: Next.js Fetch vs. HTTP Response Headers

### A) Next.js Server Fetch Caching & Request Memoization
- **React `cache()` Memoization:** `getProductBySlug(slug)` metodu React `cache()` ile sarmalanmıştır. Tek bir sayfa istek yaşam döngüsü içerisinde (`generateMetadata()` + `ProductDetailPage`) aynı ürün için **yalnızca 1 tek HTTP sunucu isteği** atılır.
- **Site Settings:** `revalidate: 300` (5 dakika) ile sunucu tarafında önbelleklenir.
- **Public Product Catalog:** `revalidate: 60` (1 dakika) ile sunucu tarafında önbelleklenir.
- **Sensitive Requests:** Admin API, Sipariş Sorgulama ve Sipariş Oluşturma sunucu önbelleğine dahil edilmez (`cache: "no-store"`).

### B) HTTP Response Cache-Control Headers (`SensitiveCacheControlMiddleware`)
- **GET /api/v1/products & GET /api/v1/site-settings:** `Cache-Control: public, max-age=60`
- **GET /api/v1/admin/*:** `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
- **POST /api/v1/orders/track:** `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
- **Tüm Mutating Yöntemler (POST/PUT/PATCH/DELETE):** `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`

---

## 3. Görsel Optimizasyonları & CLS (Layout Shift) İyileştirmeleri
- **Next.js `<Image />` Kullanımı:** `ProductCard.tsx` bileşeni `next/image` bileşenine yükseltilmiştir. `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` duyarlı boyutlandırması eklenmiştir.
- **CLS Kaynaklarının Engellenmesi:** Ürün kartlarında ve galeri konteynerlerinde sabit `aspect-[4/3]` ve `aspect-square` alanları ayrılmıştır. (Not: CLS = 0 kesin saha skoru iddiası yapılmamış; bilinen layout shift kaynakları mimari olarak önlenmiştir.)
- **Hero LCP:** Ana sayfada (Typography & SVG Text LCP adayı) görsel kaynaklı LCP bulunmamaktadır; ağır ve optimizasyonsuz hero PNG/JPEG yüklemesi yoktur.

---

## 4. Admin Sayfalama, Debounce & Veritabanı Query Optimizasyonu
- **Admin Order Debounce & Abort:** `/admin/siparisler` sayfasında arama girdisine 300ms debounce ve `AbortController` eklenerek önceki iptal edilen isteklerin yarattığı yarış durumları (race conditions) engellenmiştir.
- **Admin Order Pagination:** Backend `limit` varsayılan 25 (max 100) ve `offset` parametrelerini destekler. Frontend sayfalama butonları (Önceki/Sonraki Sayfa) ile dilimlenmiş veri çeker.
- **Dashboard Aggregation:** `admin_dashboard.py` status sayaçları `GROUP BY Order.status` ile **1 tek aggregate SQL sorgusuna** düşürülmüştür. Total ürün sayısı ile birlikte toplam **2 SQL sorgusunda** yanıt döner.
- **Veritabanı İndeksleri:** `orders_tracking_number_key` (unique), `orders_phone_idx`, `orders_status_idx`, `products_slug_key` (unique), `categories_slug_key` (unique) indeksleri aktiftir.

---

## 5. Ölçüm İpuçları & Metrik Ayrımı
- **Build Metric:** Derleme hızı (21 rotanın statik/dinamik prerender sürerliği $\approx 1.8$s) build derleme metriğidir; Core Web Vitals yerine geçmez.
- **Runtime / Field Metrics (CWV):** LCP, FCP, CLS, INP ve TBT saha metrikleri canlı prod deployment sonrasında Google Search Console ve Chrome UX raporları üzerinden izlenecektir.
