from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import time

from services.ai_pipeline import generate_quiz_for_chunk
from services.db import get_db

router = APIRouter(prefix="/api/srs", tags=["Spaced Repetition"])

class QuizGenerationRequest(BaseModel):
    chunk_text: str
    num_questions: int = 3

class ReviewResultRequest(BaseModel):
    card_id: str
    is_correct: bool
    last_seen: float
    previous_interval: float

@router.post("/generate_quiz")
async def generate_quiz(req: QuizGenerationRequest):
    """
    Generates a quiz for a specific text chunk.
    """
    quiz_questions = await generate_quiz_for_chunk(req.chunk_text, req.num_questions)
    return {"questions": quiz_questions}

@router.post("/review")
async def process_review(req: ReviewResultRequest):
    """
    Simplified Spaced Repetition (SRS) interval calculator.
    Darwinity-style retention engine.
    """
    now = time.time()
    
    if req.is_correct:
        # Simple interval multiplier
        interval = max(req.previous_interval * 2, 86400) # Minimum 1 day if correct
        next_due = now + interval
    else:
        # Resurface immediately/next session
        interval = 0
        next_due = now
        
    return {
        "card_id": req.card_id,
        "next_due": next_due,
        "new_interval": interval
    }
