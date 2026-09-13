# Backend Service

The backend is a FastAPI application with an intentionally small dependency surface and explicit boundaries between transport, domain data, retrieval, and file acceptance.

## Module map

- `main.py`: application factory wiring, middleware, health endpoint, and router registration.
- `core/config.py`: cached Pydantic settings loaded from the root `.env` file.
- `schemas.py`: request and response contracts shared by routes and services.
- `knowledge.py`: deterministic demo corpus and report factory used when no provider is configured.
- `api/routes.py`: HTTP transport only. Business decisions belong in services.
- `services/retrieval.py`: query normalization, term extraction, candidate count simulation, and CRAG trace creation.
- `services/uploads.py`: file type and size policy. Persistent object storage belongs behind this boundary.
- `tests/test_api.py`: contract tests for health, query, validation, and future additions.

## Design rules

1. Routes translate HTTP into typed service calls and return typed responses.
2. Services do not know about HTTP status codes or browser state.
3. Schemas are the contract. Add fields compatibly and update the frontend type mirror when response shape changes.
4. Every generated finding should carry supporting citation IDs.
5. Retrieval traces are first-class output because an evaluator needs to inspect why a report was produced.
6. Demo mode must remain deterministic. It is used for local UI development and contract testing, not quality claims.

## Replacing demo retrieval

Implement a provider behind `services/retrieval.py` or a new `services/providers/` package. Keep `run_hybrid_retrieval` responsible for orchestration and have the provider return normalized candidates. The response should continue to include a `RetrievalTrace` even when the provider fails. Provider errors should be observable and should never silently become a high-confidence clinical claim.

## Running backend checks

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements-dev.txt
python -m pytest backend\tests -q
ruff check backend
```

## Production additions

The service still needs authentication, workspace authorization, persistence, job queues, object storage, structured logging, request IDs, rate limits, and a real model gateway before processing sensitive data. These are intentionally separate tasks because each affects threat modeling and validation.
