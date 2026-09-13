import type { QueryInput, Report } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function requestDiagnosticReport(input: QueryInput): Promise<Report> {
  const response = await fetch(`${API_URL}/api/v1/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`Diagnostic request failed with ${response.status}`);
  return response.json() as Promise<Report>;
}

export async function uploadEvidence(file: File): Promise<{ upload_id: string; status: string; next_step: string }> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API_URL}/api/v1/upload`, { method: "POST", body });
  if (!response.ok) throw new Error(`Upload failed with ${response.status}`);
  return response.json();
}
