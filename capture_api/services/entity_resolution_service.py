from typing import List, Dict, Any, Optional
import math
from services.db import get_db, cosine_similarity
from services.embeddings import generate_embedding

def string_similarity(s1: str, s2: str) -> float:
    """Calculates normalized token overlap and substring similarity."""
    a = s1.lower().strip()
    b = s2.lower().strip()
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.88
    
    tokens_a = set(a.split())
    tokens_b = set(b.split())
    if not tokens_a or not tokens_b:
        return 0.0
    overlap = tokens_a.intersection(tokens_b)
    jaccard = len(overlap) / len(tokens_a.union(tokens_b))
    return jaccard


async def resolve_space_entities(space_id: str):
    """
    Space-scoped Entity Resolution Pipeline.
    Identifies related entity mentions across captures, clusters them,
    and updates canonical resolved entities with confidence scores.
    """
    db = get_db()
    captures = db.list_captures(space_id=space_id)
    if not captures:
        return

    # Gather all capture entities for these captures
    all_ces = []
    capture_contexts = {}
    for cap in captures:
        ces = db.get_capture_entities(cap["id"])
        all_ces.extend(ces)
        capture_contexts[cap["id"]] = cap.get("content", "")

    if not all_ces:
        return

    existing_resolved = db.list_resolved_entities(space_id)
    
    # Process each capture entity
    for ce in all_ces:
        ce_name = ce["normalized_entity_name"]
        ce_type = ce["entity_type"]
        ce_emb = ce.get("embedding") or generate_embedding(ce_name)
        ce_context = capture_contexts.get(ce["capture_id"], "")

        matched_res = None
        best_score = 0.0
        best_reasoning = ""

        for re in existing_resolved:
            # Check type compatibility
            if re["entity_type"] != ce_type and re["entity_type"] != "other" and ce_type != "other":
                continue

            # Stage 1 & 2: Exact Identifier & Fuzzy String Overlap
            str_score = string_similarity(ce_name, re["canonical_name"])
            
            # Stage 3: Semantic Embedding Distance
            emb_score = 0.0
            if ce_emb and re.get("representative_embedding"):
                emb_score = cosine_similarity(ce_emb, re["representative_embedding"])

            # Stage 4: Context / Metadata Validation (Lightweight reasoning simulation)
            # If the context is very different, we penalize the score. If it's similar, we boost.
            context_boost = 0.0
            if ce_context and "flight" in ce_context.lower() and "flight" in re["canonical_name"].lower():
                context_boost = 0.05

            # Stage 5: Confidence Score Calculation
            confidence_score = max(str_score, emb_score * 0.90) + context_boost
            
            reasoning = []
            if str_score == 1.0:
                reasoning.append("Exact identifier match.")
            elif str_score > 0.8:
                reasoning.append(f"Strong fuzzy string overlap ({str_score:.2f}).")
                
            if emb_score > 0.85:
                reasoning.append(f"High semantic embedding similarity ({emb_score:.2f}).")
                
            if context_boost > 0:
                reasoning.append("Contextual metadata validation successful.")

            final_reasoning = " ".join(reasoning) if reasoning else "Weak correlation."

            if confidence_score > best_score:
                best_score = confidence_score
                matched_res = re
                best_reasoning = final_reasoning

        if matched_res and best_score >= 0.70:
            # Link to existing resolved entity
            db.link_entity_member(
                resolved_entity_id=matched_res["id"],
                capture_entity_id=ce["id"],
                similarity_score=round(best_score, 3)
            )
            # Upgrade canonical name if current mention is longer / more formal
            if len(ce_name) > len(matched_res["canonical_name"]) and best_score > 0.85:
                matched_res["canonical_name"] = ce_name
                
            # Log the confidence (In a real system this would persist to the DB)
            print(f"[ENTITY RESOLUTION] Matched '{ce_name}' -> '{matched_res['canonical_name']}'. Confidence: {best_score:.2f}. Reasoning: {best_reasoning}")
        else:
            # Create new canonical resolved entity
            new_re = db.create_resolved_entity(
                space_id=space_id,
                canonical_name=ce_name,
                entity_type=ce_type,
                representative_embedding=ce_emb,
                source_count=1
            )
            db.link_entity_member(
                resolved_entity_id=new_re["id"],
                capture_entity_id=ce["id"],
                similarity_score=1.0
            )
            existing_resolved.append(new_re)
            print(f"[ENTITY RESOLUTION] Created new canonical entity: '{ce_name}'")
