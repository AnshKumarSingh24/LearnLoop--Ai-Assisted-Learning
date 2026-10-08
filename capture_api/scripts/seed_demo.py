import sys
import os
from datetime import datetime
from uuid import uuid4

# Add the root directory to path to allow imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.db import LocalContextDB

def seed_demo_data():
    print("Seeding perfect demo dataset for Hackathon...")
    db = LocalContextDB.get_instance()

    user_id = "00000000-0000-0000-0000-000000000000"
    
    # 1. Create Space
    space = db.create_space(user_id=user_id, name="Hackathon Demo: Flight Logistics")
    space_id = space["id"]
    print(f"Created Space: {space['name']} (ID: {space_id})")

    # 2. Ingest conflicting documents
    pdf_text = "Flight AI-842 to Paris departs on October 12 at 08:00 AM."
    chat_text = "Hey guys, quick update. The Paris flight (AI-842) was moved to October 13 due to weather."
    handwritten_text = "AI flight confirmation pending. Need to check the Paris date."

    cap1 = db.create_capture(user_id=user_id, original_content=pdf_text, capture_type="pdf", 
                             source_type="file", space_ids=[space_id], title="Flight Itinerary (PDF)")
    
    cap2 = db.create_capture(user_id=user_id, original_content=chat_text, capture_type="text", 
                             source_type="slack", space_ids=[space_id], title="Slack Message (Logistics Channel)")
                             
    cap3 = db.create_capture(user_id=user_id, original_content=handwritten_text, capture_type="image", 
                             source_type="manual_note", space_ids=[space_id], title="Handwritten Note")

    # 3. Create Capture Entities (Flight AI-842)
    ce1 = db.add_capture_entity(cap1["id"], "Flight AI-842", "AI-842", "FLIGHT")
    ce2 = db.add_capture_entity(cap2["id"], "Paris flight (AI-842)", "AI-842", "FLIGHT")
    ce3 = db.add_capture_entity(cap3["id"], "AI flight", "AI-842", "FLIGHT")

    # 4. Resolve Entities
    re = db.create_resolved_entity(space_id, canonical_name="Air India Flight 842", entity_type="FLIGHT", source_count=3)
    db.link_entity_member(re["id"], ce1["id"])
    db.link_entity_member(re["id"], ce2["id"])
    db.link_entity_member(re["id"], ce3["id"])
    
    print(f"Created and resolved entity: Air India Flight 842 across 3 disjointed sources.")

    # 5. Create Contradiction (The core demo feature)
    contra = db.create_contradiction(
        space_id=space_id,
        capture_a_id=cap1["id"],
        capture_b_id=cap2["id"],
        entity_id=re["id"],
        conflicting_field="Departure Date",
        description="The PDF itinerary states the flight departs on Oct 12, but a later Slack message says it was moved to Oct 13.",
        contradiction_type="temporal_update",
        severity="high",
        value_a="October 12",
        value_b="October 13"
    )
    print(f"Injected Contradiction: {contra['description']}")
    
    print("Seed complete! The application is now ready for a flawless live demo.")

if __name__ == "__main__":
    seed_demo_data()
