from datetime import datetime, timezone
from types import SimpleNamespace
import asyncio
import json
import re
import pytest

from fastapi import FastAPI
from fastapi.testclient import TestClient

import routers.document_questions as document_questions


class MemoryStore:
    def __init__(self):
        self.items = {}

    def create_memory(self, **values):
        document = {
            "id": "document-test-id",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "processing_status": "queued",
            **values,
        }
        self.items[document["id"]] = document
        return document

    def get_memory(self, document_id):
        return self.items.get(document_id)

    def update_memory(self, document_id, updates):
        self.items[document_id].update(updates)
        return self.items[document_id]

    def list_memories(self, user_id=None):
        return [item for item in self.items.values() if item["user_id"] == user_id]


def make_client(monkeypatch, tmp_path):
    store = MemoryStore()
    monkeypatch.setattr(document_questions, "get_db", lambda: store)
    monkeypatch.setattr(document_questions, "UPLOAD_DIR", tmp_path)
    app = FastAPI()
    app.include_router(document_questions.router)
    return TestClient(app), store


def test_upload_generates_document_evidence_backed_questions(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )

    response = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )

    assert response.status_code == 200
    document_id = response.json()["document"]["id"]
    status = client.get(f"/api/v1/documents/{document_id}/status").json()
    questions = client.get(f"/api/v1/documents/{document_id}/questions").json()["questions"]
    assert status["status"] == "ready"
    assert len(questions) >= 6
    assert {question["type"] for question in questions} >= {
        "recall", "comprehension", "application", "multiple-choice", "short-answer", "true-false"
    }
    assert all(question["documentId"] == document_id for question in questions)
    assert all(question["workspaceId"] == "workspace-17" for question in questions)
    assert all(question["sourceReference"]["quote"] in source for question in questions)
    for question in questions:
        if question["type"] == "multiple-choice":
            assert len(question["options"]) == 4
            assert all(len(option.split()) <= 16 for option in question["options"])
            assert all(option in source for option in question["options"])

    answer = client.post(
        f"/api/v1/documents/{document_id}/answers",
        json={"question_id": questions[0]["id"], "answer": questions[0]["correctAnswer"]},
    )
    assert answer.status_code == 200
    assert answer.json()["correct"] is True
    assert answer.json()["score"] == 10
    assert answer.json()["progress"] == {"correct": 1, "answered": 1}
    assert answer.json()["maxScore"] == 10
    assert answer.json()["sourceReferences"][0]["quote"] in source
    assert store.get_memory(document_id)["metadata"]["stored_path"].startswith(str(tmp_path))


