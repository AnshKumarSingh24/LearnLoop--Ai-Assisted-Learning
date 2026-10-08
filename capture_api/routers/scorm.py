from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.curriculum import CourseAST
from services.scorm_service import ScormService

router = APIRouter(tags=["SCORM Export"])

@router.post("/scorm/export")
async def export_scorm_package(ast: CourseAST):
    """
    Takes a Curriculum AST and generates a SCORM 1.2 zip package.
    Returns the zip file directly as a download.
    """
    zip_buffer = ScormService.generate_scorm_package(ast)
    
    return StreamingResponse(
        zip_buffer, 
        media_type="application/zip", 
        headers={"Content-Disposition": f"attachment; filename={ast.title.replace(' ', '_')}_SCORM1.2.zip"}
    )
