from fastapi import APIRouter, HTTPException
from app.services.candidate_service import get_candidate_info

router = APIRouter(
    prefix="/candidate",
    tags=["candidate"]
)

@router.get("/{candidate_id}")
def get_candidate(candidate_id: int):
    try:
        candidate_info = get_candidate_info(candidate_id)
        return candidate_info
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve candidate"
        )