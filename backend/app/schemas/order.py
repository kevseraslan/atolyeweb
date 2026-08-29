from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class OrderCreate(BaseModel):
    product_id: Optional[int] = None
    color_id: Optional[int] = None
    material_id: Optional[int] = None
    custom_product_name: Optional[str] = None

    requested_width: Optional[Decimal] = Field(None, gt=0, le=1000)
    requested_height: Optional[Decimal] = Field(None, gt=0, le=1000)
    requested_depth: Optional[Decimal] = Field(None, gt=0, le=1000)

    custom_note: Optional[str] = Field(None, max_length=2000)
    quantity: int = Field(1, ge=1, le=100)

    customer_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=30)
    email: Optional[str] = Field(None, max_length=120)
    city: str = Field(..., min_length=2, max_length=50)

    model_config = ConfigDict(extra="forbid", from_attributes=True)

class OrderCreatedResponse(BaseModel):
    tracking_number: str
    status: str
    created_at: datetime
    message: str = "Talebiniz başarıyla alındı. Müşteri temsilcimiz sizinle en kısa sürede iletişime geçecektir."

    model_config = ConfigDict(from_attributes=True)

class OrderTrackingRequest(BaseModel):
    tracking_number: str = Field(..., min_length=5, max_length=35)
    phone: str = Field(..., min_length=7, max_length=30)

    model_config = ConfigDict(extra="forbid", from_attributes=True)

class OrderTrackingHistoryItem(BaseModel):
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OrderTrackingResponse(BaseModel):
    tracking_number: str
    status: str
    product_name: str
    quantity: int
    requested_width: Optional[Decimal] = None
    requested_height: Optional[Decimal] = None
    requested_depth: Optional[Decimal] = None
    color_name: Optional[str] = None
    material_name: Optional[str] = None
    custom_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    history: List[OrderTrackingHistoryItem]

    model_config = ConfigDict(from_attributes=True)
