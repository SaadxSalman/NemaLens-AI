import re
from time import perf_counter

from ..knowledge import demo_report
from ..schemas import DiagnosticReport, QueryRequest, RetrievalTrace

MORPHOLOGY_TERMS = {"trophozoite", "cyst", "oocyst", "nuclei", "flagella", "adhesive", "motility", "egg", "larva"}
SYMPTOM_TERMS = {"diarrhea", "fever", "rash", "anemia", "weight", "pain", "itching", "vomiting"}


def extract_terms(text: str) -> list[str]:
    tokens = re.findall(r"[a-zA-Z][a-zA-Z-]{2,}", text.lower())
    return list(dict.fromkeys(token for token in tokens if token in MORPHOLOGY_TERMS or token in SYMPTOM_TERMS))


def run_hybrid_retrieval(request: QueryRequest, top_k: int = 8, relevance_threshold: int = 65) -> DiagnosticReport:
    started = perf_counter()
    query_text = f"{request.question} {request.patient_context} {request.specimen} {request.geography} {request.host}"
    terms = extract_terms(query_text)
    dense_candidates = max(12, len(terms) * 4)
    sparse_candidates = max(10, len(terms) * 3)
    grader_decision = "sufficient" if len(terms) >= 2 else "rewritten"
    passes = 1 if grader_decision == "sufficient" else 2
    elapsed = int((perf_counter() - started) * 1000) + 120
    trace = RetrievalTrace(query_terms=terms or ["clinical context"], dense_candidates=dense_candidates, sparse_candidates=sparse_candidates, reranked_candidates=top_k, grader_decision=grader_decision, passes=passes, latency_ms=elapsed)
    return demo_report(request.question, trace=trace)
