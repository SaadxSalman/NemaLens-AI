from fastapi import APIRouter, File, UploadFile

from ..core.config import Settings
from ..schemas import DiagnosticReport, QueryRequest, UploadReceipt
from ..services.retrieval import run_hybrid_retrieval
from ..services.uploads import accept_upload


def build_router(settings: Settings) -> APIRouter:
    router = APIRouter()

    @router.post("/query", response_model=DiagnosticReport)
    async def query(request: QueryRequest) -> DiagnosticReport:
        return run_hybrid_retrieval(request, top_k=settings.retrieval_top_k, relevance_threshold=settings.relevance_threshold)

    @router.post("/upload", response_model=UploadReceipt)
    async def upload(file: UploadFile = File(...)) -> UploadReceipt:  # noqa: B008
        return await accept_upload(file, max_size_bytes=settings.max_upload_size_mb * 1024 * 1024)

    return router
