import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.curriculum_service import CurriculumService
from services.scorm_service import ScormService

mock_markdown = """
# Introduction to Photosynthesis

Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.

## The Light-Dependent Reactions
The first stage of photosynthesis is the light-dependent reactions. These reactions take place in the thylakoid membrane and use light energy to make ATP and NADPH.
"""

async def run_test():
    print("Generating AST from mock markdown...")
    ast = await CurriculumService.generate_ast_from_text(mock_markdown, "Biology 101: Photosynthesis")
    
    if ast:
        print("\n✅ Successfully generated AST!")
        print("Packaging into SCORM 1.2 zip...")
        
        zip_buffer = ScormService.generate_scorm_package(ast)
        
        output_file = "course_export.zip"
        with open(output_file, "wb") as f:
            f.write(zip_buffer.getvalue())
            
        print(f"\n✅ SCORM package saved to {output_file}!")
        print(f"Size: {os.path.getsize(output_file)} bytes")
        
        print("\nTo verify the contents:")
        print(f"unzip -l {output_file}")
    else:
        print("\n❌ Failed to generate AST.")

if __name__ == "__main__":
    asyncio.run(run_test())