def test_written_answer_uses_semantic_evaluation_and_weighted_score(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]
    questions = client.get(f"/api/v1/documents/{document_id}/questions").json()["questions"]
    question = next(item for item in questions if not item["options"])

    class FakeCompletions:
        async def create(self, **kwargs):
            prompt = kwargs["messages"][1]["content"]
            assert "never text similarity" in prompt
            assert "paraphrases" in prompt
            assert question["evaluationGuide"]["mainConcept"] in prompt
            return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps({
                "score": 8,
                "conceptualAccuracy": 9,
                "coverage": 7,
                "reasoning": 8,
                "clarity": 8,
                "strengths": ["Explained the main idea in different wording."],
                "missingPoints": ["Could add one supporting detail."],
                "errors": [],
                "feedback": "The paraphrase shows strong understanding.",
                "improvedAnswer": "A more complete explanation, based on the source.",
            })))])

    monkeypatch.setattr(document_questions, "get_groq_client", lambda: SimpleNamespace(
        chat=SimpleNamespace(completions=FakeCompletions())
    ))
    response = client.post(
        f"/api/v1/documents/{document_id}/answers",
        json={"question_id": question["id"], "answer": "I understand the idea differently worded."},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["score"] == 8  # weighted: 9*.4 + 7*.25 + 8*.2 + 8*.15
    assert result["grade"] == "Strong"
    assert result["isCorrect"] is True
    assert result["evaluationMode"] == "semantic"
    assert result["strengths"] == ["Explained the main idea in different wording."]
    assert result["improvedAnswer"]
    assert result["sourceReferences"][0]["quote"] in source


def test_written_answer_fallback_is_concept_based_and_retry_updates_progress(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]
    question = next(item for item in client.get(
        f"/api/v1/documents/{document_id}/questions"
    ).json()["questions"] if not item["options"])
    monkeypatch.setattr(document_questions, "get_groq_client", lambda: None)

    first = client.post(
        f"/api/v1/documents/{document_id}/answers",
        json={"question_id": question["id"], "answer": question["correctAnswer"]},
    ).json()
    second = client.post(
        f"/api/v1/documents/{document_id}/answers",
        json={"question_id": question["id"], "answer": "Plants turn light into stored chemical energy."},
    ).json()

    assert first["score"] == 10
    assert second["evaluationMode"] == "offline-content-check"
    assert second["score"] >= 6
    assert second["progress"]["answered"] == 1
    assert second["feedback"]
    answers = store.get_memory(document_id)["metadata"]["answers"]
    assert len(answers) == 1
    assert answers[0]["answer"] == "Plants turn light into stored chemical energy."


def test_insufficient_content_is_failed_without_sample_questions(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    response = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("empty-notes.txt", b"Only a short note.", "text/plain")},
    )
    document_id = response.json()["document"]["id"]
    status = client.get(f"/api/v1/documents/{document_id}/status").json()
    questions = client.get(f"/api/v1/documents/{document_id}/questions").json()

    assert status["status"] == "failed"
    assert status["stage"] == "extraction_failed"
    assert status["error"] == document_questions.INSUFFICIENT_CONTENT
    assert questions["questions"] == []


def test_document_toolkit_generation_persists_source_grounded_results(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]

    async def fake_tool_generation(tool_id, config, chunks):
        items = []
        for index, chunk in enumerate(chunks[: max(5, int(config.get("count", 10)))]):
            text = chunk["text"]
            reference = {
                "page": chunk.get("page"),
                "section": chunk.get("section"),
                "paragraph": chunk.get("paragraph"),
                "quote": text,
            }
            items.append({"text": text, "front": text[:50], "back": text, "sourceReference": reference})
        result = {"title": tool_id, "items": items, "config": config}
        if tool_id == "flashcards":
            result["cards"] = [{"front": item["front"], "back": item["back"], "sourceReference": item["sourceReference"]} for item in items[: int(config.get("count", 10))]]
        elif tool_id == "mind-map":
            result["nodes"] = [{"label": item["text"][:50], "detail": item["text"], "sourceReference": item["sourceReference"]} for item in items]
        return result

    monkeypatch.setattr(document_questions, "_generate_ai_tool_result", fake_tool_generation)
    response = client.post(
        f"/api/v1/documents/{document_id}/tools",
        json={"tools": ["notes", "flashcards", "mind-map"], "config": {"flashcards": {"count": 5}}},
    )
    assert response.status_code == 200
    assert set(response.json()["queued"]) == {"notes", "flashcards", "mind-map"}
    tools = client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]
    assert all(tools[name]["status"] == "ready" for name in ("notes", "flashcards", "mind-map"))
    assert len(tools["flashcards"]["result"]["cards"]) == 5
    assert all(card["sourceReference"]["quote"] in source for card in tools["flashcards"]["result"]["cards"])
    persisted = store.get_memory(document_id)["metadata"]["tools"]
    assert all(persisted[name]["status"] == tools[name]["status"] == "ready" for name in ("notes", "flashcards", "mind-map"))
    edited = dict(tools["notes"]["result"])
    edited["title"] = "Reviewed source notes"
    save = client.put(f"/api/v1/documents/{document_id}/tools/notes", json={"result": edited})
    assert save.status_code == 200
    assert client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]["result"]["title"] == "Reviewed source notes"
    edited["items"][0]["sourceReference"]["quote"] = "A made-up claim not in the document"
    invalid_save = client.put(f"/api/v1/documents/{document_id}/tools/notes", json={"result": edited})
    assert invalid_save.status_code == 422

    async def fake_ai_call(*_args, **_kwargs):
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps({
            "answer": "Chlorophyll absorbs sunlight in the leaves.",
            "sourceIds": ["source-1"],
        })))])

    monkeypatch.setattr(document_questions, "get_groq_client", lambda: object())
    monkeypatch.setattr(document_questions, "_call_groq_with_fallback", fake_ai_call)
    answer = client.post(f"/api/v1/documents/{document_id}/ask", json={"question": "What does chlorophyll do?"})
    assert answer.status_code == 200
    assert answer.json()["grounded"] is True
    assert "Chlorophyll absorbs sunlight" in answer.json()["answer"]
    assert len(answer.json()["messages"]) == 2
    assert len(client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["ask-ai"]["result"]["messages"]) == 2


