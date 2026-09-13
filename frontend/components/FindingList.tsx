import { FlaskConical } from "lucide-react";
import type { Finding } from "../lib/types";

export function FindingList({ findings }: { findings: Finding[] }) {
  return <div className="finding-list">{findings.map((finding, index) => <article className="finding" key={finding.organism}><div className="finding-rank">{String(index + 1).padStart(2, "0")}</div><div className="finding-main"><div className="finding-title"><div><h3>{finding.organism}</h3><span>{finding.classification}</span></div><strong>{finding.confidence}%<small> match</small></strong></div><div className="confidence-bar"><span style={{ width: `${finding.confidence}%` }} /></div><p>{finding.rationale}</p><div className="test-list">{finding.confirmatory_tests.map((test) => <span key={test}><FlaskConical size={13} />{test}</span>)}</div></div></article>)}</div>;
}
