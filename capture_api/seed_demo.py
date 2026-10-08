#!/usr/bin/env python3
import asyncio
import os
import sys

# Ensure capture_api is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.demo_seeder import seed_goa_demo_data
from services.db import get_db

async def main():
    print("🌴 Seeding CAPTURE 'Trip to Goa' Demonstration Context...")
    space_id = await seed_goa_demo_data()
    db = get_db()
    space = db.get_space(space_id)
    captures = db.list_captures(space_id=space_id)
    entities = db.list_resolved_entities(space_id)
    contradictions = db.list_contradictions(space_id=space_id)

    print("\n✅ SEEDING COMPLETE!")
    print(f"Space ID: {space_id}")
    print(f"Space Name: {space.get('name')}")
    print(f"Summary: {space.get('summary')}\n")
    print(f"📁 Ingested Captures ({len(captures)}):")
    for c in captures:
        print(f"  - [{c.get('capture_type').upper()}] {c.get('title')}")

    print(f"\n👥 Resolved Entities ({len(entities)}):")
    for e in entities:
        print(f"  - {e.get('canonical_name')} ({e.get('entity_type')}) [Sources: {e.get('source_count')}]")

    print(f"\n⚠️ Active Contradictions ({len(contradictions)}):")
    for contra in contradictions:
        print(f"  - [{contra.get('severity').upper()}] {contra.get('conflicting_field')}: {contra.get('value_a')} vs {contra.get('value_b')}")
        print(f"    Explanation: {contra.get('description')}")

if __name__ == "__main__":
    asyncio.run(main())
