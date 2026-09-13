# NemaLens AI

NemaLens AI is an evidence-linked parasitology research workspace. It brings microscopy observations, clinical context, and authoritative literature into one review surface so a researcher can move from an uncertain finding to a defensible differential diagnosis without losing the source trail.

The repository contains a working vertical slice today: a Next.js dashboard, a FastAPI service, a deterministic demo corpus, upload handling, structured diagnostic output, an environment-backed configuration layer, and local infrastructure definitions for PostgreSQL, Redis, and Qdrant. Provider adapters are intentionally documented as the next production integration boundary rather than being hidden behind fake credentials.

> **Important:** NemaLens AI is research support software. It is not a medical device, does not make an autonomous diagnosis, and must not be used as a substitute for qualified clinical judgment, laboratory confirmation, local protocols, or specialist review.

## What is included

- A responsive diagnostic desk for morphology and symptom queries.
- Microscopy/PDF attachment control with a backend upload endpoint.
- Structured differential results with confidence, rationale, confirmatory tests, and source citations.
- A CRAG-style status rail showing parsing, retrieval, grading, and synthesis stages.
- Evidence trace cards for CDC, WHO, and PubMed-style sources.
- A FastAPI API with OpenAPI documentation at `/docs`.
- A deterministic local mode that works without model keys, databases, or network calls.
- A single root `.env` file for local secrets and provider configuration.
- A compose file for the persistence and retrieval services used by a production deployment.

## Product shape

The product is designed around a simple review loop:

1. Describe what was seen, including morphology, specimen type, exposure, and symptoms.
2. Attach a microscopy image or source document when available.
3. Run analysis. The orchestration layer parses the query, retrieves evidence, grades its relevance, and creates a structured synthesis.
4. Inspect the ranked differential and the confirmatory tests attached to each candidate.
5. Open the evidence trace and verify the claims against the source literature.
6. Record the next laboratory or research action in the case notes.

The interface intentionally makes uncertainty visible. A high match score is not presented as a definitive diagnosis; it is paired with rationale, competing candidates, and a specific confirmation path.

## Repository layout

```text
NemaLens-AI/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, schemas, demo retrieval route
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── globals.css         # Product UI system and responsive layout
│   │   ├── layout.tsx          # App metadata and root layout
│   │   └── page.tsx            # Diagnostic desk and seeded demo workflow
│   └── next.config.ts
├── .env                        # Local-only values; ignored by Git
├── .env.example                # Safe configuration template
├── docker-compose.yml          # PostgreSQL, Redis, Qdrant
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js 20 or newer.
- npm 10 or newer.
- Python 3.11 or newer. Python 3.12 is a good production default.
- Docker Desktop if you want to run PostgreSQL, Redis, and Qdrant locally.

The demo mode does not require Docker, a GPU, an embedding model, or an external API key.

## Quick start

### 1. Install JavaScript dependencies

```powershell
npm install
```

### 2. Create the local environment

The repository already contains a development `.env` with empty provider keys. For a fresh checkout, copy the template instead:

```powershell
Copy-Item .env.example .env
```

The `.env` file is ignored by Git. Never commit it, paste it into an issue, or include it in a screenshot.

### 3. Install Python dependencies

Create a virtual environment so the API dependencies do not leak into the global interpreter:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
```

On macOS/Linux, activate the environment with `source .venv/bin/activate` and use `/` in the paths above.

### 4. Start the API

```powershell
npm run api
```

The API will be available at `http://localhost:8000`. Open `http://localhost:8000/docs` to inspect and exercise the OpenAPI contract.

### 5. Start the dashboard

In a second terminal:

```powershell
npm run dev
```

Open `http://localhost:3000`.

The dashboard ships with a seeded Giardia investigation, so it is useful even when the API is offline. When the API is available, the Run analysis button calls `POST /api/v1/query` and replaces the seeded report with the structured response.

## Local infrastructure

Start the persistence and retrieval services with:

```powershell
docker compose up -d
```

The services are exposed at:

| Service | URL | Purpose |
| --- | --- | --- |
| PostgreSQL | `localhost:5432` | Users, workspaces, cases, chat history, audit events |
| Redis | `localhost:6379` | Queue state, rate limits, embedding cache, short-lived sessions |
| Qdrant | `localhost:6333` | Dense vectors and payload-filtered literature retrieval |

The compose file uses development credentials. Change them before any shared environment is used. Stop services with `docker compose down`; preserve their local volumes unless you deliberately want to discard local data.

## API contract

### `GET /health`

Returns a small liveness response:

```json
{
  "status": "ok",
  "service": "nemalens-api"
}
```

### `POST /api/v1/query`

Request:

```json
{
  "question": "Pear-shaped trophozoites with two nuclei and greasy diarrhea after hiking",
  "patient_context": "Adult researcher, symptoms for 5 days",
  "specimen": "stool"
}
```

