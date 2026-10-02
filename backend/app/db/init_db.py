import logging
from sqlalchemy import select, func
from app.db.session import AsyncSessionLocal
from app.models.category import Category
from app.models.material import Material
from app.models.color import Color
from app.models.site_settings import SiteSettings

logger = logging.getLogger("app")

DEFAULT_CATEGORIES = [
    {"name": "Masalar", "slug": "masalar", "description": "Doğal masif yemek ve çalışma masaları", "sort_order": 1, "is_active": True},
    {"name": "Sandalyeler & Banklar", "slug": "sandalyeler-banklar", "description": "Ergonomik ve dayanıklı masif ahşap oturma elemanları", "sort_order": 2, "is_active": True},
    {"name": "Konsol & Büfeler", "slug": "konsol-bufeler", "description": "Şık depolama çözümleri ve estetik konsollar", "sort_order": 3, "is_active": True},
    {"name": "Kitaplıklar & Raflar", "slug": "kitapliklar-raflar", "description": "Modüler ve dayanıklı masif ahşap kitaplık sistemleri", "sort_order": 4, "is_active": True},
    {"name": "Sehpalar", "slug": "sehpalar", "description": "Orta ve yan masif ahşap sehpalar", "sort_order": 5, "is_active": True},
]

DEFAULT_MATERIALS = [
    {"name": "Masif Meşe", "description": "Yüksek dayanıklılık ve karakteristik damarlı meşe dokusu", "sort_order": 1, "is_active": True},
    {"name": "Masif Ceviz", "description": "Zengin ve asil kahve tonlarında lüks masif ceviz ağacı", "sort_order": 2, "is_active": True},
    {"name": "Masif Çam", "description": "Doğal ve sıcak dokulu dayanıklı çam ağacı", "sort_order": 3, "is_active": True},
    {"name": "Masif Kestane", "description": "Dış etkenlere ve neme dirençli doğal kestane", "sort_order": 4, "is_active": True},
]

DEFAULT_COLORS = [
    {"name": "Doğal Mat Meşe", "hex_code": "#C29B38", "sort_order": 1, "is_active": True},
    {"name": "Koyu Ceviz", "hex_code": "#5D4037", "sort_order": 2, "is_active": True},
    {"name": "Antik Tik", "hex_code": "#8D6E63", "sort_order": 3, "is_active": True},
    {"name": "Duman Grisi", "hex_code": "#78909C", "sort_order": 4, "is_active": True},
    {"name": "Kömür Siyahı", "hex_code": "#263238", "sort_order": 5, "is_active": True},
    {"name": "Ham Ahşap / Naturel", "hex_code": "#D7CCC8", "sort_order": 6, "is_active": True},
]

from app.models.product import Product

DEFAULT_PRODUCTS = [
    {
        "category_id": 1,
        "name": "Masif Meşe Yemek Masası",
        "slug": "masif-mese-yemek-masasi",
        "short_description": "Doğal masif meşe ağacından üretilmiş 8 kişilik yemek masası",
        "description": "El işçiliği doğal masif meşe masamız atölyemizde özel cila ile korunmaktadır.",
        "default_width": 200,
        "default_height": 76,
        "default_depth": 90,
        "is_customizable": True,
        "is_featured": True,
        "is_active": True,
    },
    {
        "category_id": 5,
        "name": "Masif Ceviz Orta Sehpa",
        "slug": "masif-ceviz-orta-sehpa",
        "short_description": "Doğal masif ceviz orta sehpa",
        "description": "Zengin ceviz dokulu estetik sehpa.",
        "default_width": 120,
        "default_height": 45,
        "default_depth": 60,
        "is_customizable": True,
        "is_featured": True,
        "is_active": True,
    },
]

async def seed_initial_data_if_empty():
    async with AsyncSessionLocal() as db:
        try:
            # 1. Categories
            cat_count = (await db.execute(select(func.count(Category.id)))).scalar_one()
            if cat_count == 0:
                logger.info("Database has 0 categories. Seeding default categories...")
                for item in DEFAULT_CATEGORIES:
                    db.add(Category(**item))
                await db.commit()
                logger.info(f"Successfully seeded {len(DEFAULT_CATEGORIES)} categories.")

            # 2. Materials
            mat_count = (await db.execute(select(func.count(Material.id)))).scalar_one()
            if mat_count == 0:
                logger.info("Database has 0 materials. Seeding default materials...")
                for item in DEFAULT_MATERIALS:
                    db.add(Material(**item))
                await db.commit()
                logger.info(f"Successfully seeded {len(DEFAULT_MATERIALS)} materials.")

            # 3. Colors
            col_count = (await db.execute(select(func.count(Color.id)))).scalar_one()
            if col_count == 0:
                logger.info("Database has 0 colors. Seeding default colors...")
                for item in DEFAULT_COLORS:
                    db.add(Color(**item))
                await db.commit()
                logger.info(f"Successfully seeded {len(DEFAULT_COLORS)} colors.")

            # 4. Products
            prod_count = (await db.execute(select(func.count(Product.id)))).scalar_one()
            if prod_count == 0:
                logger.info("Database has 0 products. Seeding default products...")
                for item in DEFAULT_PRODUCTS:
                    db.add(Product(**item))
                await db.commit()
                logger.info(f"Successfully seeded {len(DEFAULT_PRODUCTS)} products.")

            # 5. Site Settings
            set_count = (await db.execute(select(func.count(SiteSettings.id)))).scalar_one()
            if set_count == 0:
                logger.info("Database has 0 site settings. Seeding default site settings...")
                db.add(SiteSettings(
                    workshop_name="Atölye Mobilya & Ahşap Tasarım",
                    email="iletisim@atolyeweb.com",
                    phone="+90 555 123 4567",
                    address="Atölye Caddesi No:1, İstanbul",
                    working_hours="Hafta içi 09:00 - 18:00",
                ))
                await db.commit()
        except Exception as e:
            logger.error(f"Error during seed_initial_data_if_empty: {e}")
            await db.rollback()
