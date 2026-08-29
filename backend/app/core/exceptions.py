from typing import Any, Dict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    code: str
    message: str

class ErrorResponse(BaseModel):
    error: ErrorDetail

class AppException(Exception):
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )

class BadRequestException(AppException):
    def __init__(self, message: str = "Invalid request", code: str = "BAD_REQUEST"):
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class PayloadTooLargeException(AppException):
    def __init__(self, message: str = "File size exceeds maximum allowed limit"):
        super().__init__(
            message=message,
            code="PAYLOAD_TOO_LARGE",
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
        )

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

class ForbiddenException(AppException):
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
        )

class ConflictException(AppException):
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=status.HTTP_409_CONFLICT,
        )

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )
