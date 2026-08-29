# Technical SEO Architecture Guide

## 1. Indexable vs. Noindex Routes

### Public Indexable Routes (`index: true, follow: true`)
- `/` (Ana Sayfa)
- `/urunler` (Ürün Kataloğu)
- `/urunler/[slug]` (Dinamik Ürün Detay Sayfası)
- `/ozel-siparis` (Özel Sipariş Formu)
- `/hakkimizda` (Hakkımızda)
- `/iletisim` (İletişim)
- `/kvkk` (KVKK Aydınlatma Metni)
- `/gizlilik` (Gizlilik & Çerez Politikası)

### Private / Custom Lookup Routes (`index: false`)
- `/admin` & `/admin/*`: Admin panel yönetim sayfaları (`/admin/login` dahil). HTML `<meta name="robots" content="noindex, nofollow" />` ve `robots.ts` disallow kuralları ile arama motorlarına kesin olarak kapatılmıştır.
- `/siparis-takip`: Kişisel sipariş sorgulama ekranıdır. `<meta name="robots" content="noindex, follow" />` ile indeks harici tutulmuştur.
- `/api/*`: FastAPI backend API uç noktaları.

---

## 2. Canonical URL Strategy
- Merkezi `getSiteUrl()` (`NEXT_PUBLIC_SITE_URL` veya fallback `http://localhost:3000`) fonksiyonu ile absolute canonical URL üretilir.
- `/urunler` sayfasında filtre ve sayfalama parametreleri (`?category=masalar&page=2`) canonical adrese eklenmez. Canonical adresi sabit olarak `${siteUrl}/urunler` tutularak mükerrer (duplicate) içerik oluşumu engellenir.
- Trailing slash kaldırılmış standart HTTPS URL yapısı kullanılır.

---

## 3. Robots.txt & Environment Indexing Control (`app/robots.ts`)
- **Açık İndeksleme Koşulu:** Yalnızca `NEXT_PUBLIC_SITE_INDEXABLE === "true"` olduğunda taramaya izin verilir.
- **Staging / Preview / Dev:** `SITE_INDEXABLE` varsayılan olarak `false` olduğu için (veya ortam production değilse) arama motorları taranması `Disallow: /` ile engellenir.
- **Canlı Production:** `SITE_INDEXABLE=true` yapıldığında `Allow: /`, `Disallow: ["/admin/", "/api/"]`, `Sitemap: ${siteUrl}/sitemap.xml` ilan edilir.

---

## 4. Sitemap.xml (`app/sitemap.ts`)
- Statik kamuya açık tüm rotaları ve veritabanındaki aktif ürünlerin (`/urunler/[slug]`) dinamik URL'lerini içerir.
- Pasif ürünler (`is_active === false`) veya pasif kategoriler sitemap'e dahil edilmez.
- Admin sayfaları, API uç noktaları ve sipariş takip ekranı sitemap'e eklenmez.

---

## 5. Structured Data (JSON-LD) & Serialization Security
- **Product JSON-LD (`@type: Product`):** Ürün detay sayfasında kullanıcıya görünen gerçek `name`, `description`, `image`, `category` ve `url` değerleri ile üretilir.
  - *Dürüstlük İlkesi:* Sitede anlık ödeme/checkout bulunmadığından sahte `Offer`, `price`, `rating`, `review` veya `availability` verisi kesinlikle eklenmez.
  - *Güvenlik Serialization:* Script context breakout XSS engellemesi için `JSON.stringify(data).replace(/</g, "\\u003c")` dönüştürmesi uygulanır.
- **Breadcrumb JSON-LD (`@type: BreadcrumbList`):** Ürün detay sayfasında site hiyerarşisini (Ana Sayfa $\rightarrow$ Ürünler $\rightarrow$ Ürün Adı) tanımlar.

---

## 6. Production Deployment SEO Checklist (REQUIRED BEFORE PUBLIC INDEXING)
- [ ] `NEXT_PUBLIC_SITE_URL` ortam değişkeninin üretim HTTPS alan adı ile tanımlanması (Örn: `https://www.atolyeniz.com`)
- [ ] `NEXT_PUBLIC_SITE_NAME` kamuya açık marka adının tanımlanması (Örn: `Masif Ahşap Atölyesi`)
- [ ] Yalnızca canlı üretim ortamında `NEXT_PUBLIC_SITE_INDEXABLE=true` yapılması (Staging/Preview'da `false` kalmalıdır)
- [ ] Production domain tanımlandıktan sonra Google Search Console alan adı doğrulaması yapılması
- [ ] `${SITE_URL}/sitemap.xml` adresinin Search Console'a taranmak üzere gönderilmesi
- [ ] Ürün detay sayfalarında Rich Results testinin çalıştırılması
- [ ] Aşama 16 Performance optimizasyonu sonrası Core Web Vitals raporlarının incelenmesi
