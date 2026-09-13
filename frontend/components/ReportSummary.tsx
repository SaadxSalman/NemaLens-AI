import { Check } from "lucide-react";
import type { Report } from "../lib/types";
import { FindingList } from "./FindingList";

export function ReportSummary({ report }: { report: Report }) {
  return <section className="report-panel panel"><div className="report-summary"><span className="summary-icon"><Check size={17} /></span><div><span className="verified">HIGH-CONFIDENCE SIGNAL</span><p>{report.summary}</p></div></div><FindingList findings={report.findings} /></section>;
}
