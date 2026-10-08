import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import (
    memories, spaces, retrieval, metrics, course, srs, audio, scorm, assessment, curriculum, artifacts, study, profile
)
from routers import document_questions
from services.db import get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize demo data on startup if database is fresh
    db = get_db()
    # (Demo seeding logic simplified for the hackathon MVP)
    yield

app = FastAPI(
    title="LearnLoop — AI-Powered Learning Loop",
    description="Turn your materials into courses, master them with spaced repetition, and close the learning loop.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Flutter, Web UI, Extensions, and local clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register LearnLoop routers
app.include_router(memories.router)
app.include_router(spaces.router)
app.include_router(retrieval.router)
app.include_router(metrics.router)
app.include_router(course.router)
app.include_router(srs.router)
app.include_router(audio.router)
app.include_router(scorm.router)
app.include_router(assessment.router)
app.include_router(curriculum.router)
app.include_router(artifacts.router)
app.include_router(study.router)
app.include_router(profile.router)
app.include_router(document_questions.router)



from fastapi import UploadFile, File, Form, Depends
from typing import Optional
from uuid import UUID
from dependencies import get_current_user
from routers import memories
from models.schemas import MemoryCreate

@app.get("/captures")
async def get_captures_alias(space_id: Optional[UUID] = None, current_user = Depends(get_current_user)):
    return await memories.list_memories(space_id, current_user)

@app.post("/captures/upload")
async def upload_captures_alias(file: UploadFile = File(...), title: Optional[str] = Form(None), space_id: Optional[str] = Form(None), current_user = Depends(get_current_user)):
    return await memories.upload_file_memory(file, title, space_id, current_user)

@app.post("/captures")
async def create_captures_alias(memory_in: MemoryCreate, current_user = Depends(get_current_user)):
    return await memories.create_memory(memory_in, current_user)

@app.get("/api/info")
async def api_info():
    db = get_db()
    return {
        "name": "LearnLoop — AI-Powered Learning Loop",
        "tagline": "Turn your materials into courses, master them with spaced repetition, and close the learning loop.",
        "version": "2.0.0",
        "status": "online",
        "stats": {
            "spaces_count": len(db.spaces),
            "memories_count": len(db.captures),
            "active_contradictions_count": len(db.list_contradictions(status="active")),
        }
    }


@app.get("/health")
async def health():
    return {"status": "ok", "service": "learnloop-api"}


# Mount frontend vanilla UI
vanilla_static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "learnloop_vanilla")
if os.path.exists(vanilla_static_dir):
    app.mount("/vanilla", StaticFiles(directory=vanilla_static_dir, html=True), name="static_vanilla")

uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/files", StaticFiles(directory=uploads_dir), name="files")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
