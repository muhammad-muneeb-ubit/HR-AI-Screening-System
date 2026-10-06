from fastapi import APIRouter, HTTPException
from app.schemas.job import JobCreate
from app.services.job_service import (
    create_job,
    get_all_jobs,
    get_job_by_id,
    update_job,
    delete_job,
    add_skill_to_job,
    get_job_info,
    get_job_skills,
    remove_skill_from_job,
)
from app.schemas.job_skill import JobSkillCreate

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
            "count": len(jobs),
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
        
@router.post("/{job_id}/skills")
def add_job_skill(
    job_id: int,
    skill: JobSkillCreate
):

    try:

        result = add_skill_to_job(
            job_id,
            skill
        )

        return {
            "success": True,
            "message": "Skill added to job successfully",
            "job_skill": result
        }

    except Exception as e:

        if "foreign key" in str(e).lower():

            raise HTTPException(
                status_code=404,
                detail="Job or skill not found"
            )

        if "unique" in str(e).lower():

            raise HTTPException(
                status_code=409,
                detail="Skill is already assigned to this job"
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to assign skill to job"
        )

@router.get("/{job_id}/skills")
def get_specific_job_info(job_id: int):

    try:

        job = get_job_by_id(job_id)

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        skills = get_job_skills(job_id)

        return {
            "success": True,
            "job_info": get_job_info(job_id),
            "skills": skills
        }

    except HTTPException:
        raise

    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch job skills"
        )
        
@router.delete("/{job_id}/skills/{skill_id}")
def remove_job_skill(
    job_id: int,
    skill_id: int
):

    try:

        result = remove_skill_from_job(
            job_id,
            skill_id
        )

        if not result:

            raise HTTPException(
                status_code=404,
                detail="Skill is not assigned to this job"
            )

        return {
            "success": True,
            "message": "Skill removed from job successfully"
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to remove skill from job"
        )