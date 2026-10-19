from datetime import datetime
from sqlalchemy import (BigInteger, Boolean, DateTime,Identity,Text,func,text,)
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = {"schema": "public"}

    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(always=True),
        primary_key=True,
    )

    title: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("false"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("public.users.id"),
        nullable=True,
    )


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id: Mapped[int] = mapped_column( BigInteger,Identity(always=True),primary_key=True)

    email: Mapped[str] = mapped_column(
        Text, nullable=False, unique=True
    )
    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )