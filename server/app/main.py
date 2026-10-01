from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.jobs import router as jobs_router
from app.api.routes.skills import router as skills_router
from app.api.routes.llm import router as llm_router
from app.api.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="AI Resume Screening System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://hr-ai-screening-system.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(
    dashboard_router,
    prefix="/api"
)

