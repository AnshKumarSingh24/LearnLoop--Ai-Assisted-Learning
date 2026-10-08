from typing import List, Optional
from uuid import UUID
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body
from models.schemas import Memory, MemoryCreate, ProcessingStatus
from services.db import get_db
from services.ingestion_service import IngestionService
from dependencies import get_current_user

router = APIRouter(prefix="/memories", tags=["Memories"])

@router.post("", response_model=Memory)
async def create_memory(
    memory_in: MemoryCreate,
    current_user = Depends(get_current_user)
):
    """
    Universal Memory Ingestion:
    Saves the original content immediately (<1s response), then processes
    normalization, embeddings, entity extraction, and contradiction checks asynchronously.
    """
    db = get_db()
    user_id = str(current_user.id)
    
    space_ids = [str(s) for s in (memory_in.space_ids or [])]
    if memory_in.space_id:
        space_ids.append(str(memory_in.space_id))

    mem = db.create_memory(
        user_id=user_id,
        original_content=memory_in.original_content,
        memory_type=memory_in.memory_type.value,
        title=memory_in.title,
        source_type=memory_in.source_type or "manual",
        file_url=memory_in.file_url,
        space_ids=space_ids,
        metadata=memory_in.metadata or {}
    )

    # Trigger async intelligence pipeline
    IngestionService.enqueue_processing(mem["id"])

    return db.get_memory(mem["id"])

@router.get("/{memory_id}", response_model=Memory)
async def get_memory_by_id(
    memory_id: str,
    current_user = Depends(get_current_user)
):
    """
    Retrieve a memory and its associated entities.
    """
    db = get_db()
    mem = db.get_memory(memory_id)
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")
        
    # Optional authorization check
    if mem.get("user_id") != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this memory")
        
    return mem

@router.post("/upload", response_model=Memory)
async def upload_file_memory(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    space_id: Optional[str] = Form(None),
    current_user = Depends(get_current_user)
):
    """
    Frictionless Document / Media Upload:
    Accepts PDF, screenshot, text, audio, extracts text content, and ingests immediately.
    """
    db = get_db()
    user_id = str(current_user.id)
    content_bytes = await file.read()
    filename = file.filename or "uploaded_file"
    ext = filename.split(".")[-1].lower() if "." in filename else ""

    m_type = "document"
    extracted_text = ""

    # Save file locally for Docling processing
    upload_dir = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{filename}")
    with open(file_path, "wb") as f:
        f.write(content_bytes)

    if ext in ["pdf"]:
        m_type = "pdf"
        try:
            from services.docling_service import DoclingService
            docling_result = DoclingService.extract_markdown(file_path)
            if docling_result.get("markdown"):
                extracted_text = docling_result["markdown"]
            else:
                extracted_text = f"PDF Document: {filename}"
        except ImportError:
            try:
                from io import BytesIO
                from pypdf import PdfReader
                reader = PdfReader(BytesIO(content_bytes))
                for page in reader.pages[:10]:
                    extracted_text += page.extract_text() or ""
            except Exception:
                extracted_text = f"PDF Document: {filename}"
        except Exception as e:
            extracted_text = f"PDF Document (Error parsing): {filename}"

    elif ext in ["png", "jpg", "jpeg", "webp"]:
        m_type = "screenshot" if "screen" in filename.lower() or "shot" in filename.lower() else "image"
        try:
            import base64
            import asyncio
            from services.ai_pipeline import get_groq_client
            client = get_groq_client()
            if client:
                b64_image = base64.b64encode(content_bytes).decode("utf-8")
                mime = f"image/{ext if ext != 'jpg' else 'jpeg'}"
                vision_res = await asyncio.to_thread(
                    client.chat.completions.create,
                    model="llama-3.2-11b-vision-preview",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Perform high-precision OCR and extract all text, chats, dates, names, decisions, and numbers from this image. Output only the factual extracted text:"},
                                {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64_image}"}}
                            ]
                        }
                    ],
                    max_tokens=600
                )
                if vision_res.choices and vision_res.choices[0]:
                    extracted_text = vision_res.choices[0].message.content
            if not extracted_text:
                extracted_text = f"Visual Artifact: {filename} ({len(content_bytes)//1024} KB)"
        except Exception as e:
            extracted_text = f"Image {filename} (Processed visual structure)"

    elif ext in ["mp3", "m4a", "wav", "ogg"]:
        m_type = "voice"
        try:
            import io
            import asyncio
            from services.ai_pipeline import get_groq_client
            client = get_groq_client()
            if client:
                audio_file = io.BytesIO(content_bytes)
                audio_file.name = filename
                transcription = await asyncio.to_thread(
                    client.audio.transcriptions.create,
                    file=audio_file,
                    model="whisper-large-v3",
                    response_format="json",
                    temperature=0.0
                )
                extracted_text = getattr(transcription, "text", "") or str(transcription)
            if not extracted_text:
                extracted_text = f"Audio Recording: {filename}"
        except Exception as e:
            extracted_text = f"Voice Memo {filename} (Audio data stored)"
    else:
        try:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
        except Exception:
            extracted_text = f"[File: {filename}]"

    if not extracted_text.strip():
        extracted_text = f"Uploaded file: {filename}"

    valid_space_ids = []
    if space_id and space_id.lower() != "unassigned":
        try:
            import uuid
            uuid.UUID(space_id)
            valid_space_ids.append(space_id)
        except ValueError:
            space = next((s for s in db.spaces.values() if s["name"].lower() == space_id.lower()), None)
            if space:
                valid_space_ids.append(str(space["id"]))

    mem = db.create_memory(
        user_id=user_id,
        original_content=extracted_text,
        memory_type=m_type,
        title=title or filename,
        source_type="file_upload",
        file_url=f"/files/{filename}",
        space_ids=valid_space_ids,
        metadata={"filename": filename, "size": len(content_bytes), "extension": ext, "file_path": file_path}
    )

    IngestionService.enqueue_processing(mem["id"])
    return db.get_memory(mem["id"])


