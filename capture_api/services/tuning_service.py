"""
Closed-Loop Tuning & Reinforcement Learning Queue.
Records feedback on assembled context packs and dynamically tunes source authority weights,
enabling Capture to continuously optimize the Minimum Sufficient Context over time.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime

try:
    from services.db import get_db
except ImportError:
    from capture_api.services.db import get_db

class TuningService:
    _instance = None

    def __init__(self):
        self.db = get_db()
        self.tuning_ledger: List[Dict[str, Any]] = []

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = TuningService()
        return cls._instance

    def record_feedback(
        self,
        goal: str,
        capture_id: str,
        was_helpful: bool,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Closed-loop parameter tuning:
        Boosts or demotes source authority weights based on real task efficacy.
        """
        cap = self.db.get_capture(capture_id)
        prev_weight = cap.get("authority_weight", 0.75) if cap else 0.75
        
        # Adaptive weight update (delta = +/- 0.08, clamped between 0.1 and 1.0)
        delta = 0.08 if was_helpful else -0.08
        new_weight = round(max(0.1, min(1.0, prev_weight + delta)), 3)

        if cap:
            cap["authority_weight"] = new_weight

        entry = {
            "id": f"tune_{len(self.tuning_ledger) + 1}",
            "goal": goal,
            "capture_id": capture_id,
            "was_helpful": was_helpful,
            "notes": notes,
            "prev_weight": prev_weight,
            "new_weight": new_weight,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.tuning_ledger.append(entry)

        return {
            "status": "APPLIED",
            "capture_id": capture_id,
            "previous_authority": prev_weight,
            "updated_authority": new_weight,
            "total_tuning_events": len(self.tuning_ledger)
        }

    def get_tuning_metrics(self) -> Dict[str, Any]:
        """Returns overall closed-loop learning statistics."""
        if not self.tuning_ledger:
            return {"total_feedback_events": 0, "positive_rate": "100%", "learning_active": True}

        positives = sum(1 for e in self.tuning_ledger if e["was_helpful"])
        total = len(self.tuning_ledger)
        rate = round((positives / total) * 100, 1)

        return {
            "total_feedback_events": total,
            "positive_rate": f"{rate}%",
            "tuned_captures_count": len(set(e["capture_id"] for e in self.tuning_ledger)),
            "recent_events": self.tuning_ledger[-5:]
        }
