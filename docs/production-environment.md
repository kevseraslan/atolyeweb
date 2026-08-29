# Production Environment Architecture & Infrastructure Guide

## 1. Topoloji & Sınır Güvenliği

```
Internet
   │
   ▼
[Nginx Reverse Proxy]  (Ports 80 / 443 Public)
   │
   ├── /api/v1/*  ──▶  [FastAPI Uvicorn] (127.0.0.1:8000 Loopback Only)
   │                       │
   └── /          ──▶  [Next.js App]     (127.0.0.1:3000 Loopback Only)
                           │
                           ▼
                 [PostgreSQL 16 DB]       (127.0.0.1:5432 Loopback Only)
```

- **Uygulama Portları:** `3000` (Next.js), `8000` (FastAPI) ve `5432` (PostgreSQL) portları **YALNIZCA 127.0.0.1 loopback** adresine bağlıdır. Dış internete KAPALIDIR.
- **Kamuya Açık Portlar:** Yalnızca `80` (HTTP) ve `443` (HTTPS) portları Nginx tarafından dinlenir.

---

## 2. PROVISIONED & VERIFIED IN REPO (Aşama 18A - Şablonlar & Altyapı Hazırlığı)

### A) Sunucu Kurulum & Servis Şablonları
- **Kurulum Betiği:** [deploy/setup-server.sh](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/deploy/setup-server.sh) (Ubuntu 24.04 LTS, Node 24, PostgreSQL 16, UFW, Nginx, `furniture` kullanıcısı kurulum adımları).
- **Backend Systemd Servisi:** [deploy/systemd/furniture-backend.service](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/deploy/systemd/furniture-backend.service) (`127.0.0.1:8000`, 1 worker, `NoNewPrivileges=true`).
- **Frontend Systemd Servisi:** [deploy/systemd/furniture-frontend.service](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/deploy/systemd/furniture-frontend.service) (`127.0.0.1:3000`, Node 24 `npm run start`).
- **Nginx Konfigürasyon Şablonu:** [deploy/nginx/furniture-workshop.conf](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/deploy/nginx/furniture-workshop.conf) (`client_max_body_size 12M`, gzip, reverse proxy).

### B) Çevre Değişkenleri & Şifreleme Standartları
- [backend/.env.example](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/backend/.env.example) ve [frontend/.env.example](file:///c:/Users/kevse/OneDrive/Desktop/mobilya/frontend/.env.example) güncellenmiştir.
- `TRUST_PROXY=false` (Nginx başlık temizliği tamamlanana kadar).
- `NEXT_PUBLIC_SITE_INDEXABLE=false` (Domain canlıya alınana kadar).
- `AUTH_SECRET`: En az 32 karakterlik kriptografik rastgele anahtar.

---

## 3. DEFERRED TO LIVE VPS PROVISIONING & STAGE 19 (Aşama 18B & Aşama 19)

- [ ] Contabo VPS üzerinde SSH bağlantısının sağlanması ve `deploy/setup-server.sh` çalıştırılması.
- [ ] `/srv/furniture-workshop/env/backend.env` ve `frontend.env` dosyalarının gerçek canlı parolalarla (`chmod 600`) oluşturulması.
- [ ] Canlı PostgreSQL 16 veritabanında `alembic upgrade head` çalıştırılması.
- [ ] Etkileşimli script (`python -m app.scripts.create_admin`) ile canlı ilk admin hesabının oluşturulması.
- [ ] Alan adı DNS A/AAAA kayıtlarının VPS IP adresine yönlendirilmesi (Aşama 19).
- [ ] Nginx Let's Encrypt SSL/TLS sertifikasının Certbot ile alınması (Aşama 19).
- [ ] Canlı yayından sonra `NEXT_PUBLIC_SITE_INDEXABLE=true` yapılması (Aşama 19).
