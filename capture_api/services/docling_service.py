from typing import Dict, Any, List, Optional
import os
import tempfile

try:
    from docling.document_converter import DocumentConverter
    from docling.datamodel.base_models import InputFormat
    from docling.datamodel.pipeline_options import PdfPipelineOptions
    from docling.datamodel.document import DoclingDocument
    DOCLING_AVAILABLE = True
except ImportError:
    DOCLING_AVAILABLE = False
    DocumentConverter = None
    InputFormat = None
    PdfPipelineOptions = None
    DoclingDocument = None


class DoclingService:
    """Layout-aware PDF/document extraction using Docling."""
    
    _converter = None
    
    @classmethod
    def get_converter(cls):
        if not DOCLING_AVAILABLE:
            return None
        if cls._converter is None:
            pipeline_options = PdfPipelineOptions()
            pipeline_options.do_ocr = True
            pipeline_options.do_table_structure = True
            cls._converter = DocumentConverter(
                allowed_formats=[
                    InputFormat.PDF,
                    InputFormat.DOCX,
                    InputFormat.PPTX,
                    InputFormat.HTML,
                    InputFormat.MD,
                ],
                format_options={
                    InputFormat.PDF: PdfPipelineOptions(
                        do_ocr=True,
                        do_table_structure=True,
                    )
                }
            )
        return cls._converter
    
    @staticmethod
    def extract_markdown(file_path: str) -> Dict[str, Any]:
        """
        Extract structured markdown from a document using Docling.
        Returns dict with markdown, headings, tables, figures.
        """
        if not DOCLING_AVAILABLE:
            return {"markdown": "", "headings": [], "tables": [], "figures": [], "error": "Docling not installed"}
        
        try:
            converter = DoclingService.get_converter()
            result = converter.convert(file_path)
            
            if not result.document:
                return {"markdown": "", "headings": [], "tables": [], "figures": [], "error": "No document extracted"}
            
            doc: DoclingDocument = result.document
            
            # Export to markdown
            markdown = doc.export_to_markdown()
            
            # Extract headings
            headings = []
            for item in doc.texts:
                if hasattr(item, 'label') and item.label in ['title', 'heading']:
                    headings.append({
                        "text": item.text,
                        "level": getattr(item, 'level', 1),
                        "page": getattr(item.prov[0], 'page_no', 1) if item.prov else 1
                    })
            
            # Extract tables
            tables = []
            for table in doc.tables:
                tables.append({
                    "markdown": table.export_to_markdown(),
                    "page": table.prov[0].page_no if table.prov else 1,
                    "caption": getattr(table, 'caption', '')
                })
            
            # Extract figures
            figures = []
            for figure in doc.pictures:
                figures.append({
                    "page": figure.prov[0].page_no if figure.prov else 1,
                    "caption": getattr(figure, 'caption', ''),
                    "bbox": getattr(figure, 'bbox', None)
                })
            
            return {
                "markdown": markdown,
                "headings": headings,
                "tables": tables,
                "figures": figures,
                "metadata": {
                    "page_count": len(doc.pages) if hasattr(doc, 'pages') else 1,
                    "source": file_path
                }
            }
            
        except Exception as e:
            return {"markdown": "", "headings": [], "tables": [], "figures": [], "error": str(e)}
    
    @staticmethod
    def extract_from_bytes(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Extract from bytes by writing to temp file."""
        if not DOCLING_AVAILABLE:
            return {"markdown": "", "headings": [], "tables": [], "figures": [], "error": "Docling not installed"}
        
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name
        
        try:
            return DoclingService.extract_markdown(tmp_path)
        finally:
            try:
                os.unlink(tmp_path)
            except:
                pass
    
    @staticmethod
    def build_curriculum_ast_from_docling(docling_result: Dict[str, Any], course_title: str) -> Dict[str, Any]:
        """
        Build a Curriculum AST from Docling extraction result.
        Uses headings hierarchy to create modules/lessons.
        """
        headings = docling_result.get("headings", [])
        markdown = docling_result.get("markdown", "")
        
        if not headings:
            # Fallback: create basic structure from markdown
            return {
                "title": course_title,
                "modules": [{
                    "id": "mod_1",
                    "title": "Main Content",
                    "lessons": [{
                        "id": "les_1",
                        "title": "Overview",
                        "learning_objectives": [{
                            "id": "lo_1",
                            "text": "Understand the key concepts from the source material",
                            "bloom_verb": "understand",
                            "bloom_level": "understand",
                            "source_spans": [markdown[:500]] if markdown else [],
                            "prerequisites": []
                        }]
                    }]
                }]
            }
        
        # Build hierarchy from headings
        modules = []
        current_module = None
        current_lesson = None
        module_count = 0
        lesson_count = 0
        lo_count = 0
        
        for heading in headings:
            level = heading.get("level", 1)
            text = heading.get("text", "").strip()
            
            if level == 1:
                # New module
                if current_module:
                    if current_lesson:
                        current_module["lessons"].append(current_lesson)
                    modules.append(current_module)
                
                module_count += 1
                current_module = {
                    "id": f"mod_{module_count}",
                    "title": text,
                    "lessons": []
                }
                current_lesson = None
                lesson_count = 0
                
            elif level == 2:
                # New lesson
                if current_module:
                    if current_lesson:
                        current_module["lessons"].append(current_lesson)
                    
                    lesson_count += 1
                    current_lesson = {
                        "id": f"les_{module_count}_{lesson_count}",
                        "title": text,
                        "learning_objectives": []
                    }
                else:
                    # No module yet, create default
                    module_count += 1
                    current_module = {
                        "id": f"mod_{module_count}",
                        "title": "Introduction",
                        "lessons": []
                    }
                    lesson_count += 1
                    current_lesson = {
                        "id": f"les_{module_count}_{lesson_count}",
                        "title": text,
                        "learning_objectives": []
                    }
                    
            elif level >= 3:
                # Learning objective
                if current_module and current_lesson:
                    lo_count += 1
                    current_lesson["learning_objectives"].append({
                        "id": f"lo_{module_count}_{lesson_count}_{lo_count}",
                        "text": f"Explain {text.lower()}",
                        "bloom_verb": "explain",
                        "bloom_level": "understand",
                        "source_spans": [text],
                        "prerequisites": []
                    })
        
        # Add final lesson/module
        if current_module:
            if current_lesson:
                current_module["lessons"].append(current_lesson)
            modules.append(current_module)
        
        return {
            "title": course_title,
            "modules": modules
        }


def extract_with_docling(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Convenience function for direct extraction."""
    return DoclingService.extract_from_bytes(file_bytes, filename)