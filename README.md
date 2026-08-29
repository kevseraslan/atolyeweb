# Artisan Woodworks - Mobilya Atölyesi Web Uygulaması

Özel üretim masif ahşap mobilya atölyesi için geliştirilen Next.js 16 + FastAPI + PostgreSQL web uygulaması projesi.

## Cloudinary Development Setup

Görsel yükleme altyapısı (Aşama 9) Cloudinary CDN servisini kullanmaktadır. Local geliştirme ortamında `.env` dosyası içerisinde aşağıdaki ortam değişkenleri tanımlanabilir:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Güvenlik Uyarısı:** Gerçek Cloudinary API anahtarları ve secret bilgileri kesinlikle Git deposuna veya istemci tarafına (`NEXT_PUBLIC_`) eklenmemelidir.
