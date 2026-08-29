import time
import threading
from typing import Dict, List, Optional
from fastapi import Request
from app.core.config import settings
from app.core.exceptions import AppException

class RateLimiter:
    """
    In-Process Sliding Window Rate Limiter.
    
    IMPORTANT LIMITATION:
    This rate limiter is process-local (in-memory). If Uvicorn runs multiple worker processes,
    each worker maintains its own isolated memory bucket. In production (Phase 18), Nginx
    rate-limiting (limit_req_zone) acts as the primary distributed defense-in-depth across worker processes.
    """
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._history: Dict[str, List[float]] = {}
        self._lock = threading.Lock()

    def get_client_ip(self, request: Request) -> str:
        """
        Extracts client IP address.
        
        Development: Uses direct connection IP `request.client.host`.
        Production Behind Nginx: Extensions point for trusted proxy header evaluation (`X-Forwarded-For`).
        Note: Naive reliance on `request.client.host` behind Nginx returns the Nginx container IP.
        Nginx must overwrite forwarded headers in Phase 18 deployment before headers can be trusted.
        """
        # Production Trusted Proxy Extension Point
        if settings.APP_ENV == "production":
            # If request comes from trusted proxy, evaluate X-Forwarded-For header
            x_forwarded = request.headers.get("X-Forwarded-For")
            if x_forwarded:
                # X-Forwarded-For format: client, proxy1, proxy2
                client_ip = x_forwarded.split(",")[0].strip()
                if client_ip:
                    return client_ip

        # Local development / Direct connection fallback
        return request.client.host if request.client else "127.0.0.1"

    def check(self, request: Request) -> None:
        ip = self.get_client_ip(request)
        now = time.time()
        cutoff = now - self.window_seconds

        with self._lock:
            timestamps = self._history.get(ip, [])
            valid_timestamps = [t for t in timestamps if t > cutoff]

            if len(valid_timestamps) >= self.max_requests:
                retry_after = int(self.window_seconds - (now - valid_timestamps[0]))
                if retry_after <= 0:
                    retry_after = 60
                raise AppException(
                    message="Kısa süre içinde çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
                    code="TOO_MANY_REQUESTS",
                    status_code=429,
                    headers={"Retry-After": str(retry_after)},
                )

            valid_timestamps.append(now)
            self._history[ip] = valid_timestamps

    def record_failure(self, request: Request) -> None:
        self.check(request)

    def reset(self) -> None:
        with self._lock:
            self._history.clear()

# Global Limiter Instances
login_limiter = RateLimiter(max_requests=10, window_seconds=900)       # 10 failed logins / 15 mins
tracking_limiter = RateLimiter(max_requests=30, window_seconds=60)     # 30 requests / min
order_create_limiter = RateLimiter(max_requests=30, window_seconds=60) # 30 order creations / min
