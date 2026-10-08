import json
import re
import uuid
from typing import Optional
from models.artifact import (
    StudyArtifact, ArtifactType, MindmapNode, 
    Flashcard, KeyConcept, TimelineEvent
)
from services.ai_pipeline import get_groq_client, _call_groq_with_fallback


class ArtifactService:

    @staticmethod
    async def generate_artifact(source_text: str, source_title: str, artifact_type: ArtifactType) -> Optional[StudyArtifact]:
        client = get_groq_client()
        artifact_id = f"ART_{uuid.uuid4().hex[:12]}"
        if not client:
            return ArtifactService._generate_source_only_artifact(source_text, source_title, artifact_type, artifact_id)

        if artifact_type == ArtifactType.MINDMAP:
            return await ArtifactService._generate_mindmap(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.SUMMARY:
            return await ArtifactService._generate_summary(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.FLASHCARDS:
            return await ArtifactService._generate_flashcards(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.KEY_CONCEPTS:
            return await ArtifactService._generate_key_concepts(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.TIMELINE:
            return await ArtifactService._generate_timeline(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.STUDY_GUIDE:
            return await ArtifactService._generate_study_guide(client, source_text, source_title, artifact_id)
        elif artifact_type == ArtifactType.PODCAST:
            return await ArtifactService._generate_podcast(client, source_text, source_title, artifact_id)
        return None

    @staticmethod
    def _generate_source_only_artifact(
        source_text: str,
        source_title: str,
        artifact_type: ArtifactType,
        artifact_id: str,
    ) -> StudyArtifact:
        passages = [
            passage.strip()
            for passage in re.split(r"(?<=[.!?])\s+|\n+", source_text)
            if len(passage.strip()) >= 30
        ]
        if not passages and len(source_text.strip()) >= 30:
            passages = [source_text.strip()]
        if not passages:
            raise ValueError("There is not enough source content to create this artifact.")

        excerpts = passages[:16]
        notice = "Created in source-only mode from exact document excerpts because no AI provider is configured."
        title_prefix = {
            ArtifactType.MINDMAP: "Mind Map",
            ArtifactType.SUMMARY: "Source Notes",
            ArtifactType.FLASHCARDS: "Flashcards",
            ArtifactType.KEY_CONCEPTS: "Source Concepts",
            ArtifactType.TIMELINE: "Source Sequence",
            ArtifactType.STUDY_GUIDE: "Study Guide",
            ArtifactType.PODCAST: "Podcast",
        }[artifact_type]
        common = {
            "id": artifact_id,
            "artifact_type": artifact_type,
            "title": f"{title_prefix}: {source_title}",
            "source_title": source_title,
            "generation_mode": "source-only",
            "generation_notice": notice,
        }

        if artifact_type == ArtifactType.MINDMAP:
            return StudyArtifact(
                **common,
                mindmap=MindmapNode(
                    id="source-root",
                    label=source_title,
                    children=[
                        MindmapNode(
                            id=f"source-{index + 1}",
                            label=" ".join(re.findall(r"\b[\w'-]+\b", passage)[:7])[:80],
                        )
                        for index, passage in enumerate(excerpts)
                    ],
                ),
            )
        if artifact_type == ArtifactType.FLASHCARDS:
            cards = []
            for index, passage in enumerate(excerpts):
                focus = " ".join(re.findall(r"\b[\w'-]+\b", passage)[:5])
                cards.append(Flashcard(
                    front=f"What does the source state about {focus}?",
                    back=passage,
                    difficulty=("easy", "medium", "hard")[index % 3],
                ))
            return StudyArtifact(**common, flashcards=cards)
        if artifact_type == ArtifactType.KEY_CONCEPTS:
            concepts = []
            for index, passage in enumerate(excerpts):
                term = " ".join(re.findall(r"\b[\w'-]+\b", passage)[:5]) or f"Source passage {index + 1}"
                concepts.append(KeyConcept(term=term, definition=passage, importance="medium"))
            return StudyArtifact(**common, key_concepts=concepts)
        if artifact_type == ArtifactType.TIMELINE:
            events = [
                TimelineEvent(label=f"Source passage {index + 1}", description=passage, order=index + 1)
                for index, passage in enumerate(excerpts)
            ]
            return StudyArtifact(**common, timeline=events)
        if artifact_type == ArtifactType.PODCAST:
            return StudyArtifact(**common, content="\n\n".join(excerpts))

        formatted = "## Source excerpts\n\n" + "\n\n".join(f"- {passage}" for passage in excerpts)
        return StudyArtifact(**common, content=formatted)

    @staticmethod
    async def _generate_podcast(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        messages = [
            {
                "role": "system",
                "content": "Write a spoken study podcast using only the supplied source. Never add facts not stated in it.",
            },
            {
                "role": "user",
                "content": (
                    f"Write a concise, listenable study-podcast transcript about {source_title}. "
                    "Preserve the source terminology and do not invent facts.\n\n"
                    f"SOURCE:\n{source_text[:12000]}"
                ),
            },
        ]
        response = await _call_groq_with_fallback(client, messages, temperature=0.2, max_tokens=2500)
        transcript = response.choices[0].message.content.strip()
        if not transcript:
            raise ValueError("The podcast transcript was empty.")
        return StudyArtifact(
            id=artifact_id,
            artifact_type=ArtifactType.PODCAST,
            title=f"Podcast: {source_title}",
            source_title=source_title,
            content=transcript,
            generation_mode="ai",
        )

    @staticmethod
    async def _generate_mindmap(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Analyze this text and create a hierarchical mind map. Output valid JSON matching this schema:
{{
  "id": "root",
  "label": "Central Topic",
  "children": [
    {{
      "id": "branch_1",
      "label": "Branch 1",
      "children": [
        {{ "id": "leaf_1", "label": "Detail 1", "children": [] }}
      ]
    }}
  ]
}}
Rules:
- Maximum 3 levels deep
- 3-6 main branches
- Each branch should have 2-4 leaves
- Labels must be concise (under 8 words)
- Do not include markdown code blocks, output raw JSON only

TEXT:
{source_text[:3000]}"""

        messages = [
            {"role": "system", "content": "You are a JSON-only API that creates educational mind maps."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, response_format={"type": "json_object"}, temperature=0.3, max_tokens=2000)
        data = json.loads(response.choices[0].message.content.strip())
        mindmap = MindmapNode(**data)
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.MINDMAP, title=f"Mind Map: {source_title}", source_title=source_title, mindmap=mindmap)

    @staticmethod
    async def _generate_summary(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Create a comprehensive study summary of this text. Use markdown formatting with headers, bullet points, and bold key terms. Structure it as:
1. Overview (2-3 sentences)
2. Key Points (bulleted)
3. Important Details
4. Connections & Implications

TEXT:
{source_text[:4000]}"""

        messages = [
            {"role": "system", "content": "You are an expert study material creator. Output clean markdown."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, temperature=0.3, max_tokens=2000)
        content = response.choices[0].message.content.strip()
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.SUMMARY, title=f"Summary: {source_title}", source_title=source_title, content=content)

    @staticmethod
    async def _generate_flashcards(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Create 8-12 study flashcards from this text. Output valid JSON:
{{
  "flashcards": [
    {{ "front": "Question or term", "back": "Answer or definition", "difficulty": "easy|medium|hard" }}
  ]
}}
Rules:
- Mix difficulty levels
- Front should be a clear question or key term
- Back should be a concise, accurate answer
- Do not include markdown code blocks

TEXT:
{source_text[:3000]}"""

        messages = [
            {"role": "system", "content": "You are a JSON-only API that creates study flashcards."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, response_format={"type": "json_object"}, temperature=0.3, max_tokens=2000)
        data = json.loads(response.choices[0].message.content.strip())
        cards = [Flashcard(**c) for c in data.get("flashcards", [])]
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.FLASHCARDS, title=f"Flashcards: {source_title}", source_title=source_title, flashcards=cards)

    @staticmethod
    async def _generate_key_concepts(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Extract the 8-15 most important key concepts from this text. Output valid JSON:
{{
  "key_concepts": [
    {{ "term": "Concept Name", "definition": "Clear 1-2 sentence definition", "importance": "low|medium|high" }}
  ]
}}
Rules:
- Order by importance (high first)
- Definitions must be grounded in the source text
- Do not include markdown code blocks

TEXT:
{source_text[:3000]}"""

        messages = [
            {"role": "system", "content": "You are a JSON-only API that extracts key concepts for studying."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, response_format={"type": "json_object"}, temperature=0.2, max_tokens=2000)
        data = json.loads(response.choices[0].message.content.strip())
        concepts = [KeyConcept(**c) for c in data.get("key_concepts", [])]
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.KEY_CONCEPTS, title=f"Key Concepts: {source_title}", source_title=source_title, key_concepts=concepts)

    @staticmethod
    async def _generate_timeline(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Create a logical timeline or sequence of events/steps from this text. Output valid JSON:
{{
  "timeline": [
    {{ "label": "Step or Event Name", "description": "Brief description", "order": 1 }}
  ]
}}
Rules:
- 5-10 events/steps
- Ordered chronologically or logically
- Do not include markdown code blocks

TEXT:
{source_text[:3000]}"""

        messages = [
            {"role": "system", "content": "You are a JSON-only API that creates educational timelines."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, response_format={"type": "json_object"}, temperature=0.2, max_tokens=2000)
        data = json.loads(response.choices[0].message.content.strip())
        events = [TimelineEvent(**e) for e in data.get("timeline", [])]
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.TIMELINE, title=f"Timeline: {source_title}", source_title=source_title, timeline=events)

    @staticmethod
    async def _generate_study_guide(client, source_text: str, source_title: str, artifact_id: str) -> StudyArtifact:
        prompt = f"""Create a comprehensive study guide from this text. Use rich markdown formatting:
- Use ## headers for sections
- Use **bold** for key terms
- Include a "Before You Start" prereqs section
- Include a "Key Takeaways" section at the end
- Include 3-5 self-test questions at the end
- Use tables where appropriate

TEXT:
{source_text[:4000]}"""

        messages = [
            {"role": "system", "content": "You are an expert study guide creator. Output rich, well-structured markdown."},
            {"role": "user", "content": prompt}
        ]
        response = await _call_groq_with_fallback(client, messages, temperature=0.3, max_tokens=3000)
        content = response.choices[0].message.content.strip()
        return StudyArtifact(id=artifact_id, artifact_type=ArtifactType.STUDY_GUIDE, title=f"Study Guide: {source_title}", source_title=source_title, content=content)