def test_toolkit_is_scoped_to_document_owner(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    store.items["private-document"] = {
        "id": "private-document",
        "user_id": "someone-else",
        "metadata": {"status": "ready", "tools": {"notes": {"status": "ready"}}},
    }
    assert client.get("/api/v1/documents/private-document/tools").status_code == 404


def test_question_generation_failure_does_not_block_other_tools(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    monkeypatch.setattr(
        document_questions,
        "_build_question_candidates",
        lambda *_args, **_kwargs: (_ for _ in ()).throw(ValueError("Question service unavailable")),
    )
    response = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = response.json()["document"]["id"]
    status = client.get(f"/api/v1/documents/{document_id}/status").json()
    stored = store.get_memory(document_id)
    assert status["status"] == "ready"
    assert "Photosynthesis converts light energy into chemical energy" in stored["original_content"]
    assert "plant nutrition" in stored["original_content"]
    assert client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["questions"]["status"] == "failed"

    async def fake_notes_generation(tool_id, config, chunks):
        quote = chunks[0]["text"]
        reference = {"quote": quote}
        return {
            "title": "Notes",
            "versions": [{
                "style": "standard",
                "title": "Study Notes",
                "sections": [{
                    "id": "section-1",
                    "title": "Overview",
                    "summary": quote,
                    "sourceReference": reference,
                }],
            }],
            "items": [{"text": quote, "sourceReference": reference}],
        }

    monkeypatch.setattr(document_questions, "_generate_ai_tool_result", fake_notes_generation)
    notes = client.post(f"/api/v1/documents/{document_id}/tools", json={"tools": ["notes"]})
    assert notes.status_code == 200
    assert client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]["status"] == "ready"


def test_configured_image_ocr_and_audio_transcription_are_awaited(monkeypatch):
    class FakeCompletions:
        async def create(self, **_kwargs):
            return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content="Visible image text."))])

    class FakeTranscriptions:
        async def create(self, **_kwargs):
            return SimpleNamespace(text="Recognized spoken words.")

    client = SimpleNamespace(
        chat=SimpleNamespace(completions=FakeCompletions()),
        audio=SimpleNamespace(transcriptions=FakeTranscriptions()),
    )
    monkeypatch.setattr(
        "services.ai_pipeline.get_groq_client",
        lambda: client,
    )
    assert document_questions._ocr_image(b"fake image", "scan.png") == "Visible image text."
    assert document_questions._transcribe_audio(b"fake audio", "lecture.wav") == "Recognized spoken words."


def test_audio_transcription_without_provider_returns_actionable_error(monkeypatch):
    monkeypatch.setattr("services.ai_pipeline.get_groq_client", lambda: None)
    with pytest.raises(ValueError, match="Audio transcription is unavailable"):
        document_questions._transcribe_audio(b"fake audio", "lecture.wav")


