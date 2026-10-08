from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, int_pk, timestamp

class SyncJob(Base):
    __tablename__ = "sync_jobs"
    
    id: Mapped[int_pk]
    connector_id: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50)) # pending, running, completed, failed
    error_log: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[timestamp]
    updated_at: Mapped[timestamp]

class GenerationJob(Base):
    __tablename__ = "generation_jobs"
    
    id: Mapped[int_pk]
    notebook_id: Mapped[int] = mapped_column(ForeignKey("notebooks.id"))
    job_type: Mapped[str] = mapped_column(String(50)) # podcast, summary, artifact
    status: Mapped[str] = mapped_column(String(50)) 
    progress: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[timestamp]
    updated_at: Mapped[timestamp]
