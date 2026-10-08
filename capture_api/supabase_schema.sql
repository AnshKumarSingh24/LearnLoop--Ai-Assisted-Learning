-- ============================================================
-- CAPTURE — CONTEXT INTELLIGENCE PLATFORM
-- Supabase PostgreSQL + pgvector Migration Schema
-- ============================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. SPACES
-- A Space represents a contextual environment (e.g. "Trip to Goa", "AUTONAV")
-- ============================================================
CREATE TABLE IF NOT EXISTS spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  capture_count INT DEFAULT 0,
  cover_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS spaces_user_idx ON spaces(user_id);

-- ============================================================
-- 3. CAPTURES
-- Every piece of captured information enters through this system
-- ============================================================
CREATE TABLE IF NOT EXISTS captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_content TEXT NOT NULL,
  normalized_content TEXT,
  capture_type TEXT NOT NULL CHECK (capture_type IN ('text', 'image', 'screenshot', 'voice', 'audio', 'pdf', 'document', 'link')),
  title TEXT,
  source_type TEXT DEFAULT 'manual',
  file_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(384),
  processing_status TEXT NOT NULL DEFAULT 'queued' CHECK (processing_status IN ('queued', 'processing', 'ready', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS captures_embedding_idx ON captures USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS captures_user_idx ON captures(user_id);
CREATE INDEX IF NOT EXISTS captures_status_idx ON captures(processing_status);
CREATE INDEX IF NOT EXISTS captures_metadata_gin ON captures USING gin(metadata);

-- ============================================================
-- 4. SPACE_CAPTURES (Many-to-many relationship)
-- ============================================================
CREATE TABLE IF NOT EXISTS space_captures (
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  capture_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (space_id, capture_id)
);

CREATE INDEX IF NOT EXISTS space_captures_space_idx ON space_captures(space_id);
CREATE INDEX IF NOT EXISTS space_captures_capture_idx ON space_captures(capture_id);

-- ============================================================
-- 5. CAPTURE_ENTITIES
-- Extracted entity mentions from captures
-- ============================================================
CREATE TABLE IF NOT EXISTS capture_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  entity_text TEXT NOT NULL,
  normalized_entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('person', 'project', 'organization', 'task', 'decision', 'date', 'location', 'requirement', 'event', 'other')),
  embedding vector(384),
  confidence FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS capture_entities_capture_idx ON capture_entities(capture_id);
CREATE INDEX IF NOT EXISTS capture_entities_embedding_idx ON capture_entities USING hnsw (embedding vector_cosine_ops);

-- ============================================================
-- 6. RESOLVED_ENTITIES
-- Entities determined to refer to the same underlying concept within a Space
-- ============================================================
CREATE TABLE IF NOT EXISTS resolved_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  canonical_name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  representative_embedding vector(384),
  source_count INT DEFAULT 1,
  confidence FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS resolved_entities_space_idx ON resolved_entities(space_id);
CREATE INDEX IF NOT EXISTS resolved_entities_embedding_idx ON resolved_entities USING hnsw (embedding vector_cosine_ops);

-- ============================================================
-- 7. ENTITY_MEMBERS
-- Links individual extracted entity mentions to a resolved entity
-- ============================================================
CREATE TABLE IF NOT EXISTS entity_members (
  resolved_entity_id UUID NOT NULL REFERENCES resolved_entities(id) ON DELETE CASCADE,
  capture_entity_id UUID NOT NULL REFERENCES capture_entities(id) ON DELETE CASCADE,
  similarity_score FLOAT DEFAULT 1.0,
  PRIMARY KEY (resolved_entity_id, capture_entity_id)
);

CREATE INDEX IF NOT EXISTS entity_members_resolved_idx ON entity_members(resolved_entity_id);
CREATE INDEX IF NOT EXISTS entity_members_capture_entity_idx ON entity_members(capture_entity_id);

-- ============================================================
-- 8. CONTRADICTIONS
-- Detected factual conflicts and disagreements across captures
-- ============================================================
CREATE TABLE IF NOT EXISTS contradictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  capture_a_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  capture_b_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES resolved_entities(id) ON DELETE SET NULL,
  contradiction_type TEXT NOT NULL CHECK (contradiction_type IN ('conflicting_date', 'conflicting_requirement', 'superseded_decision', 'conflicting_assignment', 'conflicting_location', 'other')),
  conflicting_field TEXT NOT NULL,
  description TEXT NOT NULL,
  value_a TEXT,
  value_b TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS contradictions_space_idx ON contradictions(space_id);
CREATE INDEX IF NOT EXISTS contradictions_status_idx ON contradictions(status);

-- ============================================================
-- VECTOR RETRIEVAL RPC: match_captures
-- ============================================================
CREATE OR REPLACE FUNCTION match_captures (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_space_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  original_content text,
  normalized_content text,
  capture_type text,
  relevance_score float,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF filter_space_id IS NOT NULL THEN
    RETURN QUERY
    SELECT
      c.id,
      c.title,
      c.original_content,
      c.normalized_content,
      c.capture_type,
      1 - (c.embedding <=> query_embedding) AS relevance_score,
      c.created_at
    FROM captures c
    JOIN space_captures sc ON c.id = sc.capture_id
    WHERE sc.space_id = filter_space_id
      AND 1 - (c.embedding <=> query_embedding) > match_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
  ELSE
    RETURN QUERY
    SELECT
      c.id,
      c.title,
      c.original_content,
      c.normalized_content,
      c.capture_type,
      1 - (c.embedding <=> query_embedding) AS relevance_score,
      c.created_at
    FROM captures c
    WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
  END IF;
END;
$$;
