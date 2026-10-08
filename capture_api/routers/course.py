from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List, Dict
import uuid

from services.ai_pipeline import generate_course_tree, generate_canvas_graph
from services.embeddings import chunk_and_embed_text
from services.db import get_db

router = APIRouter(prefix="/api/course", tags=["Course Generation"])

class CourseGenerationRequest(BaseModel):
    content: str
    level: str = "intermediate"
    time_budget: str = "30min/day"

@router.post("/generate")
async def generate_course(req: CourseGenerationRequest):
    """
    Accepts raw text (or OCR'd text from a PDF) and generates a structured course tree.
    """
    db = get_db()
    
    # 1. Chunk and embed the content
    chunks = chunk_and_embed_text(req.content)
    
    course_id = str(uuid.uuid4())
    
    # 2. Call AI pipeline to generate the course tree based on personalization
    course_data = await generate_course_tree(req.content, req.level, req.time_budget)
    
    # 3. Inject ID and set defaults
    course_data["id"] = course_id
    course_data["progress"] = 0
    course_data["status"] = "active"
    if "lessons" in course_data and len(course_data["lessons"]) > 0:
        course_data["currentLessonId"] = course_data["lessons"][0].get("id", "l1")
        course_data["totalLessons"] = len(course_data["lessons"])
    else:
        course_data["currentLessonId"] = "l1"
        course_data["totalLessons"] = 0
    course_data["completedLessons"] = 0
    course_data["nextAction"] = "Start"
    
    # Mock storing it in DB
    db.spaces[course_id] = {
        "id": course_id,
        "tree": course_data,
        "chunks": chunks
    }
    
    return {
        "status": "success",
        "course": course_data
    }
