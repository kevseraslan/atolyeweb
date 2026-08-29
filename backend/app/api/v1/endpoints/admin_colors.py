from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.color import Color
from app.schemas.product import ColorRead
from app.schemas.admin import AdminColorCreateUpdate
from app.services.admin_auth_service import get_current_admin
from app.services.image_service import ImageService
from app.core.exceptions import NotFoundException

router = APIRouter()

@router.get("", response_model=List[ColorRead])
async def list_admin_colors(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> List[ColorRead]:
    stmt = select(Color).order_by(Color.sort_order.asc(), Color.name.asc())
    res = await db.execute(stmt)
    colors = res.scalars().all()
    return [ColorRead.model_validate(c) for c in colors]

@router.post("", response_model=ColorRead, status_code=status.HTTP_201_CREATED)
async def create_admin_color(
    data: AdminColorCreateUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ColorRead:
    color = Color(
        name=data.name.strip(),
        hex_code=data.hex_code.strip() if data.hex_code else None,
        sort_order=data.sort_order,
        is_active=data.is_active,
    )
    db.add(color)
    await db.commit()
    await db.refresh(color)
    return ColorRead.model_validate(color)

@router.patch("/{color_id}", response_model=ColorRead)
async def update_admin_color(
    color_id: int,
    data: AdminColorCreateUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ColorRead:
    stmt = select(Color).where(Color.id == color_id)
    res = await db.execute(stmt)
    color = res.scalar_one_or_none()
    if not color:
        raise NotFoundException(f"Color {color_id} not found.")

    color.name = data.name.strip()
    color.hex_code = data.hex_code.strip() if data.hex_code else None
    color.sort_order = data.sort_order
    color.is_active = data.is_active

    await db.commit()
    await db.refresh(color)
    return ColorRead.model_validate(color)

@router.post("/{color_id}/texture", response_model=ColorRead)
async def upload_color_texture(
    color_id: int,
    file: UploadFile = File(...),
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ColorRead:
    file_bytes = await file.read()
    return await ImageService.upload_color_texture(
        db=db,
        color_id=color_id,
        file_bytes=file_bytes,
        filename=file.filename or "texture.jpg",
    )

@router.delete("/{color_id}/texture", response_model=ColorRead)
async def delete_color_texture(
    color_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> ColorRead:
    return await ImageService.delete_color_texture(
        db=db,
        color_id=color_id,
    )
