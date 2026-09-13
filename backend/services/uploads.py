from uuid import uuid4

from fastapi import UploadFile

from ..schemas import UploadReceipt

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/tiff", "application/pdf"}


async def accept_upload(file: UploadFile, max_size_bytes: int) -> UploadReceipt:
    payload = await file.read(max_size_bytes + 1)
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_TYPES or len(payload) > max_size_bytes:
        return UploadReceipt(upload_id=str(uuid4()), filename=file.filename or "unknown", content_type=content_type, status="rejected", bytes=len(payload), next_step="Use a JPEG, PNG, TIFF, or PDF under the configured size limit.")
    return UploadReceipt(upload_id=str(uuid4()), filename=file.filename or "microscopy-upload", content_type=content_type, status="accepted", bytes=len(payload), next_step="The ingestion worker will OCR, extract metadata, and index this asset.")
