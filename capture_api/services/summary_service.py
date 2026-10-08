from typing import Optional
from services.db import get_db
from services.ai_pipeline import generate_space_summary

async def update_space_summary_if_needed(space_id: str, force: bool = False):
    """
    Intelligently generates or updates Space summary.
    Avoids unnecessary LLM calls using capture count caching.
    """
    db = get_db()
    space = db.get_space(space_id)
    if not space:
        return

    captures = db.list_captures(space_id=space_id)
    entities = db.list_resolved_entities(space_id)
    
    current_count = len(captures)
    last_count = space.get("cover_metadata", {}).get("last_summarized_count", 0)

    # Invalidate if forced, or if new captures were added, or if summary is empty
    if force or current_count != last_count or not space.get("summary"):
        new_summary = await generate_space_summary(
            space_name=space.get("name", "Space"),
            space_description=space.get("description", ""),
            captures=captures,
        )
        cover_meta = dict(space.get("cover_metadata") or {})
        cover_meta["last_summarized_count"] = current_count
        db.update_space(space_id, {
            "summary": new_summary,
            "capture_count": current_count,
            "cover_metadata": cover_meta
        })
