"""
Agentic Orchestrator — coordinates the context assembly pipeline.

Flow:
  USER GOAL
      ↓
  ORCHESTRATOR
      ↓
  ┌───────────┬───────────────┬──────────────────┐
  ↓           ↓               ↓                  ↓
Retrieval   Entity         Contradiction      Capture
  Agent     Resolution       Agent             Agent
  ↓           ↓               ↓                  ↓
  └───────────┴───────────────┴──────────────────┘
                        ↓
               Context Assembler
                        ↓
               Quality Validator
                        ↓
                  CONTEXT PACK
"""

import json
import time
from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel
from services.embeddings import generate_embedding
from services.context_engine import (
    analyze_goal,
    retrieve_candidates,
    select_minimum_context,
    generate_context_summary,
    _detect_contradictions_in_context,
    _detect_dangling_in_context,
    assemble_context_pack,
    ContextPack,
)
from services.retrieval import (
    calculate_context_reduction,
    compute_precision_proxy,
    estimate_tokens,
    tokens_to_dollars,
)
from services.memory_utils import wrap_memory_injection
from services.memory_profile import build_memory_profile
from core.ai import get_groq_client


class OrchestratorResult(BaseModel):
    context_pack: ContextPack
    pipeline_log: List[Any]
    agent_trace: List[dict]


async def orchestrate(
    supabase,
    user_id: str,
    goal_text: str,
    space_id: Optional[str] = None,
    max_tokens: int = 10000,
) -> OrchestratorResult:
    """
    Run the full orchestration pipeline with agent tracing.
    """
    start_time = time.time()
    pipeline_log = []
    agent_trace = []

    # Step 1: Goal Analysis Agent
    agent_trace.append({"agent": "goal_analyzer", "status": "running", "input": goal_text})
    goal_analysis = await analyze_goal(goal_text)
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {
        "expanded_query": goal_analysis.expanded_query,
        "keywords": goal_analysis.keywords,
        "entity_hints": goal_analysis.entity_hints,
        "intent": goal_analysis.intent,
    }
    pipeline_log.append(f"Goal analyzed: intent={goal_analysis.intent}, {len(goal_analysis.keywords)} keywords extracted")

    # Step 2: Retrieval Agent
    agent_trace.append({"agent": "retrieval", "status": "running"})
    candidates = await retrieve_candidates(supabase, user_id, goal_analysis, space_id)
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {"candidates_found": len(candidates)}
    pipeline_log.append(f"Retrieved {len(candidates)} candidates from multiple sources")

    # Step 3: Entity Resolution Agent
    agent_trace.append({"agent": "entity_resolution", "status": "running"})
    all_entities = await _resolve_entities_for_captures(candidates[:20], user_id, supabase)
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {"entities_resolved": len(all_entities)}
    pipeline_log.append(f"Resolved {len(all_entities)} entities across sources")

    # Step 4: Context Selection via Authority Gate
    agent_trace.append({"agent": "context_selection", "status": "running"})
    naive_tokens = sum(
        estimate_tokens(c.get("content", "") or c.get("preview", ""))
        for c in candidates
    )
    gate_out = select_minimum_context(candidates, max_tokens=max_tokens, authority_threshold=0.45)
    selected = gate_out["selected"]
    gated_out_count = gate_out["gated_out_count"]
    packed_tokens = sum(
        estimate_tokens(c.get("content", "") or c.get("preview", ""))
        for c in selected
    )
    reduction_ratio = calculate_context_reduction(naive_tokens, packed_tokens)
    tokens_saved = max(0, naive_tokens - packed_tokens)
    dollars_saved = tokens_to_dollars(tokens_saved)
    precision = compute_precision_proxy(selected)
    pipeline_log.append(
        f"Gate selected {len(selected)} captures: {naive_tokens} → {packed_tokens} tokens "
        f"(pruned {gated_out_count} low-authority, reduction {reduction_ratio:.1f}%)"
    )

    # Step 5: Memory profile (static + dynamic, deduped)
    agent_trace.append({"agent": "memory_profile", "status": "running"})
    try:
        memory_profile = await build_memory_profile(
            supabase, user_id, query=goal_text, space_id=space_id
        )
    except Exception as e:
        memory_profile = {"static": [], "dynamic": [], "markdown": "",
                          "static_count": 0, "dynamic_count": 0, "warnings": []}
        pipeline_log.append(f"memory-profile failed: {e}")
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {"memory_profile": memory_profile}
    pipeline_log.append(f"Built memory profile: {memory_profile.get('static_count', 0)} static + {memory_profile.get('dynamic_count', 0)} dynamic facts")

    # Step 5: Contradiction Detection Agent
    agent_trace.append({"agent": "contradiction_detector", "status": "running"})
    contradictions = await _detect_contradictions_in_context(selected, user_id, supabase)
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {"contradictions_found": len(contradictions)}
    pipeline_log.append(f"Detected {len(contradictions)} contradictions")

    # Step 6: Dangling reference scan (edge-case handling — graceful, never break)
    agent_trace.append({"agent": "dangling_ref_scan", "status": "running"})
    dangling = await _detect_dangling_in_context(selected, supabase)
    agent_trace[-1]["status"] = "complete"
    pipeline_log.append(f"Dangling reference scan complete")

    # Step 7: Entity attachment for selected captures
    selected_entities = []
    for cap in selected[:10]:
        try:
            ent_res = supabase.table("capture_entities")\
                .select("entity_id, entities(canonical_name, entity_type, aliases)")\
                .eq("capture_id", cap["id"])\
                .execute()
            if ent_res.data:
                for link in ent_res.data:
                    ent = link.get("entities")
                    if ent:
                        selected_entities.append(ent)
        except Exception:
            pass

    seen_ent_ids = set()
    unique_entities = []
    for ent in selected_entities:
        eid = ent.get("id")
        if eid and eid not in seen_ent_ids:
            seen_ent_ids.add(eid)
            unique_entities.append(ent)

    # Step 8: Context Assembler
    agent_trace.append({"agent": "context_assembler", "status": "running"})
    summary, confidence = await generate_context_summary(
        goal_text, selected, unique_entities, contradictions,
        memory_markdown=memory_profile.get("markdown", ""),
    )
    agent_trace[-1]["status"] = "complete"
    agent_trace[-1]["output"] = {"confidence": confidence}
    pipeline_log.append(f"Context assembled: confidence={confidence:.2f}, "
                        f"{len(unique_entities)} entities resolved")

    # Step 9: Authored Context Pack — with full telemetry (Token/Cost proof)
    latency_ms = int((time.time() - start_time) * 1000)

    context_pack = ContextPack(
        goal_text=goal_text,
        selected_captures=selected,
        selected_entities=unique_entities,
        contradictions=contradictions,
        summary=summary,
        confidence=confidence,
        full_token_count=naive_tokens,
        packed_token_count=packed_tokens,
        naive_token_count=naive_tokens,
        reduction_ratio=reduction_ratio,
        tokens_saved=tokens_saved,
        dollars_saved=dollars_saved,
        precision=precision,
        gated_out_count=gated_out_count,
        memory_profile={
            "static": memory_profile.get("static", []),
            "dynamic": memory_profile.get("dynamic", []),
            "markdown": memory_profile.get("markdown", ""),
            "static_count": memory_profile.get("static_count", 0),
            "dynamic_count": memory_profile.get("dynamic_count", 0),
        },
        latency_ms=latency_ms,
        sources_scanned=len(candidates),
    )

    return OrchestratorResult(
        context_pack=context_pack,
        pipeline_log=pipeline_log,
        agent_trace=agent_trace,
    )


