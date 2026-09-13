# NemaLens AI Architecture

## Purpose

NemaLens AI is a research workspace for evidence-linked parasitology reasoning. Its architecture separates a polished review surface from a provider-agnostic evidence pipeline. That separation lets a team validate interaction design and response contracts with demo data before connecting model providers or sensitive data stores.

## Request lifecycle

```text
Browser
  -> Next.js client coordinator
  -> FastAPI typed route
  -> QueryRequest validation
  -> query normalization
  -> dense + sparse retrieval adapters
  -> reranking
  -> relevance grading
  -> corrective rewrite or web fallback
  -> structured synthesis
  -> citation and safety validation
  -> DiagnosticReport
  -> browser evidence trace
```

## Ownership boundaries

### Browser

Owns transient form state, loading state, selected evidence filename, tabs, and graceful offline fallback. It does not own API keys, retrieval rules, patient persistence, or final safety decisions.

### API transport

Owns authentication hooks, request validation, CORS, rate limiting, and response serialization. Routes should remain thin so their behavior is easy to contract-test.

### Retrieval orchestration

Owns query expansion, metadata filters, hybrid candidate generation, reranking, grader decisions, and trace events. It should not build HTML or depend on browser libraries.

### Persistence

Owns workspace membership, report versions, source snapshots, ingestion jobs, and audit events. PostgreSQL is the system of record; Redis is ephemeral coordination; Qdrant is a rebuildable search index.

### Document workers

Own malware-scanned object retrieval, OCR, PDF parsing, table extraction, chunking, embedding, and index upserts. Workers must be idempotent and resumable.

## Data model direction

Core relational entities:

- `users`: identity and account status.
- `workspaces`: organizational boundary and data region.
- `workspace_members`: role and permissions.
- `investigations`: query, specimen metadata, lifecycle status, and owner.
- `reports`: immutable report versions with model and index provenance.
- `report_findings`: normalized organism candidates and confidence values.
- `citations`: source metadata and retrieved excerpt snapshots.
- `documents`: original file metadata, hash, parse status, and storage key.
- `ingestion_jobs`: retryable workflow state and error details.
- `audit_events`: access, export, retrieval, and review events.

The vector index should store a `document_id`, `chunk_id`, source type, publication year, taxonomy path, page number, specimen tags, geography tags, and content hash in every payload.

## CRAG state machine

- `PARSE`: turn free text into structured concepts.
- `RETRIEVE`: run dense and sparse search with filters.
- `RERANK`: score the top candidate set with a cross-encoder.
- `GRADE`: decide whether the context supports the requested task.
- `CORRECT`: rewrite only the missing terms and repeat retrieval.
- `FALLBACK`: use an approved web source connector when the local index is insufficient.
- `SYNTHESIZE`: create the constrained JSON report.
- `VERIFY`: check citation coverage, schema validity, and safety rules.
- `PUBLISH`: persist an immutable report version for review.

A production graph should cap correction passes, record every transition, and return a low-confidence state when evidence remains insufficient.

## Failure handling

- Provider timeout: return a retriable status and preserve the last valid report.
- Invalid model JSON: repair once, then fail closed with a structured error.
- No relevant context: state that evidence was insufficient; do not fill the gap with general medical knowledge.
- Upload rejection: return the allowed formats and size limit.
- Index unavailable: allow case drafting but disable synthesis.
- Citation URL unavailable: preserve the source title, retrieved excerpt, and snapshot metadata.
