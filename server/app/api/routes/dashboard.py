from fastapi import APIRouter, HTTPException

from app.services.dashboard_service import get_dashboard_metrics


router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/")
def get_dashboard():
    try:
        metrics = get_dashboard_metrics()
        return {
            "success": True,
            "metrics": metrics
        }
    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch dashboard data"
        )