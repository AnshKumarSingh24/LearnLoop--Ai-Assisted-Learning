import json
import uuid
from typing import List, Optional
from models.assessment import AssessmentItem, MCQOption
from models.curriculum import LearningObjective
from services.ai_pipeline import get_groq_client, _call_groq_with_fallback

class AssessmentService:
    @staticmethod
    async def generate_mcqs_for_lo(lo: LearningObjective, source_text: str, count: int = 3) -> Optional[List[AssessmentItem]]:
        """
        Uses LLM to generate high-quality MCQs for a given Learning Objective.
        Forces the LLM to output valid JSON matching the AssessmentItem schema.
        """
        client = get_groq_client()
        if not client:
            raise Exception("Groq client not available")

        prompt = f"""
        You are an expert Psychometrician and Assessment Architect.
        Generate {count} valid multiple-choice questions (MCQs) for the following Learning Objective.
        
        LEARNING OBJECTIVE: {lo.text} (Bloom Verb: {lo.bloom_verb.value}, Level: {lo.bloom_level.value})
        
        SOURCE MATERIAL:
        {source_text}
        
        The output MUST be a valid JSON object matching this schema exactly:
        {{
            "items": [
                {{
                    "id": "item_uuid",
                    "learning_objective_id": "{lo.id}",
                    "stem": "The question text here...",
                    "options": [
                        {{
                            "text": "Option A text...",
                            "is_correct": true,
                            "justification": "Why this is correct based on the source text."
                        }},
                        {{
                            "text": "Option B text...",
                            "is_correct": false,
                            "justification": "Explicitly state the student misconception this distractor targets."
                        }},
                        {{
                            "text": "Option C text...",
                            "is_correct": false,
                            "justification": "Explicitly state the student misconception this distractor targets."
                        }},
                        {{
                            "text": "Option D text...",
                            "is_correct": false,
                            "justification": "Explicitly state the student misconception this distractor targets."
                        }}
                    ]
                }}
            ]
        }}

        CRITICAL RULES:
        1. Produce EXACTLY 1 correct option and 3 distractors per item.
        2. Distractors MUST BE PLAUSIBLE. Do not use silly or obviously wrong answers.
        3. The `justification` for incorrect answers is CRITICAL. You must name the specific misconception (e.g. "Targets the misconception that...")
        4. The question must align with the Bloom Verb ({lo.bloom_verb.value}). If it is 'analyze', the question should require analysis, not just recall.
        5. Do not include markdown code block syntax (like ```json), just output the raw JSON object.
        """

        messages = [
            {"role": "system", "content": "You are a JSON-only API that outputs rigorous psychometric assessments."},
            {"role": "user", "content": prompt}
        ]

        try:
            response = await _call_groq_with_fallback(
                client, 
                messages, 
                response_format={"type": "json_object"},
                temperature=0.3, 
                max_tokens=4000
            )
            
            content = response.choices[0].message.content
            
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            data = json.loads(content.strip())
            
            items = []
            for item_data in data.get("items", []):
                # Ensure unique UUIDs
                item_data["id"] = f"ITEM_{uuid.uuid4().hex}"
                items.append(AssessmentItem(**item_data))
                
            return items
        except Exception as e:
            print(f"Error generating MCQs: {e}")
            return None
