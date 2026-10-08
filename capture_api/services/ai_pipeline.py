import os
import json
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from core.config import settings

# Initialize Groq client
try:
    from groq import AsyncGroq
    GROQ_AVAILABLE = True
except ImportError:
    AsyncGroq = None
    GROQ_AVAILABLE = False


def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY") or settings.GROQ_API_KEY
    if not api_key or not GROQ_AVAILABLE:
        return None
    return AsyncGroq(api_key=api_key)


async def _call_groq_with_fallback(client, messages, response_format=None, temperature=0.1, max_tokens=1000):
    candidate_models = [
        "llama-3.1-8b-instant",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        settings.GROQ_MODEL
    ]
    # Deduplicate while preserving order
    seen = set()
    models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

    last_err = None
    for model in models_to_try:
        try:
            kwargs = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            if response_format:
                kwargs["response_format"] = response_format
            return await client.chat.completions.create(**kwargs)
        except Exception as e:
            last_err = e
            continue
    if last_err:
        raise last_err


class ExtractedEntity(BaseModel):
    canonical_name: str
    aliases: List[str] = []
    entity_type: str = "other"
    confidence: float = 1.0


class DetectedContradiction(BaseModel):
    contradiction: bool = True
    conflicting_entity: str = ""
    conflicting_field: str = ""
    value_a: str = ""
    value_b: str = ""
    explanation: str = ""
    confidence: float = 0.9
    severity: str = "medium"  # low, medium, high, critical


async def cleanse_and_normalize_text(raw_text: str) -> str:
    """
    Cleanses noise, conversational chatter, and informal artifacts
    while preserving facts, numbers, dates, decisions, and entities.
    """
    if not raw_text:
        return ""

    client = get_groq_client()
    if not client:
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        cleaned = " ".join(lines)
        return re.sub(r'\s+', ' ', cleaned).strip()

    prompt = f"""You are a Context Intelligence text normalizer.
Clean and normalize the following unstructured capture text into clear, factual, searchable markdown/text.
Preserve all factual details, names, dates, numbers, requirements, and decisions. Remove only conversational filler and formatting glitches.

Raw Content:
\"\"\"{raw_text}\"\"\"

Output ONLY the normalized content:"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=1000
        )
        return (response.choices[0].message.content or raw_text).strip()
    except Exception as e:
        print(f"Normalization fallback: {e}")
        return raw_text.strip()


async def generate_tags_and_summary_from_text(content: str) -> Dict[str, Any]:
    """Generates a brief summary and relevant tags for a document/capture for semantic search."""
    if not content:
        return {"summary": "", "tags": []}
        
    client = get_groq_client()
    if not client:
        return {"summary": content[:150] + "...", "tags": ["captured", "note"]}
        
    prompt = f"""You are a Context Intelligence classifier.
Analyze the following text and provide a concise summary (1-2 sentences) and a list of 3-7 highly relevant tags for semantic search.

Text:
\"\"\"{content[:4000]}\"\"\"

Respond ONLY with valid JSON in this structure:
{{
  "summary": "Brief 1-2 sentence summary of the core content",
  "tags": ["tag1", "tag2", "tag3"]
}}"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        return {
            "summary": data.get("summary", ""),
            "tags": data.get("tags", [])
        }
    except Exception as e:
        print(f"Tags & Synthesis extraction error: {e}")
        return {"summary": content[:150] + "...", "tags": ["captured"]}


