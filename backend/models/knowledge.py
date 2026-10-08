from typing import List, Optional
from sqlalchemy import String, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from .base import Base, int_pk, timestamp

class Notebook(Base):
    __tablename__ = "notebooks"
    
    id: Mapped[int_pk]
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.id"))
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[timestamp]
    
    workspace: Mapped["Workspace"] = relationship(back_populates="notebooks")
    sources: Mapped[List["Source"]] = relationship(back_populates="notebook")

class Source(Base):
    """Canonical representation of an imported or referenced item (SurfSense/OpenNotebook)."""
    __tablename__ = "sources"
    
    id: Mapped[int_pk]
    notebook_id: Mapped[int] = mapped_column(ForeignKey("notebooks.id"))
    external_id: Mapped[str] = mapped_column(String(255), index=True) # UUID or URL from external system
    connector_name: Mapped[str] = mapped_column(String(100)) # e.g. "surfsense", "notebookllama", "local"
    source_type: Mapped[str] = mapped_column(String(50)) # e.g. "pdf", "web", "audio"
    metadata_json: Mapped[dict] = mapped_column(JSON, default={})
    
    created_at: Mapped[timestamp]
    
    notebook: Mapped["Notebook"] = relationship(back_populates="sources")
    documents: Mapped[List["Document"]] = relationship(back_populates="source")

class Document(Base):
    """The canonical extracted text for a Source."""
    __tablename__ = "documents"
    
    id: Mapped[int_pk]
    source_id: Mapped[int] = mapped_column(ForeignKey("sources.id"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[timestamp]
    
    source: Mapped["Source"] = relationship(back_populates="documents")
    chunks: Mapped[List["DocumentChunk"]] = relationship(back_populates="document")

class DocumentChunk(Base):
    """Vectorized chunks for RAG."""
    __tablename__ = "document_chunks"
    
    id: Mapped[int_pk]
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id"))
    chunk_text: Mapped[str] = mapped_column(Text)
    embedding: Mapped[Optional[List[float]]] = mapped_column(Vector(1536), nullable=True)
    
    document: Mapped["Document"] = relationship(back_populates="chunks")
