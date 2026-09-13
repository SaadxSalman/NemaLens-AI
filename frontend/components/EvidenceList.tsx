import { ArrowUpRight } from "lucide-react";
import type { Citation } from "../lib/types";

export function EvidenceList({ citations }: { citations: Citation[] }) {
  return <aside className="evidence-panel"><div className="evidence-header"><div><span className="eyebrow">SOURCE TRACE</span><h3>Evidence used</h3></div><span className="source-count">{citations.length} sources</span></div>{citations.map((citation) => <div className="citation" key={citation.id || citation.title}><div className="citation-top"><span className={`source-badge ${citation.source.toLowerCase()}`}>{citation.source === "PubMed" ? "P" : citation.source[0]}</span><span>{citation.source} · {citation.year}</span><strong>{citation.relevance}%</strong></div><p>{citation.title}</p>{citation.excerpt && <small className="citation-excerpt">{citation.excerpt}</small>}<div className="relevance"><span style={{ width: `${citation.relevance}%` }} /></div></div>)}<button className="library-button">Open evidence library <ArrowUpRight size={15} /></button></aside>;
}
