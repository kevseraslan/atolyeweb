import io
import pytest
from unittest.mock import patch, MagicMock
from PIL import Image as PILImage
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    AppException,
    NotFoundException,
    BadRequestException,
    PayloadTooLargeException,
)
from app.models.category import Category
from app.models.color import Color
from app.models.product import Product
from app.models.product_image import ProductImage
from app.services.image_service import (
    ImageService,
    validate_image_file,
    MAX_FILE_SIZE,
    MAX_GALLERY_IMAGES,
)

def create_dummy_image_bytes(fmt: str = "JPEG") -> bytes:
    buf = io.BytesIO()
    img = PILImage.new("RGB", (100, 100), color="red")
    img.save(buf, format=fmt)
    return buf.getvalue()

# ---------------------------------------------------------
# 1. Image Validation Tests
# ---------------------------------------------------------
def test_validate_image_file_valid_formats():
    jpeg_bytes = create_dummy_image_bytes("JPEG")
    assert validate_image_file(jpeg_bytes, "test.jpg") == "JPEG"

    png_bytes = create_dummy_image_bytes("PNG")
    assert validate_image_file(png_bytes, "test.png") == "PNG"

    webp_bytes = create_dummy_image_bytes("WEBP")
    assert validate_image_file(webp_bytes, "test.webp") == "WEBP"

def test_validate_image_file_oversized():
    huge_bytes = b"0" * (MAX_FILE_SIZE + 10)
    with pytest.raises(PayloadTooLargeException):
        validate_image_file(huge_bytes)

def test_validate_image_file_disguised_binary():
    disguised_executable = b"MZ\x90\x00\x03\x00\x00\x00FakeEXEContent"
    with pytest.raises(BadRequestException) as excinfo:
        validate_image_file(disguised_executable, "malicious.jpg")
    assert excinfo.value.code == "INVALID_IMAGE_FORMAT"

def test_validate_image_file_empty():
    with pytest.raises(BadRequestException) as excinfo:
        validate_image_file(b"")
    assert excinfo.value.code == "EMPTY_FILE"

# ---------------------------------------------------------
# 2. Product Image Upload & Primary Behavior Tests
# ---------------------------------------------------------
@pytest.mark.anyio
async def test_upload_product_image_product_not_found(db_session: AsyncSession):
    with pytest.raises(NotFoundException):
        await ImageService.upload_product_image(
            db=db_session,
            product_id=99999,
            file_bytes=create_dummy_image_bytes("JPEG"),
        )

