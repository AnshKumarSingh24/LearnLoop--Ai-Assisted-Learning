from typing import Protocol, AsyncIterator, Any
from pydantic import BaseModel

class AdapterCapabilities(BaseModel):
    name: str
    version: str
    can_stream: bool
    supported_types: list[str]

class ExternalItem(BaseModel):
    id: str
    metadata: dict

class ExternalPayload(BaseModel):
    content: str
    raw_data: Any

class SyncCheckpoint(BaseModel):
    cursor: str
    timestamp: str

class KnowledgeSourceAdapter(Protocol):
    async def capabilities(self) -> AdapterCapabilities:
        ...

    async def discover(self) -> AsyncIterator[ExternalItem]:
        ...

    async def fetch(self, item: ExternalItem) -> ExternalPayload:
        ...

    async def checkpoint(self) -> SyncCheckpoint:
        ...

    async def close(self) -> None:
        ...