@router.get("")
async def list_memories(
    space_id: Optional[UUID] = None,
    current_user = Depends(get_current_user)
):
    try:
        db = get_db()
        user_id = str(current_user.id)
        return db.list_memories(user_id=user_id, space_id=str(space_id) if space_id else None)
    except Exception as e:
        print("list_memories notice:", e)
        return []


@router.get("/{id}")
async def get_memory_detail(
    id: UUID,
    current_user = Depends(get_current_user)
):
    db = get_db()
    mem = db.get_memory(str(id))
    if not mem or mem.get("user_id") != str(current_user.id):
        raise HTTPException(status_code=404, detail="Memory not found")
    return mem


@router.put("/{id}", response_model=Memory)
async def update_memory(
    id: UUID,
    updates: dict = Body(...),
    current_user = Depends(get_current_user)
):
    db = get_db()
    # verify existence
    mem = db.get_memory(str(id))
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")
        
    updated_mem = db.update_memory(str(id), updates)
    if not updated_mem:
        raise HTTPException(status_code=500, detail="Failed to update memory")
        
    # Re-extract tags if original_content changed
    if "original_content" in updates:
        # In a real system, you'd enqueue this in the background
        IngestionService.enqueue_processing(str(id))

    return updated_mem


@router.delete("/{id}")
async def delete_memory(
    id: UUID,
    current_user = Depends(get_current_user)
):
    db = get_db()
    deleted = db.delete_memory(str(id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"status": "deleted", "id": str(id)}


@router.post("/docling/extract")
async def extract_with_docling(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Extract structured markdown from document using Docling."""
    content_bytes = await file.read()
    filename = file.filename or "uploaded_file"
    
    try:
        from services.docling_service import DoclingService
        result = DoclingService.extract_from_bytes(content_bytes, filename)
        return result
    except ImportError:
        raise HTTPException(status_code=501, detail="Docling not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
