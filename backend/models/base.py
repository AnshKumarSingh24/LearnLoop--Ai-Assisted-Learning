from typing import Annotated
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func
from sqlalchemy.ext.asyncio import AsyncAttrs

class Base(AsyncAttrs, DeclarativeBase):
    pass

int_pk = Annotated[int, mapped_column(primary_key=True, index=True)]
timestamp = Annotated[datetime, mapped_column(server_default=func.now())]
