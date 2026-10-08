from typing import List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, int_pk, timestamp

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int_pk]
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[timestamp]
    
    workspaces: Mapped[List["WorkspaceMember"]] = relationship(back_populates="user")

class Workspace(Base):
    __tablename__ = "workspaces"
    
    id: Mapped[int_pk]
    name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[timestamp]
    
    members: Mapped[List["WorkspaceMember"]] = relationship(back_populates="workspace")
    notebooks: Mapped[List["Notebook"]] = relationship(back_populates="workspace")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    
    id: Mapped[int_pk]
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    role: Mapped[str] = mapped_column(String(50)) # Owner, Admin, Editor, Viewer
    
    workspace: Mapped["Workspace"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="workspaces")
