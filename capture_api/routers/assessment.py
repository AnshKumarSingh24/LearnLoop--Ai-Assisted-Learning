from fastapi import APIRouter
from pydantic import BaseModel
from models.curriculum import LearningObjective
from models.assessment import AssessmentItemResponse
from services.assessment_service import AssessmentService

router = APIRouter(tags=["Assessment Generator"])

class AssessmentGenerateRequest(BaseModel):
    learning_objective: LearningObjective
    source_text: str
    count: int = 3

@router.post("/assessment/generate", response_model=AssessmentItemResponse)
async def generate_assessment(request: AssessmentGenerateRequest):
    """
    Generates MCQs for a given learning objective and source text.
    Returns the items in JSON format.
    """
    items = await AssessmentService.generate_mcqs_for_lo(
        lo=request.learning_objective, 
        source_text=request.source_text,
        count=request.count
    )
    
    if not items:
        return {"items": []}
        
    return {"items": items}
