import io
import uuid
import logging
from typing import Optional
from PIL import Image as PILImage
import cloudinary
import cloudinary.uploader

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    AppException,
    NotFoundException,
    BadRequestException,
    PayloadTooLargeException,
)
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.color import Color
from app.schemas.product import ProductImageRead, ColorRead

logger = logging.getLogger("app.image_service")

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_GALLERY_IMAGES = 12
ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}
CLOUDINARY_PRODUCT_FOLDER = "furniture-workshop/products"
CLOUDINARY_COLOR_FOLDER = "furniture-workshop/colors"

def _ensure_cloudinary_config():
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY:
        raise AppException(
            message="Cloudinary integration is not configured in backend environment.",
            code="IMAGE_SERVICE_UNCONFIGURED",
            status_code=500,
        )
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )

def validate_image_file(file_bytes: bytes, filename: str = "upload.jpg") -> str:
    """
    Validates byte size, MIME header, and image format using Pillow.
    Returns detected format ('JPEG', 'PNG', or 'WEBP').
    """
    if len(file_bytes) > MAX_FILE_SIZE:
        raise PayloadTooLargeException(
            message=f"File size ({len(file_bytes)} bytes) exceeds 10MB limit."
        )

    if not file_bytes:
        raise BadRequestException(
            message="Uploaded image file is empty.",
            code="EMPTY_FILE",
        )

    try:
        with PILImage.open(io.BytesIO(file_bytes)) as img:
            img.verify()
            fmt = (img.format or "").upper()
    except Exception as exc:
        logger.warning(f"Image validation failed for file {filename}: {exc}")
        raise BadRequestException(
            message="Invalid or corrupted image format. Only JPEG, PNG, and WebP are allowed.",
            code="INVALID_IMAGE_FORMAT",
        )

    if fmt not in ALLOWED_IMAGE_FORMATS:
        raise BadRequestException(
            message=f"Image format '{fmt}' is not supported. Only JPEG, PNG, and WebP are allowed.",
            code="INVALID_IMAGE_FORMAT",
        )

    return fmt

