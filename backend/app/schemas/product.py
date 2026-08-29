from decimal import Decimal
from typing import Optional, List, Generic, TypeVar
from pydantic import BaseModel, ConfigDict
from app.schemas.category import CategoryRead

T = TypeVar("T")

class ColorRead(BaseModel):
    id: int
    name: str
    hex_code: Optional[str] = None
    texture_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class MaterialRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProductImageRead(BaseModel):
    id: int
    secure_url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)

class ProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    short_description: Optional[str] = None
    category: CategoryRead
    primary_image: Optional[ProductImageRead] = None
    is_featured: bool
    is_customizable: bool
    colors: List[ColorRead] = []

    model_config = ConfigDict(from_attributes=True)

class ProductDetail(BaseModel):
    id: int
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    default_width: Optional[Decimal] = None
    default_height: Optional[Decimal] = None
    default_depth: Optional[Decimal] = None
    is_customizable: bool
    is_featured: bool
    category: CategoryRead
    images: List[ProductImageRead] = []
    colors: List[ColorRead] = []
    materials: List[MaterialRead] = []

    model_config = ConfigDict(from_attributes=True)

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
