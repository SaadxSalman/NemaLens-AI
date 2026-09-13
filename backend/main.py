from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import build_router
from .core.config import get_settings

settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    description="Evidence-linked parasitology intelligence API",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "nemalens-api", "environment": settings.environment}


app.include_router(build_router(settings), prefix=settings.api_prefix, tags=["diagnostics"])
