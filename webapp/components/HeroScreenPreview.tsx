"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ---------- Types mirrored from HeroWorkspace.tsx ----------

type DeliveredWebm = { size: number; rel: string };

type ClipLike = {
  name: string;
  conceptId: string;
  meta: { favorite: boolean; rating: number | null; edgeFade?: number; overflowSize?: number | null };
  processed: {
    fgAlphaMp4AlignedRel?: string;
    deliveredWebms?: DeliveredWebm[];
  } | null;
};

type ConceptLike = {
  id: string;
  kind: "power" | "idle";
  title: string;
  clips: ClipLike[];
};

type HeroLike = {
  id: string;
  displayName: string;
  concepts: ConceptLike[];
};

type Slot = { x: number; y: number; w: number; h: number };

type PreviewMode = "single" | "sequence";

type PlaylistItem = { clipName: string; src: string; loops: number; edgeFade: number; overflowScale: number };

// Standard delivered content size (matches deliver_webm.py default --size).
// `overflowScale` is `overflowSize / CONTENT_SIZE` (or 1 if no overflow);
// the preview multiplies the slot dimensions by it to render the video at
// the right pixel size with the central content landing on the slot.
const CONTENT_SIZE = 550;

// The mockup PNG lives at HEROANIM_ROOT/HeroScreen.png and is served via /api/files.
const MOCKUP_REL = "HeroScreen.png";
const MOCKUP_NATURAL_W = 750;
const MOCKUP_NATURAL_H = 1624;

// Delivered WebMs are square (550×550). Derive h-normalized from w-normalized
// so the slot renders square on top of the non-square mockup.
const SLOT_ASPECT = MOCKUP_NATURAL_W / MOCKUP_NATURAL_H; // ≈ 0.4618
function squareH(wNorm: number): number { return wNorm * SLOT_ASPECT; }

// ---------- Helpers ----------

function pickLargestWebm(clip: ClipLike): DeliveredWebm | null {
  const list = clip.processed?.deliveredWebms ?? [];
  if (list.length === 0) return null;
  return list.reduce((a, b) => (a.size >= b.size ? a : b));
}

function clipHasDeliverable(clip: ClipLike): boolean {
  return (clip.processed?.deliveredWebms?.length ?? 0) > 0;
}

function clipIsAligned(clip: ClipLike): boolean {
  return !!clip.processed?.fgAlphaMp4AlignedRel;
}

// Flatten hero into all clips with deliverables. Used for single-clip mode.
function flattenDeliverables(hero: HeroLike): { concept: ConceptLike; clip: ClipLike; webm: DeliveredWebm }[] {
  const out: { concept: ConceptLike; clip: ClipLike; webm: DeliveredWebm }[] = [];
  for (const c of hero.concepts) {
    for (const cl of c.clips) {
      const w = pickLargestWebm(cl);
      if (w) out.push({ concept: c, clip: cl, webm: w });
    }
  }
  return out;
}

// For sequence mode: favorited + aligned + has-deliverable, grouped by kind.
function sequenceCandidates(hero: HeroLike, kind: "power" | "idle") {
  const out: { concept: ConceptLike; clip: ClipLike; webm: DeliveredWebm }[] = [];
  for (const c of hero.concepts) {
    if (c.kind !== kind) continue;
    for (const cl of c.clips) {
      if (!cl.meta.favorite) continue;
      if (!clipIsAligned(cl)) continue;
      const w = pickLargestWebm(cl);
      if (!w) continue;
      out.push({ concept: c, clip: cl, webm: w });
    }
  }
  return out;
}

// ---------- Component ----------

