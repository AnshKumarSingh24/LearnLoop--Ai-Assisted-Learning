from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from models.schemas import Space, SpaceCreate, SpaceUpdate
from services.db import get_db
from services.summary_service import update_space_summary_if_needed
from dependencies import get_current_user

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("", response_model=Space)
async def create_space(
    space_in: SpaceCreate,
    current_user = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user.id)
    space = db.create_space(
        user_id=user_id,
        name=space_in.name,
        description=space_in.description,
        cover_metadata=space_in.cover_metadata
    )
    return space


@router.get("", response_model=List[Space])
async def list_spaces(
    current_user = Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user.id)
    return db.list_spaces(user_id=user_id)


@router.get("/{id}")
async def get_space_detail(
    id: UUID,
    current_user = Depends(get_current_user)
):
    db = get_db()
    sid = str(id)
    space = db.get_space(sid)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")

    captures = db.list_captures(space_id=sid)
    entities = db.list_resolved_entities(sid)
    contradictions = db.list_contradictions(space_id=sid, status="active")

    return {
        **space,
        "captures": captures,
        "entities": entities,
        "contradictions": contradictions,
        "metrics": {
            "captures_count": len(captures),
            "entities_count": len(entities),
            "contradictions_count": len(contradictions)
        }
    }


@router.patch("/{id}", response_model=Space)
async def update_space(
    id: UUID,
    space_update: SpaceUpdate,
    current_user = Depends(get_current_user)
):
    db = get_db()
    sid = str(id)
    updated = db.update_space(sid, space_update.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Space not found")
    return updated


@router.post("/{id}/refresh-summary")
async def refresh_space_summary(
    id: UUID,
    current_user = Depends(get_current_user)
):
    sid = str(id)
    await update_space_summary_if_needed(sid, force=True)
    db = get_db()
    return db.get_space(sid)
