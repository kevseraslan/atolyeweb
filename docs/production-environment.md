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

## 2. Sunucu İşletim Sistemi & Kullanıcı İzolasyonu

- **İşletim Sistemi:** Ubuntu 24.04 LTS (veya 22.04 LTS) 64-bit.
- **Uygulama Kullanıcısı:** Özel `furniture` kullanıcısı (root yetkisi olmayan yetkisiz sistem kullanıcısı).
- **Dizin Yapısı:**
  `/srv/furniture-workshop/`
  ├── `app/` (Backend & Frontend kaynak kodları)
  ├── `env/` (backend.env, frontend.env - `chmod 600`)
  ├── `logs/` (Uygulama logları - stdout/stderr -> systemd journal)
  └── `backups/` (PostgreSQL günlük yedekleme dizini)

---

## 3. Sistem Servisleri (Systemd)

- **Backend Servisi:** `deploy/systemd/furniture-backend.service` (`User=furniture`, `127.0.0.1:8000`, 1 Uvicorn worker).
- **Frontend Servisi:** `deploy/systemd/furniture-frontend.service` (`User=furniture`, `127.0.0.1:3000`, Node 24 `npm run start`).
- **Güvenlik Sertleştirmeleri:** `NoNewPrivileges=true`, `PrivateTmp=true`, `ProtectSystem=full`.

---

## 4. Veritabanı Yapılandırması (PostgreSQL 16)

- **Erişim:** `listen_addresses = 'localhost'` (Dış IP'lerden bağlantı reddedilir).
- **Uygulama Kullanıcısı:** `furniture_app` (Superuser veya CREATEDB yetkisi YOKTUR).
- **Parola Şifreleme:** `password_encryption = scram-sha-256`.
- **Şema Kurulumu:** Canlı ortamda şema kurulumu yalnızca `alembic upgrade head` ile yapılır (`create_all()` kullanılmaz).

---

## 5. Güvenlik Duvarı & SSH Güvenliği (UFW / Fail2ban)

- **UFW Firewall:**
  - `ufw default deny inbound`
  - `ufw allow 22/tcp` (SSH)
  - `ufw allow 80/tcp` (HTTP)
  - `ufw allow 443/tcp` (HTTPS)
  - Port `3000`, `8000`, `5432` doğrudan engellenmiştir.
- **Fail2ban:** SSH kaba kuvvet saldırılarına karşı `sshd` jail aktiftir.

---

## 6. Aşama 19 Canlı Dağıtım Öncesi Denetim Listesi (Pre-Deployment Checklist)

- [ ] Contabo VPS üzerinde `deploy/setup-server.sh` betiğinin çalıştırılması.
- [ ] `/srv/furniture-workshop/env/backend.env` ve `frontend.env` dosyalarının 600 izinleriyle oluşturulması.
- [ ] `AUTH_SECRET` için en az 32 karakterlik kriptografik rastgele anahtar üretilmesi.
- [ ] Etkileşimli script (`python -m app.scripts.create_admin`) ile canlı ilk admin hesabının oluşturulması.
- [ ] Alan adı DNS A/AAAA kayıtlarının VPS IP adresine yönlendirilmesi (Aşama 19).
- [ ] Nginx Let's Encrypt SSL/TLS sertifikasının Certbot ile alınması (Aşama 19).
- [ ] Canlı yayından sonra `NEXT_PUBLIC_SITE_INDEXABLE=true` yapılması (Aşama 19).
