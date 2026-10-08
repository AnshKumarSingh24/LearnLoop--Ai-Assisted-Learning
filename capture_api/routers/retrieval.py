from fastapi import APIRouter, Depends
from typing import Optional
from models.schemas import AskRequest, AskResponse, ContextPackRequest, ContextPackResponse
from services.retrieval_service import RetrievalService
from dependencies import get_current_user

router = APIRouter(tags=["Retrieval & Ask"])

@router.post("/ask", response_model=AskResponse)
async def ask_capture(
    req: AskRequest,
):
    """
    Ask — Natural Language Study Intelligence:
    Retrieves minimum sufficient context, identifies active contradictions,
    synthesizes a direct grounded answer, and returns transparent context reduction metrics.
    """
    return await RetrievalService.ask_capture(
        query=req.query,
        space_id=str(req.space_id) if req.space_id else None,
        top_k=req.top_k
    )


@router.post("/context", response_model=ContextPackResponse)
async def get_context_pack(
    req: ContextPackRequest,
):
    """
    Context Pack Builder:
    Packages the minimal sufficient, entity-resolved, contradiction-aware context for AI agents or downstream tools.
    """
    return await RetrievalService.build_context_pack(
        goal=req.goal,
        space_id=str(req.space_id) if req.space_id else None,
        max_tokens=req.max_tokens
    )

