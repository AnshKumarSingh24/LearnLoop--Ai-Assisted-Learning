from typing import Any
from models.knowledge import Source, Document
from adapters.base import KnowledgeSourceAdapter

async def ingest_from_adapter(notebook_id: int, adapter: KnowledgeSourceAdapter) -> list[Source]:
    """
    Ingests data from any supported adapter (SurfSense, NotebookLlama, OpenNotebook)
    and normalizes it into the canonical Source and Document models.
    """
    sources_created = []
    
    async for item in adapter.discover():
        payload = await adapter.fetch(item)
        
        # Create canonical Source
        source = Source(
            notebook_id=notebook_id,
            external_id=item.id,
            connector_name="adapter", # would be dynamic based on adapter capabilities
            source_type="web",
            metadata_json=item.metadata
        )
        
        # In a real DB session, we would add 'source' to the session here.
        # session.add(source)
        # session.flush()
        
        # Create canonical Document
        doc = Document(
            source_id=1, # Mock ID, would use source.id
            content=payload.content
        )
        # session.add(doc)
        
        sources_created.append(source)
        
    await adapter.close()
    return sources_created
