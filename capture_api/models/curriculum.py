from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class BloomVerb(str, Enum):
    # Measurable verbs only
    DEFINE = "define"
    IDENTIFY = "identify"
    DESCRIBE = "describe"
    EXPLAIN = "explain"
    APPLY = "apply"
    CALCULATE = "calculate"
    SOLVE = "solve"
    ANALYZE = "analyze"
    COMPARE = "compare"
    CONTRAST = "contrast"
    EVALUATE = "evaluate"
    DESIGN = "design"
    CREATE = "create"

class BloomLevel(str, Enum):
    REMEMBER = "remember"
    UNDERSTAND = "understand"
    APPLY = "apply"
    ANALYZE = "analyze"
    EVALUATE = "evaluate"
    CREATE = "create"

class LearningObjective(BaseModel):
    id: str = Field(..., description="Unique identifier for the LO, e.g., LO_1.1.1")
    text: str = Field(..., description="The full learning objective text")
    bloom_verb: BloomVerb = Field(..., description="The measurable Bloom verb used")
    bloom_level: BloomLevel = Field(..., description="The Bloom taxonomy level")
    source_spans: List[str] = Field(default_factory=list, description="Exact quotes from the source material grounding this LO")
    prerequisites: List[str] = Field(default_factory=list, description="IDs of other LOs that must be mastered before this one")

class Lesson(BaseModel):
    id: str = Field(..., description="Unique identifier for the Lesson")
    title: str = Field(..., description="Lesson title")
    learning_objectives: List[LearningObjective] = Field(..., description="LOs covered in this lesson")

class Module(BaseModel):
    id: str = Field(..., description="Unique identifier for the Module")
    title: str = Field(..., description="Module title")
    lessons: List[Lesson] = Field(..., description="Lessons in this module")

class CourseAST(BaseModel):
    id: str = Field(..., description="Unique identifier for the Course")
    title: str = Field(..., description="Course title")
    modules: List[Module] = Field(..., description="Modules in this course")
