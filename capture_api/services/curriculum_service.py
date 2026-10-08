import json
import uuid
from typing import Optional
from models.curriculum import CourseAST, BloomVerb
from services.ai_pipeline import get_groq_client, _call_groq_with_fallback

class CurriculumService:
    @staticmethod
    async def generate_ast_from_text(source_text: str, course_title: str) -> Optional[CourseAST]:
        """
        Uses LLM to extract a structured Curriculum AST from raw text.
        Forces the LLM to output valid JSON matching the CourseAST schema.
        """
        client = get_groq_client()
        if not client:
            raise Exception("Groq client not available")

        # Define valid verbs for the prompt to prevent hallucinated verbs
        valid_verbs = ", ".join([v.value for v in BloomVerb])

        prompt = f"""
        You are an expert Instructional Designer. 
        Analyze the following raw educational content and structure it into a rigorous Curriculum Abstract Syntax Tree (AST).
        
        The output MUST be a valid JSON object matching this schema exactly:
        {{
            "id": "course_uuid",
            "title": "Course Title",
            "modules": [
                {{
                    "id": "mod_uuid",
                    "title": "Module Title",
                    "lessons": [
                        {{
                            "id": "les_uuid",
                            "title": "Lesson Title",
                            "learning_objectives": [
                                {{
                                    "id": "lo_uuid",
                                    "text": "The student will be able to...",
                                    "bloom_verb": "MUST BE ONE OF: {valid_verbs}",
                                    "bloom_level": "remember|understand|apply|analyze|evaluate|create",
                                    "source_spans": ["exact quote from text grounding this LO"],
                                    "prerequisites": ["lo_uuid_of_prior_lo"]
                                }}
                            ]
                        }}
                    ]
                }}
            ]
        }}

        CRITICAL RULES:
        1. DO NOT use unmeasurable verbs like 'understand', 'know', or 'learn'. Use exact verbs from the list.
        2. Every Learning Objective MUST have at least one exact 'source_span' extracted from the text to prove it is grounded.
        3. Do not include markdown code block syntax (like ```json), just output the raw JSON object.
        
        COURSE TITLE: {course_title}
        
        RAW CONTENT:
        {source_text}
        """

        messages = [
            {"role": "system", "content": "You are a JSON-only API that outputs rigorous pedagogical schemas."},
            {"role": "user", "content": prompt}
        ]

        try:
            # We use JSON object response format to force strict JSON parsing
            response = await _call_groq_with_fallback(
                client, 
                messages, 
                response_format={"type": "json_object"},
                temperature=0.2, 
                max_tokens=4000
            )
            
            content = response.choices[0].message.content
            
            # Clean up potential markdown formatting
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            data = json.loads(content.strip())
            
            # Validate with Pydantic
            ast = CourseAST(**data)
            return ast
        except Exception as e:
            print(f"Error generating Curriculum AST: {e}")
            return None

    @staticmethod
    def validate_ast(ast: CourseAST) -> list:
        """
        Validates the AST for pedagogical rigor. Returns a list of error strings if any.
        """
        errors = []
        lo_ids = set()
        
        # Collect all LO IDs first for prerequisite validation
        for module in ast.modules:
            for lesson in module.lessons:
                for lo in lesson.learning_objectives:
                    lo_ids.add(lo.id)
                    
        # Validate
        for module in ast.modules:
            for lesson in module.lessons:
                for lo in lesson.learning_objectives:
                    if not lo.source_spans:
                        errors.append(f"LO {lo.id} ('{lo.text}') is missing grounding source_spans.")
                    
                    for prereq in lo.prerequisites:
                        if prereq not in lo_ids and prereq != "":
                            errors.append(f"LO {lo.id} has invalid prerequisite {prereq} (not found in course).")
                            
        return errors
