"""
Unified Model Context Protocol (MCP) Tool Provider.
Single Source of Truth for tool schemas and tool execution.
Used across stdio servers, HTTP routers, and Claude Desktop / Cursor clients.
"""

import json
from typing import Dict, Any, Optional, List
from services.orchestrator import orchestrate, OrchestratorResult
from services.db import get_db
from dependencies import get_supabase_client

TOOLS_SPEC = [
    {
        "name": "get_context_pack",
        "description": "Calls the Master Context Orchestrator to assemble the Minimum Sufficient Context Pack for a goal, including authority gating, entity coreference, contradiction detection, and reduction metrics.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "goal": {
                    "type": "string",
                    "description": "User goal, question, or task specification"
                },
                "space_id": {
                    "type": "string",
                    "description": "Optional space UUID to scope the context assembly"
                },
                "max_tokens": {
                    "type": "integer",
                    "description": "Maximum token budget for assembled pack (default: 4000)",
                    "default": 4000
                }
            },
            "required": ["goal"]
        }
    },
    {
        "name": "resolve_entity",
        "description": "Performs semantic coreference reasoning to map a raw mention to its canonical entity record and aliases.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "mention": {
                    "type": "string",
                    "description": "Entity mention or alias to look up or resolve (e.g. 'Priya' or 'AI-842')"
                }
            },
            "required": ["mention"]
        }
    },
    {
        "name": "report_contradiction",
        "description": "Records a newly discovered cross-source conflict into the live contradiction review ledger.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "source_a": {"type": "string", "description": "First conflicting source name or ID"},
                "source_b": {"type": "string", "description": "Second conflicting source name or ID"},
                "conflicting_field": {"type": "string", "description": "Field or statement in conflict (e.g. 'Deadline')"},
                "explanation": {"type": "string", "description": "Detailed explanation of the disagreement"}
            },
            "required": ["source_a", "source_b", "conflicting_field", "explanation"]
        }
    },
    {
        "name": "capture_add_memory",
        "description": "Ingests a new raw memory, document snippet, or decision into the live database.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Raw text content"},
                "title": {"type": "string", "description": "Optional title for capture"},
                "space_id": {"type": "string", "description": "Optional target space ID"}
            },
            "required": ["content"]
        }
    }
]

async def execute_mcp_tool(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Single dispatch point for all MCP tool executions."""
    if name == "get_context_pack":
        goal = args.get("goal", "")
        space_id = args.get("space_id")
        max_tokens = args.get("max_tokens", 4000)
        
        supabase = get_supabase_client()
        user_id = "00000000-0000-0000-0000-000000000000"

        orch_result: OrchestratorResult = await orchestrate(
            supabase=supabase,
            user_id=user_id,
            goal_text=goal,
            space_id=space_id,
            max_tokens=max_tokens
        )

        return {
            "status": "SUCCESS",
            "goal": goal,
            "context_pack": orch_result.context_pack.dict() if hasattr(orch_result.context_pack, "dict") else orch_result.context_pack,
            "pipeline_log": orch_result.pipeline_log,
            "agent_trace": orch_result.agent_trace
        }

    elif name == "resolve_entity":
        mention = args.get("mention", "")
        db = get_db()
        all_entities = list(db.resolved_entities.values())
        matches = [e for e in all_entities if mention.lower() in e.get("canonical_name", "").lower() or any(mention.lower() in a.lower() for a in e.get("aliases", []))]
        
        return matches[0] if matches else {
            "canonical_name": mention,
            "aliases": [mention],
            "status": "live_unresolved_mention"
        }

    elif name == "report_contradiction":
        db = get_db()
        created = db.create_contradiction(
            space_id=args.get("space_id", "default"),
            capture_a_id=args.get("source_a"),
            capture_b_id=args.get("source_b"),
            conflicting_field=args.get("conflicting_field"),
            description=args.get("explanation"),
            contradiction_type="conflicting_requirement",
            severity="high"
        )
        return {"status": "RECORDED", "contradiction_id": created["id"]}

    elif name == "capture_add_memory":
        db = get_db()
        demo_user = "00000000-0000-0000-0000-000000000000"
        content = args.get("content", "")
        title = args.get("title", content[:30] + "...")
        space_id = args.get("space_id")
        
        cap = db.create_capture(
            user_id=demo_user,
            original_content=content,
            capture_type="text",
            title=title,
            source_type="mcp_agent",
            space_ids=[space_id] if space_id else []
        )
        return {"status": "SUCCESS", "capture_id": cap["id"], "title": title}

    else:
        raise ValueError(f"Tool '{name}' not found")
