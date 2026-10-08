from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from adapters.surfsense_adapter import SurfSenseAdapter
from services.ingestion import ingest_from_adapter
from services.retrieval import retrieve_context_for_notebook

router = APIRouter(prefix="/api/v1/research", tags=["Research & Chat"])

class AskRequest(BaseModel):
    notebook_id: int
    query: str
    use_live_web: bool = False

@router.post("/ask")
async def ask_notebook(req: AskRequest):
    """
    Vertical slice: SurfSense live research -> canonical source -> indexing -> notebook-scoped search -> cited answer.
    """
    
    # 1. Live Web Augmentation (if requested)
    if req.use_live_web:
        adapter = SurfSenseAdapter(query=req.query)
        # 2. Ingest to Canonical Source
        await ingest_from_adapter(notebook_id=req.notebook_id, adapter=adapter)
        
    # 3. Notebook-scoped Search
    context_sources = await retrieve_context_for_notebook(req.notebook_id, req.query)
    
    # 4. Generate Cited Answer (Mocked for vertical slice)
    answer = f"Based on {len(context_sources)} retrieved sources, the live web context confirms the details for your query: '{req.query}'."
    
    return {
        "answer": answer,
        "citations": [s.external_id for s in context_sources]
    }
