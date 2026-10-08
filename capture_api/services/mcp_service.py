from typing import Dict, Any, List, Optional
from services.mcp_tools import TOOLS_SPEC, execute_mcp_tool

class MCPService:
    @staticmethod
    def get_tool_definitions() -> List[Dict[str, Any]]:
        return TOOLS_SPEC

    @staticmethod
    async def execute_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        return await execute_mcp_tool(name, arguments)