def test_ai_tool_output_drops_claims_without_exact_source_evidence(monkeypatch):
    source = "Chlorophyll absorbs sunlight in the leaves and supports photosynthesis."
    valid = {
        "id": "section-1",
        "number": 1,
        "title": "Chlorophyll",
        "summary": "Chlorophyll absorbs sunlight in the leaves.",
        "paragraphs": ["Chlorophyll absorbs sunlight in the leaves."],
        "keyPoints": ["Chlorophyll absorbs sunlight in the leaves."],
        "definitions": [],
        "examples": [],
        "takeaway": "Chlorophyll absorbs sunlight.",
        "sourceId": "source-1",
        "evidenceQuote": source,
    }
    invalid = {
        **valid,
        "id": "section-2",
        "title": "Plant diseases",
        "summary": "Chlorophyll cures every plant disease.",
        "paragraphs": ["Chlorophyll cures every plant disease."],
        "keyPoints": ["Chlorophyll cures every plant disease."],
        "takeaway": "Chlorophyll cures every plant disease.",
        "evidenceQuote": "A fabricated quote that is not in the source document.",
    }
    generated = {
        "title": "Notes",
        "versions": [{
            "style": "standard",
            "title": "Study Notes",
            "sections": [valid, invalid],
        }],
    }

    async def fake_completion(*_args, **_kwargs):
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps(generated)))])

    monkeypatch.setattr(document_questions, "get_groq_client", lambda: object())
    monkeypatch.setattr(document_questions, "_call_groq_with_fallback", fake_completion)
    result = asyncio.run(document_questions._generate_ai_tool_result(
        "notes",
        {},
        [{"text": source, "page": 2, "section": "Plant cells"}],
    ))
    assert len(result["items"]) == 1
    assert result["items"][0]["sourceReference"]["page"] == 2
    assert len(result["versions"][0]["sections"]) == 1


def test_ai_visual_notes_are_cited_and_keep_three_to_five_key_points(monkeypatch):
    source = (
        "Electrochemical cells convert chemical energy into electrical energy. "
        "A galvanic cell uses a spontaneous redox reaction to generate electricity. "
        "An electrolytic cell uses electrical energy to drive a non-spontaneous reaction."
    )
    generated = {
        "title": "Electrochemical Cells",
        "versions": [{
            "style": "visual",
            "title": "Electrochemical Cells — Visual Notes",
            "pages": [{
                "pageNumber": 1,
                "sectionNumber": 1,
                "heading": "Electrochemical Cells",
                "explanation": source,
                "keyPoints": [
                    "Electrochemical cells convert chemical energy into electrical energy.",
                    "A galvanic cell uses a spontaneous redox reaction to generate electricity.",
                    "An electrolytic cell uses electrical energy to drive a non-spontaneous reaction.",
                ],
                "highlightedTerms": [],
                "visual": {"type": "comparison", "caption": "Two cell types", "labels": ["galvanic", "electrolytic"], "steps": []},
                "example": None,
                "takeaway": "The two cell types use different energy flows.",
                "sourceId": "source-1",
                "evidenceQuote": source,
            }],
        }],
    }

    async def fake_completion(*_args, **_kwargs):
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps(generated)))])

    monkeypatch.setattr(document_questions, "get_groq_client", lambda: object())
    monkeypatch.setattr(document_questions, "_call_groq_with_fallback", fake_completion)
    result = asyncio.run(document_questions._generate_ai_tool_result(
        "notes",
        {"style": "visual"},
        [{"text": source, "page": 2, "section": "Electrochemical Cells"}],
    ))
    page = result["versions"][0]["pages"][0]
    assert len(page["keyPoints"]) == 3
    assert page["sourceReference"]["page"] == 2
    assert page["sourceReference"]["quote"] == source


