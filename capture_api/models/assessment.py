from pydantic import BaseModel, Field
from typing import List

class MCQOption(BaseModel):
    text: str = Field(..., description="The text of the option")
    is_correct: bool = Field(..., description="True if this is the correct answer")
    justification: str = Field(..., description="If correct, explain why. If incorrect, explicitly state what student misconception this distractor targets.")

class AssessmentItem(BaseModel):
    id: str = Field(..., description="Unique identifier for this assessment item")
    learning_objective_id: str = Field(..., description="The ID of the Learning Objective this assesses")
    stem: str = Field(..., description="The question text or problem statement")
    options: List[MCQOption] = Field(..., description="List of exact 4 options (1 correct, 3 plausible distractors)")

class AssessmentItemResponse(BaseModel):
    items: List[AssessmentItem]
