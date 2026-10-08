#!/usr/bin/env python3
"""
bulk_import_dataset.py
----------------------
Imports the first 1205 records from the synthetic corpus JSONL dataset
into the Darwinity capture_api's LocalContextDB (which powers semantic search,
the AI companion, and entity graphs in the main app).

Run from the repo root:
    python3 scripts/bulk_import_dataset.py

Or specify a limit:
    python3 scripts/bulk_import_dataset.py --limit 200
"""

import sys
import os
import json
import argparse
import sqlite3
from datetime import datetime
from pathlib import Path
from uuid import uuid4
import hashlib
import math

# ------------------------------------------------------------------
# Setup paths so we can import the capture_api services
# ------------------------------------------------------------------
REPO_ROOT = Path(__file__).parent.parent
DATASET_PATH = REPO_ROOT / "datasets" / "capture_synthetic_corpus_5000.jsonl"
DB_PATH = REPO_ROOT / "capture_data.db"


# ------------------------------------------------------------------
# Minimal embed fallback (mirrors services/embeddings.py)
# ------------------------------------------------------------------
def _fallback_embedding(text: str, dim: int = 384):
    vec = [0.0] * dim
    words = text.lower().split()
    if not words:
        return vec
    for i, word in enumerate(words):
        h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        vec[idx] += 1.0 / (math.log(i + 2))
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec


# ------------------------------------------------------------------
# Try to use FastEmbed if installed, else fall back
# ------------------------------------------------------------------
try:
    from fastembed import TextEmbedding
    _model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    def generate_embedding(text: str):
        embs = list(_model.embed([text]))
        return embs[0].tolist() if embs else _fallback_embedding(text)
    print("✅ FastEmbed model loaded for neural embeddings.")
except Exception as e:
    print(f"⚠️  FastEmbed not available ({e}). Using fallback hash embeddings.")
    def generate_embedding(text: str):
        return _fallback_embedding(text)


# ------------------------------------------------------------------
# Direct SQLite ingestion (avoids importing full FastAPI stack)
# ------------------------------------------------------------------
def init_db(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path, timeout=30)
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA foreign_keys = ON")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS spaces (id TEXT PRIMARY KEY, data TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS captures (id TEXT PRIMARY KEY, data TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS capture_entities (id TEXT PRIMARY KEY, data TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS resolved_entities (id TEXT PRIMARY KEY, data TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS contradictions (id TEXT PRIMARY KEY, data TEXT)''')
    conn.commit()
    return conn


AUTHORITY_MAP = {
    "pdf_document": 0.95,
    "document": 0.90,
    "screenshot": 0.85,
    "image": 0.80,
    "voice_memo": 0.65,
    "audio": 0.65,
    "slack_chat": 0.55,
    "text": 0.50,
    "link": 0.60,
}


def ingest_record(conn: sqlite3.Connection, record: dict, demo_user_id: str) -> str:
    """Insert one JSONL record as a Capture into the DB."""
    content = record.get("content", "")
    source_type = record.get("source_type", "text")
    meta = record.get("metadata", {})
    entities_list = record.get("ground_truth_entities", [])
    timestamp = record.get("timestamp", datetime.utcnow().isoformat())

    capture_id = str(uuid4())
    authority_weight = AUTHORITY_MAP.get(source_type, 0.70)
    title = content[:60] + ("..." if len(content) > 60 else "")
    embedding = generate_embedding(content)

    capture = {
        "id": capture_id,
        "user_id": demo_user_id,
        "original_content": content,
        "normalized_content": content,
        "capture_type": "text",
        "title": title,
        "source_type": source_type,
        "file_url": None,
        "metadata": meta,
        "embedding": embedding,
        "authority_weight": authority_weight,
        "processing_status": "processed",
        "created_at": timestamp,
        "processed_at": timestamp,
        "space_ids": []
    }

    c = conn.cursor()
    c.execute(
        "INSERT OR IGNORE INTO captures (id, data) VALUES (?, ?)",
        (capture_id, json.dumps(capture))
    )

    # Insert ground-truth entities
    for ent_text in entities_list:
        ent_id = str(uuid4())
        entity = {
            "id": ent_id,
            "capture_id": capture_id,
            "entity_text": ent_text,
            "normalized_entity_name": ent_text.lower().strip(),
            "entity_type": "unknown",
            "confidence": 0.95,
            "embedding": None,
        }
        c.execute(
            "INSERT OR IGNORE INTO capture_entities (id, data) VALUES (?, ?)",
            (ent_id, json.dumps(entity))
        )

    return capture_id


def main():
    parser = argparse.ArgumentParser(description="Bulk import dataset into Darwinity.")
    parser.add_argument("--limit", type=int, default=1205, help="Number of records to import (default: 1205)")
    parser.add_argument("--skip-existing", action="store_true", help="Skip if already imported")
    args = parser.parse_args()

    if not DATASET_PATH.exists():
        print(f"❌ Dataset not found at {DATASET_PATH}")
        sys.exit(1)

    print(f"📂 Dataset: {DATASET_PATH}")
    print(f"🗃️  Database: {DB_PATH}")
    print(f"📥 Importing up to {args.limit} records...")
    print()

    conn = init_db(str(DB_PATH))
    demo_user_id = "00000000-0000-0000-0000-000000000000"

    # Count existing captures to avoid duplicates if re-running
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM captures")
    existing_count = c.fetchone()[0]
    print(f"📊 Existing captures in DB: {existing_count}")

    if args.skip_existing and existing_count >= args.limit:
        print("✅ Already have enough records, skipping import.")
        conn.close()
        return

    imported = 0
    failed = 0
    batch_size = 50

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            if imported >= args.limit:
                break

            line = line.strip()
            if not line:
                continue

            try:
                record = json.loads(line)
                ingest_record(conn, record, demo_user_id)
                imported += 1

                if imported % batch_size == 0:
                    conn.commit()
                    print(f"  ✅ Imported {imported}/{args.limit} records...", flush=True)

            except Exception as e:
                failed += 1
                print(f"  ⚠️  Line {line_num+1} failed: {e}")

    conn.commit()
    conn.close()

    print()
    print(f"🎉 Done! Imported {imported} captures. Failed: {failed}.")
    print(f"🔍 The app's semantic search and AI Companion now have {existing_count + imported} total captures to query from.")


if __name__ == "__main__":
    main()
