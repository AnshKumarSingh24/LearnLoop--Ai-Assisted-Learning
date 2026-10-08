from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid
import time
import asyncio

# Mock job storage for the MVP
# In a real app this would be Redis/Celery
JOB_STATUS_STORE = {}

from services.audio_pipeline import PodcastConfig

router = APIRouter(prefix="/audio", tags=["Audio Podcasts"])

class GeneratePodcastRequest(BaseModel):
    space_id: str
    text_content: str
    style: Optional[str] = "conversational"
    tone: Optional[str] = "friendly"

    speaker_count: Optional[int] = 2
    speakers_profile: Optional[list] = []

async def _simulate_notebookllama_audio_generation(job_id: str, space_id: str, text_content: str):
    """
    Simulates bridging to NotebookLlama for fast, local 2-speaker generation.
    """
    JOB_STATUS_STORE[job_id] = {"status": "processing", "progress": 20, "message": "NotebookLlama: Generating fast script..."}
    await asyncio.sleep(2)
    
    JOB_STATUS_STORE[job_id] = {"status": "processing", "progress": 70, "message": "NotebookLlama: Running local TTS model..."}
    await asyncio.sleep(3)
    
    JOB_STATUS_STORE[job_id] = {
        "status": "completed", 
        "progress": 100,
        "message": "NotebookLlama fast podcast generated successfully.",
        "audio_url": f"https://mock-audio-storage.s3.amazonaws.com/space_{space_id}_fast_podcast.mp3"
    }

async def _simulate_open_notebook_audio_generation(job_id: str, space_id: str, text_content: str, speaker_count: int):
    """
    Simulates bridging to the Open Notebook podcast pipeline which takes ~30 seconds.
    """
    JOB_STATUS_STORE[job_id] = {"status": "processing", "progress": 10, "message": "Analyzing text for script generation..."}
    await asyncio.sleep(5)
    
    JOB_STATUS_STORE[job_id] = {"status": "processing", "progress": 40, "message": f"Generating {speaker_count}-speaker script via LangChain..."}
    await asyncio.sleep(10)
    
    JOB_STATUS_STORE[job_id] = {"status": "processing", "progress": 80, "message": "Synthesizing TTS audio..."}
    await asyncio.sleep(5)
    
    JOB_STATUS_STORE[job_id] = {
        "status": "completed", 
        "progress": 100,
        "message": "Podcast generated successfully.",
        "audio_url": f"https://mock-audio-storage.s3.amazonaws.com/space_{space_id}_podcast.mp3"
    }

@router.post("/generate")
async def generate_podcast(req: GeneratePodcastRequest, background_tasks: BackgroundTasks):
    """
    Triggers the Open Notebook audio pipeline to generate an advanced multi-speaker podcast
    from the provided text content or space notes.
    """
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    
    JOB_STATUS_STORE[job_id] = {"status": "queued", "progress": 0, "message": "Job queued"}
    
    # Intelligent Audio Router
    if req.speaker_count <= 2 and len(req.text_content) < 5000:
        # Route to NotebookLlama for fast, lightweight generations
        background_tasks.add_task(
            _simulate_notebookllama_audio_generation, 
            job_id, 
            req.space_id, 
            req.text_content
        )
        engine_used = "NotebookLlama (Fast)"
    else:
        # Route to Open Notebook for complex, multi-speaker / deep context generations
        background_tasks.add_task(
            _simulate_open_notebook_audio_generation, 
            job_id, 
            req.space_id, 
            req.text_content, 
            req.speaker_count
        )
        engine_used = "Open Notebook (Advanced)"
    
    return {
        "status": "processing",
        "message": f"Podcast generation queued via {engine_used}.",
        "job_id": job_id
    }

@router.get("/status/{job_id}")
async def get_podcast_status(job_id: str):
    """
    Poll this endpoint to check the background job status.
    """
    job = JOB_STATUS_STORE.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
