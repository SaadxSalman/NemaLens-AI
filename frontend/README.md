# Frontend Application

The frontend is a Next.js App Router dashboard built around a single diagnostic desk workflow. It runs in offline demo mode with a seeded report and upgrades to the FastAPI service when the API is available.

## Module map

- `app/layout.tsx`: document metadata and global style entry point.
- `app/page.tsx`: client-side workspace coordinator. It owns query state, report state, active view state, and request lifecycle state.
- `app/globals.css`: visual system, layout primitives, responsive rules, focus treatment, and product styling.
- `lib/types.ts`: browser-side mirror of the API contract.
- `lib/api.ts`: browser-safe HTTP functions. Keep secrets out of this layer.
- `lib/demo-report.ts`: stable local fixture for development and screenshot tests.
- `components/QueryComposer.tsx`: long-form query and evidence attachment control.
- `components/PipelineStatus.tsx`: visible orchestration state.
- `components/ReportSummary.tsx`: high-level report composition.
- `components/FindingList.tsx`: ranked organisms and confirmatory testing actions.
- `components/EvidenceList.tsx`: source provenance and relevance display.

## Interaction principles

- Never imply that a model score is a confirmed diagnosis.
- Keep rationale and confirmation steps adjacent to the organism name.
- Keep the source trace visible without requiring a second page.
- Preserve the seeded report when the API is unavailable so research on the interface is not blocked by infrastructure.
- Treat the upload name as a local acknowledgement only until the backend returns a receipt.
- Keep controls keyboard reachable and label icon-only buttons.

## Adding a new report field

1. Add the field to `backend/schemas.py`.
2. Add or update the fixture in `backend/knowledge.py`.
3. Mirror it in `frontend/lib/types.ts`.
4. Add it to the appropriate component rather than expanding `app/page.tsx`.
5. Add a contract assertion in `backend/tests/test_api.py`.
6. Run `npm run build` and the backend test command.
