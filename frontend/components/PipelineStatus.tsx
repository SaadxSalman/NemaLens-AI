import { Activity, Check, LoaderCircle } from "lucide-react";

export function PipelineStatus({ isRunning }: { isRunning: boolean }) {
  return <aside className="signal-panel panel"><div className="signal-title"><span className="signal-icon"><Activity size={17} /></span><div><h3>Pipeline status</h3><p>CRAG orchestration</p></div></div><div className="pipeline"><PipelineItem label="Query parsed" done /><PipelineItem label="Hybrid retrieval" done /><PipelineItem label="Relevance grading" done={!isRunning} active={isRunning} /><PipelineItem label="Clinical synthesis" done={false} active={isRunning} /></div><div className="pipeline-foot"><span className="pulse" />{isRunning ? "Working across 2,400 indexed sources" : "Ready for a new investigation"}</div></aside>;
}

function PipelineItem({ label, done, active = false }: { label: string; done: boolean; active?: boolean }) { return <div className={`pipeline-item ${active ? "current" : ""}`}><span className={done ? "pipeline-check done" : active ? "pipeline-check active" : "pipeline-check"}>{done && <Check size={11} />}</span><span>{label}</span>{active && <LoaderCircle size={13} className="spin" />}</div>; }
