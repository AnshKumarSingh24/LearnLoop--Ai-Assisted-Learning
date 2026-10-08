from typing import List, Dict, Any, Optional
from services.db import get_db, cosine_similarity
from services.ai_pipeline import detect_contradictions_llm

async def run_contradiction_check(new_capture_id: str, space_id: str) -> List[Dict[str, Any]]:
    """
    Two-stage Contradiction Detection Pipeline:
    Stage 1: Semantic similarity search in Space to retrieve top related captures.
    Stage 2: Structured LLM factual comparison for disagreements, dates, decisions, assignments.
    """
    db = get_db()
    new_capture = db.get_capture(new_capture_id)
    if not new_capture:
        return []

    new_emb = new_capture.get("embedding")
    new_content = new_capture.get("normalized_content") or new_capture.get("original_content", "")
    new_title = new_capture.get("title", "New Capture")

    # Fetch existing captures in space
    existing_all = db.list_captures(space_id=space_id)
    candidates = [c for c in existing_all if c["id"] != new_capture_id]
    if not candidates:
        return []

    # Score and filter related captures
    related_captures = []
    for c in candidates:
        c_emb = c.get("embedding")
        if new_emb and c_emb:
            sim = cosine_similarity(new_emb, c_emb)
        else:
            sim = 0.5

        # Ignore exact duplicates (>0.98 similarity)
        if 0.25 <= sim <= 0.98:
            related_captures.append(c)

    # If no vector filtered match, check candidate pool
    if not related_captures:
        related_captures = candidates[:4]

    # Run LLM-based structured contradiction check
    detected = await detect_contradictions_llm(
        new_capture_title=new_title,
        new_capture_content=new_content,
        existing_captures=related_captures
    )

    created_contradictions = []
    for d in detected:
        # Determine the counterpart capture ID
        counterpart_id = related_captures[0]["id"] if related_captures else None
        if not counterpart_id:
            continue

        contra = db.create_contradiction(
            space_id=space_id,
            capture_a_id=new_capture_id,
            capture_b_id=counterpart_id,
            conflicting_field=d.conflicting_field or "Factual Statement",
            description=d.explanation or f"Conflict detected on {d.conflicting_field}",
            contradiction_type="conflicting_date" if "date" in d.conflicting_field.lower() else "conflicting_requirement",
            severity=d.severity,
            value_a=d.value_a,
            value_b=d.value_b
        )
        created_contradictions.append(contra)

    return created_contradictions


def resolve_contradiction_workflow(
    contradiction_id: str,
    action: str,
    notes: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Executes user contradiction decision:
    - mark_a_correct
    - mark_b_correct
    - keep_both
    - dismiss
    """
    db = get_db()
    status_map = {
        "mark_a_correct": "resolved",
        "mark_b_correct": "resolved",
        "keep_both": "reviewed",
        "dismiss": "dismissed"
    }
    new_status = status_map.get(action, "resolved")
    return db.resolve_contradiction(contradiction_id, status=new_status, notes=notes or f"Action taken: {action}")
