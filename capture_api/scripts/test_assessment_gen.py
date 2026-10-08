import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.curriculum import LearningObjective, BloomVerb, BloomLevel
from services.assessment_service import AssessmentService

mock_text = """
The second stage of photosynthesis, the Calvin cycle, takes place in the stroma. 
It uses energy derived from the light-dependent reactions (ATP and NADPH) to capture carbon dioxide and make sugar.
"""

lo = LearningObjective(
    id="lo_test_1",
    text="The student will be able to explain the purpose of the Calvin cycle.",
    bloom_verb=BloomVerb.EXPLAIN,
    bloom_level=BloomLevel.UNDERSTAND,
    source_spans=["uses energy derived from the light-dependent reactions to capture carbon dioxide and make sugar"],
    prerequisites=[]
)

async def run_test():
    print(f"Generating 3 MCQs for LO: {lo.text}")
    print(f"Bloom Level: {lo.bloom_level.value}, Verb: {lo.bloom_verb.value}\n")
    
    items = await AssessmentService.generate_mcqs_for_lo(lo, mock_text, count=3)
    
    if items:
        print("✅ Successfully generated MCQs!\n")
        
        for i, item in enumerate(items):
            print(f"Q{i+1}: {item.stem}")
            for j, opt in enumerate(item.options):
                mark = "✅" if opt.is_correct else "❌"
                print(f"  {mark} {chr(65+j)}. {opt.text}")
                print(f"     Justification: {opt.justification}")
            print("\n")
    else:
        print("❌ Failed to generate MCQs.")

if __name__ == "__main__":
    asyncio.run(run_test())
