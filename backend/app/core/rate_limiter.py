import time
from collections import defaultdict
from fastapi import HTTPException, Request, status

class InMemoryRateLimiter:
    def __init__(self, max_requests: int = 5, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    def check(self, key: str):
        now = time.time()
        # Clean older requests outside the window
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
        
        if len(self.requests[key]) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - self.requests[key][0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many login attempts. Please wait {retry_after} seconds before trying again.",
                headers={"Retry-After": str(retry_after)}
            )
        
        self.requests[key].append(now)

login_limiter = InMemoryRateLimiter(max_requests=10, window_seconds=60)
