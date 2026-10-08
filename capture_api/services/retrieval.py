import re
import time
import math
from typing import List, Dict, Any, Optional
from collections import Counter

# In-memory cache for hot spaces to guarantee sub-second retrieval
_active_space_cache: Dict[str, Dict[str, Any]] = {}

# Cost model: GPT-4 / Claude Opus class input pricing ($/1M tokens)
COST_PER_MILLION_INPUT_TOKENS = 15.0

# Lazy tiktoken encoder (real BPE counting when available)
_tiktoken_encoder = None

def _get_tiktoken_encoder():
    global _tiktoken_encoder
    if _tiktoken_encoder is None:
        try:
            import tiktoken
            _tiktoken_encoder = tiktoken.get_encoding("cl100k_base")
        except Exception:
            _tiktoken_encoder = False  # mark unavailable, use heuristic
    return _tiktoken_encoder if _tiktoken_encoder else None


def estimate_tokens(text: str) -> int:
    """
    Single canonical token estimator used across the whole pipeline.
    Uses tiktoken (cl100k_base) when available, else a calibrated heuristic.
    """
    if not text:
        return 0
    enc = _get_tiktoken_encoder()
    if enc is not None:
        try:
            return len(enc.encode(text))
        except Exception:
            pass
    return max(1, math.ceil(len(text) / 3.8))


# Backwards-compatible alias (older modules import count_tokens)
def count_tokens(text: str) -> int:
    """Alias for estimate_tokens. Single source of truth for token math."""
    return estimate_tokens(text)


def tokens_to_dollars(tokens: int) -> float:
    """Convert a token count to USD at the configured input-token price."""
    return round((max(0, tokens) / 1_000_000.0) * COST_PER_MILLION_INPUT_TOKENS, 4)

def calculate_context_reduction(full_space_tokens: int, retrieved_tokens: int) -> float:
    """
    Computes the exact mathematical reduction ratio:
    Reduction Ratio = ((Full Space - Retrieved) / Full Space) * 100
    """
    if full_space_tokens <= 0:
        return 0.0
    ratio = ((full_space_tokens - retrieved_tokens) / full_space_tokens) * 100.0
    return round(max(0.0, min(100.0, ratio)), 2)


def _tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase alphanumeric tokens."""
    return re.findall(r'\b[a-z0-9]+\b', text.lower())

def bm25_score(query: str, document: str, k1: float = 1.5, b: float = 0.75) -> float:
    """Okapi BM25 scoring between a query and a single document."""
    if not query or not document:
        return 0.0
    query_tokens = _tokenize(query)
    doc_tokens = _tokenize(document)
    if not query_tokens or not doc_tokens:
        return 0.0
    doc_len = len(doc_tokens)
    avg_dl = max(1, doc_len)  # single doc, use its own length
    doc_tf = Counter(doc_tokens)
    score = 0.0
    for qt in set(query_tokens):
        tf = doc_tf.get(qt, 0)
        if tf == 0:
            continue
        numerator = tf * (k1 + 1)
        denominator = tf + k1 * (1 - b + b * (doc_len / avg_dl))
        score += numerator / denominator
    return score

def detect_retrieval_contradictions(
    captures: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Check retrieved captures for factual contradictions."""
    contradictions = []
    field_patterns = {
        "departure_date": r'(?:october|november|december|january|february|march|april|may|june|july|august|september)\s+\d{1,2}',
        "price": r'[\$₹€£]\s*[\d,]+(?:\.\d{2})?',
        "time": r'\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)',
        "location": r'(?:at|from|to|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
    }
    for i in range(len(captures)):
        for j in range(i + 1, len(captures)):
            cap_a = captures[i]
            cap_b = captures[j]
            text_a = (cap_a.get("normalized_content") or cap_a.get("original_content") or "").lower()
            text_b = (cap_b.get("normalized_content") or cap_b.get("original_content") or "").lower()
            for field, pattern in field_patterns.items():
                matches_a = set(re.findall(pattern, text_a, re.IGNORECASE))
                matches_b = set(re.findall(pattern, text_b, re.IGNORECASE))
                if matches_a and matches_b and not matches_a.intersection(matches_b):
                    contradictions.append({
                        "capture_a_id": cap_a["id"],
                        "capture_b_id": cap_b["id"],
                        "conflicting_field": field,
                        "value_a": ", ".join(list(matches_a)[:3]),
                        "value_b": ", ".join(list(matches_b)[:3]),
                        "severity": "high" if field in ("departure_date", "price") else "medium",
                        "description": f"Conflicting {field.replace('_', ' ')}: '{', '.join(list(matches_a)[:2])}' vs '{', '.join(list(matches_b)[:2])}'"
                    })
    return contradictions


