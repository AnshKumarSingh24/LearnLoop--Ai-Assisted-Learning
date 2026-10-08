from typing import Optional
from uuid import UUID
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings
from services.db import get_db

security = HTTPBearer(auto_error=False)

class MockUser:
    def __init__(self, user_id: str = "00000000-0000-0000-0000-000000000000", email: str = "demo@capture.ai"):
        self.id = user_id
        self.email = email


def get_supabase_client():
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        try:
            from supabase import create_client
            return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        except Exception:
            return None
    return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Returns the authenticated user or falls back to the default demo user
    for local-first, friction-free operation and high demo reliability.
    """
    if not credentials or not credentials.credentials:
        return MockUser()

    token = credentials.credentials
    supabase = get_supabase_client()
    if supabase:
        try:
            user_resp = supabase.auth.get_user(token)
            if user_resp and user_resp.user:
                return user_resp.user
        except Exception:
            pass

    # In local/demo mode, accept token or return mock user
    return MockUser(user_id="00000000-0000-0000-0000-000000000000")
