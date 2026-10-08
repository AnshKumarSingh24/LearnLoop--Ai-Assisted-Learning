#!/usr/bin/env python3
import asyncio
import os
import sys
import json

# Ensure capture_api is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.db import get_db

async def main():
    print("🌴 Seeding CAPTURE 1200+ Kaggle/Mock Data...")
    db = get_db()
    
    # Create a generic space if needed
    space = db.create_space(
        user_id="demo_user",
        name="Synced Workspace",
        description="A workspace containing a large volume of synced external data."
    )
    space_id = space["id"]
    
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "capture_vanilla", "dataset_1200.json")
    if not os.path.exists(json_path):
        print(f"Dataset not found at {json_path}")
        return

    with open(json_path, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} items from dataset_1200.json. Inserting...")
    
    for item in data:
        # Create Capture
        capture = db.create_capture(
            user_id="demo_user",
            original_content=item.get("content", ""),
            capture_type=item.get("source", "doc"),
            title=item.get("title", ""),
            source_type="manual",
            space_ids=[space_id],
            metadata={"status": item.get("status", "ready"), "date": item.get("date", ""), "summary": item.get("summary", "")}
        )
        
        # Add Entities directly as capture entities
        entities = item.get("entities", [])
        for ent in entities:
            # Strip leading @ if present
            clean_ent = ent.lstrip("@").strip()
            db.add_capture_entity(
                capture_id=capture["id"],
                entity_text=clean_ent,
                normalized_name=clean_ent,
                entity_type="other"
            )

    print("\n✅ KAGGLE DATA SEEDING COMPLETE!")
    print(f"Space ID: {space_id}")
    print(f"Total Captures in DB: {len(db.list_captures(space_id=space_id))}")

if __name__ == "__main__":
    asyncio.run(main())