`specimen` accepts `stool`, `blood`, `skin`, `water`, or `unknown`.

Response shape:

```json
{
  "query": "Pear-shaped trophozoites with two nuclei and greasy diarrhea after hiking",
  "summary": "The morphology and clinical context most strongly support Giardia duodenalis.",
  "findings": [
    {
      "organism": "Giardia duodenalis",
      "classification": "Protozoa · Intestinal flagellate",
      "confidence": 92,
      "rationale": "A pear-shaped trophozoite with two nuclei ...",
      "confirmatory_tests": ["Stool antigen EIA", "Multiplex stool NAAT"]
    }
  ],
  "citations": [
    { "title": "DPDx: Giardiasis", "source": "CDC", "year": 2024, "relevance": 98 }
  ],
  "next_steps": ["Order a Giardia antigen assay or multiplex NAAT."],
  "retrieval_mode": "Demo corpus · CRAG simulation",
  "safety_note": "Research support only."
}
```

### `POST /api/v1/upload`

Accepts a multipart field named `file`. The current implementation validates receipt and returns metadata. Production ingestion should move the file to object storage, create an ingestion job, and return a job identifier instead of keeping the file in request memory.

## CRAG implementation plan

The current API keeps the contract stable while using a deterministic knowledge object. The production orchestration should preserve that contract and implement the following graph:

```text
query + image
    │
    ├── clinical text normalization
    ├── image feature extraction
    └── metadata filters (specimen, host, geography, date)
             │
             ▼
       hybrid retrieval
    dense vectors + BM25
             │
             ▼
       cross-encoder rerank
             │
             ▼
       relevance grader
        /          \
   sufficient       weak
      │              │
      ▼              ├── query rewrite
  evidence           ├── web fallback
  synthesis          └── retry with relaxed filters
      │
      ▼
 structured report + citations + safety checks
```

Recommended production responsibilities:

- **Query parser:** Extract organism hints, morphology terms, specimen, host, geography, exposure, and timeframe.
- **Dense retrieval:** Embed the normalized clinical/morphology text with Snowflake Arctic Embed or a selected medical embedding model.
- **Visual retrieval:** Encode microscopy images with a validated vision encoder; store image vectors separately from text vectors and fuse scores.
- **Sparse retrieval:** Maintain BM25 terms for uncommon morphology words, taxonomic names, stains, and laboratory methods.
- **Reranker:** Use BGE-Reranker or another cross-encoder to score query/chunk pairs.
- **Grader:** Ask a constrained evaluator to label each chunk as relevant, partial, or irrelevant and return an explanation for observability.
- **Corrector:** Rewrite only the missing concepts, retry retrieval, and log the reason for every additional retrieval pass.
- **Generator:** Produce JSON that conforms to the Pydantic response model. Reject invalid output and retry with a repair prompt.
- **Citation guard:** Every clinical assertion must map to one or more retrieved chunk IDs. Claims without support should be omitted or labeled as hypotheses.
- **Safety guard:** Refuse medication dosing or patient-specific treatment decisions unless a qualified clinician has reviewed the output in the intended regulated workflow.

## Document ingestion plan

The secure ingestion pipeline should be asynchronous and idempotent:

1. Verify MIME type, extension, file size, and malware scan result.
2. Store the original in private object storage with a random key.
3. Create a document record and an ingestion job in PostgreSQL.
4. Extract text and tables with a PDF parser. Use OCR only for pages that lack a usable text layer.
5. Preserve page number, bounding box, table identifier, figure caption, DOI, and source URL as chunk metadata.
6. Normalize taxonomy terms without deleting the original text.
7. Chunk around headings and table boundaries, with overlap tuned for dense diagnostic manuals.
8. Compute text and, where applicable, image embeddings.
9. Upsert vectors with a stable content hash so re-ingestion is safe.
10. Mark the document searchable only after all chunks pass validation.

Do not send patient identifiers to a hosted model without an approved data-processing agreement. De-identify clinical context before embedding, and keep the original case data in a regional store with audit access.

## Environment variables

All important local configuration belongs in the root `.env` file. `.env.example` documents the expected names without secrets.

| Variable | Required for demo | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Browser URL for the FastAPI service |
| `CORS_ORIGINS` | Yes | Comma-separated browser origins accepted by the API |
| `JWT_SECRET` | Production | Secret used to sign access tokens |
| `DATABASE_URL` | Production persistence | Async PostgreSQL connection string |
| `REDIS_URL` | Production queues | Redis connection string |
| `QDRANT_URL` | Production retrieval | Qdrant endpoint |
| `QDRANT_API_KEY` | Hosted Qdrant | Qdrant authentication key |
| `OPENAI_API_KEY` | Optional | Hosted model or embedding provider |
| `GROQ_API_KEY` | Optional | Low-latency inference provider |
| `OLLAMA_BASE_URL` | Optional | Local model server URL |

