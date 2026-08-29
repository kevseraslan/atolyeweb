# Technical Security Architecture & Hardening Guide

## 1. Authentication & Session Management
- **Password Hashing:** Argon2id via `argon2-cffi` (`PasswordHasher()`). Plaintext passwords are never stored, logged, or returned.
- **Session Tokens:** Short-lived signed JWTs (4 hours expiry) stored in HttpOnly cookies (`__Host-admin_session` in production, `admin_session` in development).
- **Session Revocation (`session_version`):** The `admins` table contains a `session_version` integer. Every admin JWT token embeds the `sv` claim. On logout or security action, `session_version` is incremented in DB, immediately rendering all copied tokens invalid.

## 2. CSRF & Origin Defense
- **Origin / Referer Validation:** All state-changing requests (`POST`, `PATCH`, `DELETE`) are strictly validated against `settings.FRONTEND_URL` (scheme + host + port). Cross-origin attempts trigger `HTTP 403 Forbidden`.
- **Double-Submit HMAC CSRF Tokens:** Admin login/profile issues a signed HMAC CSRF token (`generate_csrf_token`). State-changing admin requests require the header `X-CSRF-Token`.

## 3. Rate Limiting (In-Process Sliding Window)
- `POST /api/v1/admin/auth/login`: Max 5 failed attempts per 15 minutes per IP.
- `POST /api/v1/orders/track`: Max 15 requests per minute per IP.
- `POST /api/v1/orders`: Max 5 order creations per minute per IP.
- Exceeding limit returns `HTTP 429 Too Many Requests` with `Retry-After: 60`.

## 4. Hardened Security Headers
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`: `default-src 'self'; img-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Production HTTPS only).

## 5. Input Validation & Data Minimization
- Strict Pydantic `ConfigDict(extra="forbid")` prevents arbitrary parameter injection.
- Parameterized SQLAlchemy ORM prevents SQL injection.
- Public order tracking endpoint (`POST /orders/track`) minimizes returned fields and uses generic anti-enumeration `404 ORDER_NOT_FOUND` error messages.
- Production environment hides `/docs`, `/redoc`, and `/openapi.json` documentation endpoints.
