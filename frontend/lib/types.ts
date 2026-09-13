export type SpecimenType = "stool" | "blood" | "skin" | "water" | "unknown";

export type Finding = {
  organism: string;
  classification: string;
  confidence: number;
  rationale: string;
  confirmatory_tests: string[];
  supporting_citation_ids?: string[];
};

export type Citation = {
  id?: string;
  title: string;
  source: string;
  year: number;
  relevance: number;
  excerpt?: string;
  url?: string;
};

export type RetrievalTrace = {
  query_terms: string[];
  dense_candidates: number;
  sparse_candidates: number;
  reranked_candidates: number;
  grader_decision: "sufficient" | "rewritten" | "fallback";
  passes: number;
  latency_ms: number;
};

export type Report = {
  report_id?: string;
  query?: string;
  summary: string;
  findings: Finding[];
  citations: Citation[];
  next_steps: string[];
  retrieval_mode: string;
  retrieval_trace?: RetrievalTrace;
  generated_at?: string;
  safety_note: string;
};

export type QueryInput = {
  question: string;
  patient_context?: string;
  specimen?: SpecimenType;
  geography?: string;
  host?: string;
  include_web_fallback?: boolean;
};
