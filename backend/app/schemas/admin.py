from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# Auth Schemas
class AdminLoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=1)

    model_config = ConfigDict(extra="forbid")

class AdminRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Admin Product Management Schemas
class AdminProductCreate(BaseModel):
    category_id: int
    name: str = Field(..., min_length=2, max_length=200)
    slug: Optional[str] = Field(None, max_length=220)
    short_description: Optional[str] = None
    description: Optional[str] = None
    default_width: Optional[Decimal] = Field(None, gt=0, le=1000)
    default_height: Optional[Decimal] = Field(None, gt=0, le=1000)
    default_depth: Optional[Decimal] = Field(None, gt=0, le=1000)
    is_customizable: bool = True
    is_featured: bool = False
    is_active: bool = True
    color_ids: List[int] = Field(default_factory=list)
    material_ids: List[int] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")

class AdminProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    slug: Optional[str] = Field(None, max_length=220)
    short_description: Optional[str] = None
    description: Optional[str] = None
    default_width: Optional[Decimal] = Field(None, gt=0, le=1000)
    default_height: Optional[Decimal] = Field(None, gt=0, le=1000)
    default_depth: Optional[Decimal] = Field(None, gt=0, le=1000)
    is_customizable: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    color_ids: Optional[List[int]] = None
    material_ids: Optional[List[int]] = None

    model_config = ConfigDict(extra="forbid")

# Admin Category/Color/Material Management Schemas
class AdminCategoryCreateUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: Optional[str] = Field(None, max_length=120)
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

    model_config = ConfigDict(extra="forbid")

class AdminColorCreateUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    hex_code: Optional[str] = Field(None, max_length=30)
    sort_order: int = 0
    is_active: bool = True

    model_config = ConfigDict(extra="forbid")

class AdminMaterialCreateUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

    model_config = ConfigDict(extra="forbid")

# Admin Order Management Schemas
class AdminOrderStatusUpdate(BaseModel):
    new_status: str
    note: Optional[str] = Field(None, max_length=1000)

    model_config = ConfigDict(extra="forbid")

class AdminOrderPriceUpdate(BaseModel):
    quoted_price: Optional[Decimal] = Field(None, ge=0)
    approved_price: Optional[Decimal] = Field(None, ge=0)

    model_config = ConfigDict(extra="forbid")

class AdminOrderNoteCreate(BaseModel):
    note: str = Field(..., min_length=1, max_length=2000)

    model_config = ConfigDict(extra="forbid")

class AdminOrderNoteRead(BaseModel):
    id: int
    note: str
    admin_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AdminOrderDetailRead(BaseModel):
    id: int
    tracking_number: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    city: str
    product_name: str
    custom_product_name: Optional[str] = None
    color_name: Optional[str] = None
    material_name: Optional[str] = None
    requested_width: Optional[Decimal] = None
    requested_height: Optional[Decimal] = None
    requested_depth: Optional[Decimal] = None
    quantity: int
    custom_note: Optional[str] = None
    status: str
    quoted_price: Optional[Decimal] = None
    approved_price: Optional[Decimal] = None
    quoted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    notes: List[AdminOrderNoteRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

# Admin Site Settings Schemas
class SiteSettingsUpdate(BaseModel):
    workshop_name: Optional[str] = Field(None, max_length=150)
    phone: Optional[str] = Field(None, max_length=30)
    whatsapp: Optional[str] = Field(None, max_length=30)
    email: Optional[str] = Field(None, max_length=120)
    address: Optional[str] = None
    working_hours: Optional[str] = Field(None, max_length=150)
    google_maps_url: Optional[str] = Field(None, max_length=500)
    instagram_url: Optional[str] = Field(None, max_length=500)
    hero_title: Optional[str] = Field(None, max_length=255)
    about_text: Optional[str] = None

    model_config = ConfigDict(extra="forbid")

class PublicSiteSettingsRead(BaseModel):
    workshop_name: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    working_hours: Optional[str] = None
    google_maps_url: Optional[str] = None
    instagram_url: Optional[str] = None
    hero_title: Optional[str] = None
    about_text: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
