from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum


class MemoryType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    SCREENSHOT = "screenshot"
    VOICE = "voice"
    AUDIO = "audio"
    PDF = "pdf"
    DOCUMENT = "document"
    LINK = "link"


class ProcessingStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class EntityType(str, Enum):
    PERSON = "person"
    PROJECT = "project"
    ORGANIZATION = "organization"
    TASK = "task"
    DECISION = "decision"
    DATE = "date"
    LOCATION = "location"
    REQUIREMENT = "requirement"
    EVENT = "event"
    OTHER = "other"


class ContradictionType(str, Enum):
    CONFLICTING_DATE = "conflicting_date"
    CONFLICTING_REQUIREMENT = "conflicting_requirement"
    SUPERSEDED_DECISION = "superseded_decision"
    CONFLICTING_ASSIGNMENT = "conflicting_assignment"
    CONFLICTING_LOCATION = "conflicting_location"
    OTHER = "other"


class ContradictionStatus(str, Enum):
    ACTIVE = "active"
    REVIEWED = "reviewed"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


# -------------------------------------------------------------
# USERS
# -------------------------------------------------------------
class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# -------------------------------------------------------------
# SPACES
# -------------------------------------------------------------
class SpaceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cover_metadata: Optional[Dict[str, Any]] = None


class SpaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    summary: Optional[str] = None
    cover_metadata: Optional[Dict[str, Any]] = None


class Space(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    name: str
    description: Optional[str] = None
    summary: Optional[str] = None
    capture_count: int = 0
    cover_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# -------------------------------------------------------------
# MEMORIES
# -------------------------------------------------------------
class MemoryCreate(BaseModel):
    original_content: str
    memory_type: MemoryType = MemoryType.TEXT
    title: Optional[str] = None
    source_type: Optional[str] = "manual"
    file_url: Optional[str] = None
    space_id: Optional[UUID] = None
    space_ids: Optional[List[UUID]] = None
    metadata: Optional[Dict[str, Any]] = None


class Memory(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    original_content: str
    normalized_content: Optional[str] = None
    memory_type: MemoryType
    title: Optional[str] = None
    source_type: Optional[str] = "manual"
    file_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    embedding: Optional[List[float]] = None
    processing_status: ProcessingStatus = ProcessingStatus.QUEUED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    space_ids: List[UUID] = Field(default_factory=list)
    entities: Optional[List[Dict[str, Any]]] = None


# -------------------------------------------------------------
# ENTITIES & RESOLUTION
# -------------------------------------------------------------
class CaptureEntity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    capture_id: UUID
    entity_text: str
    normalized_entity_name: str
    entity_type: EntityType
    embedding: Optional[List[float]] = None
    confidence: float = 1.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EntityMember(BaseModel):
    resolved_entity_id: UUID
    capture_entity_id: UUID
    similarity_score: float = 1.0


class ResolvedEntity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    space_id: UUID
    canonical_name: str
    entity_type: EntityType
    representative_embedding: Optional[List[float]] = None
    source_count: int = 1
    confidence: float = 1.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    members: Optional[List[Dict[str, Any]]] = None


class EntityResolutionConfirm(BaseModel):
    resolved_entity_id: UUID
    confirmed_canonical_name: Optional[str] = None


class EntityResolutionSeparate(BaseModel):
    member_capture_entity_id: UUID
    new_canonical_name: str


# -------------------------------------------------------------
# CONTRADICTIONS
# -------------------------------------------------------------
class Contradiction(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    space_id: UUID
    capture_a_id: UUID
    capture_b_id: UUID
    entity_id: Optional[UUID] = None
    contradiction_type: ContradictionType
    conflicting_field: str
    description: str
    severity: str = "medium"  # low, medium, high, critical
    status: ContradictionStatus = ContradictionStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    source_a: Optional[Dict[str, Any]] = None
    source_b: Optional[Dict[str, Any]] = None
    value_a: Optional[str] = None
    value_b: Optional[str] = None


class ContradictionResolveRequest(BaseModel):
    resolution_action: str  # "mark_a_correct", "mark_b_correct", "keep_both", "dismiss"
    notes: Optional[str] = None


# -------------------------------------------------------------
# RETRIEVAL & ASK CAPTURE
# -------------------------------------------------------------
class AskRequest(BaseModel):
    query: str
    space_id: Optional[UUID] = None
    top_k: int = 5


class SourceCitation(BaseModel):
    capture_id: UUID
    title: str
    capture_type: str
    relevance_score: float
    excerpt: str
    created_at: datetime
    source_type: Optional[str] = None


class ContextReductionMetrics(BaseModel):
    naive_context_tokens: int
    actual_context_tokens: int
    context_reduction_percentage: float
    total_space_captures: int
    retrieved_captures_count: int


class AskResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
    metrics: ContextReductionMetrics
    why_sources: Optional[str] = None
    contradictions_noted: Optional[List[Dict[str, Any]]] = None


class ContextPackRequest(BaseModel):
    goal: str
    space_id: Optional[UUID] = None
    max_tokens: int = 2000


class ContextPackResponse(BaseModel):
    goal: str
    summary: str
    assembled_context: str
    sources: List[SourceCitation]
    entities: List[Dict[str, Any]]
    contradictions: List[Dict[str, Any]]
    metrics: ContextReductionMetrics


# -------------------------------------------------------------
# MCP SERVER MODELS
# -------------------------------------------------------------
class MCPToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)


class MCPResponse(BaseModel):
    content: List[Dict[str, Any]]
    is_error: bool = False


# -------------------------------------------------------------
# AUTH MODELS
# -------------------------------------------------------------
class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: User
