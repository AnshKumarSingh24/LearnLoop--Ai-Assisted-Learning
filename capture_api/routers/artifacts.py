from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.artifact import StudyArtifact, ArtifactType
from services.artifact_service import ArtifactService

router = APIRouter(tags=["Artifact Generator"])

class ArtifactGenerateRequest(BaseModel):
    source_text: str
    source_title: str
    artifact_type: ArtifactType

@router.post("/artifacts/generate", response_model=StudyArtifact)
async def generate_artifact(request: ArtifactGenerateRequest):
    """Generate a study artifact (mindmap, flashcards, summary, etc.) from source text."""
    try:
        artifact = await ArtifactService.generate_artifact(
            source_text=request.source_text,
            source_title=request.source_title,
            artifact_type=request.artifact_type
        )
        if not artifact:
            raise HTTPException(status_code=500, detail="Failed to generate artifact")
        return artifact
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
