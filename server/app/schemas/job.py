from pydantic import BaseModel, Field


class JobCreate(BaseModel):

    title: str = Field(
        min_length=2,
        max_length=255
    )

    description: str = Field(
        min_length=20
    )

    minimum_score: float = Field(
        default=60,
        ge=0,
        le=100
    )

    minimum_experience: float = Field(
        default=0,
        ge=0
    )

    education_requirement: str | None = None