def authority_gated_retrieval(
    raw_results: List[Dict[str, Any]],
    authority_threshold: float = 0.60,
    top_k_budget_tokens: int = 2000,
    query_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Module 2: The Context Narrowing Engine (Authority-Gated Retrieval).

    Formula:
    Final Score = (Cosine Similarity * 0.5) + (BM25 * 0.2) + (Authority * 0.3)

    Filters out any context chunks that fail the authority threshold,
    and enforces a strict token budget to eliminate enterprise token waste.
    This is the discrete authority gate: low-authority, low-relevance
    chunks never reach the LLM, which is what produces the reduction ratio.
    """
    scored_chunks = []

    for r in raw_results:
        sim = float(r.get("relevance_score") or r.get("similarity") or 0.8)
        auth_weight = float(r.get("authority_weight") or 1.0)

        # BM25 scoring blended with vector similarity and authority
        bm25 = bm25_score(query_text, r.get("content", "") or "") if query_text else 0.0
        final_score = (sim * 0.5) + (bm25 * 0.2) + (auth_weight * 0.3)

        if final_score >= authority_threshold:
            scored_chunks.append({
                **r,
                "final_score": round(final_score, 4),
                "bm25_score": round(bm25, 4),
                "token_count": estimate_tokens(r.get("content", ""))
            })

    # Sort by the final gated score
    scored_chunks.sort(key=lambda x: x["final_score"], reverse=True)

    # Enforce minimum sufficient context budget
    passed_chunks = []
    current_tokens = 0

    for chunk in scored_chunks:
        if current_tokens + chunk["token_count"] <= top_k_budget_tokens:
            passed_chunks.append(chunk)
            current_tokens += chunk["token_count"]
        else:
            break

    return {
        "passed_chunks": passed_chunks,
        "retained_tokens": current_tokens,
        "gated_out_count": len(raw_results) - len(passed_chunks)
    }

def apply_authority_gate(
    candidates: List[Dict[str, Any]],
    threshold: float = 0.65,
    max_tokens: int = 10000,
    query_text: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Convenience wrapper: run the authority gate and return only the
    surviving chunks (drops telemetry). Used by legacy call sites.
    """
    result = authority_gated_retrieval(
        raw_results=candidates,
        authority_threshold=threshold,
        top_k_budget_tokens=max_tokens,
        query_text=query_text,
    )
    return result["passed_chunks"]


def hardened_scoped_retrieval(
    query_text: str,
    raw_space_captures: List[Dict[str, Any]],
    authority_threshold: float = 0.60,
    token_budget: int = 1500,
) -> Dict[str, Any]:
    """
    Executes end-to-end authority-gated scoped context retrieval
    with real token metrics, BM25 hybrid scoring, and contradiction detection.
    """
    start_time = time.time()

    # Measure full space token volume (what Naive RAG would send)
    total_space_text = " ".join([c.get("content", "") or "" for c in raw_space_captures])
    full_space_tokens = estimate_tokens(total_space_text)

    # Execute the Authority Gate with BM25 scoring
    gated_result = authority_gated_retrieval(
        raw_results=raw_space_captures,
        authority_threshold=authority_threshold,
        top_k_budget_tokens=token_budget,
        query_text=query_text,
    )

    selected_captures = gated_result["passed_chunks"]
    retrieved_tokens = gated_result["retained_tokens"]
    reduction_ratio = calculate_context_reduction(full_space_tokens, retrieved_tokens)
    latency_ms = int((time.time() - start_time) * 1000)

    # Detect contradictions across selected captures
    contradictions = detect_retrieval_contradictions(selected_captures)

    # Dollar cost savings at the configured input-token price
    tokens_saved = max(0, full_space_tokens - retrieved_tokens)
    dollars_saved = tokens_to_dollars(tokens_saved)

    return {
        "context_payload": selected_captures,
        "contradictions": contradictions,
        "telemetry": {
            "full_space_tokens": full_space_tokens,
            "retrieved_tokens": retrieved_tokens,
            "tokens_saved": tokens_saved,
            "reduction_ratio_pct": reduction_ratio,
            "cost_saved_usd": dollars_saved,
            "latency_ms": max(1, latency_ms),
            "chunks_pruned": gated_result["gated_out_count"],
            "contradictions_found": len(contradictions),
        },
    }


def compute_precision_proxy(selected: List[Dict[str, Any]], high_relevance_cutoff: float = 0.7) -> Optional[float]:
    """
    Retrieval precision proxy: fraction of selected chunks whose
    relevance_score clears a high-confidence cutoff. Logged to
    retrieval_logs.precision_score so the dashboard can chart it.
    Returns None when no scored chunks were selected.
    """
    scored = [c for c in selected if isinstance(c.get("relevance_score"), (int, float))]
    if not scored:
        return None
    hits = sum(1 for c in scored if c["relevance_score"] >= high_relevance_cutoff)
    return round(hits / len(scored), 3)


def log_retrieval_metrics(
    query: str,
    space_id: Optional[str],
    latency_ms: int,
    full_tokens: int,
    retrieved_tokens: int,
    supabase_client,
    user_id: Optional[str] = None,
    selected_count: int = 0,
    candidates_found: int = 0,
    precision_score: Optional[float] = None,
) -> None:
    """
    Persist one retrieval event to retrieval_logs. Never raises:
    telemetry must never break the retrieval pipeline.
    """
    try:
        row = {
            "query": query,
            "latency_ms": latency_ms,
            "sources_scanned": candidates_found,
            "candidates_found": candidates_found,
            "selected_count": selected_count,
            "full_token_count": full_tokens,
            "packed_token_count": retrieved_tokens,
            "reduction_ratio": calculate_context_reduction(full_tokens, retrieved_tokens),
            "precision_score": precision_score,
        }
        if user_id:
            row["user_id"] = user_id
        # space_id has no column on retrieval_logs; stash it in the query
        # prefix only when callers pass the legacy "global" sentinel.
        supabase_client.table("retrieval_logs").insert(row).execute()
    except Exception as e:
        print(f"Telemetry log failed (non-fatal): {e}")
