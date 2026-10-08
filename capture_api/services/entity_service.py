import json
from typing import List, Dict, Any, Optional
from uuid import UUID
from core.ai import get_groq_client
from services.embeddings import generate_embedding
from services.db import get_db, cosine_similarity

class EntityService:
    """
    State-of-the-Art Semantic Entity Resolution & Identity Mapping.
    Combines high-dimension embedding search with LLM-based Coreference Reasoning
    to resolve aliases, nicknames, abbreviations, and informal mentions into canonical entities.
    """
    def __init__(self, supabase_client=None):
        self.supabase = supabase_client
        self.db = get_db()

    async def resolve_entity(self, user_id: Any, text: str, entity_type: str = "general") -> Optional[str]:
        """
        Resolves a piece of text to a canonical entity using:
        1. Exact alias lookup
        2. Embedding similarity matching
        3. LLM Coreference Reasoning for ambiguous mentions
        """
        if not text or not text.strip():
            return None
        
        text = text.strip()
        
        # 1. Exact alias lookup in local DB / Supabase
        for eid, ent in self.db.resolved_entities.items():
            if text.lower() == ent.get("canonical_name", "").lower() or any(text.lower() == a.lower() for a in ent.get("aliases", [])):
                return eid

        # 2. Embedding similarity search
        query_embedding = generate_embedding(text)
        candidate_matches = []

        if self.supabase:
            try:
                rpc_params = {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.65,
                    "match_count": 3,
                    "filter_entity_type": entity_type
                }
                response = self.supabase.rpc("match_entities", rpc_params).execute()
                candidate_matches = response.data or []
            except Exception:
                pass
        else:
            for eid, ent in self.db.resolved_entities.items():
                e_emb = ent.get("embedding")
                sim = cosine_similarity(query_embedding, e_emb) if (query_embedding and e_emb) else 0.0
                if sim >= 0.50:
                    candidate_matches.append({
                        "id": eid,
                        "canonical_name": ent.get("canonical_name"),
                        "aliases": ent.get("aliases", []),
                        "relevance_score": sim
                    })

        # High confidence direct match (> 0.85)
        if candidate_matches and candidate_matches[0].get("relevance_score", 0) > 0.85:
            return candidate_matches[0]["id"]

        # 3. LLM Coreference Reasoning (Semantic Identity Map)
        if candidate_matches:
            best_candidate = candidate_matches[0]
            is_same, reasoning = await self._judge_identity_match_llm(text, best_candidate)
            if is_same:
                # Add alias to candidate
                if str(best_candidate["id"]) in self.db.resolved_entities:
                    self.db.resolved_entities[str(best_candidate["id"])]["aliases"].append(text)
                return str(best_candidate["id"])

        # 4. If no candidate matches, create a new canonical entity
        return await self.create_entity(user_id, text, entity_type, query_embedding)

    async def _judge_identity_match_llm(self, mention: str, candidate: Dict[str, Any]) -> tuple[bool, str]:
        """Uses LLM reasoning to determine if mention maps to candidate."""
        client = get_groq_client()
        if not client:
            return False, "No LLM client"

        prompt = f"""You are an expert Entity Resolution and Coreference Reasoning engine.
Determine whether the mention '{mention}' refers to the same real-world entity as canonical entity '{candidate.get('canonical_name')}' (Known aliases: {candidate.get('aliases', [])}).

Return ONLY a JSON object:
{{
  "is_match": true or false,
  "confidence": float between 0.0 and 1.0,
  "reasoning": "brief explanation"
}}"""
        try:
            resp = await client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {"role": "system", "content": "You are a strict JSON entity resolution engine."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.0
            )
            data = json.loads(resp.choices[0].message.content)
            return bool(data.get("is_match") and data.get("confidence", 0) >= 0.7), data.get("reasoning", "")
        except Exception:
            return False, "LLM parsing error"

    async def create_entity(self, user_id: Any, name: str, entity_type: str, embedding: Optional[List[float]] = None) -> str:
        """Creates a new canonical entity."""
        if not embedding:
            embedding = generate_embedding(name)

        entity_data = {
            "user_id": str(user_id),
            "canonical_name": name,
            "entity_type": entity_type,
            "embedding": embedding,
            "aliases": [name]
        }

        if self.supabase:
            try:
                res = self.supabase.table("entities").insert(entity_data).execute()
                return str(res.data[0]["id"])
            except Exception:
                pass

        created = self.db.create_resolved_entity(
            space_id="",
            canonical_name=name,
            entity_type=entity_type,
        )
        return created["id"]

    async def link_capture_to_entity(self, capture_id: Any, entity_id: Any, text: str, entity_type: str, confidence: float = 1.0):
        """Links a specific capture to a resolved entity."""
        link_data = {
            "capture_id": str(capture_id),
            "entity_id": str(entity_id),
            "entity_text": text,
            "entity_type": entity_type,
            "confidence": confidence
        }
        if self.supabase:
            try:
                self.supabase.table("capture_entities").upsert(link_data).execute()
            except Exception:
                pass
        self.db.capture_entities[f"{capture_id}_{entity_id}"] = link_data

    async def find_all_related_captures(self, entity_id: Any) -> List[Dict]:
        """Finds all captures associated with a specific entity."""
        if self.supabase:
            try:
                res = self.supabase.table("capture_entities")\
                    .select("capture_id, captures(*)")\
                    .eq("entity_id", str(entity_id))\
                    .execute()
                return [item["captures"] for item in res.data if item.get("captures")]
            except Exception:
                pass
        
        matches = []
        for k, v in self.db.capture_entities.items():
            if str(v.get("entity_id")) == str(entity_id):
                cap = self.db.get_capture(v.get("capture_id"))
                if cap:
                    matches.append(cap)
        return matches