class ImageService:
    @staticmethod
    async def upload_product_image(
        db: AsyncSession,
        product_id: int,
        file_bytes: bytes,
        filename: str = "image.jpg",
        alt_text: Optional[str] = None,
        sort_order: int = 0,
        is_primary: bool = False,
    ) -> ProductImageRead:
        # 1. Product existence check
        stmt = select(Product).where(Product.id == product_id)
        result = await db.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise NotFoundException(message=f"Product with ID {product_id} not found.")

        # 2. Max gallery image count limit check
        count_stmt = select(func.count()).select_from(ProductImage).where(ProductImage.product_id == product_id)
        count_res = await db.execute(count_stmt)
        image_count = count_res.scalar_one()
        if image_count >= MAX_GALLERY_IMAGES:
            raise BadRequestException(
                message=f"Maximum gallery limit ({MAX_GALLERY_IMAGES} images) reached for this product.",
                code="MAX_GALLERY_LIMIT_REACHED",
            )

        # 3. Content & format validation
        validate_image_file(file_bytes, filename)

        # 4. Upload to Cloudinary
        _ensure_cloudinary_config()
        public_id = f"{CLOUDINARY_PRODUCT_FOLDER}/{uuid.uuid4().hex}"

        try:
            upload_result = cloudinary.uploader.upload(
                file_bytes,
                public_id=public_id,
                resource_type="image",
                overwrite=True,
            )
            secure_url = upload_result.get("secure_url")
        except Exception as exc:
            logger.error(f"Cloudinary upload error for product {product_id}: {exc}")
            raise AppException(
                message="Görsel yüklenemedi.",
                code="IMAGE_UPLOAD_FAILED",
                status_code=500,
            )

        # 5. DB Transaction (with compensating delete on failure)
        try:
            # If is_primary=True, demote existing primary images for this product
            if is_primary:
                await db.execute(
                    update(ProductImage)
                    .where(ProductImage.product_id == product_id)
                    .values(is_primary=False)
                )

            # If no primary image exists at all for this product, force is_primary=True
            if not is_primary and image_count == 0:
                is_primary = True

            new_img = ProductImage(
                product_id=product_id,
                cloudinary_public_id=public_id,
                secure_url=secure_url,
                alt_text=alt_text,
                sort_order=sort_order,
                is_primary=is_primary,
            )
            db.add(new_img)
            await db.commit()
            await db.refresh(new_img)

            return ProductImageRead.model_validate(new_img)
        except Exception as exc:
            await db.rollback()
            logger.error(f"DB commit failed after Cloudinary upload. Triggering compensating delete for asset '{public_id}': {exc}")
            try:
                cloudinary.uploader.destroy(public_id, resource_type="image")
            except Exception as cleanup_exc:
                logger.error(f"Compensating delete failed for '{public_id}': {cleanup_exc}")

            raise AppException(
                message="Görsel veritabanına kaydedilemedi.",
                code="IMAGE_SAVE_FAILED",
                status_code=500,
            )

    @staticmethod
    async def delete_product_image(
        db: AsyncSession,
        product_id: int,
        image_id: int,
    ) -> None:
        stmt = (
            select(ProductImage)
            .where(ProductImage.id == image_id)
            .where(ProductImage.product_id == product_id)
        )
        result = await db.execute(stmt)
        img = result.scalar_one_or_none()
        if not img:
            raise NotFoundException(message=f"Product image with ID {image_id} not found for product {product_id}.")

        public_id = img.cloudinary_public_id
        was_primary = img.is_primary

        # 1. Cloudinary Destroy
        _ensure_cloudinary_config()
        try:
            cloudinary.uploader.destroy(public_id, resource_type="image")
        except Exception as exc:
            logger.warning(f"Cloudinary destroy returned error for asset '{public_id}': {exc}")

        # 2. DB Delete
        await db.delete(img)
        await db.commit()

        # 3. Primary Promotion if deleted image was primary
        if was_primary:
            remaining_stmt = (
                select(ProductImage)
                .where(ProductImage.product_id == product_id)
                .order_by(ProductImage.sort_order.asc(), ProductImage.id.asc())
                .limit(1)
            )
            rem_res = await db.execute(remaining_stmt)
            next_primary = rem_res.scalar_one_or_none()
            if next_primary:
                next_primary.is_primary = True
                await db.commit()

    @staticmethod
    async def upload_color_texture(
        db: AsyncSession,
        color_id: int,
        file_bytes: bytes,
        filename: str = "texture.jpg",
    ) -> ColorRead:
        stmt = select(Color).where(Color.id == color_id)
        result = await db.execute(stmt)
        color = result.scalar_one_or_none()
        if not color:
            raise NotFoundException(message=f"Color with ID {color_id} not found.")

        validate_image_file(file_bytes, filename)

        _ensure_cloudinary_config()
        old_public_id = color.texture_public_id
        new_public_id = f"{CLOUDINARY_COLOR_FOLDER}/{uuid.uuid4().hex}"

        try:
            upload_result = cloudinary.uploader.upload(
                file_bytes,
                public_id=new_public_id,
                resource_type="image",
                overwrite=True,
            )
            new_url = upload_result.get("secure_url")
        except Exception as exc:
            logger.error(f"Cloudinary texture upload error for color {color_id}: {exc}")
            raise AppException(
                message="Doku görseli yüklenemedi.",
                code="TEXTURE_UPLOAD_FAILED",
                status_code=500,
            )

        try:
            color.texture_public_id = new_public_id
            color.texture_url = new_url
            await db.commit()
            await db.refresh(color)

            # Cleanup old Cloudinary asset after successful DB update
            if old_public_id:
                try:
                    cloudinary.uploader.destroy(old_public_id, resource_type="image")
                except Exception as clean_exc:
                    logger.warning(f"Failed to destroy old texture asset '{old_public_id}': {clean_exc}")

            return ColorRead.model_validate(color)
        except Exception as exc:
            await db.rollback()
            logger.error(f"DB commit failed for color texture. Destroying new asset '{new_public_id}': {exc}")
            try:
                cloudinary.uploader.destroy(new_public_id, resource_type="image")
            except Exception:
                pass
            raise AppException(
                message="Doku görseli kaydedilemedi.",
                code="TEXTURE_SAVE_FAILED",
                status_code=500,
            )

    @staticmethod
    async def delete_color_texture(
        db: AsyncSession,
        color_id: int,
    ) -> ColorRead:
        stmt = select(Color).where(Color.id == color_id)
        result = await db.execute(stmt)
        color = result.scalar_one_or_none()
        if not color:
            raise NotFoundException(message=f"Color with ID {color_id} not found.")

        if color.texture_public_id:
            _ensure_cloudinary_config()
            try:
                cloudinary.uploader.destroy(color.texture_public_id, resource_type="image")
            except Exception as exc:
                logger.warning(f"Cloudinary destroy error for texture '{color.texture_public_id}': {exc}")

            color.texture_public_id = None
            color.texture_url = None
            await db.commit()
            await db.refresh(color)

        return ColorRead.model_validate(color)
