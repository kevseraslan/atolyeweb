import sys
import os
import asyncio
from argon2 import PasswordHasher

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.admin import Admin

ph = PasswordHasher()


async def main():
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    full_name = os.getenv("ADMIN_FULL_NAME", "").strip()
    password = os.getenv("ADMIN_PASSWORD", "")

    if not email or "@" not in email:
        print("ADMIN_EMAIL is missing or invalid.")
        return

    if not full_name:
        print("ADMIN_FULL_NAME is missing.")
        return

    if len(password) < 12:
        print("ADMIN_PASSWORD is missing or must be at least 12 characters.")
        return

    async with AsyncSessionLocal() as db:
        stmt = select(Admin).where(Admin.email == email)
        res = await db.execute(stmt)

        if res.scalar_one_or_none():
            print(f"Admin '{email}' already exists. Skipping.")
            return

        admin = Admin(
            email=email,
            password_hash=ph.hash(password),
            full_name=full_name,
            role="SUPER_ADMIN",
            is_active=True,
        )

        db.add(admin)
        await db.commit()

        print(f"Success: Super Admin '{email}' created.")


if __name__ == "__main__":
    asyncio.run(main())
