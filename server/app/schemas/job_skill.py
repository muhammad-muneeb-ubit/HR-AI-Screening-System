from typing import Literal

from pydantic import BaseModel


class JobSkillCreate(BaseModel):

    skill_id: int

    skill_type: Literal["required", "optional"]