def test_ai_mind_map_uses_validated_hierarchical_schema(monkeypatch):
    source_facts = [
        "Photosynthesis converts light energy into chemical energy in green plants.",
        "Chlorophyll absorbs sunlight in the leaves.",
        "Carbon dioxide enters through small openings called stomata.",
        "Roots absorb water from the soil and transport it to the leaves.",
        "The process produces glucose that stores energy for the plant.",
        "Oxygen is released into the atmosphere as a byproduct.",
        "Light intensity can affect the rate of photosynthesis.",
        "These parts work together in plant nutrition.",
        "The source describes leaves as the main site for the process.",
    ]
    source = " ".join(source_facts)

    def map_node(node_id, keyword, fact, children=None):
        return {
            "id": node_id,
            "keyword": keyword,
            "summary": fact,
            "details": fact,
            "example": None,
            "sourceId": "source-1",
            "evidenceQuote": fact,
            "children": children or [],
        }

    branches = []
    for branch_index in range(4):
        branch_fact = source_facts[branch_index + 1]
        children = [
            map_node(
                f"b{branch_index + 1}c{child_index + 1}",
                f"Concept {branch_index + 1}{child_index + 1}",
                source_facts[(branch_index + child_index + 4) % len(source_facts)],
            )
            for child_index in range(2)
        ]
        branches.append(map_node(f"b{branch_index + 1}", f"Branch {branch_index + 1}", branch_fact, children))

    generated = {
        "topic": "Photosynthesis",
        "summary": source_facts[0],
        "details": source_facts[0],
        "sourceId": "source-1",
        "evidenceQuote": source_facts[0],
        "branches": branches,
    }

    async def fake_completion(_client, messages, **_kwargs):
        assert messages[0]["content"] == document_questions.MIND_MAP_SYSTEM_PROMPT
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps(generated)))])

    monkeypatch.setattr(document_questions, "get_groq_client", lambda: object())
    monkeypatch.setattr(document_questions, "_call_groq_with_fallback", fake_completion)
    result = asyncio.run(document_questions._generate_ai_tool_result(
        "mind-map",
        {},
        [{"text": source, "page": 2, "section": "Photosynthesis"}],
    ))
    assert result["topic"] == "Photosynthesis"
    assert len(result["branches"]) == 4
    assert all(len(branch["children"]) == 2 for branch in result["branches"])
    assert all(node["sourceReference"]["quote"] in source for branch in result["branches"] for node in [branch, *branch["children"]])


def test_toolkit_works_without_groq_key_using_cited_source_only_results(monkeypatch, tmp_path):
    client, _ = make_client(monkeypatch, tmp_path)
    monkeypatch.setattr(document_questions, "get_groq_client", lambda: None)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]
    selected_tools = ["notes", "mind-map", "flashcards", "quizzes", "podcast", "ask-ai", "focus"]
    response = client.post(f"/api/v1/documents/{document_id}/tools", json={"tools": selected_tools})

    assert response.status_code == 200
    assert client.post(f"/api/v1/documents/{document_id}/tools", json={"tools": ["games"]}).status_code == 422
    results = client.get(f"/api/v1/documents/{document_id}/tools").json()
    assert results["aiProviderConfigured"] is False
    for tool_id in selected_tools:
        result = results["tools"][tool_id]
        assert result["status"] == "ready", (tool_id, result.get("error"))
        assert result["result"]["generationMode"] == "source-only"
        if tool_id != "ask-ai":
            source_refs = (
                result["result"].get("cards")
                or result["result"].get("nodes")
                or result["result"].get("pairs")
                or result["result"].get("items")
            )
            assert source_refs
            assert all(item["sourceReference"]["quote"] in source for item in source_refs)
        if tool_id == "quizzes":
            quiz_items = result["result"]["items"]
            assert quiz_items
            assert all(item["type"] == "multiple-choice" for item in quiz_items)
            assert all(len(item["options"]) == 4 and item["correctAnswer"] in item["options"] for item in quiz_items)
            assert all(len(option.split()) <= 16 for item in quiz_items for option in item["options"])
        if tool_id == "mind-map":
            assert all(len(item["detail"].split()) <= 13 for item in result["result"]["nodes"])
            mind_map = result["result"]
            assert 4 <= len(mind_map["branches"]) <= 6
            assert all(2 <= len(branch["children"]) <= 4 for branch in mind_map["branches"])
            assert all(
                1 <= len(node["keyword"].split()) <= 3
                for branch in mind_map["branches"]
                for node in [branch, *branch["children"]]
            )
            assert all(
                node["sourceReference"]["quote"] in source
                for branch in mind_map["branches"]
                for node in [branch, *branch["children"]]
            )