@pytest.mark.anyio
@patch("app.services.image_service._async_cloudinary_upload")
async def test_upload_product_image_success_and_primary_replacement(
    mock_cloud_upload, db_session: AsyncSession
):
    async def fake_async_upload(file_bytes, public_id):
        return {
            "secure_url": f"https://res.cloudinary.com/demo/{public_id}.jpg",
            "public_id": public_id,
        }
    mock_cloud_upload.side_effect = fake_async_upload

    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "12345"
    settings.CLOUDINARY_API_SECRET = "secret_key_123"

    cat = Category(name="Masa Cat", slug="masa-cat-img", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Test Product Img", slug="test-prod-img", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    img_bytes = create_dummy_image_bytes("JPEG")

    # 1st Upload (Primary by default when 0 images exist)
    res1 = await ImageService.upload_product_image(
        db=db_session,
        product_id=prod.id,
        file_bytes=img_bytes,
        filename="img1.jpg",
        sort_order=1,
        is_primary=False,
    )
    assert res1.is_primary is True
    assert "https://res.cloudinary.com/demo/furniture-workshop/products/" in res1.secure_url
    assert "cloudinary_public_id" not in res1.model_dump()

    # 2nd Upload as is_primary=True -> Existing primary demoted to False
    res2 = await ImageService.upload_product_image(
        db=db_session,
        product_id=prod.id,
        file_bytes=img_bytes,
        filename="img2.jpg",
        sort_order=2,
        is_primary=True,
    )
    assert res2.is_primary is True

    img1_db = await db_session.get(ProductImage, res1.id)
    assert img1_db.is_primary is False

@pytest.mark.anyio
async def test_upload_product_image_max_gallery_limit(db_session: AsyncSession):
    cat = Category(name="Cat Limit", slug="cat-limit", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Product Limit", slug="product-limit", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    for i in range(MAX_GALLERY_IMAGES):
        img = ProductImage(
            product_id=prod.id,
            cloudinary_public_id=f"pub_{i}",
            secure_url=f"https://url_{i}",
            sort_order=i,
            is_primary=(i == 0),
        )
        db_session.add(img)
    await db_session.commit()

    with pytest.raises(BadRequestException) as excinfo:
        await ImageService.upload_product_image(
            db=db_session,
            product_id=prod.id,
            file_bytes=create_dummy_image_bytes("JPEG"),
        )
    assert excinfo.value.code == "MAX_GALLERY_LIMIT_REACHED"

@pytest.mark.anyio
@patch("app.services.image_service._async_cloudinary_destroy")
@patch("app.services.image_service._async_cloudinary_upload")
async def test_upload_product_image_db_commit_failure_compensating_delete(
    mock_upload, mock_destroy, db_session: AsyncSession
):
    async def fake_upload(file_bytes, public_id):
        return {
            "secure_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            "public_id": public_id,
        }
    mock_upload.side_effect = fake_upload
    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "12345"

    cat = Category(name="Cat Comp", slug="cat-comp", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Prod Comp", slug="prod-comp", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    # Mock DB commit failure
    with patch.object(db_session, "commit", side_effect=Exception("DB Connection Dropped")):
        with pytest.raises(AppException) as excinfo:
            await ImageService.upload_product_image(
                db=db_session,
                product_id=prod.id,
                file_bytes=create_dummy_image_bytes("JPEG"),
            )
        assert excinfo.value.code == "IMAGE_SAVE_FAILED"
        assert mock_destroy.called
        destroyed_public_id = mock_destroy.call_args[0][0]
        assert destroyed_public_id.startswith("furniture-workshop/products/")

# ---------------------------------------------------------
# 3. Product Image Delete & DB-First Consistency Tests
# ---------------------------------------------------------
@pytest.mark.anyio
@patch("app.services.image_service._async_cloudinary_destroy")
async def test_delete_product_image_db_first_ordering(mock_destroy, db_session: AsyncSession):
    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "12345"

    cat = Category(name="Cat Del", slug="cat-del", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Prod Del", slug="prod-del", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    img1 = ProductImage(product_id=prod.id, cloudinary_public_id="pub1", secure_url="http://url1", sort_order=1, is_primary=True)
    img2 = ProductImage(product_id=prod.id, cloudinary_public_id="pub2", secure_url="http://url2", sort_order=2, is_primary=False)
    db_session.add_all([img1, img2])
    await db_session.commit()

    # Delete primary image (img1)
    await ImageService.delete_product_image(db=db_session, product_id=prod.id, image_id=img1.id)
    mock_destroy.assert_called_once_with("pub1")

    # Verify img2 was promoted to is_primary=True inside same DB transaction
    await db_session.refresh(img2)
    assert img2.is_primary is True

@pytest.mark.anyio
@patch("app.services.image_service._async_cloudinary_destroy")
async def test_delete_product_image_db_failure_does_not_call_cloudinary(mock_destroy, db_session: AsyncSession):
    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "12345"

    cat = Category(name="Cat Del Fail", slug="cat-del-fail", is_active=True)
    db_session.add(cat)
    await db_session.commit()

    prod = Product(category_id=cat.id, name="Prod Del Fail", slug="prod-del-fail", is_active=True)
    db_session.add(prod)
    await db_session.commit()

    img = ProductImage(product_id=prod.id, cloudinary_public_id="pub_fail", secure_url="http://url", sort_order=1, is_primary=True)
    db_session.add(img)
    await db_session.commit()

    with patch.object(db_session, "commit", side_effect=Exception("DB Error Before Commit")):
        with pytest.raises(Exception):
            await ImageService.delete_product_image(db=db_session, product_id=prod.id, image_id=img.id)
        # Cloudinary destroy MUST NOT be called if DB commit fails
        assert not mock_destroy.called

# ---------------------------------------------------------
# 4. Color Texture Upload & Delete Consistency Tests
# ---------------------------------------------------------
@pytest.mark.anyio
@patch("app.services.image_service._async_cloudinary_destroy")
@patch("app.services.image_service._async_cloudinary_upload")
async def test_color_texture_upload_and_replacement_consistency(
    mock_upload, mock_destroy, db_session: AsyncSession
):
    async def fake_upload(file_bytes, public_id):
        return {
            "secure_url": f"https://res.cloudinary.com/demo/{public_id}.jpg",
            "public_id": public_id,
        }
    mock_upload.side_effect = fake_upload
    settings.CLOUDINARY_CLOUD_NAME = "demo"
    settings.CLOUDINARY_API_KEY = "12345"

    col = Color(name="Meşe Dokulu", hex_code="#8d6e63", is_active=True)
    db_session.add(col)
    await db_session.commit()

    # 1. Upload Texture 1
    res1 = await ImageService.upload_color_texture(
        db=db_session,
        color_id=col.id,
        file_bytes=create_dummy_image_bytes("JPEG"),
    )
    assert "furniture-workshop/colors/" in res1.texture_url

    # 2. Upload Texture 2 (Replaces Texture 1)
    res2 = await ImageService.upload_color_texture(
        db=db_session,
        color_id=col.id,
        file_bytes=create_dummy_image_bytes("PNG"),
    )
    assert "furniture-workshop/colors/" in res2.texture_url
    assert mock_destroy.called
    destroyed_public_id = mock_destroy.call_args[0][0]
    assert destroyed_public_id.startswith("furniture-workshop/colors/")

    mock_destroy.reset_mock()

    # 3. Delete Texture 2
    res_del = await ImageService.delete_color_texture(db=db_session, color_id=col.id)
    assert res_del.texture_url is None
    assert mock_destroy.called
