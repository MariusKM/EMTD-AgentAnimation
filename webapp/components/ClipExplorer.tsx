"use client";

import { useEffect, useMemo, useState } from "react";

type FilesResponse = {
  clipName: string;
  clipDirRel: string;
  frames: Record<string, string[]>;
  outputs: { name: string; rel: string; ext: string; sizeBytes: number }[];
};

const FRAME_TABS = ["FG", "Matte", "Comp", "Processed"] as const;
type FrameTab = (typeof FRAME_TABS)[number];
type Tab = FrameTab | "Outputs";

export function ClipExplorer({
  heroId,
  clipName,
  onClose,
}: {
  heroId: string;
  clipName: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<FilesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("Processed");
  const [frameIdx, setFrameIdx] = useState(0);
  const [showCheckers, setShowCheckers] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetch(`/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(clipName)}/files`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((j: FilesResponse) => {
        if (cancelled) return;
        setData(j);
        const firstAvailable = FRAME_TABS.find((t) => j.frames[t]?.length) as Tab | undefined;
        setTab(firstAvailable ?? "Outputs");
        setFrameIdx(0);
      })
      .catch((e) => !cancelled && setError(String(e?.message ?? e)));
    return () => { cancelled = true; };
  }, [heroId, clipName]);

  // Reset frame index when switching frame tabs
  useEffect(() => { setFrameIdx(0); }, [tab]);

  // Keyboard navigation: arrow keys for scrubbing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (tab === "Outputs" || !data) return;
      const frames = data.frames[tab as FrameTab] ?? [];
      if (frames.length === 0) return;
      if (e.key === "ArrowRight") setFrameIdx((i) => Math.min(frames.length - 1, i + 1));
      else if (e.key === "ArrowLeft") setFrameIdx((i) => Math.max(0, i - 1));
      else if (e.key === "Home") setFrameIdx(0);
      else if (e.key === "End") setFrameIdx(frames.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, data, onClose]);

  const frames = useMemo(() => (data && tab !== "Outputs") ? (data.frames[tab as FrameTab] ?? []) : [], [data, tab]);
  const currentFrameRel = frames[frameIdx];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel border border-border rounded-lg w-[1200px] max-w-[96vw] h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold">{clipName}</div>
            <div className="text-xs text-muted font-mono">{data?.clipDirRel ?? "…"}</div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-2xl leading-none px-2">×</button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-3 border-b border-border flex gap-1">
          {FRAME_TABS.map((t) => {
            const count = data?.frames[t]?.length ?? 0;
            const disabled = count === 0;
            return (
              <button
                key={t}
                onClick={() => !disabled && setTab(t)}
                disabled={disabled}
                className={`px-3 py-1.5 rounded-t text-sm border-b-2 transition-colors ${
                  tab === t
                    ? "border-accent text-text"
                    : disabled
                      ? "border-transparent text-border cursor-not-allowed"
                      : "border-transparent text-muted hover:text-text"
                }`}
              >
                {t} <span className="text-xs text-muted">{count}</span>
              </button>
            );
          })}
          <button
            onClick={() => setTab("Outputs")}
            disabled={!data?.outputs.length}
            className={`px-3 py-1.5 rounded-t text-sm border-b-2 transition-colors ${
              tab === "Outputs"
                ? "border-accent text-text"
                : !data?.outputs.length
                  ? "border-transparent text-border cursor-not-allowed"
                  : "border-transparent text-muted hover:text-text"
            }`}
          >
            Outputs <span className="text-xs text-muted">{data?.outputs.length ?? 0}</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {error && <div className="p-6 text-bad">{error}</div>}
          {!error && !data && <div className="p-6 text-muted">Loading…</div>}

          {data && tab !== "Outputs" && (
            <FrameViewer
              frames={frames}
              currentFrameRel={currentFrameRel}
              frameIdx={frameIdx}
              setFrameIdx={setFrameIdx}
              showCheckers={showCheckers}
              setShowCheckers={setShowCheckers}
              tab={tab as FrameTab}
            />
          )}

          {data && tab === "Outputs" && <OutputsView outputs={data.outputs} />}
        </div>
      </div>
    </div>
  );
}

