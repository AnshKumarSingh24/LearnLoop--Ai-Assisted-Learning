from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.curriculum import CourseAST
from services.curriculum_service import CurriculumService

router = APIRouter(tags=["Curriculum Generator"])

class CurriculumGenerateRequest(BaseModel):
    source_text: str
    course_title: str

@router.post("/curriculum/generate", response_model=CourseAST)
async def generate_curriculum(request: CurriculumGenerateRequest):
    """
    Generates a CourseAST from raw text.
    """
    ast = await CurriculumService.generate_ast_from_text(
        source_text=request.source_text,
        course_title=request.course_title
    )
    
    if not ast:
        raise HTTPException(status_code=500, detail="Failed to generate AST from LLM")
    return ast

@router.get("/curriculum/{course_id}")
async def get_curriculum(course_id: str):
    """
    Retrieves the course curriculum and user mastery.
    """
    from services.db import get_db
    db = get_db()
    if course_id in db.spaces:
        course = db.spaces[course_id].get("tree", {})
        # Mock mastery data
        total_lessons = course.get("totalLessons", 0)
        completed_lessons = course.get("completedLessons", 0)
        progress = course.get("progress", 0)
        return {
            **course,
            "mastery": {
                "completedLessonIds": [],
                "completedLessons": completed_lessons,
                "totalLessons": total_lessons,
                "progress": progress
            }
        }
    raise HTTPException(status_code=404, detail="Curriculum not found")