def test_notes_generate_and_preserve_both_source_grounded_styles(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    monkeypatch.setattr(document_questions, "get_groq_client", lambda: None)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-notes"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]

    standard = client.post(
        f"/api/v1/documents/{document_id}/tools",
        json={"tools": ["notes"], "config": {"notes": {"style": "standard"}}},
    )
    assert standard.status_code == 200
    stored = client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]["result"]
    assert [version["style"] for version in stored["versions"]] == ["standard"]
    assert stored["versions"][0]["sections"]

    visual = client.post(
        f"/api/v1/documents/{document_id}/tools",
        json={"tools": ["notes"], "config": {"notes": {"style": "visual"}}},
    )
    assert visual.status_code == 200
    stored = client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]["result"]
    assert [version["style"] for version in stored["versions"]] == ["standard", "visual"]
    assert stored["versions"][1]["pages"]
    assert all(page["sourceReference"]["quote"] in source for page in stored["versions"][1]["pages"])
    assert store.get_memory(document_id)["metadata"]["workspace_id"] == "workspace-notes"

    answer = client.post(
        f"/api/v1/documents/{document_id}/ask",
        json={"question": "What does chlorophyll do?"},
    )
    assert answer.status_code == 200
    assert answer.json()["grounded"] is True
    assert "Chlorophyll absorbs sunlight" in answer.json()["answer"]


def test_old_missing_groq_failures_are_migrated_to_source_only_mode(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    monkeypatch.setattr(document_questions, "get_groq_client", lambda: None)
    source = (
        "Photosynthesis converts light energy into chemical energy in green plants.\n"
        "Chlorophyll absorbs sunlight in the leaves.\n"
        "Carbon dioxide enters through small openings called stomata.\n"
        "Roots absorb water from the soil and transport it to the leaves.\n"
        "The process produces glucose that stores energy for the plant.\n"
        "Oxygen is released into the atmosphere as a byproduct.\n"
        "Light intensity can affect the rate of photosynthesis.\n"
        "These parts work together in plant nutrition."
    )
    upload = client.post(
        "/api/v1/documents",
        data={"workspaceId": "workspace-17"},
        files={"file": ("plant-science.txt", source.encode(), "text/plain")},
    )
    document_id = upload.json()["document"]["id"]
    document = store.get_memory(document_id)
    metadata = dict(document["metadata"])
    metadata["tools"] = {
        "notes": {
            "status": "failed",
            "error": "AI generation is unavailable because no Groq API key is configured.",
        }
    }
    document["metadata"] = metadata

    queued = client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]
    assert queued["status"] == "queued"
    recovered = client.get(f"/api/v1/documents/{document_id}/tools").json()["tools"]["notes"]
    assert recovered["status"] == "ready"
    assert recovered["result"]["generationMode"] == "source-only"


def test_pasted_public_link_is_extracted_and_ingested(monkeypatch, tmp_path):
    client, store = make_client(monkeypatch, tmp_path)
    source = (
        "Electrochemical cells convert chemical energy into electrical energy.\n"
        "A galvanic cell uses a spontaneous redox reaction to generate electricity.\n"
        "An electrolytic cell uses electrical energy to drive a non-spontaneous reaction.\n"
        "The anode is where oxidation occurs in the cell.\n"
        "The cathode is where reduction occurs in the cell.\n"
        "A salt bridge maintains charge balance between half cells."
    )

    async def fetch_web_source(_url):
        return "Electrochemical Cells", source, "https://example.org/cells"

    monkeypatch.setattr(document_questions, "_fetch_web_source", fetch_web_source)
    response = client.post(
        "/api/v1/documents/from-url",
        json={"url": "https://example.org/cells", "workspaceId": "workspace-web"},
    )

    assert response.status_code == 200
    document_id = response.json()["document"]["id"]
    document = store.get_memory(document_id)
    assert document["metadata"]["status"] == "ready"
    assert document["metadata"]["source_url"] == "https://example.org/cells"
    assert document["user_id"] == "00000000-0000-0000-0000-000000000000"
    assert document["metadata"]["workspace_id"] == "workspace-web"
    assert re.sub(r"\s+", " ", document["original_content"]) == re.sub(r"\s+", " ", source)


def test_private_network_links_are_rejected(monkeypatch):
    monkeypatch.setattr(
        document_questions.socket,
        "getaddrinfo",
        lambda *_args, **_kwargs: [(None, None, None, None, ("127.0.0.1", 80))],
    )
    try:
        document_questions._validate_public_web_url("http://localhost/private")
    except ValueError as exc:
        assert "local or private" in str(exc)
    else:
        raise AssertionError("Local/private URLs must be blocked.")
