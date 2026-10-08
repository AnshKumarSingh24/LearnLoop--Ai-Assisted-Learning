"""
Memory Profile — Static / Dynamic memory tiers backed by Capture's own data.

Pattern adapted from supermemory's profile model (static = permanent facts,
dynamic = recent context), but resolved locally:
  STATIC  <- resolved canonical entities (people, services, decisions, deadlines)
             These are stable workspace facts with cross-source aliases.
  DYNAMIC <- most recent captures in scope (recency-weighted working memory).

The profile is deduplicated with supermemory's deduplicate_memories
(Static > Dynamic > Search priority) and rendered as markdown for
injection into LLM prompts.
"""

from typing import Any, Dict, List, Optional
from services.memory_utils import deduplicate_memories, convert_profile_to_markdown


def _entity_to_fact(ent: Dict[str, Any], mention_count: int = 0) -> str:
    name = ent.get("canonical_name", "Unknown")
    etype = ent.get("entity_type", "other")
    aliases = ent.get("aliases") or []
    alias_str = f" (aka: {', '.join(aliases[:4])})" if aliases else ""
    mention_str = f" — mentioned in {mention_count} sources" if mention_count else ""
    return f"{name} [{etype}]{alias_str}{mention_str}"


async def build_memory_profile(
    supabase,
    user_id: str,
    query: str = "",
    space_id: Optional[str] = None,
    static_limit: int = 15,
    dynamic_limit: int = 8,
) -> Dict[str, Any]:
    """
    Build the static/dynamic memory profile for a user (optionally scoped).
    Never raises — returns an empty profile on failure.
    """
    static_facts: List[str] = []
    dynamic_items: List[str] = []
    warnings: List[str] = []

    # ── STATIC: resolved entities = stable facts ──
    try:
        ent_query = (
            supabase.table("entities")
            .select("id, canonical_name, entity_type, aliases")
            .eq("user_id", user_id)
            .limit(static_limit * 2)
        )
        ent_res = ent_query.execute()
        entities = ent_res.data or []

        # Count cross-source mentions per entity (evidence of stability)
        for ent in entities[:static_limit]:
            try:
                link_res = (
                    supabase.table("capture_entities")
                    .select("capture_id")
                    .eq("entity_id", ent["id"])
                    .execute()
                )
                mention_count = len(link_res.data or [])
            except Exception:
                mention_count = 0
            static_facts.append(_entity_to_fact(ent, mention_count))
    except Exception as e:
        warnings.append(f"static-profile unavailable: {e}")

    # ── DYNAMIC: recent captures = working memory ──
    try:
        cap_query = (
            supabase.table("captures")
            .select("id, title, preview, type, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(dynamic_limit * 2)
        )
        cap_res = cap_query.execute()
        recent = cap_res.data or []

        if space_id:
            # Prefer captures actually in this space; fall back to global recency
            in_space = [
                c for c in recent
                if space_id in (c.get("space_ids") or [])
            ]
            scoped = in_space[:dynamic_limit] or recent[:dynamic_limit]
        else:
            scoped = recent[:dynamic_limit]

        for c in scoped:
            title = c.get("title") or "Untitled"
            preview = (c.get("preview") or "")[:160]
            dynamic_items.append(f"[recent] {title} ({c.get('type', 'text')}): {preview}")
    except Exception as e:
        warnings.append(f"dynamic-profile unavailable: {e}")

    # ── DEDUP (supermemory priority: static wins) ──
    deduped = deduplicate_memories(static=static_facts, dynamic=dynamic_items)

    markdown = convert_profile_to_markdown({
        "profile": {"static": deduped.static, "dynamic": deduped.dynamic},
        "searchResults": {"results": []},
    })

    return {
        "static": deduped.static,
        "dynamic": deduped.dynamic,
        "markdown": markdown,
        "static_count": len(deduped.static),
        "dynamic_count": len(deduped.dynamic),
        "warnings": warnings,
    }


def format_search_results_markdown(results: List[Dict[str, Any]], limit: int = 8) -> str:
    """Render gated search results as a markdown evidence list."""
    lines = []
    for i, r in enumerate(results[:limit]):
        title = r.get("title") or "Untitled"
        score = r.get("final_score", r.get("relevance_score", 0))
        preview = ((r.get("content") or r.get("preview")) or "")[:200]
        lines.append(f"{i+1}. **{title}** (score {score:.2f}): {preview}")
    return "\n".join(lines)
