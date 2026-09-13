from typing import Literal

from pydantic import BaseModel, Field, field_validator

SpecimenType = Literal["stool", "blood", "skin", "water", "unknown"]
SourceType = Literal["CDC", "WHO", "PubMed", "Demo"]


class QueryRequest(BaseModel):
    question: str = Field(min_length=3, max_length=2_000)
    patient_context: str = Field(default="", max_length=5_000)
    specimen: SpecimenType = "unknown"
    geography: str = Field(default="", max_length=120)
    host: str = Field(default="human", max_length=120)
    include_web_fallback: bool = True

    @field_validator("question")
    @classmethod
    def normalize_question(cls, value: str) -> str:
        return " ".join(value.split())


class Citation(BaseModel):
    id: str
    title: str
    source: SourceType
    year: int = Field(ge=1900, le=2100)
    relevance: int = Field(ge=0, le=100)
    excerpt: str
    url: str | None = None


class Finding(BaseModel):
    organism: str
    classification: str
    confidence: int = Field(ge=0, le=100)
    rationale: str
    confirmatory_tests: list[str]
    supporting_citation_ids: list[str] = []


class RetrievalTrace(BaseModel):
    query_terms: list[str]
    dense_candidates: int
    sparse_candidates: int
    reranked_candidates: int
    grader_decision: Literal["sufficient", "rewritten", "fallback"]
    passes: int
    latency_ms: int


class DiagnosticReport(BaseModel):
    report_id: str
    query: str
    summary: str
    findings: list[Finding]
    citations: list[Citation]
    next_steps: list[str]
    retrieval_mode: str
    retrieval_trace: RetrievalTrace
    generated_at: str
    safety_note: str


class UploadReceipt(BaseModel):
    upload_id: str
    filename: str
    content_type: str
    status: Literal["accepted", "rejected"]
    bytes: int
    next_step: str
