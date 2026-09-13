# Evaluation Plan

A credible diagnostic assistant needs evaluation beyond whether a page renders. NemaLens should maintain three separate evaluation sets: retrieval, generation, and workflow safety.

## Retrieval set

Create expert-labeled queries spanning protozoa, helminths, ectoparasites, specimen types, stains, morphology, host species, geography, and incomplete observations. Each query should have relevant source chunks and hard negatives.

Track:

- Recall@5 and Recall@10.
- nDCG for ranked evidence.
- Source freshness and source authority coverage.
- Performance by taxonomic group and specimen type.
- Performance when uncommon morphology terms are misspelled.

## Generation set

For each case, label supported claims, unsupported claims, missing uncertainty, incorrect organism names, and inappropriate treatment advice. Track citation coverage at the claim level rather than only counting citations per report.

Recommended gates:

- No unsupported high-confidence claim in the release set.
- Every finding has at least one supporting citation or is explicitly marked as a hypothesis.
- Confirmatory tests are relevant to the organism and specimen.
- Safety note is present for every report.
- JSON schema validity is 100% after the repair policy.

## Workflow set

Use browser tests for:

- Empty query and short query validation.
- Long morphology notes.
- Image and PDF attachment acknowledgement.
- API offline mode.
- Loading state and repeated submission.
- Mobile layout at 390px wide.
- Keyboard navigation and visible focus.
- Export control and source link behavior.

## Release review

Every model, embedding model, reranker, index rebuild, prompt, and source-ingestion change should produce a comparison report against the previous release. Keep the test corpus versioned and record the model/provider configuration with each result.
