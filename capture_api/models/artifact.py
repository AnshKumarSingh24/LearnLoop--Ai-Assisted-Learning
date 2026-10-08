from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ArtifactType(str, Enum):
    MINDMAP = "mindmap"
    SUMMARY = "summary"
    FLASHCARDS = "flashcards"
    STUDY_GUIDE = "study_guide"
    KEY_CONCEPTS = "key_concepts"
    TIMELINE = "timeline"
    PODCAST = "podcast"

class MindmapNode(BaseModel):
    id: str
    label: str
    children: List["MindmapNode"] = []

class Flashcard(BaseModel):
    front: str
    back: str
    difficulty: str = "medium"  # easy, medium, hard

class KeyConcept(BaseModel):
    term: str
    definition: str
    importance: str = "medium"  # low, medium, high

class TimelineEvent(BaseModel):
    label: str
    description: str
    order: int

class StudyArtifact(BaseModel):
    id: str
    artifact_type: ArtifactType
    title: str
    source_title: str
    # For mindmaps
    mindmap: Optional[MindmapNode] = None
    # For summaries / study guides
    content: Optional[str] = None
    # For flashcards
    flashcards: Optional[List[Flashcard]] = None
    # For key concepts
    key_concepts: Optional[List[KeyConcept]] = None
    # For timelines
    timeline: Optional[List[TimelineEvent]] = None
    # Podcast transcript and playback mode.
    generation_mode: Optional[str] = None
    generation_notice: Optional[str] = None
