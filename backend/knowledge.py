from .schemas import Citation, DiagnosticReport, Finding, RetrievalTrace

DEMO_CITATIONS = [
    Citation(id="cdc-dpdx-giardia", title="DPDx: Giardiasis", source="CDC", year=2024, relevance=98, excerpt="Giardia trophozoites are pear-shaped and contain two nuclei. The organism is identified in stool by microscopy, antigen detection, or molecular methods.", url="https://www.cdc.gov/dpdx/giardiasis/"),
    Citation(id="who-water-giardia", title="WHO guidelines for drinking-water quality: Giardia", source="WHO", year=2022, relevance=89, excerpt="Giardia is transmitted through ingestion of environmentally resistant cysts, with water and person-to-person transmission as important routes.", url="https://www.who.int/publications/i/item/9789240045064"),
    Citation(id="pubmed-giardia-review", title="Giardia duodenalis: biology and pathogenesis", source="PubMed", year=2023, relevance=84, excerpt="Clinical presentation ranges from asymptomatic carriage to prolonged diarrhea, malabsorption, and weight loss.", url="https://pubmed.ncbi.nlm.nih.gov/"),
]


def demo_report(question: str, trace: RetrievalTrace | None = None) -> DiagnosticReport:
    return DiagnosticReport(
        report_id="demo-giardia-001",
        query=question,
        summary="The morphology and clinical context most strongly support Giardia duodenalis. Confirm with antigen detection or NAAT before treatment.",
        findings=[
            Finding(organism="Giardia duodenalis", classification="Protozoa · Intestinal flagellate", confidence=92, rationale="A pear-shaped trophozoite with two nuclei, a ventral adhesive disc, and intermittent greasy diarrhea is a high-value match.", confirmatory_tests=["Stool antigen EIA", "Multiplex stool NAAT", "Three-specimen ova and parasite exam"], supporting_citation_ids=["cdc-dpdx-giardia", "pubmed-giardia-review"]),
            Finding(organism="Entamoeba histolytica", classification="Protozoa · Intestinal amoeba", confidence=34, rationale="A competing cause of persistent diarrhea, but the described nuclear pattern and lack of dysentery reduce likelihood.", confirmatory_tests=["E. histolytica-specific antigen", "Stool NAAT"], supporting_citation_ids=["pubmed-giardia-review"]),
            Finding(organism="Cryptosporidium spp.", classification="Protozoa · Apicomplexan", confidence=18, rationale="Exposure context can overlap, although oocysts and watery diarrhea would be more characteristic.", confirmatory_tests=["Modified acid-fast stain", "Cryptosporidium antigen or NAAT"], supporting_citation_ids=["who-water-giardia"]),
        ],
        citations=DEMO_CITATIONS,
        next_steps=["Review specimen collection timing and recent antimicrobial exposure.", "Order a Giardia antigen assay or multiplex NAAT.", "Escalate to a reference laboratory if microscopy and antigen testing disagree."],
        retrieval_mode="Demo corpus · CRAG simulation",
        retrieval_trace=trace or RetrievalTrace(query_terms=["trophozoite", "two nuclei", "greasy diarrhea"], dense_candidates=24, sparse_candidates=18, reranked_candidates=8, grader_decision="sufficient", passes=1, latency_ms=420),
        generated_at="2026-09-13T00:00:00Z",
        safety_note="Research support only. This report does not replace clinical judgment, local laboratory protocols, or specialist consultation.",
    )
