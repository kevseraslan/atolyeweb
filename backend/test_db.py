import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def test_db_connection():
    print(f"Connecting to database at {settings.DATABASE_URL}...")
    engine = create_async_engine(settings.DATABASE_URL)
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            value = result.scalar()
            print(f"SELECT 1 Query Result: {value}")
            return value == 1
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_db_connection())
