"""Profile preferences for the local-first learning workspace.

This is deliberately separate from authentication providers: Supabase (when
configured) supplies identity, while this API owns the learning preferences
that the React profile screen edits.
"""
from typing import Any, Dict

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from dependencies import get_current_user
from services.db import get_db

router = APIRouter(prefix="/profile", tags=["Profile"])


class ProfileUpdate(BaseModel):
    firstName: str = Field(default="", max_length=80)
    lastName: str = Field(default="", max_length=80)
    username: str = Field(default="", max_length=80)
    email: str = Field(default="", max_length=320)
    theme: str = Field(default="system", pattern="^(light|dark|system)$")
    language: str = Field(default="en", max_length=12)
    fontSize: str = Field(default="Medium", max_length=20)
    editorFont: str = Field(default="Default", max_length=40)
    defaultView: str = Field(default="Dashboard", max_length=40)
    personalizedLearning: bool = True
    aiSuggestions: bool = True
    learningReminders: bool = True
    weeklyProgress: bool = False
    profileVisibility: bool = False
    cloudStorage: bool = False
    # The LearnLoop onboarding flow stores its course preferences here.  Keeping
    # this as a namespaced object lets the profile endpoint remain forwards
    # compatible while avoiding a separate unauthenticated onboarding store.
    learningProfile: Dict[str, Any] = Field(default_factory=dict)


def _default_profile(user: Any) -> Dict[str, Any]:
    name = (getattr(user, "email", "") or "").split("@", 1)[0]
    return ProfileUpdate(username=name, email=getattr(user, "email", "") or "").model_dump()


@router.get("")
async def get_profile(current_user=Depends(get_current_user)):
    db = get_db()
    return db.get_profile(str(current_user.id), _default_profile(current_user))


@router.put("")
async def update_profile(profile: ProfileUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    # Never take a user id from the browser; profile ownership is token-derived.
    return db.save_profile(str(current_user.id), profile.model_dump())
