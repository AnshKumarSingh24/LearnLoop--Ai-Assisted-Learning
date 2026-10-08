import asyncio
from uuid import uuid4
from datetime import datetime
from services.db import get_db
from services.embeddings import generate_embedding
from services.summary_service import update_space_summary_if_needed

DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

async def seed_goa_demo_data() -> str:
    """
    Seeds the standard Context Intelligence demonstration:
    Space: "Trip to Goa"
    Captures:
      1. Flight Confirmation PDF (Oct 12)
      2. WhatsApp Screenshot (Oct 13)
      3. Voice Memo from Priya (Oct 13)
      4. Hotel & Budget Note
    Resolves entities (Priya / Priya Sharma, Goa, Sea Breeze Resort).
    Flags the active contradiction: October 12 vs October 13 departure date.
    """
    db = get_db()
    
    # 1. Create Space
    space = db.create_space(
        user_id=DEMO_USER_ID,
        name="Trip to Goa",
        description="Collaborative travel plan, flight details, hotel bookings, and budget for Goa vacation.",
        cover_metadata={"color": "#6366f1", "icon": "plane", "last_summarized_count": 4}
    )
    space_id = space["id"]

    # 2. Add Ingestion 1: Flight Confirmation PDF
    content_pdf = """Flight Booking Confirmation
Airline: Air India Flight AI-872
Passenger: Rahul Varma, Priya Sharma, Amit Patel
Departure: New Delhi (DEL) to Goa Dabolim (GOI)
Date of Departure: October 12, 2026 at 06:45 AM
Booking Reference: PNR-AI88294
Status: Confirmed & Paid"""
    emb_pdf = generate_embedding(content_pdf)
    cap_pdf = db.create_capture(
        user_id=DEMO_USER_ID,
        original_content=content_pdf,
        capture_type="pdf",
        title="Flight Confirmation PDF — Air India AI-872",
        source_type="document",
        file_url="https://capture.internal/files/goa_flight_confirmation.pdf",
        space_ids=[space_id],
        embedding=emb_pdf,
        metadata={"pnr": "PNR-AI88294", "airline": "Air India", "file_name": "flight_confirmation.pdf"}
    )
    db.update_capture(cap_pdf["id"], {
        "processing_status": "ready",
        "normalized_content": content_pdf,
        "processed_at": datetime.utcnow().isoformat()
    })

    # 3. Add Ingestion 2: WhatsApp Screenshot
    content_screenshot = """WhatsApp Group Chat Screenshot — 'Goa Trip 2026'
Priya S.: Hey guys, remember we rescheduled our flight departure to October 13 because Amit has an exam on the 12th!
Amit Patel: Yes, flight is definitely on Oct 13 now.
Rahul: Got it, updated my calendar for Oct 13."""
    emb_screenshot = generate_embedding(content_screenshot)
    cap_screenshot = db.create_capture(
        user_id=DEMO_USER_ID,
        original_content=content_screenshot,
        capture_type="screenshot",
        title="WhatsApp Screenshot — Flight Reschedule Note",
        source_type="chat",
        file_url="https://capture.internal/files/whatsapp_reschedule_chat.png",
        space_ids=[space_id],
        embedding=emb_screenshot,
        metadata={"platform": "WhatsApp", "chat_group": "Goa Trip 2026"}
    )
    db.update_capture(cap_screenshot["id"], {
        "processing_status": "ready",
        "normalized_content": content_screenshot,
        "processed_at": datetime.utcnow().isoformat()
    })

    # 4. Add Ingestion 3: Voice Memo
    content_voice = """Voice Memo Transcription (Audio-094.m4a):
"Hey Rahul, this is Priya. Just leaving a quick voice memo to confirm that we are leaving on October 13th morning. Don't look at the old PDF ticket from last month since we moved it by one day. See you at terminal 3!"""
    emb_voice = generate_embedding(content_voice)
    cap_voice = db.create_capture(
        user_id=DEMO_USER_ID,
        original_content=content_voice,
        capture_type="voice",
        title="Voice Memo from Priya — Departure Clarification",
        source_type="voice",
        file_url="https://capture.internal/files/voice_memo_priya.m4a",
        space_ids=[space_id],
        embedding=emb_voice,
        metadata={"duration_seconds": 18, "speaker": "Priya Sharma"}
    )
    db.update_capture(cap_voice["id"], {
        "processing_status": "ready",
        "normalized_content": content_voice,
        "processed_at": datetime.utcnow().isoformat()
    })

    # 5. Add Ingestion 4: Hotel & Budget Note
    content_budget = """Goa Accommodations & Budget Target:
Resort: Sea Breeze Resort, Calangute Beach
Check-in: October 13, 2026
Check-out: October 18, 2026
Total Accommodation: ₹42,000 (~$500)
Total Trip Budget Target: ₹75,000 (~$900) split between 3 people.
Status: Advance ₹10,000 paid by Rahul."""
    emb_budget = generate_embedding(content_budget)
    cap_budget = db.create_capture(
        user_id=DEMO_USER_ID,
        original_content=content_budget,
        capture_type="text",
        title="Hotel Reservation & Budget Target",
        source_type="manual",
        space_ids=[space_id],
        embedding=emb_budget,
        metadata={"resort": "Sea Breeze Resort", "budget_target": "₹75,000"}
    )
    db.update_capture(cap_budget["id"], {
        "processing_status": "ready",
        "normalized_content": content_budget,
        "processed_at": datetime.utcnow().isoformat()
    })

    # 6. Extract & Link Entities
    # Entity: Priya Sharma (Resolved from "Priya Sharma", "Priya S.", "Priya")
    ce_p1 = db.add_capture_entity(cap_pdf["id"], "Priya Sharma", "Priya Sharma", "person", generate_embedding("Priya Sharma"), 0.98)
    ce_p2 = db.add_capture_entity(cap_screenshot["id"], "Priya S.", "Priya S.", "person", generate_embedding("Priya S."), 0.92)
    ce_p3 = db.add_capture_entity(cap_voice["id"], "Priya", "Priya", "person", generate_embedding("Priya"), 0.90)

    re_priya = db.create_resolved_entity(space_id, "Priya Sharma", "person", generate_embedding("Priya Sharma"), 3)
    db.link_entity_member(re_priya["id"], ce_p1["id"], 1.0)
    db.link_entity_member(re_priya["id"], ce_p2["id"], 0.94)
    db.link_entity_member(re_priya["id"], ce_p3["id"], 0.88)

    # Entity: Goa (Location)
    ce_g1 = db.add_capture_entity(cap_pdf["id"], "Goa Dabolim", "Goa", "location", generate_embedding("Goa"), 0.95)
    ce_g2 = db.add_capture_entity(cap_budget["id"], "Calangute Beach, Goa", "Goa", "location", generate_embedding("Goa"), 0.95)
    re_goa = db.create_resolved_entity(space_id, "Goa", "location", generate_embedding("Goa"), 4)
    db.link_entity_member(re_goa["id"], ce_g1["id"], 1.0)
    db.link_entity_member(re_goa["id"], ce_g2["id"], 0.96)

    # Entity: Sea Breeze Resort (Organization/Hotel)
    ce_h1 = db.add_capture_entity(cap_budget["id"], "Sea Breeze Resort", "Sea Breeze Resort", "organization", generate_embedding("Sea Breeze Resort"), 0.98)
    re_hotel = db.create_resolved_entity(space_id, "Sea Breeze Resort", "organization", generate_embedding("Sea Breeze Resort"), 1)
    db.link_entity_member(re_hotel["id"], ce_h1["id"], 1.0)

    # Entity: Air India AI-872 (Project/Flight)
    ce_f1 = db.add_capture_entity(cap_pdf["id"], "Air India Flight AI-872", "Air India AI-872", "project", generate_embedding("Air India AI-872"), 0.95)
    re_flight = db.create_resolved_entity(space_id, "Air India AI-872", "project", generate_embedding("Air India AI-872"), 1)
    db.link_entity_member(re_flight["id"], ce_f1["id"], 1.0)

    # 7. Create Active Contradiction: Departure Date (Oct 12 vs Oct 13)
    db.create_contradiction(
        space_id=space_id,
        capture_a_id=cap_pdf["id"],
        capture_b_id=cap_screenshot["id"],
        conflicting_field="Flight Departure Date",
        description="Flight confirmation ticket lists October 12, whereas WhatsApp chat and voice memo specify October 13 due to rescheduling.",
        contradiction_type="conflicting_date",
        severity="high",
        value_a="October 12, 2026 (06:45 AM)",
        value_b="October 13, 2026"
    )

    # 8. Set Space Summary
    db.update_space(space_id, {
        "summary": "Planning information for a Goa trip involving three people (Rahul, Priya, Amit), two conflicting departure dates (Oct 12 vs Oct 13), Sea Breeze Resort reservation, and ₹75,000 budget target.",
        "capture_count": 4
    })

    # 9. Run Entity Resolution across all captures in this space
    from services.entity_resolution_service import resolve_space_entities
    await resolve_space_entities(space_id)

    return space_id