function FrameViewer({
  frames,
  currentFrameRel,
  frameIdx,
  setFrameIdx,
  showCheckers,
  setShowCheckers,
  tab,
}: {
  frames: string[];
  currentFrameRel?: string;
  frameIdx: number;
  setFrameIdx: (n: number) => void;
  showCheckers: boolean;
  setShowCheckers: (b: boolean) => void;
  tab: FrameTab;
}) {
  const showAlphaToggle = tab === "FG" || tab === "Processed";

  if (frames.length === 0) {
    return <div className="p-6 text-muted">No frames in {tab}.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Big preview */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center p-4"
        style={
          showCheckers && showAlphaToggle
            ? {
                backgroundImage:
                  "linear-gradient(45deg, #2a313c 25%, transparent 25%), linear-gradient(-45deg, #2a313c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a313c 75%), linear-gradient(-45deg, transparent 75%, #2a313c 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
                backgroundColor: "#171b22",
              }
            : { backgroundColor: "#0f1115" }
        }
      >
        {currentFrameRel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/files/${encodeURI(currentFrameRel)}`}
            alt={currentFrameRel}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {/* Scrubber + controls */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted font-mono w-24 shrink-0">
            {String(frameIdx + 1).padStart(4, "0")} / {frames.length}
          </div>
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={frameIdx}
            onChange={(e) => setFrameIdx(parseInt(e.target.value, 10))}
            className="flex-1 accent-accent"
          />
          <div className="text-xs text-muted font-mono w-64 truncate text-right">
            {currentFrameRel?.split("/").pop()}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setFrameIdx(Math.max(0, frameIdx - 1))}
            className="px-2 py-1 bg-panel2 rounded hover:bg-border"
          >← prev</button>
          <button
            onClick={() => setFrameIdx(Math.min(frames.length - 1, frameIdx + 1))}
            className="px-2 py-1 bg-panel2 rounded hover:bg-border"
          >next →</button>
          <span className="text-muted">arrows scrub · Home/End jump · Esc closes</span>
          <div className="flex-1" />
          {showAlphaToggle && (
            <label className="flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={showCheckers}
                onChange={(e) => setShowCheckers(e.target.checked)}
              />
              checker bg
            </label>
          )}
          {currentFrameRel && (
            <a
              href={`/api/files/${encodeURI(currentFrameRel)}`}
              download
              className="text-accent hover:underline"
            >
              download frame
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function OutputsView({ outputs }: { outputs: { name: string; rel: string; ext: string; sizeBytes: number }[] }) {
  return (
    <div className="h-full overflow-auto p-4 grid grid-cols-2 gap-4">
      {outputs.map((o) => {
        const isVideo = o.ext === ".mp4" || o.ext === ".mov" || o.ext === ".webm";
        return (
          <div key={o.rel} className="bg-panel2 border border-border rounded overflow-hidden">
            <div className="bg-bg flex items-center justify-center min-h-[200px]">
              {isVideo ? (
                <video src={`/api/files/${encodeURI(o.rel)}`} controls preload="metadata" className="block w-full h-auto" />
              ) : (
                <div className="p-4 text-xs font-mono text-muted">{o.name}</div>
              )}
            </div>
            <div className="p-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-mono">{o.name}</div>
                <div className="text-muted">{formatSize(o.sizeBytes)}</div>
              </div>
              <a href={`/api/files/${encodeURI(o.rel)}`} download className="text-accent hover:underline">
                download
              </a>
            </div>
          </div>
        );
      })}
      {outputs.length === 0 && <div className="text-muted text-sm col-span-2 p-4">No composited outputs yet.</div>}
    </div>
  );
}

function formatSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
