import sys
import os
import asyncio
from getpass import getpass
from argon2 import PasswordHasher

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.admin import Admin

ph = PasswordHasher()

async def main():
    print("--- Artisan Woodworks Admin User Creation CLI ---")
    email = input("Admin Email: ").strip().lower()
    if not email or "@" not in email:
        print("Error: Invalid email address.")
        sys.exit(1)

    full_name = input("Admin Full Name: ").strip()
    if not full_name:
        print("Error: Full name is required.")
        sys.exit(1)

    password = getpass("Admin Password (min 12 chars): ")
    if len(password) < 12:
        print("Error: Password must be at least 12 characters long.")
        sys.exit(1)

    password_confirm = getpass("Confirm Admin Password: ")
    if password != password_confirm:
        print("Error: Passwords do not match.")
        sys.exit(1)

    async with AsyncSessionLocal() as db:
        stmt = select(Admin).where(Admin.email == email)
        res = await db.execute(stmt)
        if res.scalar_one_or_none():
            print(f"Error: Admin with email '{email}' already exists.")
            sys.exit(1)

        password_hash = ph.hash(password)
        admin = Admin(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            role="SUPER_ADMIN",
            is_active=True,
        )
        db.add(admin)
        await db.commit()
        print(f"Success: Super Admin '{email}' successfully created!")

if __name__ == "__main__":
    asyncio.run(main())
