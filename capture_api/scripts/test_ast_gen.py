import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.curriculum_service import CurriculumService
from core.config import settings

# Load the env
from dotenv import load_dotenv
load_dotenv()

mock_markdown = """
# Introduction to Photosynthesis

Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.

## The Light-Dependent Reactions
The first stage of photosynthesis is the light-dependent reactions. These reactions take place in the thylakoid membrane and use light energy to make ATP and NADPH.

## The Calvin Cycle
The second stage, the Calvin cycle, takes place in the stroma. It uses energy derived from the light-dependent reactions to capture carbon dioxide and make sugar.
"""

async def run_test():
    print("Generating AST from mock markdown...")
    ast = await CurriculumService.generate_ast_from_text(mock_markdown, "Biology 101: Photosynthesis")
    
    if ast:
        print("\n✅ Successfully generated AST!")
        print(f"Course: {ast.title} ({len(ast.modules)} modules)")
        
        errors = CurriculumService.validate_ast(ast)
        if errors:
            print("\n⚠️ Pedagogical Validation Errors:")
            for e in errors:
                print(f"  - {e}")
        else:
            print("\n✅ AST passed all pedagogical validation checks (Bloom Verbs & Grounding).")
            
        print("\n--- AST JSON ---")
        print(ast.model_dump_json(indent=2))
    else:
        print("\n❌ Failed to generate AST.")

if __name__ == "__main__":
    asyncio.run(run_test())
