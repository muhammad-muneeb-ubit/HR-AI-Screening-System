from fastapi import FastAPI
from app.api.routes.jobs import router as jobs_router
from app.api.routes.skills import router as skills_router
from app.api.routes.llm import router as llm_router

app = FastAPI(
    title="AI Resume Screening System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Resume Screening System API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }
    
app.include_router(
    jobs_router,
    prefix="/api"
)

app.include_router(
    skills_router,
    prefix="/api"
)

app.include_router(
    llm_router,
    prefix="/api"
)

