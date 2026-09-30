from typing import Literal
from pydantic import BaseModel, Field

class ScoreBreakdown(BaseModel):
    skills: str
    experience: str
    qualifications: str


class LLMOutput(BaseModel):
    file_name: str
    candidate_name: str | None
    candidate_email: str | None
    candidate_phone: str | None
    status: Literal["passed", "failed"]
    score: float = Field(ge=0.0, le=1.0)
    score_breakdown: ScoreBreakdown
    response: str