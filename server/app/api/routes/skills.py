from fastapi import APIRouter, HTTPException

from app.schemas.skill import SkillCreate

from app.services.skill_service import (
    create_skill,
    get_all_skills,
    get_skill_by_id,
    delete_skill
)


router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.post("/")
def create_skill_api(skill: SkillCreate):

    try:

        created_skill = create_skill(skill)

        return {
            "success": True,
            "message": "Skill created successfully",
            "skill": created_skill
        }

    except Exception as e:

        if "unique" in str(e).lower():

            raise HTTPException(
                status_code=409,
                detail="Skill already exists"
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to create skill"
        )


@router.get("/")
def get_skills():

    try:

        skills = get_all_skills()

        return {
            "success": True,
            "count": len(skills),
            "skills": skills
        }

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch skills"
        )


@router.get("/{skill_id}")
def get_skill(skill_id: int):

    try:

        skill = get_skill_by_id(skill_id)

        if not skill:

            raise HTTPException(
                status_code=404,
                detail="Skill not found"
            )

        return {
            "success": True,
            "skill": skill
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch skill"
        )


@router.delete("/{skill_id}")
def delete_skill_api(skill_id: int):

    try:

        deleted_skill = delete_skill(skill_id)

        if not deleted_skill:

            raise HTTPException(
                status_code=404,
                detail="Skill not found"
            )

        return {
            "success": True,
            "message": "Skill deleted successfully",
            "skill_id": deleted_skill["id"]
        }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Failed to delete skill"
        )