"""Target Roles Routes."""

from fastapi import APIRouter, HTTPException
from backend.app.services.graph_service import graph_service

router = APIRouter(prefix="/api/roles", tags=["Roles"])

@router.get("")
def list_roles():
    return graph_service.get_roles()

@router.get("/{role_id}")
def get_role(role_id: str):
    res = graph_service.get_role_detail(role_id)
    if "error" in res or not res.get("role"):
        raise HTTPException(status_code=404, detail="Role not found")
    return res