The frontend only exposes variables prefixed with `NEXT_PUBLIC_`. Never put private keys in a variable with that prefix. Never access provider keys from client components.

## Testing and quality gates

Run the frontend production build:

```powershell
npm run build
```

Compile-check the API:

```powershell
python -m py_compile backend\main.py
```

Before production, add and require:

- Unit tests for query parsing, score fusion, confidence calibration, citation coverage, and safety filtering.
- Contract tests for every API response schema.
- Ingestion fixtures for born-digital PDFs, scanned pages, tables, captions, and malformed files.
- Retrieval evaluation sets with labeled relevant and irrelevant chunks.
- Prompt regression tests for unsupported claims and citation drift.
- Browser tests for upload, long queries, mobile layouts, offline API fallback, and report export.
- Dependency and container scans in CI.

## Security checklist

- Keep `.env` ignored and rotate any credential that has ever been committed.
- Use a secret manager in shared and production environments.
- Enforce HTTPS and secure cookies outside local development.
- Add authentication and workspace-level authorization before exposing case data.
- Apply upload size, type, and rate limits before parsing.
- Malware-scan files and isolate document parsing workers.
- Encrypt object storage, database backups, and queue payloads.
- Keep a tamper-evident audit event for report generation, source access, exports, and admin actions.
- Avoid retaining raw patient identifiers in prompts, embeddings, logs, and analytics.
- Pin container images by digest for production deploys.
- Make source provenance and model version visible in every exported report.

## Deployment shape

A practical first production deployment separates the web, API, and workers:

- Next.js on a managed Node platform or container runtime.
- FastAPI behind a TLS-terminating gateway with multiple replicas.
- A worker deployment for OCR, parsing, embedding, and ingestion retries.
- Managed PostgreSQL with backups and point-in-time recovery.
- Managed Redis for queues and short-lived state.
- Qdrant Cloud or a protected Qdrant cluster with snapshots.
- Private object storage for originals and derived thumbnails.
- Centralized logs and traces with request IDs carried through every graph node.

Use a staging corpus with synthetic or de-identified cases. Do not validate a new model or retrieval index against identifiable patient data.

## Roadmap

### Near term

- Persist workspaces, investigations, reports, and source bookmarks in PostgreSQL.
- Add authentication and role-based access for researcher, clinician, reviewer, and administrator roles.
- Replace the seeded object with a LangGraph orchestration package behind the existing endpoint.
- Add asynchronous ingestion jobs and visible document processing status.
- Implement image preview, OCR overlays, and morphology annotations.

### Retrieval quality

- Build a curated benchmark across protozoa, helminths, and ectoparasites.
- Measure recall@k, nDCG, citation coverage, unsupported-claim rate, and grader calibration.
- Add geography and host filters for epidemiology queries.
- Include WHO outbreak and CDC DPDx updates with source freshness metadata.

### Clinical workflow

- Add report versioning and reviewer sign-off.
- Add export to a source-linked PDF.
- Make differential confidence explicitly calibrated against a labeled validation set.
- Add a second-review queue for low-confidence or conflicting evidence.

## License and responsibility

Choose and add a license before public distribution. Until then, treat this repository as an internal prototype. The authors and contributors are not responsible for decisions made from unreviewed model output. Any clinical deployment requires appropriate validation, governance, privacy review, security review, and regulatory assessment for its intended use.

## Detailed development guide

### How the current demo behaves

The application deliberately supports two modes. In offline demo mode, the browser renders a stable Giardia case from `frontend/lib/demo-report.ts`. Clicking **Run analysis** attempts the API request; if the API is not available, the seeded report remains visible and the interface finishes its loading state. This makes visual development and product review possible without a running model server.

When the API is available, `frontend/lib/api.ts` sends a typed request to FastAPI. The backend validates it with Pydantic, extracts morphology and symptom terms, creates a retrieval trace, and returns the deterministic knowledge report with the submitted question and computed trace. The demo provider is intentionally predictable so contract tests do not depend on model temperature, external uptime, or changing web results.

### Why the API is split into layers

The backend uses a transport/domain/provider boundary:

- `backend/main.py` is responsible for application construction and middleware.
- `backend/api/routes.py` owns HTTP verbs and response models.
- `backend/schemas.py` owns the external contract.
- `backend/services/retrieval.py` owns query terms and retrieval decisions.
- `backend/services/uploads.py` owns file acceptance policy.
- `backend/knowledge.py` owns local fixture data.
- `backend/core/config.py` owns environment configuration.

This prevents provider-specific code from leaking into route handlers and makes it possible to test retrieval decisions without starting a web server. See [docs/architecture.md](docs/architecture.md) for the future state and [backend/README.md](backend/README.md) for backend-specific rules.

