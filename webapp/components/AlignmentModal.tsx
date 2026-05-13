"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Anchor = { x: number; y: number; confidence: number; source: string };

type AnchorsFile = {
  schemaVersion: number;
  frame: { width: number; height: number; index: number; path: string } | null;
  eye: Anchor;
  foot: Anchor;
  detectedAt?: string;
  notes?: string;
};

type Template = {
  eyeLevelY: number;
  groundY: number;
  centerX: number;
  eyeRangeHalfWidth: number;
  outputCanvas: { mode: "source" | "template"; width: number; height: number };
};

type Props = {
  heroId: string;
  clipName: string;
  firstFrameSrc: string;           // URL to first keyed frame (served via /api/files)
  onClose: () => void;
  onSaved?: (anchors: AnchorsFile) => void;
};

/** Viewport max; scales image down to fit, then scales anchor coords in sync. */
const VIEWPORT_MAX = 720;

export function AlignmentModal({ heroId, clipName, firstFrameSrc, onClose, onSaved }: Props) {
  const [anchors, setAnchors] = useState<AnchorsFile | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState<null | "eye" | "foot">(null);
  const [propagateOpen, setPropagateOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  // Load template + anchors (and auto-detect if no anchors exist yet)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tplRes, anRes] = await Promise.all([
          fetch("/api/alignment-template").then(r => r.json()),
          fetch(`/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(clipName)}/anchors`).then(r => r.json()),
        ]);
        if (cancelled) return;
        setTemplate(tplRes.template);
        if (anRes.anchors) {
          setAnchors(anRes.anchors);
        } else {
          // Auto-detect on first open
          setDetecting(true);
          const det = await fetch(`/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(clipName)}/anchors`, {
            method: "POST",
          }).then(r => r.json());
          if (cancelled) return;
          setDetecting(false);
          if (det.error) { setErr(det.error); } else { setAnchors(det.anchors); }
        }
      } catch (e: any) {
        if (!cancelled) setErr(String(e?.message ?? e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [heroId, clipName]);

  const onImgLoad = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
  }, []);

  // Fit-to-viewport scale
  const scale = useMemo(() => {
    if (!imgDims) return 1;
    return Math.min(VIEWPORT_MAX / imgDims.w, VIEWPORT_MAX / imgDims.h, 1);
  }, [imgDims]);

  const canvasW = imgDims ? Math.round(imgDims.w * scale) : VIEWPORT_MAX;
  const canvasH = imgDims ? Math.round(imgDims.h * scale) : VIEWPORT_MAX;

  // Image-space → screen-space and vice versa
  const toScreen = (x: number, y: number) => ({ x: x * scale, y: y * scale });
  const toImage  = (x: number, y: number) => ({ x: x / scale, y: y / scale });

  const onPointerDown = (which: "eye" | "foot") => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(which);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !anchors || !imgDims) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const sx = Math.max(0, Math.min(canvasW, e.clientX - rect.left));
    const sy = Math.max(0, Math.min(canvasH, e.clientY - rect.top));
    const { x, y } = toImage(sx, sy);
    setAnchors({
      ...anchors,
      [dragging]: { x, y, confidence: 1.0, source: "manual" },
    } as AnchorsFile);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    setDragging(null);
  };

  const redetect = async () => {
    setDetecting(true); setErr(null);
    try {
      const r = await fetch(`/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(clipName)}/anchors`, {
        method: "POST",
      }).then(r => r.json());
      if (r.error) setErr(r.error);
      else setAnchors(r.anchors);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setDetecting(false);
    }
  };

  const save = async () => {
    if (!anchors) return;
    setSaving(true); setErr(null);
    try {
      const r = await fetch(`/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(clipName)}/anchors`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eye:  { x: anchors.eye.x,  y: anchors.eye.y  },
          foot: { x: anchors.foot.x, y: anchors.foot.y },
          frame: anchors.frame,
          notes: anchors.notes,
        }),
      }).then(r => r.json());
      if (r.error) { setErr(r.error); return; }
      onSaved?.(r.anchors);
    } finally {
      setSaving(false);
    }
  };

  const recompose = async () => {
    await save();
    setSaving(true);
    try {
      await fetch("/api/jobs/recompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clips: [{ heroId, clipName }], alignToTemplate: true }),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const openPropagate = async () => {
    // Save current anchors so the propagate endpoint reads the latest state.
    await save();
    setPropagateOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="bg-neutral-900 text-white rounded-lg shadow-2xl max-w-[90vw] max-h-[92vh] overflow-auto p-4 w-fit">
        <div className="flex items-center justify-between mb-3 gap-4">
          <div>
            <div className="text-sm text-neutral-400">{heroId}</div>
            <div className="text-lg font-semibold">Align {clipName}</div>
          </div>
          <button className="text-neutral-300 hover:text-white" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="py-10 text-center text-neutral-400">Loading…</div>}
        {detecting && <div className="py-2 text-xs text-yellow-400">Auto-detecting anchors…</div>}
        {err && <div className="py-2 text-xs text-red-400 whitespace-pre-wrap">{err}</div>}

        {anchors && template && (
          <div
            className="relative select-none"
            style={{ width: canvasW, height: canvasH, touchAction: "none" }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <img
              ref={imgRef}
              src={firstFrameSrc}
              alt="first frame"
              onLoad={onImgLoad}
              style={{ width: canvasW, height: canvasH, imageRendering: "auto" }}
              className="pointer-events-none bg-[conic-gradient(at_25%_25%,#222,#111_25%,#222_50%,#111_75%,#222)] rounded"
              draggable={false}
            />

            {imgDims && (
              <TemplateOverlay
                template={template}
                canvasW={canvasW}
                canvasH={canvasH}
                imgW={imgDims.w}
                imgH={imgDims.h}
                anchors={anchors}
              />
            )}

            <Crosshair
              label="EYE"
              color="#22d3ee"
              at={toScreen(anchors.eye.x, anchors.eye.y)}
              onPointerDown={onPointerDown("eye")}
            />
            <Crosshair
              label="FOOT"
              color="#f472b6"
              at={toScreen(anchors.foot.x, anchors.foot.y)}
              onPointerDown={onPointerDown("foot")}
            />
          </div>
        )}

        {anchors && (
          <div className="mt-4 flex items-center gap-3 text-xs">
            <Badge label={`eye ${anchors.eye.source} · conf ${anchors.eye.confidence.toFixed(2)}`} tone={anchors.eye.confidence > 0.6 ? "ok" : "warn"} />
            <Badge label={`foot ${anchors.foot.source} · conf ${anchors.foot.confidence.toFixed(2)}`} tone={anchors.foot.confidence > 0.6 ? "ok" : "warn"} />
            <div className="flex-1" />
            <button
              className="px-3 py-1.5 rounded bg-neutral-700 hover:bg-neutral-600"
              onClick={redetect}
              disabled={detecting || saving}
            >
              Re-detect
            </button>
            <button
              className="px-3 py-1.5 rounded bg-neutral-700 hover:bg-neutral-600"
              onClick={save}
              disabled={saving}
            >
              Save anchors
            </button>
            <button
              className="px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600"
              onClick={recompose}
              disabled={saving}
            >
              Save + recompose aligned
            </button>
            <button
              className="px-3 py-1.5 rounded bg-neutral-700 hover:bg-neutral-600"
              onClick={openPropagate}
              disabled={saving}
              title="Copy these anchors to other clips on this hero (and recompose them)."
            >
              Apply to other clips…
            </button>
          </div>
        )}

        {propagateOpen && (
          <PropagateModal
            heroId={heroId}
            sourceClipName={clipName}
            onClose={() => setPropagateOpen(false)}
            onDone={(applied) => {
              setPropagateOpen(false);
              if (applied > 0) onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// "Apply to other clips" sub-modal
// -----------------------------------------------------------------------------

type ClipForPropagate = {
  name: string;
  conceptId: string;
  hasAnchors: boolean;
  hasProcessed: boolean;
  isAligned: boolean;
};

function PropagateModal({
  heroId,
  sourceClipName,
  onClose,
  onDone,
}: {
  heroId: string;
  sourceClipName: string;
  onClose: () => void;
  onDone: (appliedCount: number) => void;
}) {
  const [clips, setClips] = useState<ClipForPropagate[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [recompose, setRecompose] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<{ copied: any[]; errors: any[] } | null>(null);

  useEffect(() => {
    fetch(`/api/heroes/${encodeURIComponent(heroId)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(j => {
        const list: ClipForPropagate[] = [];
        for (const c of j.hero?.concepts ?? []) {
          for (const cl of c.clips ?? []) {
            if (cl.name === sourceClipName) continue;
            // Only clips with a Processed dir can have anchors applied + recomposed.
            const hasProcessed = !!cl.processed?.fgAlphaMp4Rel;
            list.push({
              name: cl.name,
              conceptId: c.id,
              hasAnchors: !!cl.processed?.hasAnchors,
              hasProcessed,
              isAligned: !!cl.processed?.fgAlphaMp4AlignedRel,
            });
          }
        }
        // Sort: clips that already have anchors LAST (so they don't get overwritten by accident),
        // then by name.
        list.sort((a, b) => Number(a.hasAnchors) - Number(b.hasAnchors) || a.name.localeCompare(b.name));
        setClips(list);
      })
      .catch(e => setErr(String(e?.message ?? e)));
  }, [heroId, sourceClipName]);

  const eligible = useMemo(() => (clips ?? []).filter(c => c.hasProcessed), [clips]);
  const allEligibleSelected = eligible.length > 0 && eligible.every(c => selected.has(c.name));

  const toggle = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const submit = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    setErr(null);
    try {
      const r = await fetch(
        `/api/clips/${encodeURIComponent(heroId)}/${encodeURIComponent(sourceClipName)}/anchors/propagate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetClipNames: Array.from(selected), recompose }),
        },
      );
      const j = await r.json();
      if (!r.ok) {
        setErr(j?.error ?? "Propagate failed");
        return;
      }
      setResult({ copied: j.copied ?? [], errors: j.errors ?? [] });
      // Auto-close after a short delay if everything succeeded.
      if ((j.errors ?? []).length === 0) {
        setTimeout(() => onDone(j.copied?.length ?? 0), 800);
      }
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-neutral-900 text-white rounded-lg shadow-2xl max-w-[560px] w-full max-h-[85vh] flex flex-col p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-neutral-400">Apply anchors from</div>
            <div className="text-base font-semibold font-mono">{sourceClipName}</div>
          </div>
          <button className="text-neutral-300 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <div className="text-xs text-neutral-400 mb-3">
          Copies <span className="font-mono">{sourceClipName}</span>&apos;s eye + foot to the selected clips&apos; <span className="font-mono">anchors.json</span>.
          Coords auto-scale if frame dimensions differ. Use this to pin a known-good alignment across siblings that share the same FFLF.
        </div>

        {err && <div className="text-xs text-red-400 whitespace-pre-wrap mb-2">{err}</div>}
        {clips === null && <div className="text-xs text-neutral-400">Loading clips…</div>}

        {clips && (
          <>
            <div className="flex items-center gap-3 text-xs mb-2">
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setSelected(allEligibleSelected ? new Set() : new Set(eligible.map(c => c.name)))}
                disabled={eligible.length === 0}
              >
                {allEligibleSelected ? "Deselect all" : `Select all eligible (${eligible.length})`}
              </button>
              <label className="ml-auto flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={recompose}
                  onChange={e => setRecompose(e.target.checked)}
                />
                <span>Recompose aligned after copy</span>
              </label>
            </div>

            <div className="overflow-y-auto flex-1 border border-neutral-700 rounded">
              {clips.length === 0 && (
                <div className="p-4 text-xs text-neutral-400">No other clips on this hero.</div>
              )}
              {clips.map(c => {
                const isChecked = selected.has(c.name);
                return (
                  <label
                    key={c.name}
                    className={`flex items-center gap-2 px-3 py-1.5 border-b border-neutral-800 text-sm ${c.hasProcessed ? "hover:bg-neutral-800 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={!c.hasProcessed}
                      onChange={() => toggle(c.name)}
                    />
                    <span className="font-mono">{c.name}</span>
                    <span className="text-neutral-500 text-xs">· {c.conceptId}</span>
                    <span className="ml-auto flex items-center gap-1.5 text-[10px]">
                      {!c.hasProcessed && <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">not keyed</span>}
                      {c.hasAnchors && <span className="px-1.5 py-0.5 rounded bg-yellow-900/60 text-yellow-200">will overwrite</span>}
                      {c.isAligned && <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200">aligned</span>}
                    </span>
                  </label>
                );
              })}
            </div>

            {result && (
              <div className="mt-2 text-xs space-y-1">
                {result.copied.length > 0 && (
                  <div className="text-emerald-400">
                    ✓ Copied to {result.copied.length} clip{result.copied.length === 1 ? "" : "s"}
                    {recompose && result.copied.some((c: any) => c.recomposeJobId) && " — recompose queued"}
                  </div>
                )}
                {result.errors.length > 0 && (
                  <div className="text-red-400">
                    {result.errors.length} error{result.errors.length === 1 ? "" : "s"}:
                    <ul className="ml-4 list-disc">
                      {result.errors.slice(0, 5).map((e: any, i: number) => (
                        <li key={i}><span className="font-mono">{e.clipName}</span> — {e.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={submit}
                disabled={submitting || selected.size === 0}
              >
                {submitting ? "Applying…" : `Apply to ${selected.size} clip${selected.size === 1 ? "" : "s"}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Crosshair({ label, color, at, onPointerDown }: {
  label: string; color: string; at: { x: number; y: number };
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      className="absolute pointer-events-auto"
      style={{ left: at.x - 14, top: at.y - 14, cursor: "grab" }}
      onPointerDown={onPointerDown}
    >
      <svg width="28" height="28" viewBox="-14 -14 28 28">
        <circle cx="0" cy="0" r="10" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="-13" y1="0" x2="13" y2="0" stroke={color} strokeWidth="1" />
        <line x1="0" y1="-13" x2="0" y2="13" stroke={color} strokeWidth="1" />
        <circle cx="0" cy="0" r="1.5" fill={color} />
      </svg>
      <div className="absolute -top-4 left-4 text-[10px] font-mono" style={{ color }}>{label}</div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "ok" | "warn" }) {
  const cls = tone === "ok" ? "bg-emerald-900/60 text-emerald-200" : "bg-yellow-900/60 text-yellow-200";
  return <span className={`px-2 py-1 rounded ${cls}`}>{label}</span>;
}

/**
 * Draw the template guides (Eye Level, Ground, Center, Eye Range) on top of the image.
 *
 * Coord mapping: the template is normalized to the *output canvas*. We need to show where
 * the anchors WILL land after transform, overlaid on the current (unaligned) image so the
 * user can sanity-check. The simplest visual for now: draw target lines relative to the
 * image canvas (using image dims as a stand-in for output dims when mode="source"). For
 * mode="template", scale to the fixed template dims.
 */
function TemplateOverlay({
  template, canvasW, canvasH, imgW, imgH, anchors,
}: {
  template: Template;
  canvasW: number; canvasH: number;
  imgW: number; imgH: number;
  anchors: AnchorsFile;
}) {
  const outW = template.outputCanvas.mode === "template" ? template.outputCanvas.width : imgW;
  const outH = template.outputCanvas.mode === "template" ? template.outputCanvas.height : imgH;

  // For the preview, compute the affine that would be applied, then show the transformed
  // anchors relative to the canvas. Because we're viewing the SOURCE frame, we instead show
  // the *inverse* position of the template lines back on the source — i.e. where the eye/foot
  // MUST be (in source coords) for the transform to land on the target. That's equivalent to:
  // if anchors are perfect, the target lines coincide with the anchors themselves. So we draw:
  //   horizontal "target eye" line at eye.y, "target ground" at foot.y (these are where lines
  //   will be AFTER alignment). Plus the center-x vertical at the eye's x.
  const scaleX = canvasW / imgW;
  const scaleY = canvasH / imgH;

  const eyeYpx   = anchors.eye.y  * scaleY;
  const footYpx  = anchors.foot.y * scaleY;
  const centerXpx= anchors.eye.x  * scaleX;

  // Also show where the lines would fall if we used "ideal" normalized positions on this
  // image — useful when anchors are off. These are the *current* target guides in image space.
  const idealEyeY    = template.eyeLevelY * outH * scaleY;
  const idealGroundY = template.groundY   * outH * scaleY;
  const idealCenterX = template.centerX   * outW * scaleX;
  const idealRangeHW = template.eyeRangeHalfWidth * outW * scaleX;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasW} height={canvasH}
      viewBox={`0 0 ${canvasW} ${canvasH}`}
    >
      {/* Ideal target guides (dashed magenta, matches character-alignment.png) */}
      <line x1="0" y1={idealEyeY}    x2={canvasW} y2={idealEyeY}    stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" opacity="0.85" />
      <line x1="0" y1={idealGroundY} x2={canvasW} y2={idealGroundY} stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" opacity="0.85" />
      <line x1={idealCenterX} y1="0" x2={idealCenterX} y2={canvasH} stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      {/* Eye-range tolerance bar */}
      <rect
        x={idealCenterX - idealRangeHW} y={idealEyeY - 4}
        width={idealRangeHW * 2} height="8"
        fill="#ec4899" opacity="0.25"
      />

      {/* Live anchor-derived lines (solid, show where current anchors sit) */}
      <line x1="0" y1={eyeYpx}  x2={canvasW} y2={eyeYpx}  stroke="#22d3ee" strokeWidth="0.75" opacity="0.6" />
      <line x1="0" y1={footYpx} x2={canvasW} y2={footYpx} stroke="#f472b6" strokeWidth="0.75" opacity="0.6" />

      <text x="6"  y={idealEyeY - 4}    fill="#ec4899" fontSize="10">Eye Level (target)</text>
      <text x="6"  y={idealGroundY - 4} fill="#ec4899" fontSize="10">Ground (target)</text>
    </svg>
  );
}
