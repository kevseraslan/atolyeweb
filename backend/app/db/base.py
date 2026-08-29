from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    SQLAlchemy 2.x Declarative Base class.
    All future ORM models will inherit from this Base.
    """
    pass
