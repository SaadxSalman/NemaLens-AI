"use client";

import { useState } from "react";
import { ArrowUpRight, Beaker, BookOpen, ChevronDown, CircleHelp, LayoutDashboard, Menu, Microscope, Plus, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { EvidenceList } from "../components/EvidenceList";
import { PipelineStatus } from "../components/PipelineStatus";
import { QueryComposer } from "../components/QueryComposer";
import { ReportSummary } from "../components/ReportSummary";
import { requestDiagnosticReport, uploadEvidence } from "../lib/api";
import { seededQuestion, seededReport } from "../lib/demo-report";
import type { Report } from "../lib/types";

export default function Dashboard() {
  const [question, setQuestion] = useState(seededQuestion);
  const [report, setReport] = useState(seededReport);
  const [isRunning, setIsRunning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");

  async function runQuery() {
    setIsRunning(true);
    try {
      setReport(await requestDiagnosticReport({ question, specimen: "stool", include_web_fallback: true }));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 850));
    } finally {
      setIsRunning(false);
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadedFile(file.name);
    try { await uploadEvidence(file); } catch { /* The query remains usable when the API is offline. */ }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Microscope size={19} /></span><span>NemaLens<span className="brand-ai">AI</span></span></div>
        <div className="workspace-label">WORKSPACE <button aria-label="Add workspace"><Plus size={13} /></button></div>
        <nav className="main-nav">
          <a className="nav-item active"><LayoutDashboard size={17} />Diagnostic desk</a>
          <a className="nav-item"><BookOpen size={17} />Evidence library<span className="nav-count">2.4k</span></a>
          <a className="nav-item"><Beaker size={17} />Specimen archive</a>
        </nav>
        <div className="sidebar-bottom"><div className="status-pill"><span className="status-dot" />All systems nominal</div><a className="nav-item"><CircleHelp size={17} />Help & methods</a><div className="user-row"><span className="avatar">AR</span><div><strong>Dr. Amina Rahman</strong><small>Clinical research</small></div><ChevronDown size={14} /></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumb"><span className="mobile-menu"><Menu size={20} /></span><span>Workspace</span><span className="slash">/</span><strong>Diagnostic desk</strong></div><div className="top-actions"><span className="connection"><span className="status-dot" />Live index</span><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button" aria-label="Settings"><SlidersHorizontal size={18} /></button></div></header>
        <div className="page-wrap">
          <div className="intro-row"><div><p className="eyebrow"><Sparkles size={14} />EVIDENCE-LINKED INTELLIGENCE</p><h1>Diagnostic desk</h1><p className="subhead">Cross-reference morphology, symptoms, and literature in one considered view.</p></div><button className="secondary-button"><Plus size={16} />New investigation</button></div>
          <div className="query-grid">
            <QueryComposer question={question} onQuestionChange={setQuestion} onFileChange={handleFile} uploadedFile={uploadedFile} isRunning={isRunning} onRun={runQuery} />
            <PipelineStatus isRunning={isRunning} />
          </div>

          <div className="result-heading"><div><div className="eyebrow result-eyebrow"><span className="result-dot" />LATEST ANALYSIS</div><h2>Diagnostic synthesis</h2></div><div className="result-meta"><span>{report.retrieval_mode}</span><button className="export-button">Export report <ArrowUpRight size={15} /></button></div></div>
          <div className="tabs">{["Overview", "Evidence graph", "Clinical notes"].map((tab) => <button key={tab} className={activeTab === tab ? "tab active-tab" : "tab"} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
          <div className="results-grid"><ReportSummary report={report} /><EvidenceList citations={report.citations} /></div>
          <div className="safety-note"><ShieldCheck size={16} /><span><strong>Use with clinical judgment.</strong> {report.safety_note}</span><button aria-label="Dismiss"><X size={15} /></button></div>
        </div>
      </section>
    </main>
  );
}
