import time
from typing import List, Dict, Any, Optional, Tuple
from uuid import UUID
from .retrieval import hardened_scoped_retrieval, count_tokens, log_retrieval_metrics
from .ai_pipeline import apply_authority_gate, assemble_context_pack, calculate_context_reduction
from .entity_service import EntityService

class ContextService:
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.entity_service = EntityService(supabase_client)

    async def create_context_pack(self, user_id: UUID, goal_id: UUID, query: str, space_id: Optional[UUID] = None) -> Dict[str, Any]:
        """
        The Master Orchestrator: Assembles the 'Minimum Sufficient Context'
        for a given goal.
        """
        start_time = time.time()

        # 1. Goal-Based Entity Expansion
        # Instead of just searching for the query string, we find entities related to the goal
        resolved_entities = []
        try:
            goal_res = self.supabase.table("goals").select("*").eq("id", str(goal_id)).single().execute()
            goal_data = goal_res.data

            # We could use an LLM here to extract entities from the goal_text
            # For now, we use the query string as the primary entity seed
            entity_id = await self.entity_service.resolve_entity(user_id, query, "project")
            if entity_id:
                resolved_entities.append(entity_id)
        except Exception as e:
            print(f"Goal resolution error: {e}")

        # 2. Hybrid Retrieval (Entity-linked + Vector search)
        all_candidates = []

        # A. Get captures linked to resolved entities (High Authority)
        for eid in resolved_entities:
            entity_caps = await self.entity_service.find_all_related_captures(eid)
            all_candidates.extend(entity_caps)

        # B. Perform vector search for the query
        from .embeddings import get_embedding
        query_embedding = get_embedding(query)
        vector_results, latency_ms = hardened_scoped_retrieval(
            query_embedding,
            str(space_id) if space_id else None,
            self.supabase,
            top_k=20
        )
        all_candidates.extend(vector_results)

        # 3. Context Narrowing (The Authority Gate)
        # Prune the list to the "Minimum Sufficient Context"
        gated_captures = apply_authority_gate(all_candidates, threshold=0.65)

        # 4. Token Accounting (The Proof of Work)
        # Calculate 'Naive' tokens (all captures in the space)
        full_space_tokens = 0
        if space_id:
            space_res = self.supabase.table("spaces").select("capture_ids").eq("id", str(space_id)).single().execute()
            cap_ids = space_res.data.get("capture_ids", [])
            all_caps = self.supabase.table("captures").select("content").in_("id", cap_ids).execute()
            for c in all_caps.data:
                full_space_tokens += count_tokens(c.get("content") or "")

        # Calculate 'Packed' tokens
        packed_content = assemble_context_pack(query, gated_captures)
        packed_tokens = count_tokens(packed_content)

        reduction_ratio = calculate_context_reduction(full_space_tokens, packed_tokens)

        # 5. Final Assembly & Logging
        context_pack_data = {
            "user_id": str(user_id),
            "goal_id": str(goal_id),
            "goal_text": query,
            "selected_captures": [c.get("id") for c in gated_captures],
            "full_token_count": full_space_tokens,
            "packed_token_count": packed_tokens,
            "reduction_ratio": reduction_ratio,
            "latency_ms": latency_ms,
            "summary": packed_content # In a real system, we'd summarize this via LLM
        }

        try:
            pack_res = self.supabase.table("context_packs").insert(context_pack_data).execute()
            pack_id = pack_res.data[0]["id"]

            # Log to retrieval_logs for the Dashboard
            log_retrieval_metrics(
                query=query,
                space_id=str(space_id) if space_id else "global",
                latency_ms=latency_ms,
                full_tokens=full_space_tokens,
                retrieved_tokens=packed_tokens,
                supabase_client=self.supabase
            )

            return {
                "pack_id": pack_id,
                "context": packed_content,
                "reduction_ratio": reduction_ratio,
                "tokens_saved": full_space_tokens - packed_tokens
            }
        except Exception as e:
            print(f"Context pack save error: {e}")
            return {"error": str(e)}