export function HeroScreenPreview({
  hero,
  initialClipName,
  initialMode = "single",
  onClose,
}: {
  hero: HeroLike;
  initialClipName?: string;
  initialMode?: PreviewMode;
  onClose: () => void;
}) {
  const [slot, setSlot] = useState<Slot>({ x: 0.08, y: 0.18, w: 0.84, h: 0.38 });
  const [editingSlot, setEditingSlot] = useState(false);
  const [mode, setMode] = useState<PreviewMode>(initialMode);
  const [muted, setMuted] = useState(false);

  // --- Fetch persisted slot rect once ---
  useEffect(() => {
    fetch("/api/config/mockup-slot", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (j?.slot) setSlot(j.slot); })
      .catch(() => {});
  }, []);

  // --- Single-clip mode state ---
  const singleOptions = useMemo(() => flattenDeliverables(hero), [hero]);
  const initialSingle = useMemo(() => {
    if (initialClipName) {
      const found = singleOptions.find((o) => o.clip.name === initialClipName);
      if (found) return found.clip.name;
    }
    return singleOptions[0]?.clip.name ?? "";
  }, [initialClipName, singleOptions]);
  const [singleClipName, setSingleClipName] = useState(initialSingle);
  useEffect(() => { if (!singleClipName && initialSingle) setSingleClipName(initialSingle); }, [initialSingle, singleClipName]);

  // --- Sequence-mode state ---
  const idleOptions = useMemo(() => sequenceCandidates(hero, "idle"), [hero]);
  const powerOptions = useMemo(() => sequenceCandidates(hero, "power"), [hero]);
  const [idleClipName, setIdleClipName] = useState(idleOptions[0]?.clip.name ?? "");
  const [powerClipName, setPowerClipName] = useState(powerOptions[0]?.clip.name ?? "");
  const [idleLoops, setIdleLoops] = useState(2);
  useEffect(() => { if (!idleClipName && idleOptions[0]) setIdleClipName(idleOptions[0].clip.name); }, [idleOptions, idleClipName]);
  useEffect(() => { if (!powerClipName && powerOptions[0]) setPowerClipName(powerOptions[0].clip.name); }, [powerOptions, powerClipName]);

  // --- Pending delivery options for the active single-mode clip (UI staging) ---
  // Initialised from the selected clip's stored meta; reset when the selected
  // clip changes; "Save" persists back to clip_meta.
  const [pendingFade, setPendingFade] = useState(0);
  const [pendingOverflow, setPendingOverflow] = useState<number | null>(null);
  useEffect(() => {
    const opt = singleOptions.find((o) => o.clip.name === singleClipName);
    setPendingFade(opt?.clip.meta.edgeFade ?? 0);
    setPendingOverflow(opt?.clip.meta.overflowSize ?? null);
  }, [singleClipName, singleOptions]);

  // --- Playlist: list of (src, loops, edgeFade, overflowScale) per mode ---
  // edgeFade here is the *additional* CSS overlay on top of whatever's already
  // baked into the WebM on disk. After a save+re-deliver the stored value
  // matches the baked value, so the CSS overlay drops to 0 and the preview
  // reflects the asset exactly without compounding masks.
  // overflowScale is overflowSize/CONTENT_SIZE (or 1 if no overflow). Single
  // mode reflects pendingOverflow live; sequence mode uses each clip's stored
  // overflow because the WebM on disk already has the padding baked in.
  const playlist: PlaylistItem[] = useMemo(() => {
    const overflowScaleFor = (storedOverflow: number | null | undefined, pending?: number | null) => {
      const v = pending !== undefined ? pending : (storedOverflow ?? null);
      if (!v || v <= CONTENT_SIZE) return 1;
      return v / CONTENT_SIZE;
    };
    if (mode === "single") {
      const opt = singleOptions.find((o) => o.clip.name === singleClipName);
      if (!opt) return [];
      const stored = opt.clip.meta.edgeFade ?? 0;
      const cssOverlay = Math.max(0, pendingFade - stored);
      // For overflow: the WebM on disk has whatever overflow was last baked.
      // The slider edits pendingOverflow which is the *target* for the next
      // delivery. We display the WebM at the SAVED overflow scale (because
      // that's what the bytes on disk actually are) — the staging slider
      // doesn't change layout until the user re-delivers.
      const overflowScale = overflowScaleFor(opt.clip.meta.overflowSize);
      return [{
        clipName: opt.clip.name,
        src: `/api/files/${encodeURI(opt.webm.rel)}`,
        loops: 0,
        edgeFade: cssOverlay,
        overflowScale,
      }];
    }
    const idle = idleOptions.find((o) => o.clip.name === idleClipName);
    const power = powerOptions.find((o) => o.clip.name === powerClipName);
    if (!idle || !power) return [];
    const idleSrc = `/api/files/${encodeURI(idle.webm.rel)}`;
    const idleScale = overflowScaleFor(idle.clip.meta.overflowSize);
    const powerScale = overflowScaleFor(power.clip.meta.overflowSize);
    // Sequence mode shows what's actually on disk — no CSS overlay needed.
    return [
      { clipName: idle.clip.name,  src: idleSrc, loops: Math.max(1, idleLoops), edgeFade: 0, overflowScale: idleScale },
      { clipName: power.clip.name, src: `/api/files/${encodeURI(power.webm.rel)}`, loops: 1, edgeFade: 0, overflowScale: powerScale },
      { clipName: idle.clip.name,  src: idleSrc, loops: 1, edgeFade: 0, overflowScale: idleScale },
    ];
  }, [mode, singleOptions, singleClipName, pendingFade, idleOptions, idleClipName, powerOptions, powerClipName, idleLoops]);

  // --- Playback index + loops-remaining tracking ---
  const [plIdx, setPlIdx] = useState(0);
  const [loopsDone, setLoopsDone] = useState(0);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [localTime, setLocalTime] = useState(0); // currentTime within the current loop
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Set when seeking into a different segment — applied once the new <video> mounts
  // and reports loadedmetadata.
  const pendingSeekRef = useRef<number | null>(null);

  // Reset playback when playlist identity changes (different clips picked).
  useEffect(() => {
    setPlIdx(0);
    setLoopsDone(0);
    setFinished(false);
    setLocalTime(0);
    setPlaying(true);
  }, [playlist.map((p) => p.src + "×" + p.loops).join("|")]);

  // Pre-load metadata for every unique src so the timeline knows total
  // duration up-front, not just for the segment that's currently playing.
  const [clipDurations, setClipDurations] = useState<Map<string, number>>(new Map());
  useEffect(() => {
    const unique = Array.from(new Set(playlist.map(p => p.src)));
    for (const src of unique) {
      if (clipDurations.has(src)) continue;
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.src = src;
      v.onloadedmetadata = () => {
        if (Number.isFinite(v.duration) && v.duration > 0) {
          setClipDurations(prev => {
            if (prev.has(src)) return prev;
            const next = new Map(prev);
            next.set(src, v.duration);
            return next;
          });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.map(p => p.src).join("|")]);

  const current = playlist[plIdx];
  const currentIsLast = plIdx === playlist.length - 1;
  const currentLoopsForever = current && current.loops === 0;

  // Compute segment boundaries on a unified sequence timeline.
  // Each playlist item contributes (duration × loops) seconds.
  const timeline = useMemo(() => {
    let acc = 0;
    const segs = playlist.map((item) => {
      const dur = clipDurations.get(item.src) ?? 0;
      const span = dur * (item.loops || 1);
      const seg = { ...item, duration: dur, span, startTime: acc };
      acc += span;
      return seg;
    });
    return { segments: segs, total: acc };
  }, [playlist, clipDurations]);

  const globalTime = useMemo(() => {
    if (currentLoopsForever) return localTime;
    const seg = timeline.segments[plIdx];
    if (!seg) return 0;
    return seg.startTime + loopsDone * seg.duration + localTime;
  }, [timeline, plIdx, loopsDone, localTime, currentLoopsForever]);

  // requestAnimationFrame loop to keep localTime in sync with the playing video.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) setLocalTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Handle <video> ended event: advance loops or items.
  const onEnded = () => {
    if (!current) return;
    if (currentLoopsForever) {
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      return;
    }
    const nextLoopsDone = loopsDone + 1;
    if (nextLoopsDone < current.loops) {
      setLoopsDone(nextLoopsDone);
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      return;
    }
    if (plIdx < playlist.length - 1) {
      setPlIdx(plIdx + 1);
      setLoopsDone(0);
      return;
    }
    setFinished(true);
    setPlaying(false);
  };

  const replay = () => {
    setPlIdx(0);
    setLoopsDone(0);
    setLocalTime(0);
    setFinished(false);
    setPlaying(true);
    // play() after src change fires on load via autoPlay attr.
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (finished) {
      replay();
      return;
    }
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };

  // Space toggles play/pause when the modal has focus (and you're not typing
  // into an input).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      togglePlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, playing]);

  // Seek to an absolute position on the unified sequence timeline.
  const seekGlobal = (target: number) => {
    if (timeline.total <= 0) return;
    const t = Math.max(0, Math.min(timeline.total, target));
    for (let i = 0; i < timeline.segments.length; i++) {
      const s = timeline.segments[i];
      const segEnd = s.startTime + s.span;
      if (t < segEnd || i === timeline.segments.length - 1) {
        const within = Math.max(0, Math.min(s.span, t - s.startTime));
        const loop = s.duration > 0 ? Math.min(s.loops - 1, Math.floor(within / s.duration)) : 0;
        const local = s.duration > 0 ? within - loop * s.duration : 0;
        const sameSegment = i === plIdx;
        if (sameSegment) {
          if (loop !== loopsDone) setLoopsDone(loop);
          if (videoRef.current) {
            videoRef.current.currentTime = local;
            setLocalTime(local);
          }
        } else {
          // Cross-segment seek: queue the local currentTime to apply once the
          // new <video> element mounts and reports loadedmetadata.
          pendingSeekRef.current = local;
          setPlIdx(i);
          setLoopsDone(loop);
          setLocalTime(local);
        }
        setFinished(false);
        return;
      }
    }
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    if (current && Number.isFinite(v.duration) && v.duration > 0) {
      setClipDurations(prev => {
        if (prev.get(current.src) === v.duration) return prev;
        const next = new Map(prev);
        next.set(current.src, v.duration);
        return next;
      });
    }
    if (pendingSeekRef.current != null) {
      v.currentTime = pendingSeekRef.current;
      pendingSeekRef.current = null;
    }
    if (playing) v.play().catch(() => {});
  };

  // --- Slot persistence ---
  const saveSlot = async (next: Slot) => {
    setSlot(next);
    await fetch("/api/config/mockup-slot", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  // --- Per-clip delivery options: save & re-deliver ---
  const [savingFade, setSavingFade] = useState<"idle" | "saving" | "queued" | "error">("idle");
  const [fadeMsg, setFadeMsg] = useState<string | null>(null);

  const saveClipDelivery = async (
    clipName: string,
    fade: number,
    overflow: number | null,
    alsoRedeliver: boolean,
  ) => {
    setSavingFade("saving");
    setFadeMsg(null);
    try {
      const r = await fetch(`/api/clips/${encodeURIComponent(hero.id)}/${encodeURIComponent(clipName)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edgeFade: fade, overflowSize: overflow }),
      });
      if (!r.ok) {
        const t = await r.text();
        setSavingFade("error");
        setFadeMsg(t || "Save failed");
        return;
      }
      if (alsoRedeliver) {
        const dr = await fetch("/api/jobs/deliver", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clips: [{ heroId: hero.id, clipName }], allowUnaligned: true }),
        });
        if (!dr.ok) {
          const t = await dr.text();
          setSavingFade("error");
          setFadeMsg(t || "Re-deliver failed");
          return;
        }
        setSavingFade("queued");
        setFadeMsg("Saved · re-deliver queued (open /jobs to watch)");
      } else {
        setSavingFade("queued");
        setFadeMsg("Saved");
      }
      // Mark the locally-cached clip's stored values so the next clip-switch
      // initialises the panel correctly without a full hero refetch.
      const opt = singleOptions.find(o => o.clip.name === clipName);
      if (opt) {
        opt.clip.meta.edgeFade = fade;
        opt.clip.meta.overflowSize = overflow;
      }
    } catch (e: any) {
      setSavingFade("error");
      setFadeMsg(String(e?.message ?? e));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-stretch justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-panel border border-border rounded-lg w-full max-w-[1100px] max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-2 border-b border-border flex items-center gap-3">
          <div className="font-semibold">Hero screen preview</div>
          <div className="text-xs text-muted">{hero.displayName}</div>
          <div className="ml-auto flex items-center gap-2">
            <ModeTabs mode={mode} onChange={setMode} />
            <button
              onClick={() => setEditingSlot((v) => !v)}
              className={`text-xs px-2 py-1 rounded border ${editingSlot ? "bg-accent text-bg border-accent" : "bg-panel2 text-text border-border hover:border-accent"}`}
              title="Drag/resize the character slot on the mockup. Saves automatically."
            >
              {editingSlot ? "Done" : "Edit placement"}
            </button>
            <button onClick={onClose} className="text-muted hover:text-text ml-1">×</button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* LEFT: mockup + video overlay + transport bar */}
          <div className="flex-1 bg-bg flex flex-col p-4 overflow-hidden">
            <div className="flex-1 flex items-center justify-center min-h-0">
              <MockupStage
                slot={slot}
                editing={editingSlot}
                onSlotChange={saveSlot}
                edgeFade={current?.edgeFade ?? 0}
                overflowScale={current?.overflowScale ?? 1}
                videoSrc={current?.src}
                muted={muted}
                onEnded={onEnded}
                onLoadedMetadata={onLoadedMetadata}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                loopForever={!!currentLoopsForever}
                videoRef={videoRef}
                finished={finished}
              />
            </div>
            {playlist.length > 0 && !currentLoopsForever && (
              <TransportBar
                playing={playing}
                finished={finished}
                onTogglePlay={togglePlay}
                segments={timeline.segments}
                total={timeline.total}
                globalTime={globalTime}
                onSeek={seekGlobal}
                activeIdx={plIdx}
              />
            )}
            {currentLoopsForever && playlist.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="text-xs px-2.5 py-1.5 rounded bg-panel2 border border-border hover:border-accent w-16"
                >
                  {playing ? "❚❚ Pause" : "▶ Play"}
                </button>
                <div className="text-[11px] text-muted font-mono">single clip · looping</div>
              </div>
            )}
          </div>

          {/* RIGHT: controls */}
          <div className="w-[300px] border-l border-border flex flex-col overflow-y-auto">
            <div className="p-3 space-y-3 text-sm">
              {mode === "single" ? (
                <>
                  <div>
                    <div className="text-xs text-muted mb-1">Clip</div>
                    {singleOptions.length === 0 ? (
                      <div className="text-xs text-bad">No delivered WebMs on this hero yet. Run &quot;Deliver (WebM 550)&quot; first.</div>
                    ) : (
                      <select
                        value={singleClipName}
                        onChange={(e) => setSingleClipName(e.target.value)}
                        className="w-full bg-bg border border-border rounded p-2 text-sm"
                      >
                        {singleOptions.map((o) => (
                          <option key={o.clip.name} value={o.clip.name}>
                            {o.concept.kind === "power" ? "⚡" : "·"} {o.clip.name} — {o.concept.title}
                            {o.clip.meta.favorite ? "  ★" : ""}
                            {(o.clip.meta.edgeFade ?? 0) > 0 ? `  · mask ${Math.round((o.clip.meta.edgeFade ?? 0) * 100)}%` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {singleClipName && (
                    <DeliveryPanel
                      clipName={singleClipName}
                      storedFade={singleOptions.find(o => o.clip.name === singleClipName)?.clip.meta.edgeFade ?? 0}
                      storedOverflow={singleOptions.find(o => o.clip.name === singleClipName)?.clip.meta.overflowSize ?? null}
                      pendingFade={pendingFade}
                      onFadeChange={setPendingFade}
                      pendingOverflow={pendingOverflow}
                      onOverflowChange={setPendingOverflow}
                      onSave={(redeliver) => saveClipDelivery(singleClipName, pendingFade, pendingOverflow, redeliver)}
                      state={savingFade}
                      msg={fadeMsg}
                    />
                  )}
                </>
              ) : (
                <>
                  <SequenceControls
                    idleOptions={idleOptions}
                    powerOptions={powerOptions}
                    idleClipName={idleClipName}
                    setIdleClipName={setIdleClipName}
                    powerClipName={powerClipName}
                    setPowerClipName={setPowerClipName}
                    idleLoops={idleLoops}
                    setIdleLoops={setIdleLoops}
                  />
                  <SequenceMaskSummary
                    items={[
                      {
                        clipName: idleClipName,
                        label: "Idle",
                        fade: idleOptions.find(o => o.clip.name === idleClipName)?.clip.meta.edgeFade ?? 0,
                        overflow: idleOptions.find(o => o.clip.name === idleClipName)?.clip.meta.overflowSize ?? null,
                      },
                      {
                        clipName: powerClipName,
                        label: "Power",
                        fade: powerOptions.find(o => o.clip.name === powerClipName)?.clip.meta.edgeFade ?? 0,
                        overflow: powerOptions.find(o => o.clip.name === powerClipName)?.clip.meta.overflowSize ?? null,
                      },
                    ]}
                  />
                </>
              )}

              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="flex-1 text-xs px-2 py-1.5 rounded bg-panel2 border border-border hover:border-accent"
                  >
                    {muted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                  <button
                    onClick={replay}
                    className="flex-1 text-xs px-2 py-1.5 rounded bg-panel2 border border-border hover:border-accent"
                  >
                    ↻ Replay
                  </button>
                </div>
                {mode === "sequence" && (
                  <ExportStitchedButton
                    heroId={hero.id}
                    idleClipName={idleClipName}
                    idleLoops={idleLoops}
                    powerClipName={powerClipName}
                    disabled={!idleClipName || !powerClipName}
                  />
                )}
                {mode === "sequence" && playlist.length > 0 && (
                  <div className="text-[11px] text-muted font-mono leading-snug">
                    {playlist.map((p, i) => {
                      const active = i === plIdx && !finished;
                      const loopTag = p.loops > 0 ? ` ×${p.loops}` : "";
                      const progress = active && p.loops > 0 ? `  (${loopsDone + 1}/${p.loops})` : "";
                      return (
                        <div key={i} className={active ? "text-accent" : ""}>
                          {active ? "▶" : "·"} {p.clipName}{loopTag}{progress}
                        </div>
                      );
                    })}
                    {finished && <div className="text-muted mt-1">— finished —</div>}
                  </div>
                )}
              </div>

              {editingSlot && (
                <div className="pt-2 border-t border-border space-y-2">
                  <Field label={`Scale (${Math.round(slot.w * 100)}%)`}>
                    <input
                      type="range"
                      min={0}
                      max={300}
                      step={1}
                      value={Math.round(slot.w * 100)}
                      onChange={(e) => {
                        const w = parseInt(e.target.value, 10) / 100;
                        const h = squareH(w);
                        // Preserve the current centre; allow overflow when the slot is larger than the mockup.
                        const cx = slot.x + slot.w / 2;
                        const cy = slot.y + squareH(slot.w) / 2;
                        const nx = clampAllowOverflow(cx - w / 2, w);
                        const ny = clampAllowOverflow(cy - h / 2, h);
                        saveSlot({ x: nx, y: ny, w, h });
                      }}
                      className="w-full"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="x"
                      value={slot.x}
                      step={0.001}
                      onCommit={(v) => saveSlot({ ...slot, x: v, h: squareH(slot.w) })}
                    />
                    <NumberField
                      label="y"
                      value={slot.y}
                      step={0.001}
                      onCommit={(v) => saveSlot({ ...slot, y: v, h: squareH(slot.w) })}
                    />
                  </div>
                  <div className="text-[11px] text-muted italic leading-snug">
                    drag the box to move · slider to scale · x/y for exact values (shared across heroes)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function ExportStitchedButton({
  heroId,
  idleClipName,
  idleLoops,
  powerClipName,
  disabled,
}: {
  heroId: string;
  idleClipName: string;
  idleLoops: number;
  powerClipName: string;
  disabled: boolean;
}) {
  const [state, setState] = useState<"idle" | "submitting" | "queued" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setState("submitting");
    setMsg(null);
    const res = await fetch("/api/jobs/preview-stitch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroId,
        // idle×N → power → idle×1 — same shape as the live preview, so the
        // exported MP4 also lets you verify entry + exit alignment. Per-clip
        // edge-fade comes from clip_meta on the server (no need to send here).
        items: [
          { clipName: idleClipName, loops: idleLoops },
          { clipName: powerClipName, loops: 1 },
          { clipName: idleClipName, loops: 1 },
        ],
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("error");
      setMsg(j?.error ?? "Export failed");
      return;
    }
    setState("queued");
    setMsg(j?.outputPath ? outputTail(j.outputPath) : "Queued");
  };

  return (
    <div className="space-y-1">
      <button
        onClick={submit}
        disabled={disabled || state === "submitting"}
        className={`w-full text-xs px-2 py-1.5 rounded font-medium ${disabled ? "bg-panel2 text-muted cursor-not-allowed" : "bg-accent text-bg hover:opacity-90"}`}
        title="Render idle×N → power over the mockup into a single MP4 with audio, saved to Output/<Hero>/Final/"
      >
        {state === "submitting" ? "Submitting…" : state === "queued" ? "✓ Queued" : "⤓ Export shareable MP4"}
      </button>
      {msg && (
        <div className={`text-[11px] font-mono break-all ${state === "error" ? "text-bad" : "text-muted"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}

function outputTail(p: string): string {
  const parts = p.replace(/\\/g, "/").split("/");
  return parts.slice(-3).join("/");
}

function DeliveryPanel({
  clipName,
  storedFade,
  storedOverflow,
  pendingFade,
  onFadeChange,
  pendingOverflow,
  onOverflowChange,
  onSave,
  state,
  msg,
}: {
  clipName: string;
  storedFade: number;
  storedOverflow: number | null;
  pendingFade: number;
  onFadeChange: (v: number) => void;
  pendingOverflow: number | null;
  onOverflowChange: (v: number | null) => void;
  onSave: (alsoRedeliver: boolean) => void;
  state: "idle" | "saving" | "queued" | "error";
  msg: string | null;
}) {
  const fadeDirty = Math.abs(pendingFade - storedFade) > 0.001;
  const overflowDirty = (pendingOverflow ?? null) !== (storedOverflow ?? null);
  const dirty = fadeDirty || overflowDirty;
  const saving = state === "saving";

  // Common preset overflow output sizes. "None" = null (no overflow).
  const OVERFLOW_PRESETS: { label: string; value: number | null }[] = [
    { label: "None (550)", value: null },
    { label: "640", value: 640 },
    { label: "720", value: 720 },
    { label: "768", value: 768 },
    { label: "896", value: 896 },
    { label: "960", value: 960 },
    { label: "1024", value: 1024 },
  ];
  const isPreset = OVERFLOW_PRESETS.some(p => (p.value ?? null) === (pendingOverflow ?? null));

  return (
    <div className="border-t border-border pt-3 space-y-3">
      <div className="text-xs text-muted">Delivery options for <span className="font-mono text-text">{clipName}</span></div>

      {/* Edge fade */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] text-muted">Edge fade</div>
          <div className="text-[10px] text-muted">
            stored {Math.round(storedFade * 100)}%
            {fadeDirty && <span className="text-accent ml-1">→ {Math.round(pendingFade * 100)}%</span>}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pendingFade * 100)}
          onChange={(e) => onFadeChange(parseInt(e.target.value, 10) / 100)}
          className="w-full"
        />
        {pendingFade < storedFade && (
          <div className="text-[10px] text-yellow-400 leading-snug">
            Lower than baked — preview can&apos;t subtract. Re-deliver to see the new value.
          </div>
        )}
      </div>

      {/* Overflow */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] text-muted">Overflow size (px)</div>
          <div className="text-[10px] text-muted">
            stored {storedOverflow ?? "none"}
            {overflowDirty && <span className="text-accent ml-1">→ {pendingOverflow ?? "none"}</span>}
          </div>
        </div>
        <select
          value={isPreset ? String(pendingOverflow ?? "") : "__custom__"}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onOverflowChange(null);
            else if (v === "__custom__") {/* leave as-is, edited via the input below */}
            else onOverflowChange(parseInt(v, 10));
          }}
          className="w-full bg-bg border border-border rounded p-1.5 text-xs"
        >
          {OVERFLOW_PRESETS.map(p => (
            <option key={p.label} value={p.value === null ? "" : String(p.value)}>{p.label}</option>
          ))}
          {!isPreset && (
            <option value="__custom__">Custom: {pendingOverflow ?? "none"}</option>
          )}
        </select>
        <input
          type="number"
          min={CONTENT_SIZE}
          max={4096}
          step={1}
          placeholder={`${CONTENT_SIZE} = no overflow`}
          value={pendingOverflow ?? ""}
          onChange={(e) => {
            const t = e.target.value.trim();
            if (t === "") onOverflowChange(null);
            else {
              const n = parseInt(t, 10);
              if (Number.isFinite(n)) onOverflowChange(n);
            }
          }}
          className="w-full bg-bg border border-border rounded p-1.5 text-xs font-mono"
        />
        <div className="text-[10px] text-muted leading-snug">
          Outer canvas size. Encodes the WebM larger with the central {CONTENT_SIZE}×{CONTENT_SIZE} matching the slot, transparent padding around it. Lets the action overshoot in-game without clipping.
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave(false)}
          disabled={!dirty || saving}
          className={`flex-1 text-xs px-2 py-1.5 rounded border ${dirty && !saving ? "bg-panel2 border-border hover:border-accent text-text" : "bg-panel2 border-border text-muted cursor-not-allowed"}`}
          title="Persist these values to clip_meta. Existing delivered WebM is unchanged until you re-deliver."
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => onSave(true)}
          disabled={saving}
          className={`flex-1 text-xs px-2 py-1.5 rounded font-medium ${saving ? "bg-panel2 text-muted" : "bg-accent text-bg hover:opacity-90"}`}
          title="Save and queue a re-deliver job that re-encodes the WebM with these settings."
        >
          Save + re-deliver
        </button>
      </div>
      {msg && (
        <div className={`text-[10px] font-mono break-all ${state === "error" ? "text-bad" : "text-muted"}`}>{msg}</div>
      )}
    </div>
  );
}

function SequenceMaskSummary({
  items,
}: {
  items: { clipName: string; label: string; fade: number; overflow: number | null }[];
}) {
  if (items.every(i => i.fade === 0 && !i.overflow)) return null;
  return (
    <div className="border-t border-border pt-3">
      <div className="text-xs text-muted mb-1">Per-clip delivery</div>
      <div className="text-[11px] font-mono leading-snug space-y-0.5">
        {items.map((i, idx) => {
          const bits: string[] = [];
          if (i.fade > 0) bits.push(`fade ${Math.round(i.fade * 100)}%`);
          if (i.overflow && i.overflow > CONTENT_SIZE) bits.push(`overflow ${i.overflow}`);
          return (
            <div key={idx} className={bits.length ? "text-text" : "text-muted"}>
              {i.label}: <span className="text-muted">{i.clipName}</span> · {bits.length ? bits.join(" · ") : "default"}
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-muted italic mt-1">
        Switch to Single mode to tune a clip&apos;s delivery.
      </div>
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: PreviewMode; onChange: (m: PreviewMode) => void }) {
  return (
    <div className="flex text-xs rounded border border-border overflow-hidden">
      {(["single", "sequence"] as PreviewMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-2.5 py-1 ${mode === m ? "bg-accent text-bg" : "bg-panel2 text-text hover:bg-panel"}`}
        >
          {m === "single" ? "Single" : "Sequence"}
        </button>
      ))}
    </div>
  );
}

function SequenceControls({
  idleOptions,
  powerOptions,
  idleClipName,
  setIdleClipName,
  powerClipName,
  setPowerClipName,
  idleLoops,
  setIdleLoops,
}: {
  idleOptions: { concept: ConceptLike; clip: ClipLike; webm: DeliveredWebm }[];
  powerOptions: { concept: ConceptLike; clip: ClipLike; webm: DeliveredWebm }[];
  idleClipName: string;
  setIdleClipName: (v: string) => void;
  powerClipName: string;
  setPowerClipName: (v: string) => void;
  idleLoops: number;
  setIdleLoops: (n: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] text-muted italic">
        Favorited + aligned clips with a delivered 550 WebM only.
      </div>
      <Field label="Idle">
        {idleOptions.length === 0 ? (
          <div className="text-xs text-bad">No eligible idle clips. Favorite an aligned + delivered idle first.</div>
        ) : (
          <select value={idleClipName} onChange={(e) => setIdleClipName(e.target.value)} className="w-full bg-bg border border-border rounded p-2 text-sm">
            {idleOptions.map((o) => (
              <option key={o.clip.name} value={o.clip.name}>
                {o.clip.name} — {o.concept.title}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={`Idle loops (${idleLoops})`}>
        <input
          type="range" min={1} max={5} step={1}
          value={idleLoops}
          onChange={(e) => setIdleLoops(parseInt(e.target.value, 10))}
          className="w-full"
        />
      </Field>
      <Field label="Power">
        {powerOptions.length === 0 ? (
          <div className="text-xs text-bad">No eligible power clips. Favorite an aligned + delivered power first.</div>
        ) : (
          <select value={powerClipName} onChange={(e) => setPowerClipName(e.target.value)} className="w-full bg-bg border border-border rounded p-2 text-sm">
            {powerOptions.map((o) => (
              <option key={o.clip.name} value={o.clip.name}>
                {o.clip.name} — {o.concept.title}
              </option>
            ))}
          </select>
        )}
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted mb-1">{label}</div>
      {children}
    </label>
  );
}

// Controlled number input that only commits on blur or Enter so typing
// intermediate values (e.g. "0." on the way to "0.5") doesn't fight state.
function NumberField({
  label,
  value,
  step,
  onCommit,
}: {
  label: string;
  value: number;
  step: number;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState(value.toFixed(3));
  // Re-sync when external value changes (e.g. drag) and input is not focused.
  useEffect(() => {
    setDraft(value.toFixed(3));
  }, [value]);

  const commit = () => {
    const n = parseFloat(draft);
    if (Number.isFinite(n)) onCommit(n);
    else setDraft(value.toFixed(3));
  };

  return (
    <Field label={label}>
      <input
        type="number"
        step={step}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className="w-full bg-bg border border-border rounded p-1.5 text-xs font-mono"
      />
    </Field>
  );
}

// ---------- Transport bar: play/pause + unified-sequence scrubber ----------

type Segment = PlaylistItem & { duration: number; span: number; startTime: number };

function TransportBar({
  playing,
  finished,
  onTogglePlay,
  segments,
  total,
  globalTime,
  onSeek,
  activeIdx,
}: {
  playing: boolean;
  finished: boolean;
  onTogglePlay: () => void;
  segments: Segment[];
  total: number;
  globalTime: number;
  onSeek: (t: number) => void;
  activeIdx: number;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);

  const known = total > 0;
  const displayTime = scrubbing ? scrubTime : globalTime;
  const pct = known ? Math.max(0, Math.min(100, (displayTime / total) * 100)) : 0;

  const beginScrub = (e: React.PointerEvent) => {
    if (!known) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setScrubbing(true);
    handleScrubMove(e.clientX);
  };
  const moveScrub = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    handleScrubMove(e.clientX);
  };
  const endScrub = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    setScrubbing(false);
    onSeek(scrubTime);
  };
  const handleScrubMove = (clientX: number) => {
    const el = trackRef.current;
    if (!el || total <= 0) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setScrubTime(ratio * total);
  };

  return (
    <div className="mt-2 flex items-center gap-3">
      <button
        onClick={onTogglePlay}
        className="text-xs px-2.5 py-1.5 rounded bg-panel2 border border-border hover:border-accent w-16 flex-shrink-0"
        title={playing ? "Pause (Space)" : finished ? "Replay" : "Play (Space)"}
      >
        {finished ? "↻ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
      </button>

      <div className="flex-1 relative" style={{ touchAction: "none" }}>
        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 bg-panel2 rounded-full overflow-hidden cursor-pointer"
          onPointerDown={beginScrub}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
        >
          {/* Segment dividers — let you see where each clip-loop boundary sits. */}
          {known && segments.map((s, i) => {
            const segPct = (s.startTime / total) * 100;
            return (
              <div
                key={i}
                className={`absolute top-0 bottom-0 ${i === activeIdx ? "bg-accent/30" : ""}`}
                style={{
                  left: `${segPct}%`,
                  width: `${(s.span / total) * 100}%`,
                  borderLeft: i > 0 ? "1px solid var(--border, #374151)" : undefined,
                }}
                title={`${s.clipName} ×${s.loops}`}
              />
            );
          })}
          {/* Loop dividers within a segment — thin marks every clip-duration. */}
          {known && segments.map((s, i) =>
            s.loops > 1 && s.duration > 0
              ? new Array(s.loops - 1).fill(0).map((_, j) => {
                  const t = s.startTime + s.duration * (j + 1);
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="absolute top-0 bottom-0 border-l border-border/60"
                      style={{ left: `${(t / total) * 100}%` }}
                    />
                  );
                })
              : null,
          )}
          {/* Progress fill */}
          <div className="absolute top-0 left-0 bottom-0 bg-accent" style={{ width: `${pct}%` }} />
        </div>
        {/* Scrubber handle */}
        {known && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-bg pointer-events-none"
            style={{ left: `calc(${pct}% - 6px)` }}
          />
        )}
        {/* Segment labels under the bar */}
        {known && (
          <div className="relative h-3 mt-1">
            {segments.map((s, i) => {
              const segPct = (s.startTime / total) * 100;
              const widthPct = (s.span / total) * 100;
              if (widthPct < 8) return null; // skip too-narrow labels
              return (
                <div
                  key={i}
                  className={`absolute text-[9px] font-mono leading-3 truncate ${i === activeIdx ? "text-accent" : "text-muted"}`}
                  style={{ left: `${segPct}%`, width: `${widthPct}%`, paddingLeft: 2 }}
                  title={`${s.clipName} ×${s.loops}`}
                >
                  {s.clipName}{s.loops > 1 ? ` ×${s.loops}` : ""}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-[11px] text-muted font-mono whitespace-nowrap flex-shrink-0">
        {known ? `${formatTime(displayTime)} / ${formatTime(total)}` : "—:—"}
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ds = Math.floor((s - Math.floor(s)) * 10);
  return `${m}:${sec.toString().padStart(2, "0")}.${ds}`;
}

// ---------- Mockup stage: mockup PNG + overlayed video + optional edit handles ----------

function MockupStage({
  slot,
  editing,
  onSlotChange,
  edgeFade,
  overflowScale,
  videoSrc,
  muted,
  onEnded,
  onLoadedMetadata,
  onPlay,
  onPause,
  loopForever,
  videoRef,
  finished,
}: {
  slot: Slot;
  editing: boolean;
  onSlotChange: (s: Slot) => void;
  edgeFade: number;
  overflowScale: number;
  videoSrc: string | undefined;
  muted: boolean;
  onEnded: () => void;
  onLoadedMetadata?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  loopForever: boolean;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  finished: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Fit mockup into available space preserving aspect ratio.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const aspect = MOCKUP_NATURAL_W / MOCKUP_NATURAL_H;
      let w = rect.width;
      let h = w / aspect;
      if (h > rect.height) {
        h = rect.height;
        w = h * aspect;
      }
      setContainerSize({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Render slot as always-square: derive h from w at display time.
  const effH = squareH(slot.w);
  const pxSlot = {
    left: slot.x * containerSize.w,
    top: slot.y * containerSize.h,
    width: slot.w * containerSize.w,
    height: effH * containerSize.h,
  };
  // For overflow clips, the video element is rendered LARGER than the slot,
  // centred on the slot's centre, so the central CONTENT_SIZE × CONTENT_SIZE
  // region of the WebM lands on the slot. The transparent padding on the WebM
  // extends past the slot edges naturally (clipped by the panel's overflow:hidden).
  const pxVideo = {
    left: pxSlot.left + (pxSlot.width  - pxSlot.width  * overflowScale) / 2,
    top:  pxSlot.top  + (pxSlot.height - pxSlot.height * overflowScale) / 2,
    width:  pxSlot.width  * overflowScale,
    height: pxSlot.height * overflowScale,
  };

  // --- Move-only drag (scale is controlled by the slider in the sidebar) ---
  const stageRef = useRef<HTMLDivElement | null>(null);
  const beginMove = (e: React.MouseEvent) => {
    if (!editing) return;
    e.preventDefault();
    e.stopPropagation();
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...slot };

    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / rect.width;
      const dy = (ev.clientY - startY) / rect.height;
      const h = squareH(start.w);
      const next: Slot = {
        x: clampAllowOverflow(start.x + dx, start.w),
        y: clampAllowOverflow(start.y + dy, h),
        w: start.w,
        h,
      };
      onSlotChange(next);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        ref={stageRef}
        className="relative"
        style={{ width: containerSize.w, height: containerSize.h }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/files/${encodeURI(MOCKUP_REL)}`}
          alt="Hero screen mockup"
          className="block w-full h-full select-none pointer-events-none"
          draggable={false}
        />

        {/* Video overlay in character slot */}
        {videoSrc && (
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted={muted}
            loop={loopForever}
            playsInline
            onEnded={onEnded}
            onLoadedMetadata={onLoadedMetadata}
            onPlay={onPlay}
            onPause={onPause}
            className="absolute object-contain pointer-events-none max-w-none max-h-none"
            style={{
              left: pxVideo.left,
              top: pxVideo.top,
              width: pxVideo.width,
              height: pxVideo.height,
              opacity: finished ? 0.5 : 1,
              ...radialMaskStyle(edgeFade),
            }}
          />
        )}

        {/* Edit overlay: move-only drag. Scale is adjusted via the sidebar slider. */}
        {editing && (
          <div
            className="absolute border-2 border-accent cursor-move"
            style={{ left: pxSlot.left, top: pxSlot.top, width: pxSlot.width, height: pxSlot.height }}
            onMouseDown={beginMove}
          />
        )}
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Radial alpha mask centred on the slot. fade ∈ [0..1] is the fraction of
// the slot's half-min-side that is the soft falloff. fade=0 → no mask;
// fade=0.2 → outer 20% of the radius fades out; fade=1 → fade from centre.
function radialMaskStyle(fade: number): React.CSSProperties {
  if (!fade || fade <= 0) return {};
  const innerPct = Math.max(0, Math.min(100, (1 - fade) * 100));
  const gradient = `radial-gradient(circle closest-side, black ${innerPct}%, transparent 100%)`;
  return {
    maskImage: gradient,
    WebkitMaskImage: gradient,
  } as React.CSSProperties;
}

// Clamp an axis coord so the slot stays on the mockup when it fits,
// and can overflow equally on both sides when it's larger than the mockup.
function clampAllowOverflow(v: number, size: number): number {
  const lo = Math.min(0, 1 - size);
  const hi = Math.max(0, 1 - size);
  return clamp(v, lo, hi);
}