async def extract_entities_from_text(content: str) -> List[ExtractedEntity]:
    """
    Extracts structured entities: person, project, organization, task, decision, date, location, requirement, event.
    """
    if not content:
        return []

    client = get_groq_client()
    if not client:
        entities = []
        dates = re.findall(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?|\b\d{1,2}/\d{1,2}/\d{2,4}\b', content, re.IGNORECASE)
        for d in dates:
            entities.append(ExtractedEntity(canonical_name=d, aliases=[d], entity_type="date", confidence=0.9))

        amounts = re.findall(r'[\$₹€£]\s*[\d,]+(?:\.\d{2})?', content)
        for a in amounts:
            entities.append(ExtractedEntity(canonical_name=a, aliases=[a], entity_type="amount", confidence=0.9))

        words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', content)
        for w in set(words):
            if len(w) > 3 and w.lower() not in ["the", "this", "that", "there", "flight", "hotel", "travel", "project", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]:
                t = "person" if any(p in content.lower() for p in ["said", "told", "met", "by", "with"]) else "project"
                entities.append(ExtractedEntity(canonical_name=w, aliases=[w.lower()], entity_type=t, confidence=0.8))
        return entities

    prompt = f"""You are an Entity Extraction and Resolution Engine for Context Intelligence.
Extract all meaningful entities from this capture:
Entity Types: 'person', 'project', 'organization', 'task', 'decision', 'date', 'location', 'requirement', 'event'.

For each entity provide:
1. canonical_name (standardized name)
2. aliases (alternative mentions/spellings)
3. entity_type
4. confidence (0.0 to 1.0)

Text:
\"\"\"{content}\"\"\"

Respond ONLY with valid JSON in this exact structure:
{{
  "entities": [
    {{
      "canonical_name": "Priya Sharma",
      "aliases": ["Priya", "Priya S."],
      "entity_type": "person",
      "confidence": 0.95
    }}
  ]
}}"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        items = data.get("entities", [])
        return [ExtractedEntity(**item) for item in items if isinstance(item, dict) and "canonical_name" in item]
    except Exception as e:
        print(f"Entity extraction error: {e}")
        return []


async def detect_contradictions_llm(
    new_capture_title: str,
    new_capture_content: str,
    existing_captures: List[Dict[str, Any]]
) -> List[DetectedContradiction]:
    """
    Evaluates whether a new piece of information contradicts existing context.
    """
    if not existing_captures:
        return []

    client = get_groq_client()
    if not client:
        contradictions = []
        for ex in existing_captures:
            ex_text = ex.get("normalized_content") or ex.get("original_content") or ""
            dates_new = set(re.findall(r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+', new_capture_content, re.IGNORECASE))
            dates_ex = set(re.findall(r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+', ex_text, re.IGNORECASE))
            if dates_new and dates_ex and dates_new != dates_ex:
                contradictions.append(DetectedContradiction(
                    contradiction=True,
                    conflicting_entity="Date Reference",
                    conflicting_field="Date",
                    value_a=list(dates_new)[0],
                    value_b=list(dates_ex)[0],
                    explanation=f"New capture specifies {list(dates_new)[0]} while existing capture '{ex.get('title')}' specifies {list(dates_ex)[0]}",
                    confidence=0.92,
                    severity="high"
                ))
        return contradictions

    existing_context_str = "\n\n".join([
        f"--- Source ID: {c.get('id')} | Title: {c.get('title', 'Document')} ---\n{c.get('normalized_content') or c.get('original_content')}"
        for c in existing_captures[:5]
    ])

    prompt = f"""You are a Contradiction and Conflict Detection Engine for a Context Intelligence system.
Determine whether the NEW CAPTURE contains any direct factual disagreement, conflicting dates, contradictory decisions, or opposing requirements compared to the EXISTING CAPTURES.

NEW CAPTURE:
Title: {new_capture_title}
Content:
\"\"\"{new_capture_content}\"\"\"

EXISTING CAPTURES IN THIS CONTEXT:
{existing_context_str}

Respond ONLY with a JSON object:
{{
  "contradictions": [
    {{
      "contradiction": true,
      "conflicting_entity": "Name of subject",
      "conflicting_field": "Field name",
      "value_a": "Value in new capture",
      "value_b": "Value in existing capture",
      "explanation": "Brief explanation of the conflict",
      "severity": "high"
    }}
  ]
}}"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(response.choices[0].message.content)
        items = data.get("contradictions", [])
        return [DetectedContradiction(**item) for item in items if isinstance(item, dict) and item.get("contradiction")]
    except Exception as e:
        print(f"Contradiction detection LLM error: {e}")
        return []


async def synthesize_grounded_answer(
    query: str,
    context_chunks: Optional[List[Dict[str, Any]]] = None,
    context_sources: Optional[List[Dict[str, Any]]] = None,
    active_contradictions: Optional[List[Dict[str, Any]]] = None,
    contradictions: Optional[List[Dict[str, Any]]] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Answers user queries grounded strictly in retrieved context.
    """
    sources_list = context_chunks or context_sources or []
    contras_list = active_contradictions or contradictions or []
    client = get_groq_client()
    sources_text = ""
    if sources_list:
        sources_text = "\n\n".join([
            f"[{i+1}] {s.get('capture_type', 'text').upper()} — {s.get('title', 'Document')}:\n{(s.get('normalized_content') or s.get('original_content') or '')[:1500]}"
            for i, s in enumerate(sources_list)
        ])
    
    contradictions_text = ""
    if contras_list:
        contradictions_text = "\n\nCONFLICTING INFO DETECTED IN YOUR NOTES:\n" + "\n".join([
            f"- {c.get('conflicting_field')}: '{c.get('value_a')}' vs '{c.get('value_b')}' — {c.get('description') or c.get('explanation', '')}"
            for c in contras_list
        ])

    if not client:
        ans = "Based on your captured materials:\n"
        for i, s in enumerate(sources_list):
            ans += f"[{i+1}] {s.get('title', 'Document')}: {(s.get('normalized_content') or s.get('original_content') or '')[:200]}...\n"
        if not sources_list:
            ans = "I don't have any of your uploaded materials in my context yet. Please upload some PDFs or notes first, then ask me questions about them!"
        return {
            "answer": ans,
            "why_sources": f"Found {len(sources_list)} relevant sources."
        }

    has_context = bool(sources_list)
    context_section = f"YOUR UPLOADED KNOWLEDGE:\n{sources_text}" if has_context else "No uploaded materials found yet."
    
    prompt = f"""You are Darwin — an intelligent AI study companion that helps students learn from their own uploaded materials.

{context_section}
{contradictions_text}

INSTRUCTIONS:
- If the student's uploaded materials (above) answer the question, use them as your primary source and cite with [1], [2] etc.
- If the materials are relevant but incomplete, supplement with your own knowledge and clearly say "Based on your notes plus my knowledge:..."
- If the question is about something not in their materials at all, answer from your own knowledge as a helpful tutor — never say "sources don't contain this info".
- NEVER reference Flight AI-842, Paris dates, or any information not asked about.
- Be concise, friendly, and educational.
- If they ask "what do I have", "what did I upload", or "what materials do I have" — list their uploaded files/documents from the context above.

Student Question: {query}

Output a JSON object:
{{
  "answer": "Your helpful response here (cite [1] [2] if using their uploaded docs)",
  "why_sources": "Brief note on what context was used"
}}"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Answer synthesis error: {e}")
        if sources_list:
            ans = f"Based on your uploaded materials:\n"
            for i, s in enumerate(sources_list[:3]):
                content = (s.get("normalized_content") or s.get("original_content") or "")[:300]
                ans += f"\n**{s.get('title', 'Document')}**: {content}..."
        else:
            ans = "I couldn't find specific materials about that in your uploads. Try uploading relevant PDFs or notes first!"
        return {
            "answer": ans,
            "why_sources": f"Used {len(sources_list)} documents from your library."
        }


def check_dangling_references(
    text: str,
    valid_entity_names: List[str],
    valid_filenames: List[str],
) -> List[str]:
    """
    Scans text for @mentions and file references that don't resolve
    to any known entity or file in the workspace.
    """
    issues: List[str] = []
    import re

    at_mentions = re.findall(r'@(\w[\w\s]*\w)', text)
    for mention in at_mentions:
        mention_lower = mention.lower()
        if not any(mention_lower in v.lower() or v.lower() in mention_lower for v in valid_entity_names):
            issues.append(f"@{mention} does not resolve to any known entity in this workspace")

    file_refs = re.findall(r'(?:file|doc|pdf|sheet)[:\s]+([^\s,]+)', text, re.IGNORECASE)
    for ref in file_refs:
        ref_clean = ref.strip('.,;:')
        if not any(ref_clean.lower() in v.lower() for v in valid_filenames):
            issues.append(f"Referenced file '{ref_clean}' not found in workspace")

    return issues


async def generate_space_summary_llm(space_name: str, space_description: str, captures: List[Dict[str, Any]]) -> str:
    """
    Generates a high-level summary of a Context Space.
    """
    if not captures:
        return space_description or "Empty contextual space."

    client = get_groq_client()
    if not client:
        return f"{space_name}: Contains {len(captures)} items including notes and documents."

    captures_summary = "\n".join([
        f"- {c.get('title', 'Capture')}: {(c.get('normalized_content') or c.get('original_content') or '')[:120]}"
        for c in captures[:10]
    ])

    prompt = f"""Generate a concise, 2-sentence summary of this Context Space for a knowledge dashboard.
Space: {space_name}
Description: {space_description}

Captures in this Space:
{captures_summary}

Summary:"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"{space_name}: Contains {len(captures)} connected context items."

# Aliases for backwards compatibility
generate_space_summary = generate_space_summary_llm
synthesize_answer = synthesize_grounded_answer
normalize_text = cleanse_and_normalize_text
extract_entities = extract_entities_from_text
detect_contradictions = detect_contradictions_llm

async def generate_course_tree(content: str, level: str, time_budget: str) -> Dict[str, Any]:
    """Generates a structured course from raw text matching the Darwinity Course schema."""
    client = get_groq_client()
    if not client:
        return {
            "title": "Fallback Course",
            "description": "Generated fallback",
            "learningGoal": "Learn something",
            "estimatedMinutes": 30,
            "modules": [],
            "lessons": []
        }
        
    prompt = f"""You are an expert curriculum designer. Turn the following text into a structured course matching the requested JSON format.
Target audience level: {level}
Expected time budget: {time_budget}

Text:
\"\"\"{content[:100000]}\"\"\"

Output ONLY valid JSON matching this exact structure:
{{
  "title": "Course Title",
  "description": "Short description of the course",
  "learningGoal": "Primary learning goal",
  "estimatedMinutes": 60,
  "modules": [
    {{
      "id": "m1",
      "title": "Module 1 Name",
      "description": "What this module covers",
      "lessonIds": ["l1", "l2"]
    }}
  ],
  "lessons": [
    {{
      "id": "l1",
      "title": "Lesson 1 Name",
      "objective": "Lesson objective",
      "estimatedMinutes": 10,
      "difficulty": "{level}",
      "status": "draft",
      "hasAssessment": true,
      "blocks": [
        {{
          "id": "b1",
          "type": "explanation",
          "content": "Detailed explanation of a concept from the text."
        }},
        {{
          "id": "b2",
          "type": "example",
          "content": "An example illustrating the concept."
        }},
        {{
          "id": "b3",
          "type": "multiple-choice",
          "content": "A question testing the concept?",
          "metadata": {{
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0
          }}
        }}
      ]
    }},
    {{
      "id": "l2",
      "title": "Lesson 2 Name",
      "objective": "Lesson objective",
      "estimatedMinutes": 10,
      "difficulty": "{level}",
      "status": "draft",
      "hasAssessment": false,
      "blocks": []
    }}
  ]
}}
IMPORTANT: Ensure lessonIds in modules exactly match the ids of the lessons array. Generate at least 1 module and 2 lessons with detailed blocks. Do not use markdown backticks in output, just pure JSON."""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=4000
        )
        result_text = response.choices[0].message.content
        return json.loads(result_text)
    except Exception as e:
        print(f"Course generation failed: {e}")
        return {
            "title": "Failed to Generate",
            "description": str(e),
            "learningGoal": "N/A",
            "estimatedMinutes": 0,
            "modules": [],
            "lessons": []
        }

async def generate_canvas_graph(course_tree: Dict[str, Any]) -> Dict[str, Any]:
    """Generates nodes and edges for the spatial canvas from a course tree."""
    nodes = []
    edges = []
    
    for topic in course_tree.get("topics", []):
        t_id = topic.get("id")
        nodes.append({
            "id": t_id,
            "label": topic.get("title", "Topic"),
            "group": "topic",
            "title": topic.get("summary", "")
        })
        for sub in topic.get("subtopics", []):
            s_id = sub.get("id")
            nodes.append({
                "id": s_id,
                "label": sub.get("title", "Subtopic"),
                "group": "subtopic"
            })
            edges.append({
                "from": t_id,
                "to": s_id
            })
            
    return {"nodes": nodes, "edges": edges}

async def generate_quiz_for_chunk(chunk_text: str, num_questions: int = 3) -> List[Dict[str, Any]]:
    """Generates multiple choice quiz questions for a text chunk."""
    client = get_groq_client()
    if not client:
        return [{"id": "q1", "question": "What is this?", "options": ["A", "B", "C"], "answer_idx": 0, "explanation": "It's A."}]
        
    prompt = f"""Generate {num_questions} multiple choice questions to test retention of the following text.
Text:
\"\"\"{chunk_text[:3000]}\"\"\"

Output JSON matching this exact structure:
{{
  "questions": [
    {{
      "id": "unique-id",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer_idx": 0,
      "explanation": "Why this is correct."
    }}
  ]
}}"""
    try:
        response = await _call_groq_with_fallback(
            client=client,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("questions", [])
    except Exception as e:
        print(f"Quiz generation error: {e}")
        return []