async def _resolve_entities_for_captures(
    captures: List[dict],
    user_id: str,
    supabase,
) -> List[dict]:
    """Get all entities linked to the given captures using a single batched query."""
    cap_ids = [str(c["id"]) for c in captures[:20] if c.get("id")]
    if not cap_ids:
        return []

    entity_ids = set()
    entities = []

    if supabase:
        try:
            # Single batched query instead of looping
            res = supabase.table("capture_entities")\
                .select("entity_id, entities(id, canonical_name, entity_type, aliases)")\
                .in_("capture_id", cap_ids)\
                .execute()
            if res.data:
                for link in res.data:
                    ent = link.get("entities")
                    if ent and ent.get("id") not in entity_ids:
                        entity_ids.add(ent["id"])
                        entities.append(ent)
        except Exception:
            pass
    else:
        from services.db import get_db
        db = get_db()
        cap_id_set = set(cap_ids)
        for e_id, ent in db.capture_entities.items():
            if ent.get("capture_id") in cap_id_set and e_id not in entity_ids:
                entity_ids.add(e_id)
                entities.append(ent)

    return entities


async def ask_contextos(
    supabase,
    user_id: str,
    question: str,
    space_id: Optional[str] = None,
) -> dict:
    """
    Conversational interface: answer a question using the context engine.
    Returns the answer with evidence and context reduction stats.
    """
    # Build context pack for the question
    pack = await assemble_context_pack(supabase, user_id, question, space_id)

    # Expose clean telemetry (frontend renders these as metric cards)
    return {
        "answer": pack.summary,
        "evidence": [
            {"id": c.get("id"), "title": c.get("title") or "Untitled"}
            for c in pack.selected_captures[:8]
        ],
        "context_stats": {
            "scanned": pack.sources_scanned,
            "selected": len(pack.selected_captures),
            "reduction": round(pack.reduction_ratio, 1),
            "precision": pack.precision,
            "tokens_saved": pack.tokens_saved,
            "dollars_saved": round(pack.dollars_saved, 4),
            "confidence": round(pack.confidence, 2),
            "latency_ms": pack.latency_ms,
            "gated_out": pack.gated_out_count,
        },
    }
