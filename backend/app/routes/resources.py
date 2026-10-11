"""Curated Learning Resources Route."""

from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.graph_service import graph_service

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.get("")
def list_resources(
    skill_id: Optional[str] = Query(None, description="Filter by skill ID"),
    is_free: Optional[bool] = Query(None, description="Filter by free resources only")
):
    return graph_service.get_resources(skill_id=skill_id, is_free=is_free)