### Why the frontend is split into feature components

The page coordinator owns only workflow state: the current question, the selected file name, the report, the active tab, and the request lifecycle. Presentation and interaction live in small components:

- `QueryComposer` handles the user’s input and evidence attachment.
- `PipelineStatus` makes orchestration state inspectable.
- `ReportSummary` and `FindingList` keep diagnostic reasoning readable.
- `EvidenceList` keeps provenance adjacent to the report.
- `lib/api.ts` centralizes browser requests.
- `lib/types.ts` mirrors the API contract.

This layout is intentionally modest. It gives future routes such as `/library`, `/specimens`, and `/investigations/[id]` somewhere to grow without turning the dashboard into a single unreviewable component.

### Adding a new parasite or case fixture

For a demo case, add citations and a report factory to `backend/knowledge.py`, then add a matching browser fixture if the user experience needs a distinct loading or empty state. Keep the case synthetic or fully de-identified. Add a test asserting the organism, citation source, and confirmatory test fields. Do not infer production accuracy from a hand-authored fixture.

### Adding a real retrieval provider

Create an adapter with a narrow interface such as:

```python
class RetrievalProvider(Protocol):
  async def search(self, query: NormalizedQuery, limit: int) -> list[EvidenceChunk]: ...
```

The provider should receive normalized query concepts and return source chunks with stable IDs, source metadata, scores, and excerpts. The orchestration service should remain responsible for fusion, reranking, relevance grading, retries, trace events, and the final report. A provider must never return unverified prose as if it were a citation.

### Adding persistence

Start with migrations and repositories rather than placing SQL in route handlers. Store immutable report versions so a later index or model change cannot rewrite a historical review. Keep the source excerpt used at generation time, not only a URL that may change. Include provider name, model version, embedding version, prompt version, and index snapshot in the report provenance.

### Adding authentication

Authentication should be introduced before any persistent clinical or patient-linked data. The expected boundary is:

1. Authenticate the user at the gateway or API.
2. Resolve the active workspace.
3. Authorize access to the investigation and every referenced source.
4. Add the actor and workspace to the audit event.
5. Keep browser tokens out of logs and avoid storing long-lived secrets in local storage.

Workspace authorization is not the same as authentication. A valid user must still be prevented from reading another workspace’s investigations, files, citations, and exports.

### Running quality checks

Install development dependencies once:

```powershell
pip install -r backend\requirements-dev.txt
```

Then run the full local checks:

```powershell
npm run build
npm run test:api
npm run lint:python
```

The test suite is intentionally small at this stage. Expand it with provider contract tests, ingestion fixtures, retrieval evaluation, and browser tests before treating a model-backed deployment as validated. The complete evaluation strategy lives in [docs/evaluation.md](docs/evaluation.md).

### Environment and secret handling

The root `.env` is ignored by Git. `.env.example` is the only file intended to be copied between developers. Frontend-exposed values must use the `NEXT_PUBLIC_` prefix and must be non-secret. Provider keys belong only in backend runtime configuration. In CI, inject secrets through the CI secret store and write a temporary environment file at job runtime rather than committing a second environment file.

### Source governance

Every source connector should record source name, canonical URL, access timestamp, publication/update year, license or usage constraints, and a content hash. Curated CDC, WHO, and PubMed material should be versioned as an ingestion collection. When a source is retracted or materially updated, mark affected chunks and reports for review rather than deleting history.

### Clinical safety boundaries

NemaLens should answer questions about evidence and differential possibilities, not issue treatment instructions. The product must distinguish:

- observed morphology from inferred morphology;
- retrieved evidence from generated explanation;
- a candidate organism from a confirmed diagnosis;
- a recommended confirmatory test from a treatment decision;
- a research report from an authorized clinical record.

These distinctions belong in the schema, prompts, UI labels, exports, evaluation set, and governance process. A safety disclaimer at the bottom of a screen is necessary but not sufficient.

### Suggested implementation order for production

1. Add authentication, workspace authorization, audit events, and structured request IDs.
2. Add PostgreSQL migrations and report version persistence.
3. Add private object storage and asynchronous ingestion jobs.
4. Add PDF/OCR parsing with malware and resource limits.
5. Add Qdrant collections with versioned embedding metadata.
6. Add a real hybrid retriever and a labeled retrieval benchmark.
7. Add reranking, grading, corrective rewrites, and claim-level citation checks.
8. Add a model gateway with provider timeouts, retries, budgets, and redaction.
9. Add browser, API, ingestion, and evaluation CI gates.
10. Complete privacy, security, clinical governance, and regulatory review for the intended deployment.

For operating procedures, incident response, backups, and observability, see [docs/operations.md](docs/operations.md). For endpoint semantics, see [docs/api.md](docs/api.md). The front- and backend-specific contribution notes are in [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).
