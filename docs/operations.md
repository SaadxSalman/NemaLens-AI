# Operations Runbook

## Development

Start the API and web app in separate terminals:

```powershell
npm run api
npm run dev
```

Start local dependencies only when testing persistence or retrieval adapters:

```powershell
docker compose up -d
```

## Diagnostics

Check API liveness:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Inspect the OpenAPI contract at `http://localhost:8000/docs`.

Build the web app before a review:

```powershell
npm run build
```

## Incident response

1. Disable synthesis if source provenance or citation validation is degraded.
2. Preserve the user query and report version; do not silently overwrite a report.
3. Record provider, index version, prompt version, and request ID.
4. Rotate credentials if a secret appears in logs or a client bundle.
5. Notify the designated clinical and security reviewers for any incorrect high-confidence output.
6. Re-run the affected evaluation set before re-enabling the provider.

## Backups and recovery

PostgreSQL backups should include point-in-time recovery. Qdrant snapshots are useful but the index must remain rebuildable from source documents and embedding version metadata. Object storage versions should be retained long enough to reproduce a report. Redis should be treated as disposable; never use it as the only store for a report or audit event.

## Observability

Capture structured events for request accepted, retrieval pass, grader decision, provider latency, citation validation, upload rejection, report persisted, and report exported. Redact patient context, raw images, access tokens, and provider keys from logs. Add trace IDs to every event so a reviewer can reconstruct the graph without exposing the clinical payload.
