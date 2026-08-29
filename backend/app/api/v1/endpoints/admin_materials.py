from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.admin import Admin
from app.models.material import Material
from app.schemas.product import MaterialRead
from app.schemas.admin import AdminMaterialCreateUpdate
from app.services.admin_auth_service import get_current_admin
from app.core.exceptions import NotFoundException

router = APIRouter()

@router.get("", response_model=List[MaterialRead])
async def list_admin_materials(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> List[MaterialRead]:
    stmt = select(Material).order_by(Material.sort_order.asc(), Material.name.asc())
    res = await db.execute(stmt)
    materials = res.scalars().all()
    return [MaterialRead.model_validate(m) for m in materials]

@router.post("", response_model=MaterialRead, status_code=status.HTTP_201_CREATED)
async def create_admin_material(
    data: AdminMaterialCreateUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> MaterialRead:
    material = Material(
        name=data.name.strip(),
        description=data.description,
        sort_order=data.sort_order,
        is_active=data.is_active,
    )
    db.add(material)
    await db.commit()
    await db.refresh(material)
    return MaterialRead.model_validate(material)

@router.patch("/{material_id}", response_model=MaterialRead)
async def update_admin_material(
    material_id: int,
    data: AdminMaterialCreateUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> MaterialRead:
    stmt = select(Material).where(Material.id == material_id)
    res = await db.execute(stmt)
    mat = res.scalar_one_or_none()
    if not mat:
        raise NotFoundException(f"Material {material_id} not found.")

    mat.name = data.name.strip()
    mat.description = data.description
    mat.sort_order = data.sort_order
    mat.is_active = data.is_active

    await db.commit()
    await db.refresh(mat)
    return MaterialRead.model_validate(mat)
