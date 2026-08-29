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
- `/admin` & `/admin/*`: Admin panel yönetim sayfaları. HTML `<meta name="robots" content="noindex, nofollow" />` ve `robots.ts` disallow kuralları ile arama motorlarına tamamen kapatılmıştır.
- `/siparis-takip`: Kişisel sipariş sorgulama ekranıdır. `<meta name="robots" content="noindex, follow" />` ile indeks harici tutulmuştur.
- `/api/*`: FastAPI backend API uç noktaları.

---

## 2. Canonical URL Strategy
- Merkezi `getSiteUrl()` (`NEXT_PUBLIC_SITE_URL` veya fallback `http://localhost:3000`) fonksiyonu ile absolute canonical URL üretilir.
- `/urunler` sayfasında filtre ve sayfalama parametreleri (`?category=masalar&page=2`) canonical adrese eklenmez. Canonical adresi sabit olarak `${siteUrl}/urunler` tutularak mükerrer (duplicate) içerik oluşumu engellenir.
- Trailing slash kaldırılmış standart HTTPS URL yapısı kullanılır.

---

## 3. Robots.txt (`app/robots.ts`)
- **Üretim (Production):** `Allow: /`, `Disallow: ["/admin/", "/api/"]`, `Sitemap: ${siteUrl}/sitemap.xml`.
- **Geliştirme / Staging (Non-Production):** `Disallow: /` (Yanlışlıkla indekslenmeyi önler).

---

## 4. Sitemap.xml (`app/sitemap.ts`)
- Statik kamuya açık tüm rotaları ve veritabanındaki aktif ürünlerin (`/urunler/[slug]`) dinamik URL'lerini içerir.
- Pasif ürünler veya silinmiş kategoriler sitemap'e dahil edilmez.
- Admin sayfaları, API uç noktaları ve sipariş takip ekranı sitemap'e eklenmez.

---

## 5. Structured Data (JSON-LD) Strategy
- **Product JSON-LD (`@type: Product`):** Ürün detay sayfasında kullanıcıya görünen gerçek `name`, `description`, `image`, `category` ve `url` değerleri ile üretilir.
  - *Dürüstlük İlkesi:* Sitede anlık ödeme/checkout bulunmadığından sahte `Offer`, `price`, `rating`, `review` veya `availability` verisi kesinlikle eklenmez.
- **Breadcrumb JSON-LD (`@type: BreadcrumbList`):** Ürün detay sayfasında site hiyerarşisini (Ana Sayfa $\rightarrow$ Ürünler $\rightarrow$ Ürün Adı) tanımlar.

---

## 6. Search Console Future Deployment Checklist
- [ ] Production domain tanımlandıktan sonra Google Search Console alan adı doğrulaması yapılması
- [ ] `${SITE_URL}/sitemap.xml` adresinin Search Console'a taranmak üzere gönderilmesi
- [ ] Ürün detay sayfalarında Rich Results testinin çalıştırılması
- [ ] Aşama 16 Performance optimizasyonu sonrası Core Web Vitals raporlarının incelenmesi
