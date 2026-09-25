from fastapi import APIRouter, HTTPException

from app.schemas.job import JobCreate
from app.services.job_service import ( create_job, get_all_jobs, get_job_by_id, update_job, delete_job)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.post("/")
def create_job_api(job: JobCreate): 

    try:

        job_data = create_job(job)

        return {
            "success": True,
            "message": "Job created successfully",
            "job": job_data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail="Failed to create job"
        )
        
@router.get("/")
def get_all_jobs_api():

    try:

        jobs = get_all_jobs()

        return {
            "success": True,
            "message": "Jobs retrieved successfully",
            "jobs": jobs
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve jobs"
        )
        
@router.get("/{job_id}")
def get_job(job_id: int):

    try:

        job = get_job_by_id(job_id)

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "success": True,
            "job": job
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch job"
        )
        
@router.put("/{job_id}")
def update_job_api(
    job_id: int,
    job: JobCreate
):

    try:

        updated_job = update_job(
            job_id,
            job
        )

        if not updated_job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "success": True,
            "message": "Job updated successfully",
            "job": updated_job
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to update job"
        )
        
@router.delete("/{job_id}")
def delete_job_api(job_id: int):

    try:

        deleted_job = delete_job(job_id)

        if not deleted_job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "success": True,
            "message": "Job deleted successfully",
            "job_id": deleted_job["id"]
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to delete job"
        )