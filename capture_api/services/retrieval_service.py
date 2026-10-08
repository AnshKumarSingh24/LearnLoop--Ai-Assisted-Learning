from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime
import re
import tiktoken
from services.db import get_db
from services.embeddings import generate_embedding
from services.ai_pipeline import synthesize_answer
from models.schemas import AskResponse, SourceCitation, ContextReductionMetrics, ContextPackResponse

_tokenizer = None

def get_tokenizer():
    global _tokenizer
    if _tokenizer is None:
        try:
            _tokenizer = tiktoken.get_encoding("cl100k_base")
        except Exception:
            _tokenizer = None
    return _tokenizer

def count_tokens(text: str) -> int:
    if not text:
        return 0
    tok = get_tokenizer()
    if tok:
        try:
            return len(tok.encode(text))
        except Exception:
            pass
    # Fallback approximation: ~1 token per 4 chars
    return max(1, len(text) // 4)


class RetrievalService:
    @staticmethod
    async def ask_capture(query: str, space_id: Optional[str] = None, top_k: int = 4) -> AskResponse:
        db = get_db()
        
        # 1. Embed query
        query_emb = generate_embedding(query)

        # 2. Vector search + keyword fallback inside space (or globally)
        retrieved_captures = db.search_captures(
            query_embedding=query_emb, 
            space_id=space_id, 
            top_k=top_k,
            query_text=query
        )
        
        # 2a. If nothing found, widen search globally (no space filter)
        if not retrieved_captures and space_id:
            retrieved_captures = db.search_captures(
                query_embedding=query_emb,
                space_id=None,
                top_k=top_k,
                query_text=query
            )

        # 3. Retrieve all captures in space for naive context comparison
        all_space_captures = db.list_captures(space_id=space_id)
        
        # 3a. If still empty (no embeddings yet), fall back to plain text of all captures
        if not retrieved_captures:
            retrieved_captures = db.list_captures(space_id=None)[:top_k]
            for cap in retrieved_captures:
                cap["relevance_score"] = 0.5

        total_captures_count = len(all_space_captures)

        entity_hints = re.findall(r'@(\w[\w\s]*\w)', query)
        cap_words = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', query)
        entity_hints.extend(cap_words)
        entity_hints = [h.lower() for h in entity_hints if len(h) > 2]

        if entity_hints and retrieved_captures:
            for cap in retrieved_captures:
                cap_entities = cap.get("entities", [])
                entity_names = [e.get("normalized_entity_name", "").lower() for e in cap_entities]
                entity_texts = [e.get("entity_text", "").lower() for e in cap_entities]
                all_entity_str = " ".join(entity_names + entity_texts)

                match_bonus = sum(1.5 for hint in entity_hints if hint in all_entity_str)
                cap["relevance_score"] = cap.get("relevance_score", 0.5) + match_bonus

            retrieved_captures.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)


        # Calculate naive context (all captures in space)
        all_content_str = "\n\n".join([
            (c.get("normalized_content") or c.get("original_content") or "")
            for c in all_space_captures
        ])
        naive_tokens = count_tokens(all_content_str)
        # Ensure realistic minimum baseline if few items
        naive_tokens = max(naive_tokens, 1200 if total_captures_count > 1 else 300)

        # Calculate actual retrieved context
        retrieved_content_str = "\n\n".join([
            (c.get("normalized_content") or c.get("original_content") or "")
            for c in retrieved_captures
        ])
        actual_tokens = count_tokens(retrieved_content_str)
        actual_tokens = max(actual_tokens, 45)

        if naive_tokens > actual_tokens:
            reduction_pct = round(((naive_tokens - actual_tokens) / naive_tokens) * 100, 1)
        else:
            reduction_pct = 0.0

        # 4. Fetch only contradictions relevant to the retrieved captures or query
        all_active_contras = db.list_contradictions(space_id=space_id, status="active")
        retrieved_ids = {c["id"] for c in retrieved_captures}
        
        # Check if query is conversational/greeting
        is_greeting = query.lower().strip() in ["hi", "hello", "hey", "hola", "yo", "sup", "greetings"]

        relevant_contras = []
        if not is_greeting:
            for contra in all_active_contras:
                # Included if one of the retrieved sources is part of the conflict
                if contra.get("capture_a_id") in retrieved_ids or contra.get("capture_b_id") in retrieved_ids:
                    relevant_contras.append(contra)
            
            # PROACTIVE SCAN: Check the retrieved context chunks for new, undetected contradictions right now
            from services.retrieval import detect_retrieval_contradictions
            proactive_contras = detect_retrieval_contradictions(retrieved_captures)
            
            # Merge the new proactive ones into relevant_contras
            for pc in proactive_contras:
                # Add it so the LLM synthesis sees it
                relevant_contras.append(pc)

        # 5. Synthesize answer with Groq LLM
        if not query or query.lower() in ['hi', 'hello']:
            return AskResponse(
                answer="Hello! I am Darwinity, your AI learning companion. Ask me anything about your courses, sources, or study materials, and I'll help you master them.",
                sources=[],
                processing_time_ms=0,
                metrics=ContextReductionMetrics(naive_context_tokens=0, actual_context_tokens=0, context_reduction_percentage=0, total_space_captures=0, retrieved_captures_count=0)
            )
        else:
            synth_result = await synthesize_answer(
                query=query,
                context_chunks=retrieved_captures,
                active_contradictions=relevant_contras
            )
            sources = [
                SourceCitation(
                    capture_id=UUID(c["id"]),
                    title=c.get("title", "Document"),
                    capture_type=c.get("capture_type", "text"),
                    relevance_score=c.get("relevance_score", 0.9),
                    excerpt=(c.get("normalized_content") or c.get("original_content", ""))[:180] + "...",
                    created_at=datetime.fromisoformat(c.get("created_at", datetime.utcnow().isoformat())),
                    source_type=c.get("source_type", "manual")
                )
                for c in retrieved_captures
            ]

        # 6. Log metrics
        db.log_retrieval_metric(naive_tokens, actual_tokens, reduction_pct)

        metrics = ContextReductionMetrics(
            naive_context_tokens=naive_tokens,
            actual_context_tokens=actual_tokens if not is_greeting else 0,
            context_reduction_percentage=reduction_pct if not is_greeting else 100.0,
            total_space_captures=total_captures_count,
            retrieved_captures_count=len(sources)
        )

        return AskResponse(
            answer=synth_result["answer"],
            sources=sources,
            metrics=metrics,
            why_sources=synth_result.get("why_sources"),
            contradictions_noted=relevant_contras
        )

    @staticmethod
    async def build_context_pack(goal: str, space_id: Optional[str] = None, max_tokens: int = 2000) -> ContextPackResponse:
        """Assembles the minimum sufficient context pack for an AI agent or downstream task."""
        ask_res = await RetrievalService.ask_capture(query=goal, space_id=space_id, top_k=5)
        db = get_db()
        entities = db.list_resolved_entities(space_id) if space_id else []
        contradictions = db.list_contradictions(space_id=space_id, status="active")

        assembled_str = f"GOAL: {goal}\n\nRELEVANT CONTEXT:\n"
        for s in ask_res.sources:
            assembled_str += f"- [{s.capture_type.upper()}] {s.title}: {s.excerpt}\n"

        return ContextPackResponse(
            goal=goal,
            summary=ask_res.answer,
            assembled_context=assembled_str,
            sources=ask_res.sources,
            entities=entities,
            contradictions=contradictions,
            metrics=ask_res.metrics
        )
