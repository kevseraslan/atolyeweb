# Technical Security Architecture & Hardening Guide

## 1. Scope & Implementation Matrix

### IMPLEMENTED NOW (Application Level)
- **Authentication & Argon2id Hashing:** `argon2-cffi` (`PasswordHasher()`) for admin password verification with timing side-channel mitigation for invalid usernames.
- **CSRF Defense:** Origin / Referer strict validation against `settings.FRONTEND_URL` + Signed Double-Submit HMAC CSRF Tokens (`X-CSRF-Token` header) on all state-changing admin endpoints.
- **Session Revocation (`session_version`):** `admins.session_version` tracked in DB and JWT token `sv` claim. `logout` increments `session_version` in DB *before* deleting cookies, immediately invalidating stolen/copied tokens across all devices.
- **Application Security Headers Baseline:**
  - **FastAPI API Responses (`/api/v1/*`):** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Content-Security-Policy`.
  - **Next.js Frontend HTML Responses (`/`, `/admin/*`, etc.):** Configured in `next.config.ts` via `async headers()` applying `nosniff`, `DENY`, `strict-origin-when-cross-origin`, and `Content-Security-Policy`.
- **Content Security Policy (CSP) & Trade-Off:**
  - `unsafe-eval` is **STRICTLY ABSENT** in both dev and production.
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `connect-src 'self'`.
  - **Security / Performance Trade-Off for `'unsafe-inline'`:** Next.js App Router relies on inline React hydration scripts. Implementing per-request dynamic nonces requires dynamic SSR on every page, disabling Next.js static prerendering (`prerendered as static content`) and CDN edge caching for public pages (`/`, `/urunler`, etc.). To maintain V1 static performance and CDN speed, `script-src 'self' 'unsafe-inline'` is used alongside strict React auto-escaping, zero `dangerouslySetInnerHTML`, and strict CSP directives.
- **Cookie Security:** Production cookies use `__Host-admin_session` with `Secure=True`, `HttpOnly=True`, `SameSite=Lax`, `Path=/`, and host-only scope (`Domain=None`).
- **Proxy IP Fallback & `TRUST_PROXY`:** `RateLimiter` defaults to direct client IP (`request.client.host`). Requires explicit opt-in (`TRUST_PROXY=true`) before reading `X-Forwarded-For` to prevent IP spoofing prior to Nginx configuration.

---

### DEPLOYMENT-DEPENDENT (Stage 18/19 Nginx & Infrastructure Level)
- **Nginx Header Sanitization:** Overwriting and sanitizing incoming `X-Forwarded-For` and `X-Real-IP` headers at the reverse proxy boundary. `TRUST_PROXY=true` will be enabled once Nginx is deployed.
- **Nginx Multi-Worker Rate Limiting:** Global rate-limiting (`limit_req_zone`) at the Nginx layer acting as primary distributed defense-in-depth across multi-process Uvicorn workers.
- **Production TLS & Outer HSTS:** HTTPS termination and outer `Strict-Transport-Security` header enforcement at the Nginx edge.
- **WAF / Firewall & DDoS Mitigation:** Network-level rate limiting and IP filtering.
