import asyncio
import re

from fastapi import FastAPI
from fastapi.testclient import TestClient

from routers import artifacts
from services import artifact_service
from models.artifact import ArtifactType


def test_podcast_artifact_uses_source_excerpts_without_ai_provider(monkeypatch):
    monkeypatch.setattr(artifact_service, "get_groq_client", lambda: None)
    app = FastAPI()
    app.include_router(artifacts.router)
    client = TestClient(app)
    source = (
        "A galvanic cell converts the energy released during a spontaneous redox reaction into electricity.\n"
        "The anode is the electrode where oxidation occurs, and the cathode is where reduction occurs.\n"
        "A salt bridge maintains charge balance between the two half cells."
    )

    response = client.post(
        "/artifacts/generate",
        json={"source_text": source, "source_title": "Electrochemical Cells", "artifact_type": "podcast"},
    )

    assert response.status_code == 200
    artifact = response.json()
    assert artifact["artifact_type"] == "podcast"
    assert artifact["generation_mode"] == "source-only"
    assert re.sub(r"\s+", " ", artifact["content"]) == re.sub(r"\s+", " ", source)
    assert artifact["generation_notice"]


def test_podcast_needs_readable_source_text(monkeypatch):
    monkeypatch.setattr(artifact_service, "get_groq_client", lambda: None)

    try:
        asyncio.run(artifact_service.ArtifactService.generate_artifact("too short", "Empty source", ArtifactType.PODCAST))
    except ValueError as exc:
        assert "not enough source content" in str(exc)
    else:
        raise AssertionError("Podcast generation should reject insufficient source text.")


def test_all_artifact_types_remain_usable_without_ai_provider(monkeypatch):
    monkeypatch.setattr(artifact_service, "get_groq_client", lambda: None)
    app = FastAPI()
    app.include_router(artifacts.router)
    client = TestClient(app)
    source = (
        "A galvanic cell converts energy from a spontaneous redox reaction into electricity. "
        "The anode is the electrode where oxidation occurs. "
        "The cathode is the electrode where reduction occurs. "
        "A salt bridge maintains charge balance between the two half cells."
    )

    for artifact_type in ArtifactType:
        response = client.post(
            "/artifacts/generate",
            json={"source_text": source, "source_title": "Electrochemistry", "artifact_type": artifact_type.value},
        )
        assert response.status_code == 200
        artifact = response.json()
        assert artifact["artifact_type"] == artifact_type.value
        assert artifact["generation_mode"] == "source-only"
        assert artifact["generation_notice"]
