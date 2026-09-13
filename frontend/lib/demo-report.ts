import type { Report } from "./types";

export const seededQuestion = "Pear-shaped trophozoites, two visible nuclei, and greasy diarrhea after a hiking trip. What should I consider?";

export const seededReport: Report = {
  report_id: "demo-giardia-001",
  summary: "The morphology and clinical context most strongly support Giardia duodenalis. Confirm with antigen detection or NAAT before treatment.",
  findings: [
    { organism: "Giardia duodenalis", classification: "Protozoa · Intestinal flagellate", confidence: 92, rationale: "A pear-shaped trophozoite with two nuclei, a ventral adhesive disc, and intermittent greasy diarrhea is a high-value match.", confirmatory_tests: ["Stool antigen EIA", "Multiplex stool NAAT", "Three-specimen O&P exam"] },
    { organism: "Entamoeba histolytica", classification: "Protozoa · Intestinal amoeba", confidence: 34, rationale: "A competing cause of persistent diarrhea, but the described nuclear pattern and lack of dysentery reduce likelihood.", confirmatory_tests: ["E. histolytica-specific antigen", "Stool NAAT"] },
    { organism: "Cryptosporidium spp.", classification: "Protozoa · Apicomplexan", confidence: 18, rationale: "Exposure context can overlap, although oocysts and watery diarrhea would be more characteristic.", confirmatory_tests: ["Modified acid-fast stain", "Cryptosporidium antigen or NAAT"] },
  ],
  citations: [{ id: "cdc-dpdx-giardia", title: "DPDx: Giardiasis", source: "CDC", year: 2024, relevance: 98 }, { id: "who-water-giardia", title: "WHO guidelines for drinking-water quality: Giardia", source: "WHO", year: 2022, relevance: 89 }, { id: "pubmed-giardia-review", title: "Giardia duodenalis: biology and pathogenesis", source: "PubMed", year: 2023, relevance: 84 }],
  next_steps: ["Review specimen collection timing and recent antimicrobial exposure.", "Order a Giardia antigen assay or multiplex stool NAAT.", "Escalate to a reference laboratory if microscopy and antigen testing disagree."],
  retrieval_mode: "Demo corpus · CRAG simulation",
  retrieval_trace: { query_terms: ["trophozoite", "two nuclei", "greasy diarrhea"], dense_candidates: 24, sparse_candidates: 18, reranked_candidates: 8, grader_decision: "sufficient", passes: 1, latency_ms: 420 },
  safety_note: "Research support only. This report does not replace clinical judgment, local laboratory protocols, or specialist consultation.",
};
