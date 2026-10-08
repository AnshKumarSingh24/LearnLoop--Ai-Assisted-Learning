import asyncio
from typing import AsyncIterator
from datetime import datetime
from .base import (
    KnowledgeSourceAdapter,
    AdapterCapabilities,
    ExternalItem,
    ExternalPayload,
    SyncCheckpoint
)

class SurfSenseAdapter(KnowledgeSourceAdapter):
    """
    Adapter that connects to SurfSense live web capabilities.
    Normalizes SurfSense web results into canonical ExternalItems.
    """
    
    def __init__(self, query: str):
        self.query = query

    async def capabilities(self) -> AdapterCapabilities:
        return AdapterCapabilities(
            name="SurfSenseLiveWeb",
            version="1.0",
            can_stream=True,
            supported_types=["web_context"]
        )

    async def discover(self) -> AsyncIterator[ExternalItem]:
        # Mocking a search to SurfSense's live web engine
        await asyncio.sleep(1) # simulate network latency
        
        # In real life, we would call SurfSense's /api/search or MCP tool
        yield ExternalItem(
            id=f"surfsense_web_{hash(self.query)}",
            metadata={"source": "SurfSense Agent", "query": self.query}
        )

    async def fetch(self, item: ExternalItem) -> ExternalPayload:
        await asyncio.sleep(0.5)
        return ExternalPayload(
            content=f"Live web context for: {self.query}. Found relevant recent articles confirming the details.",
            raw_data={"url": "https://example.com/live-data"}
        )

    async def checkpoint(self) -> SyncCheckpoint:
        return SyncCheckpoint(cursor="done", timestamp=datetime.now().isoformat())

    async def close(self) -> None:
        pass
