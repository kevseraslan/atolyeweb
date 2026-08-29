# Technical Security Architecture & Hardening Guide

## 1. Client IP & Proxy Strategy
- **Development Mode:** Client IP is extracted directly via `request.client.host`.
- **Production Mode (Nginx Reverse Proxy):** In Stage 18 deployment, Nginx will overwrite and sanitize incoming `X-Forwarded-For` and `X-Real-IP` headers from client connections. RateLimiter provides an explicit trusted proxy evaluation extension point (`get_trusted_proxy_ip`). Naive reliance on `request.client.host` behind Nginx returns the internal Nginx container IP unless trusted proxy headers are evaluated.

## 2. In-Process Rate Limiter Limitations
- **Process-Local Bucket:** The `RateLimiter` class uses an in-memory sliding window bucket per process. If Uvicorn runs multiple worker processes, each worker maintains an independent rate-limiting state.
- **Production Defense-in-Depth:** In Phase 18 deployment, Nginx rate-limiting (`limit_req_zone`) acts as the primary distributed defense-in-depth across all application processes.

## 3. Content Security Policy (CSP) & Inline Scripts
- **Strict Prohibition of `unsafe-eval`:** The `unsafe-eval` directive is strictly absent in both development and production headers.
- **Justification for `script-src 'self' 'unsafe-inline'`:** Next.js 15/16 App Router requires inline hydration scripts for client-side React components. Restricting `script-src` without `unsafe-inline` breaks Next.js client-side page transitions unless complex dynamic edge nonces are generated for every static build chunk. `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'` are combined with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, and strict `X-Content-Type-Options: nosniff`.
- **Cloudinary Integration:** Images are restricted to `'self'`, `data:` URIs, and `https://res.cloudinary.com`.

## 4. Authentication & Cookie Specifications
- **Production `__Host-` Cookie:** In `production` environment, the session cookie is named `__Host-admin_session` and strictly meets `__Host-` specifications:
  - `Secure = True` (HTTPS required).
  - `Path = /`.
  - `Domain` attribute is omitted (host-only scope).
- **Session Revocation (`session_version`):** On logout or security action, `admin.session_version += 1` is committed to PostgreSQL in a database transaction *before* deleting the cookie. The token `sv` claim mismatch immediately invalidates any copied JWT tokens.
- **HSTS (HTTP Strict Transport Security):** `Strict-Transport-Security: max-age=31536000; includeSubDomains` is served exclusively in production HTTPS environments and disabled in local development.
