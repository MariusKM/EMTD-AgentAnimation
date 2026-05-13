"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "Green (chroma)", value: "#00ff00" },
  { label: "Blue (chroma)", value: "#0000ff" },
  { label: "Magenta", value: "#ff00ff" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
];

const ASPECTS = [
  { label: "9:16 portrait (720×1280)", w: 720, h: 1280 },
  { label: "16:9 landscape (1280×720)", w: 1280, h: 720 },
  { label: "1:1 square (1024×1024)", w: 1024, h: 1024 },
  { label: "4:3 (1024×768)", w: 1024, h: 768 },
];

export function FFLFBuilder({
  heroId,
  heroSourceRel,
  onClose,
  onSaved,
}: {
  heroId: string;
  heroSourceRel?: string;
  onClose: () => void;
  onSaved: (saved: { name: string; index: number; relPath: string }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState("#00ff00");
  const [aspectIdx, setAspectIdx] = useState(0);
  const [tx, setTx] = useState(0.5); // 0..1 normalized x of hero center
  const [ty, setTy] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAligning, setAutoAligning] = useState(false);
  const [autoAnchors, setAutoAnchors] = useState<{
    eye: { x: number; y: number; source: string; confidence: number };
    foot: { x: number; y: number; source: string; confidence: number };
    frame: { width: number; height: number };
  } | null>(null);

  const aspect = ASPECTS[aspectIdx];

  // Load hero image
  useEffect(() => {
    if (!heroSourceRel) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      heroImgRef.current = img;
      setImgLoaded(true);
      // Auto-fit: scale so hero fills ~85% of the smaller axis
      const fit = Math.min((aspect.w * 0.85) / img.naturalWidth, (aspect.h * 0.85) / img.naturalHeight);
      setScale(fit);
      setTx(0.5);
      setTy(0.5);
    };
    img.onerror = () => setError("Failed to load source image");
    img.src = `/api/files/${encodeURI(heroSourceRel)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSourceRel]);

  // Re-render canvas on any change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = aspect.w;
    canvas.height = aspect.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, aspect.w, aspect.h);

    const img = heroImgRef.current;
    if (img && imgLoaded) {
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const cx = tx * aspect.w;
      const cy = ty * aspect.h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    }
  }, [bgColor, aspect, tx, ty, scale, imgLoaded]);

  // Drag to reposition + wheel to scale on the displayed canvas.
  // We map display-space deltas to canvas-space normalized coords.
  const dragRef = useRef<{ startTx: number; startTy: number; startX: number; startY: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startTx: tx, startTy: ty, startX: e.clientX, startY: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const drag = dragRef.current;
    if (!drag || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - drag.startX) / rect.width;
    const dy = (e.clientY - drag.startY) / rect.height;
    setTx(clamp01(drag.startTx + dx));
    setTy(clamp01(drag.startTy + dy));
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.05 : 0.95;
    setScale((s) => Math.max(0.05, Math.min(8, s * factor)));
  };

  const autoAlign = async () => {
    const img = heroImgRef.current;
    if (!img) return;
    setAutoAligning(true);
    setError(null);
    try {
      // 1. Fetch anchors for the source PNG.
      let anchors = autoAnchors;
      if (!anchors) {
        const a = await fetch(`/api/heroes/${encodeURIComponent(heroId)}/auto-align-source`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).then((r) => r.json());
        if (a.error) throw new Error(a.error);
        anchors = a.anchors;
        setAutoAnchors(anchors);
      }
      if (!anchors) throw new Error("No anchors returned");

      // 2. Fetch template (normalized positions).
      const tpl = await fetch("/api/alignment-template").then((r) => r.json());
      const t = tpl.template as { eyeLevelY: number; groundY: number; centerX: number };

      // 3. Compute required scale + tx/ty so the source PNG lands at template positions on the
      //    FFLF canvas. Source drawn centered at (tx*W, ty*H) with `scale` multiplier applied to
      //    the natural size. A source-space point (x, y) lands at:
      //        canvasX = tx*W + (x - srcW/2) * displayScale
      //        canvasY = ty*H + (y - srcH/2) * displayScale
      //    where displayScale = scale (because we already normalize by natural size in the render).
      const srcW = anchors.frame.width;
      const srcH = anchors.frame.height;
      const eyeToFoot = anchors.foot.y - anchors.eye.y;
      if (eyeToFoot <= 1) throw new Error(`Invalid anchors (foot<=eye): ${eyeToFoot}`);

      const targetEyeToFoot = (t.groundY - t.eyeLevelY) * aspect.h;
      const displayScale = targetEyeToFoot / eyeToFoot;

      // displayScale is the ratio between natural-size pixels and canvas pixels, but `scale` here
      // multiplies `img.naturalWidth * scale` to get canvas draw width. So scale === displayScale.
      const newScale = displayScale;

      // Compute tx / ty from the eye anchor landing on the target.
      // canvasX_eye = tx*W + (eyeX - srcW/2) * displayScale = W * centerX
      // → tx = centerX - (eyeX - srcW/2) * displayScale / W
      const newTx = t.centerX - (anchors.eye.x - srcW / 2) * displayScale / aspect.w;
      const newTy = t.eyeLevelY - (anchors.eye.y - srcH / 2) * displayScale / aspect.h;

      setScale(clampScale(newScale));
      setTx(clamp01(newTx));
      setTy(clamp01(newTy));
    } catch (e: any) {
      setError(`Auto-align failed: ${e?.message ?? e}`);
    } finally {
      setAutoAligning(false);
    }
  };

  const save = async () => {
    if (!canvasRef.current) return;
    setSaving(true);
    setError(null);
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const res = await fetch(`/api/heroes/${encodeURIComponent(heroId)}/fflf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pngBase64: dataUrl }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error ?? "Save failed");
      onSaved(j.fflf);
      onClose();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel border border-border rounded-lg w-[1100px] max-w-[96vw] h-[90vh] flex flex-col"
      >
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold">Build FFLF for {heroId}</div>
            <div className="text-xs text-muted">
              Drag to position · scroll to scale · saves to <code>Output/{heroId}/{heroId}_FFLF_&lt;n&gt;.png</code>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text text-2xl leading-none px-2">×</button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 p-4">
          {/* Canvas */}
          <div className="col-span-9 bg-bg border border-border rounded flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onWheel={onWheel}
              className="max-h-full max-w-full cursor-move"
              style={{ background: "#000" }}
            />
          </div>

          {/* Controls */}
          <div className="col-span-3 flex flex-col gap-3 overflow-auto">
            <Field label="Background color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-12 rounded border border-border bg-bg cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-bg border border-border rounded p-2 text-sm font-mono"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setBgColor(p.value)}
                    className={`text-xs px-2 py-1 rounded border ${bgColor.toLowerCase() === p.value ? "border-accent text-text" : "border-border text-muted hover:text-text"}`}
                    title={p.label}
                  >
                    <span className="inline-block w-3 h-3 rounded-sm align-middle mr-1.5" style={{ background: p.value, border: "1px solid #444" }} />
                    {p.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Output size">
              <select
                value={aspectIdx}
                onChange={(e) => setAspectIdx(parseInt(e.target.value, 10))}
                className="w-full bg-bg border border-border rounded p-2 text-sm"
              >
                {ASPECTS.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
              </select>
            </Field>

            <Field label={`Scale: ${scale.toFixed(2)}×`}>
              <input
                type="range"
                min={0.05}
                max={4}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </Field>

            <Field label={`Position X: ${(tx * 100).toFixed(0)}%`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={tx}
                onChange={(e) => setTx(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </Field>

            <Field label={`Position Y: ${(ty * 100).toFixed(0)}%`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={ty}
                onChange={(e) => setTy(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </Field>

            <div className="flex gap-2">
              <button
                onClick={() => { setTx(0.5); setTy(0.5); }}
                className="flex-1 text-xs text-muted hover:text-text px-2 py-1 border border-border rounded"
              >Reset position</button>
              <button
                onClick={autoAlign}
                disabled={autoAligning || !imgLoaded}
                className="flex-1 text-xs px-2 py-1 border border-border rounded bg-panel2 text-text hover:border-accent disabled:opacity-50"
                title="Detect eye+foot on the source PNG and position/scale it to match the alignment template (Eye Level + Ground)"
              >
                {autoAligning ? "Aligning…" : "Auto-align to template"}
              </button>
            </div>
            {autoAnchors && (
              <div className="text-[10px] text-muted leading-snug">
                Anchors detected — eye: {autoAnchors.eye.source} (conf {autoAnchors.eye.confidence.toFixed(2)}) · foot: {autoAnchors.foot.source}
              </div>
            )}

            {error && <div className="text-xs text-bad">{error}</div>}

            <div className="flex-1" />

            <button
              onClick={save}
              disabled={saving || !imgLoaded}
              className={`mt-2 px-3 py-2 rounded font-medium ${imgLoaded && !saving ? "bg-accent text-bg" : "bg-panel2 text-muted"}`}
            >
              {saving ? "Saving…" : "Save FFLF"}
            </button>
            <button onClick={onClose} className="bg-panel2 px-3 py-1.5 rounded text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function clampScale(n: number) { return Math.max(0.05, Math.min(8, n)); }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted mb-1">{label}</div>
      {children}
    </label>
  );
}
