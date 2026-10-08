import os
import json
import math
import sqlite3
from typing import List, Dict, Any, Optional, Union
from uuid import UUID, uuid4
from datetime import datetime
from models.schemas import (
    User, Space, Memory as Capture, MemoryType as CaptureType, ProcessingStatus,
    CaptureEntity, EntityType, ResolvedEntity, EntityMember,
    Contradiction, ContradictionType, ContradictionStatus
)
from core.config import settings

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)


class LocalContextDB:
    """
    High-performance Local Context Intelligence Database.
    Provides offline-first resilience, vector similarity search, entity graphs,
    and contradiction tracking out of the box with zero external dependencies.
    """
    _instance = None

    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.spaces: Dict[str, Dict[str, Any]] = {}
        self.captures: Dict[str, Dict[str, Any]] = {}
        self.space_captures: List[Dict[str, Any]] = [] # {space_id, capture_id, relevance_score, created_at}
        self.capture_entities: Dict[str, Dict[str, Any]] = {} # id -> data
        self.resolved_entities: Dict[str, Dict[str, Any]] = {} # id -> data
        self.entity_members: List[Dict[str, Any]] = [] # {resolved_entity_id, capture_entity_id, similarity_score}
        self.contradictions: Dict[str, Dict[str, Any]] = {} # id -> data
        self.metrics_log: List[Dict[str, Any]] = []
        self.profiles: Dict[str, Dict[str, Any]] = {}

        # Initialize default demo user
        demo_user_id = "00000000-0000-0000-0000-000000000000"
        self.users[demo_user_id] = {
            "id": demo_user_id,
            "email": "demo@capture.ai",
            "created_at": datetime.utcnow().isoformat()
        }

        # Initialize SQLite fallback persistence
        self.db_path = os.path.join(os.path.dirname(__file__), "..", "..", "capture_data.db")
        self._init_sqlite()
        self._load_from_sqlite()

    def _init_sqlite(self):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS spaces (id TEXT PRIMARY KEY, data TEXT)''')
            c.execute('''CREATE TABLE IF NOT EXISTS captures (id TEXT PRIMARY KEY, data TEXT)''')
            c.execute('''CREATE TABLE IF NOT EXISTS capture_entities (id TEXT PRIMARY KEY, data TEXT)''')
            c.execute('''CREATE TABLE IF NOT EXISTS resolved_entities (id TEXT PRIMARY KEY, data TEXT)''')
            c.execute('''CREATE TABLE IF NOT EXISTS contradictions (id TEXT PRIMARY KEY, data TEXT)''')
            c.execute('''CREATE TABLE IF NOT EXISTS profiles (user_id TEXT PRIMARY KEY, data TEXT)''')
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"SQLite Init Error (Silently falling back to memory only): {e}")

    def _load_from_sqlite(self):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("SELECT id, data FROM spaces")
            for row in c.fetchall():
                try:
                    self.spaces[row[0]] = json.loads(row[1])
                except:
                    pass
            c.execute("SELECT id, data FROM captures")
            for row in c.fetchall():
                try:
                    self.captures[row[0]] = json.loads(row[1])
                except:
                    pass
            c.execute("SELECT id, data FROM capture_entities")
            for row in c.fetchall():
                try:
                    self.capture_entities[row[0]] = json.loads(row[1])
                except:
                    pass
            c.execute("SELECT id, data FROM resolved_entities")
            for row in c.fetchall():
                try:
                    self.resolved_entities[row[0]] = json.loads(row[1])
                except:
                    pass
            c.execute("SELECT id, data FROM contradictions")
            for row in c.fetchall():
                try:
                    self.contradictions[row[0]] = json.loads(row[1])
                except:
                    pass
            c.execute("SELECT user_id, data FROM profiles")
            for row in c.fetchall():
                try:
                    self.profiles[row[0]] = json.loads(row[1])
                except Exception:
                    pass
            conn.close()
            print(f"Successfully loaded DB state from SQLite persistence.")
        except Exception as e:
            print(f"SQLite Load Error: {e}")

    def _save_space_to_sqlite(self, space: Dict[str, Any]):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO spaces (id, data) VALUES (?, ?)", (space["id"], json.dumps(space)))
            conn.commit()
            conn.close()
        except:
            pass

    def _save_capture_to_sqlite(self, capture: Dict[str, Any]):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO captures (id, data) VALUES (?, ?)", (capture["id"], json.dumps(capture)))
            conn.commit()
            conn.close()
        except:
            pass

    def _save_capture_entity_to_sqlite(self, entity: Dict[str, Any]):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO capture_entities (id, data) VALUES (?, ?)", (entity["id"], json.dumps(entity)))
            conn.commit()
            conn.close()
        except:
            pass

    def _save_resolved_entity_to_sqlite(self, entity: Dict[str, Any]):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO resolved_entities (id, data) VALUES (?, ?)", (entity["id"], json.dumps(entity)))
            conn.commit()
            conn.close()
        except:
            pass
            
    def _save_contradiction_to_sqlite(self, contradiction: Dict[str, Any]):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("INSERT OR REPLACE INTO contradictions (id, data) VALUES (?, ?)", (contradiction["id"], json.dumps(contradiction)))
            conn.commit()
            conn.close()
        except:
            pass

    # ---------------- Profiles ----------------
    def get_profile(self, user_id: str, default: Dict[str, Any]) -> Dict[str, Any]:
        profile = self.profiles.get(str(user_id))
        if profile:
            # Newly introduced profile preferences must be visible for profiles
            # persisted before the field existed (for example LearnLoop's
            # onboarding payload), without requiring a migration or reset.
            return {"user_id": str(user_id), **default, **profile}
        return {"user_id": str(user_id), **default}

    def save_profile(self, user_id: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        record = {"user_id": str(user_id), **profile, "updated_at": datetime.utcnow().isoformat()}
        self.profiles[str(user_id)] = record
        try:
            conn = sqlite3.connect(self.db_path)
            conn.execute("INSERT OR REPLACE INTO profiles (user_id, data) VALUES (?, ?)", (str(user_id), json.dumps(record)))
            conn.commit()
            conn.close()
        except Exception:
            pass
        return record

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = LocalContextDB()
        return cls._instance

    # ---------------- Spaces ----------------
    def create_space(self, user_id: str, name: str, description: Optional[str] = None, cover_metadata: Optional[Dict] = None) -> Dict[str, Any]:
        space_id = str(uuid4())
        now = datetime.utcnow().isoformat()
        space = {
            "id": space_id,
            "user_id": str(user_id),
            "name": name,
            "description": description or "",
            "summary": "",
            "capture_count": 0,
            "cover_metadata": cover_metadata or {},
            "created_at": now,
            "updated_at": now
        }
        self.spaces[space_id] = space
        self._save_space_to_sqlite(space)
        return space

    def get_space(self, space_id: str) -> Optional[Dict[str, Any]]:
        return self.spaces.get(str(space_id))

    def list_spaces(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        spaces = list(self.spaces.values())
        if user_id:
            spaces = [s for s in spaces if s.get("user_id") == str(user_id)]
        # sort by updated_at descending
        return sorted(spaces, key=lambda s: s.get("updated_at", ""), reverse=True)

    def update_space(self, space_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        space = self.spaces.get(str(space_id))
        if not space:
            return None
        for k, v in updates.items():
            if v is not None:
                space[k] = v
        space["updated_at"] = datetime.utcnow().isoformat()
        self._save_space_to_sqlite(space)
        return space

    # ---------------- Captures ----------------
    def create_capture(self, user_id: str, original_content: str, capture_type: str, title: Optional[str] = None,
                       source_type: str = "manual", file_url: Optional[str] = None, space_ids: Optional[List[str]] = None,
                       metadata: Optional[Dict] = None, embedding: Optional[List[float]] = None,
                       authority_weight: Optional[float] = None) -> Dict[str, Any]:
        capture_id = str(uuid4())
        now = datetime.utcnow().isoformat()

        # Set authority weight based on source type if not provided
        if authority_weight is None:
            _AUTHORITY_MAP = {
                "pdf": 0.95,
                "document": 0.90,
                "screenshot": 0.85,
                "image": 0.80,
                "voice": 0.65,
                "audio": 0.65,
                "text": 0.50,
                "link": 0.60,
            }
            authority_weight = _AUTHORITY_MAP.get(capture_type, 0.70)

        capture = {
            "id": capture_id,
            "user_id": str(user_id),
            "original_content": original_content,
            "normalized_content": original_content,
            "capture_type": capture_type,
            "title": title or (original_content[:40] + ("..." if len(original_content) > 40 else "")),
            "source_type": source_type,
            "file_url": file_url,
            "metadata": metadata or {},
            "embedding": embedding,
            "authority_weight": authority_weight,
            "processing_status": "queued",
            "created_at": now,
            "processed_at": None,
            "space_ids": [str(s) for s in (space_ids or [])]
        }
        self.captures[capture_id] = capture

        # Link to spaces
        if space_ids:
            for s_id in space_ids:
                self.link_space_capture(str(s_id), capture_id)

        self._save_capture_to_sqlite(capture)
        return capture

    def get_capture(self, capture_id: str) -> Optional[Dict[str, Any]]:
        cap = self.captures.get(str(capture_id))
        if not cap:
            return None
        # Attach extracted entities
        entities = self.get_capture_entities(capture_id)
        cap_copy = dict(cap)
        cap_copy["entities"] = entities
        return cap_copy

    def update_capture(self, capture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if str(capture_id) not in self.captures:
            return None
        
        cap = self.captures[str(capture_id)]
        
        # Prevent overriding critical fields accidentally
        safe_updates = {k: v for k, v in updates.items() if k in ["title", "original_content", "metadata", "space_ids"]}
        cap.update(safe_updates)
        cap["updated_at"] = datetime.utcnow().isoformat()
        
        self.captures[str(capture_id)] = cap
        self._save_capture_to_sqlite(cap)
        return self.get_capture(capture_id)


    def list_captures(self, user_id: Optional[str] = None, space_id: Optional[str] = None) -> List[Dict[str, Any]]:
        captures = list(self.captures.values())
        if user_id:
            captures = [c for c in captures if c.get("user_id") == str(user_id)]
        if space_id:
            linked_ids = {sc["capture_id"] for sc in self.space_captures if sc["space_id"] == str(space_id)}
            captures = [c for c in captures if c["id"] in linked_ids or str(space_id) in c.get("space_ids", [])]
        
        # Sort by created_at descending
        results = []
        for c in sorted(captures, key=lambda x: x.get("created_at", ""), reverse=True):
            c_copy = dict(c)
            c_copy["entities"] = self.get_capture_entities(c["id"])
            results.append(c_copy)
        return results

    def update_capture(self, capture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        capture = self.captures.get(str(capture_id))
        if not capture:
            return None
        for k, v in updates.items():
            if v is not None:
                capture[k] = v
        self._save_capture_to_sqlite(capture)
        return capture

    def delete_capture(self, capture_id: str) -> bool:
        cid = str(capture_id)
        if cid in self.captures:
            del self.captures[cid]
            self.space_captures = [sc for sc in self.space_captures if sc["capture_id"] != cid]
            # remove capture entities
            to_del_ce = [ce_id for ce_id, ce in self.capture_entities.items() if ce["capture_id"] == cid]
            for ce_id in to_del_ce:
                del self.capture_entities[ce_id]
                self.entity_members = [em for em in self.entity_members if em["capture_entity_id"] != ce_id]
            # update space count
            try:
                conn = sqlite3.connect(self.db_path)
                c = conn.cursor()
                c.execute("DELETE FROM captures WHERE id=?", (cid,))
                conn.commit()
                conn.close()
            except:
                pass
            return True
        return False

    # ---------------- Memory Aliases ----------------
    def create_memory(self, user_id: str, original_content: str, memory_type: str = "text", capture_type: Optional[str] = None, title: Optional[str] = None, source_type: str = "manual", file_url: Optional[str] = None, space_ids: Optional[List[str]] = None, metadata: Optional[Dict] = None, **kwargs) -> Dict[str, Any]:
        c_type = capture_type or memory_type or "text"
        return self.create_capture(
            user_id=user_id,
            original_content=original_content,
            capture_type=c_type,
            title=title,
            source_type=source_type,
            file_url=file_url,
            space_ids=space_ids,
            metadata=metadata,
            **{k: v for k, v in kwargs.items() if k in ["embedding", "authority_weight"]}
        )

    def get_memory(self, memory_id: str) -> Optional[Dict[str, Any]]:
        return self.get_capture(memory_id)

    def list_memories(self, user_id: Optional[str] = None, space_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return self.list_captures(user_id=user_id, space_id=space_id)

    def update_memory(self, memory_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self.update_capture(memory_id, updates)

    def delete_memory(self, memory_id: str) -> bool:
        return self.delete_capture(memory_id)

    def link_space_capture(self, space_id: str, capture_id: str, relevance_score: float = 1.0):
        sid = str(space_id)
        cid = str(capture_id)
        # Check if already linked
        for sc in self.space_captures:
            if sc["space_id"] == sid and sc["capture_id"] == cid:
                return
        self.space_captures.append({
            "space_id": sid,
            "capture_id": cid,
            "relevance_score": relevance_score,
            "created_at": datetime.utcnow().isoformat()
        })
        # update space capture_count
        if sid in self.spaces:
            self.spaces[sid]["capture_count"] = len([sc for sc in self.space_captures if sc["space_id"] == sid])

    # ---------------- Capture Entities ----------------
    def add_capture_entity(self, capture_id: str, entity_text: str, normalized_name: str,
                           entity_type: str, embedding: Optional[List[float]] = None,
                           confidence: float = 1.0) -> Dict[str, Any]:
        ce_id = str(uuid4())
        entity = {
            "id": ce_id,
            "capture_id": str(capture_id),
            "entity_text": entity_text,
            "normalized_entity_name": normalized_name,
            "entity_type": entity_type,
            "embedding": embedding,
            "confidence": confidence,
            "created_at": datetime.utcnow().isoformat()
        }
        self.capture_entities[ce_id] = entity
        self._save_capture_entity_to_sqlite(entity)
        return entity

    def get_capture_entities(self, capture_id: str) -> List[Dict[str, Any]]:
        cid = str(capture_id)
        return [ce for ce in self.capture_entities.values() if ce["capture_id"] == cid]

    # ---------------- Resolved Entities ----------------
    def create_resolved_entity(self, space_id: str, canonical_name: str, entity_type: str,
                               representative_embedding: Optional[List[float]] = None,
                               source_count: int = 1) -> Dict[str, Any]:
        re_id = str(uuid4())
        re = {
            "id": re_id,
            "space_id": str(space_id),
            "canonical_name": canonical_name,
            "entity_type": entity_type,
            "aliases": [],
            "representative_embedding": representative_embedding,
            "source_count": source_count,
            "confidence": 1.0,
            "created_at": datetime.utcnow().isoformat()
        }
        self.resolved_entities[re_id] = re
        self._save_resolved_entity_to_sqlite(re)
        return re

    def link_entity_member(self, resolved_entity_id: str, capture_entity_id: str, similarity_score: float = 1.0):
        rid = str(resolved_entity_id)
        cid = str(capture_entity_id)
        for em in self.entity_members:
            if em["resolved_entity_id"] == rid and em["capture_entity_id"] == cid:
                return
        self.entity_members.append({
            "resolved_entity_id": rid,
            "capture_entity_id": cid,
            "similarity_score": similarity_score
        })
        # update source count on resolved entity
        if rid in self.resolved_entities:
            unique_captures = set()
            for em in self.entity_members:
                if em["resolved_entity_id"] == rid:
                    ce = self.capture_entities.get(em["capture_entity_id"])
                    if ce:
                        unique_captures.add(ce["capture_id"])
            self.resolved_entities[rid]["source_count"] = max(1, len(unique_captures))

    def list_resolved_entities(self, space_id: str) -> List[Dict[str, Any]]:
        sid = str(space_id)
        entities = [re for re in self.resolved_entities.values() if re["space_id"] == sid]
        results = []
        for re in entities:
            re_copy = dict(re)
            members = []
            for em in self.entity_members:
                if em["resolved_entity_id"] == re["id"]:
                    ce = self.capture_entities.get(em["capture_entity_id"])
                    if ce:
                        members.append({
                            "capture_entity_id": ce["id"],
                            "capture_id": ce["capture_id"],
                            "entity_text": ce["entity_text"],
                            "normalized_entity_name": ce["normalized_entity_name"],
                            "entity_type": ce["entity_type"],
                            "similarity_score": em["similarity_score"]
                        })
            re_copy["members"] = members
            results.append(re_copy)
        return results

    # ---------------- Contradictions ----------------
    def create_contradiction(self, space_id: str, capture_a_id: str, capture_b_id: str,
                             conflicting_field: str, description: str,
                             contradiction_type: str = "other", severity: str = "medium",
                             entity_id: Optional[str] = None, value_a: Optional[str] = None,
                             value_b: Optional[str] = None) -> Dict[str, Any]:
        cid = str(uuid4())
        contra = {
            "id": cid,
            "space_id": str(space_id),
            "capture_a_id": str(capture_a_id),
            "capture_b_id": str(capture_b_id),
            "entity_id": str(entity_id) if entity_id else None,
            "contradiction_type": contradiction_type,
            "conflicting_field": conflicting_field,
            "description": description,
            "severity": severity,
            "status": "active",
            "value_a": value_a,
            "value_b": value_b,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "resolved_at": None,
            "resolution_note": None
        }
        self.contradictions[cid] = contra
        self._save_contradiction_to_sqlite(contra)
        return contra

    def list_contradictions(self, space_id: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        items = list(self.contradictions.values())
        if space_id:
            items = [c for c in items if c.get("space_id") == str(space_id)]
        if status:
            items = [c for c in items if c.get("status") == status]
        
        # Populate source capture previews
        results = []
        for c in items:
            c_copy = dict(c)
            cap_a = self.captures.get(c.get("capture_a_id"))
            cap_b = self.captures.get(c.get("capture_b_id"))
            c_copy["source_a"] = cap_a
            c_copy["source_b"] = cap_b
            results.append(c_copy)
        return sorted(results, key=lambda x: x.get("created_at", ""), reverse=True)

    def resolve_contradiction(self, contradiction_id: str, status: str = "resolved", notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        cid = str(contradiction_id)
        contra = self.contradictions.get(cid)
        if not contra:
            return None
        contra["status"] = status
        contra["resolved_at"] = datetime.utcnow().isoformat()
        if notes:
            contra["resolution_notes"] = notes
        return contra

    # ---------------- Vector Similarity Search ----------------
    def search_captures(self, query_embedding: List[float], space_id: Optional[str] = None,
                        top_k: int = 5, min_score: float = 0.05, query_text: str = "") -> List[Dict[str, Any]]:
        candidates = self.list_captures(space_id=space_id)
        scored = []
        query_words = set((query_text or "").lower().split()) if query_text else set()
        
        for cap in candidates:
            emb = cap.get("embedding")
            content = (cap.get("normalized_content") or cap.get("original_content") or "").lower()
            title = (cap.get("title") or "").lower()
            
            if emb and query_embedding:
                score = cosine_similarity(query_embedding, emb)
            else:
                # Keyword-based fallback — always include if has content
                score = 0.3  # base score for any document
                if query_words:
                    match_count = sum(1 for w in query_words if len(w) > 2 and (w in content or w in title))
                    score = min(0.9, 0.3 + (match_count * 0.15))
                    
            if score >= min_score:
                cap_res = dict(cap)
                cap_res["relevance_score"] = round(score, 4)
                scored.append(cap_res)

        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:top_k]

    # ---------------- Metrics ----------------
    def log_retrieval_metric(self, naive_tokens: int, actual_tokens: int, reduction_pct: float):
        self.metrics_log.append({
            "naive_tokens": naive_tokens,
            "actual_tokens": actual_tokens,
            "reduction_pct": reduction_pct,
            "timestamp": datetime.utcnow().isoformat()
        })


def get_db():
    return LocalContextDB.get_instance()
