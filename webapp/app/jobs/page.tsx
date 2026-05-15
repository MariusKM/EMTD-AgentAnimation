"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Job = {
  id: string;
  kind: string;
  status: string;
  hero_id: string | null;
  concept_id: string | null;
  clip_name: string | null;
  payload: any;
  result: any;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Loading jobs…</div>}>
      <JobsPageInner />
    </Suspense>
  );
}

function JobsPageInner() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const backHref = fromParam && fromParam.startsWith("/") ? fromParam : "/";
  const backLabel = fromParam && fromParam.startsWith("/heroes/")
    ? `← Back to ${decodeURIComponent(fromParam.replace("/heroes/", "").split("?")[0]).replace(/_/g, " ")}`
    : "← Back to Heroes";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [openLog, setOpenLog] = useState<string | null>(null);
  const [logText, setLogText] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const refresh = async () => {
    const res = await fetch(`/api/jobs?limit=200`, { cache: "no-store" });
    const j = await res.json();
    setJobs(j.jobs ?? []);
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!openLog) return;
    const fetchLog = async () => {
      const r = await fetch(`/api/jobs/${openLog}/log`, { cache: "no-store" });
      setLogText(await r.text());
    };
    fetchLog();
    const id = setInterval(fetchLog, 2000);
    return () => clearInterval(id);
  }, [openLog]);

  const cancel = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    refresh();
  };

  const rerun = async (id: string) => {
    const res = await fetch(`/api/jobs/${id}/rerun`, { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(`Rerun failed: ${j?.error ?? res.statusText}`);
      return;
    }
    refresh();
  };

  const pollNow = async (id: string) => {
    const res = await fetch(`/api/jobs/${id}/poll`, { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { alert(`Poll failed: ${j?.error ?? res.statusText}`); return; }
    const detail = j.action === "completed"   ? `Completed — ${j.outputMp4}` :
                   j.action === "failed"       ? `Failed: ${j.raw ?? "(see log)"}` :
                   j.action === "in_progress"  ? `Still ${j.state ?? "in progress"} — try again in a bit` :
                                                  `Action: ${j.action} (state=${j.state ?? "?"})`;
    alert(detail);
    refresh();
  };

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div>
      <div className="mb-3">
        <Link href={backHref} className="text-xs text-muted hover:text-accent">
          {backLabel}
        </Link>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex items-center gap-2">
          {["all", "queued", "running", "done", "error", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded text-xs ${filter === s ? "bg-accent text-bg" : "bg-panel2 text-muted hover:text-text"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-panel border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel2 text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-3 py-2">Kind</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Target</th>
              <th className="text-left px-3 py-2">Stage</th>
              <th className="text-left px-3 py-2">Created</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{j.kind}</td>
                <td className="px-3 py-2"><StatusPill status={j.status} /></td>
                <td className="px-3 py-2 text-xs">
                  {j.hero_id ? `${j.hero_id}` : "—"}
                  {j.concept_id ? ` · ${j.concept_id}` : ""}
                  {j.clip_name ? ` · ${j.clip_name}` : ""}
                </td>
                <td className="px-3 py-2 text-xs text-muted">{j.result?.stage ?? ""}</td>
                <td className="px-3 py-2 text-xs text-muted">{new Date(j.created_at + "Z").toLocaleString()}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => setOpenLog(j.id)} className="text-xs text-accent hover:underline">log</button>
                  {j.kind === "seedance" && j.status === "running" && (
                    <button
                      onClick={() => pollNow(j.id)}
                      className="text-xs text-accent hover:underline"
                      title="Manually fetch fal status now (recovers stuck jobs)"
                    >poll</button>
                  )}
                  {(j.status === "queued" || j.status === "running") && (
                    <button onClick={() => cancel(j.id)} className="text-xs text-bad hover:underline">cancel</button>
                  )}
                  {(j.status === "done" || j.status === "error" || j.status === "cancelled") && (
                    <button onClick={() => rerun(j.id)} className="text-xs text-accent hover:underline" title="Submit a new run with the same params (does not overwrite the previous output)">new run</button>
                  )}
                  {j.status === "done" && goToClipHref(j) && (
                    <Link
                      href={goToClipHref(j)!}
                      className="text-xs text-accent hover:underline"
                      title="Open this clip in the hero workspace"
                    >→ go to clip</Link>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted text-sm">No jobs.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {openLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40" onClick={() => setOpenLog(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg w-[900px] max-w-[95vw] h-[80vh] flex flex-col">
            <div className="px-4 py-2 border-b border-border flex items-center justify-between">
              <div className="font-mono text-xs text-muted">{openLog}</div>
              <button onClick={() => setOpenLog(null)} className="text-muted hover:text-text">×</button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono whitespace-pre-wrap">{logText || "(empty)"}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function goToClipHref(j: Job): string | null {
  if (!j.hero_id) return null;
  let clipName: string | null = j.clip_name ?? null;
  if (!clipName && j.result?.outputMp4) {
    const base = String(j.result.outputMp4).split(/[\\/]/).pop() ?? "";
    clipName = base.replace(/\.mp4$/i, "") || null;
  }
  const conceptId = j.concept_id ?? (clipName ? clipName.split("_")[0] : null);
  if (!conceptId) return null;
  // For seedance jobs the clip isn't keyed yet, so opening the files modal
  // would error. Send only the concept so the hero workspace selects it
  // without auto-opening the explorer. key+compose jobs still pass `clip=`
  // so users land on the files view of the just-keyed clip.
  const qs = new URLSearchParams({ concept: conceptId });
  if (clipName && j.kind !== "seedance") qs.set("clip", clipName);
  return `/heroes/${encodeURIComponent(j.hero_id)}?${qs.toString()}`;
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "running" ? "bg-accent/20 text-accent" :
    status === "queued"  ? "bg-panel2 text-muted" :
    status === "done"    ? "bg-good/20 text-good" :
    status === "error"   ? "bg-bad/20 text-bad" :
                           "bg-panel2 text-muted line-through";
  return <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{status}</span>;
}
