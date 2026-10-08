from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json

from services.db import get_db
from services.ai_pipeline import get_groq_client
from dependencies import get_current_user

import os
import google.generativeai as genai

router = APIRouter(prefix="/study", tags=["Study & Lessons"])

class LessonGenerateRequest(BaseModel):
    lesson_id: str
    course_id: str

class LessonGenerateResponse(BaseModel):
    blocks: List[dict]

@router.post("/lesson/generate", response_model=LessonGenerateResponse)
async def generate_lesson(req: LessonGenerateRequest, current_user = Depends(get_current_user)):
    """
    Dynamically generates a Duolingo-style micro-lesson block list based on learning objectives and course content.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

    # 1. Fetch course from in-memory DB
    db = get_db()
    course_record = db.spaces.get(req.course_id)
    
    if not course_record:
        raise HTTPException(status_code=404, detail=f"Course {req.course_id} not found in active session.")
        
    course_tree = course_record.get("tree", {})
    chunks = course_record.get("chunks", [])
    
    # 2. Find the lesson objective
    lesson_obj = next((l for l in course_tree.get("lessons", []) if l.get("id") == req.lesson_id), None)
    
    objective_text = lesson_obj.get("objective", "General learning") if lesson_obj else "General learning"
    
    # Assemble source text from chunks (limit to ~40,000 characters for context)
    source_text = "\n\n".join(chunks)[:40000]

    prompt = f"""
    You are an expert AI tutor building an interactive micro-lesson.
    
    Source Material:
    {source_text}
    
    Learning Objective for this lesson:
    {objective_text}
    
    Create a highly engaging, Duolingo-style lesson. The lesson should consist of 3 to 5 "blocks".
    Each block must have a "type" (either "concept" or "quiz").
    
    For "concept":
    Provide a "title" and "content" (markdown text explaining the concept simply and engagingly).
    
    For "quiz":
    Provide a "question", an array of "options" (strings), and the "correctIndex" (0-indexed integer of the correct option). Also provide an "explanation" string for when they answer.
    
    Return the response as a JSON object with a single key "blocks" containing the array of blocks. Example format:
    {{
      "blocks": [
        {{
          "type": "concept",
          "title": "Understanding X",
          "content": "X is like a..."
        }},
        {{
          "type": "quiz",
          "question": "What is X?",
          "options": ["A", "B", "C"],
          "correctIndex": 0,
          "explanation": "Exactly! X is A because..."
        }}
      ]
    }}
    """

    try:
        response = model.generate_content(prompt)
        content = response.text
        
        try:
            parsed = json.loads(content)
            blocks = parsed.get("blocks", []) if isinstance(parsed, dict) else []
        except Exception as e:
            blocks = []
            
        return LessonGenerateResponse(blocks=blocks)
    except Exception as e:
        print(f"Gemini generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
