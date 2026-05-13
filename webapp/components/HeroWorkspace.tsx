"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { RatingStars } from "./RatingStars";
import { FavoriteButton } from "./FavoriteButton";
import { ClipExplorer } from "./ClipExplorer";
import { AlignmentModal } from "./AlignmentModal";
import { FFLFBuilder } from "./FFLFBuilder";
import { HeroScreenPreview } from "./HeroScreenPreview";
import { parsePromptAspect, parsePromptDuration } from "@/lib/prompt";

type PromptFileDto = { model: string; fileName: string; rawMarkdown: string };

type ConceptDto = {
  id: string;
  kind: "power" | "idle";
  title: string;
  slug: string;
  rawMarkdown: string;
  meta: { favorite: boolean; rating: number | null; notes: string | null };
  promptFiles: PromptFileDto[];
  clips: ClipDto[];
};

type ClipDto = {
  name: string;
  conceptId: string;
  iter: number;
  rawMp4Rel?: string;
  processed: {
    fgAlphaMovRel?: string;
    fgAlphaMp4Rel?: string;
    compMp4Rel?: string;
    fgAlphaMovAlignedRel?: string;
    fgAlphaMp4AlignedRel?: string;
    deliveredWebms?: { size: number; rel: string }[];
    frameCount: number | null;
    hasAnchors?: boolean;
  } | null;
  meta: {
    favorite: boolean;
    rating: number | null;
    notes: string | null;
    markedUpload: boolean;
    markedKey: boolean;
    edgeFade?: number;
    overflowSize?: number | null;
    screenColor?: "green" | "blue" | null;
  };
};

type FFLFDto = { name: string; index: number | null; relPath: string };

type HeroDto = {
  id: string;
  displayName: string;
  sourceImageRel?: string;
  hasOutputDir: boolean;
  hasConceptsMd: boolean;
  fflfs: FFLFDto[];
  concepts: ConceptDto[];
};

export function HeroWorkspace({ initialHero }: { initialHero: HeroDto }) {
  return (
    <Suspense fallback={null}>
      <HeroWorkspaceInner initialHero={initialHero} />
    </Suspense>
  );
}

function HeroWorkspaceInner({ initialHero }: { initialHero: HeroDto }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hero, setHero] = useState(initialHero);
  const [selectedId, setSelectedId] = useState<string | null>(initialHero.concepts[0]?.id ?? null);
  const [edit, setEdit] = useState<{ conceptId: string; text: string } | null>(null);
  const [centerTab, setCenterTab] = useState<"concept" | "prompts">("prompts");
  const [generating, setGenerating] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [explorerClip, setExplorerClip] = useState<string | null>(null);
  const [alignClip, setAlignClip] = useState<string | null>(null);
  const [aligningAll, setAligningAll] = useState(false);
  const [deliverWarn, setDeliverWarn] = useState<{ aligned: string[]; unaligned: string[] } | null>(null);
  const [deliverSize, setDeliverSize] = useState<number>(960);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [favOverlayOpen, setFavOverlayOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);
  const [rekeyModal, setRekeyModal] = useState<{ clipNames: string[] } | null>(null);
  const [uploadModal, setUploadModal] = useState<{ clipNames: string[] } | null>(null);
  const [preview, setPreview] = useState<{ clipName?: string; mode: "single" | "sequence" } | null>(null);

  const selected = useMemo(
    () => hero.concepts.find((c) => c.id === selectedId) ?? null,
    [hero.concepts, selectedId],
  );

  const refresh = async () => {
    const res = await fetch(`/api/heroes/${encodeURIComponent(hero.id)}`, { cache: "no-store" });
    const j = await res.json();
    if (j.hero) setHero(j.hero);
  };

  // Auto-refresh every 6s in case keying or seedance jobs land new files.
  useEffect(() => {
    const id = setInterval(() => refresh(), 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero.id]);

  // Clear selection whenever the user switches concepts.
  useEffect(() => {
    setSelection(new Set());
  }, [selectedId]);

  // Deep-link: apply ?concept=&clip= once, then strip them from the URL.
  useEffect(() => {
    const conceptParam = searchParams.get("concept");
    const clipParam = searchParams.get("clip");
    if (!conceptParam && !clipParam) return;
    if (conceptParam && hero.concepts.some((c) => c.id === conceptParam)) {
      setSelectedId(conceptParam);
    }
    if (clipParam) {
      const owner = hero.concepts.find((c) => c.clips.some((cl) => cl.name === clipParam));
      if (owner) {
        setSelectedId(owner.id);
        setExplorerClip(clipParam);
      }
    }
    router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hero.concepts]);

  const patchConcept = async (conceptId: string, patch: any) => {
    const res = await fetch(`/api/concepts/${encodeURIComponent(hero.id)}/${conceptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) refresh();
  };

  const patchClip = async (clipName: string, patch: any) => {
    const res = await fetch(`/api/clips/${encodeURIComponent(hero.id)}/${encodeURIComponent(clipName)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) refresh();
  };

  const goToJobs = () => {
    router.push(`/jobs?from=${encodeURIComponent(`/heroes/${hero.id}`)}`);
  };

  const queueKeying = async (clip: ClipDto) => {
    await fetch(`/api/jobs/key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clips: [{ heroId: hero.id, clipName: clip.name }] }),
    });
    goToJobs();
  };

  const toggleSelect = (clipName: string) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(clipName)) next.delete(clipName);
      else next.add(clipName);
      return next;
    });
  };

  const clearSelection = () => setSelection(new Set());

  const deleteClips = async (clipNames: string[]) => {
    for (const name of clipNames) {
      await fetch(
        `/api/clips/${encodeURIComponent(hero.id)}/${encodeURIComponent(name)}`,
        { method: "DELETE" },
      );
    }
    clearSelection();
    setDeleteConfirm(null);
    refresh();
  };

  const markClips = async (clipNames: string[], patch: { markedUpload?: boolean; markedKey?: boolean }) => {
    for (const name of clipNames) {
      await fetch(
        `/api/clips/${encodeURIComponent(hero.id)}/${encodeURIComponent(name)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
    }
    refresh();
  };

  const submitRekey = async (
    clipNames: string[],
    despill: number,
    alphaMode: "birefnet+chroma" | "birefnet" | "chroma",
    screenColor: "auto" | "green" | "blue",
  ) => {
    await fetch(`/api/jobs/key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clips: clipNames.map((clipName) => ({ heroId: hero.id, clipName })),
        despill,
        alphaMode,
        screenColor,
      }),
    });
    clearSelection();
    setRekeyModal(null);
    goToJobs();
  };

  const detectAllAnchors = async (force: boolean) => {
    setAligningAll(true);
    try {
      const res = await fetch("/api/jobs/detect-anchors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroId: hero.id, force }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Batch detect failed: ${err}`);
        return;
      }
      await refresh();
    } finally {
      setAligningAll(false);
    }
  };

  const recomposeAllAligned = async () => {
    const clipsWithAnchors: string[] = [];
    for (const c of hero.concepts) {
      for (const cl of c.clips) {
        if (cl.processed?.hasAnchors) clipsWithAnchors.push(cl.name);
      }
    }
    if (clipsWithAnchors.length === 0) {
      alert("No clips with anchors yet. Click \"Align all\" first.");
      return;
    }
    if (!confirm(`Recompose ${clipsWithAnchors.length} aligned clip(s)? Originals are preserved; only *_fg_alpha_aligned.mov/.mp4 will be (re)written.`)) {
      return;
    }
    const res = await fetch("/api/jobs/recompose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clips: clipsWithAnchors.map((clipName) => ({ heroId: hero.id, clipName })),
        alignToTemplate: true,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      alert(`Recompose failed: ${err}`);
      return;
    }
    goToJobs();
  };

  const submitDeliver = async (clipNames: string[], allowUnaligned: boolean) => {
    const res = await fetch("/api/jobs/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clips: clipNames.map((clipName) => ({ heroId: hero.id, clipName })),
        size: deliverSize,
        allowUnaligned,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      alert(`Delivery failed: ${err}`);
      return;
    }
    clearSelection();
    setDeliverWarn(null);
    goToJobs();
  };

  const requestDeliver = (clipNames: string[]) => {
    const clipByName = new Map<string, ClipDto>();
    for (const c of hero.concepts) for (const cl of c.clips) clipByName.set(cl.name, cl);
    const aligned: string[] = [];
    const unaligned: string[] = [];
    for (const n of clipNames) {
      const cl = clipByName.get(n);
      if (!cl?.processed) continue;
      if (cl.processed.fgAlphaMovAlignedRel) aligned.push(n);
      else unaligned.push(n);
    }
    if (unaligned.length > 0) {
      setDeliverWarn({ aligned, unaligned });
    } else {
      submitDeliver(aligned, false);
    }
  };

  const submitGDriveUpload = async (
    clipNames: string[],
    fileKind: "deliveredWebm" | "fgAlphaMov" | "fgAlphaMp4" | "compMp4" | "rawMp4",
    destination: "Auto" | "Final" | "Final_960" | "Previs",
  ) => {
    const res = await fetch(`/api/jobs/gdrive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroId: hero.id, clipNames, fileKind, destination }),
    });
    if (!res.ok) {
      const err = await res.text();
      alert(`Upload failed: ${err}`);
      return;
    }
    clearSelection();
    setUploadModal(null);
    goToJobs();
  };

  const favoriteClips = useMemo(() => {
    const out: { concept: ConceptDto; clip: ClipDto }[] = [];
    for (const c of hero.concepts) {
      for (const cl of c.clips) {
        if (cl.meta.favorite) out.push({ concept: c, clip: cl });
      }
    }
    out.sort((a, b) => b.clip.iter - a.clip.iter);
    return out;
  }, [hero.concepts]);

  const power = hero.concepts.filter((c) => c.kind === "power");
  const idle = hero.concepts.filter((c) => c.kind === "idle");

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
      {/* LEFT: concept list */}
      <aside className="col-span-3 bg-panel border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-3 py-2 border-b border-border flex items-center gap-3">
          {hero.sourceImageRel && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/files/${encodeURI(hero.sourceImageRel)}`} alt="" className="w-9 h-9 rounded object-cover" />
          )}
          <div>
            <div className="font-semibold">{hero.displayName}</div>
            <div className="text-xs text-muted">{hero.concepts.length} concepts</div>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          <ConceptList title="Power" concepts={power} selectedId={selectedId} onSelect={setSelectedId} onPatch={patchConcept} />
          <ConceptList title="Idle" concepts={idle} selectedId={selectedId} onSelect={setSelectedId} onPatch={patchConcept} />
          {hero.concepts.length === 0 && (
            <div className="p-4 text-sm text-muted">
              No concepts.md found at <code>Output/{hero.id}/concepts.md</code>.
            </div>
          )}
        </div>
      </aside>

      {/* CENTER: concept detail / editor */}
      <section className="col-span-5 bg-panel border border-border rounded-lg overflow-hidden flex flex-col">
        {selected ? (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.id}: {selected.title}</div>
                <div className="text-xs text-muted">{selected.kind} · {selected.clips.length} clips · {selected.promptFiles.length} prompts</div>
              </div>
              <div className="flex items-center gap-3">
                <FavoriteButton
                  favorite={selected.meta.favorite}
                  onChange={(v) => patchConcept(selected.id, { favorite: v })}
                />
                <RatingStars
                  rating={selected.meta.rating}
                  onChange={(r) => patchConcept(selected.id, { rating: r })}
                />
                <button
                  onClick={() => setGeneratorOpen(true)}
                  className="bg-accent text-bg font-medium px-3 py-1.5 rounded hover:opacity-90"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-2 border-b border-border flex gap-1">
              <TabButton active={centerTab === "prompts"} onClick={() => setCenterTab("prompts")}>
                Prompts <span className="text-xs text-muted">{selected.promptFiles.length}</span>
              </TabButton>
              <TabButton active={centerTab === "concept"} onClick={() => setCenterTab("concept")}>
                Concept
              </TabButton>
            </div>

            <div className="flex-1 overflow-auto">
              {centerTab === "concept" && (
                <div className="p-4">
                  {edit?.conceptId === selected.id ? (
                    <div className="flex flex-col gap-3 h-full">
                      <textarea
                        value={edit.text}
                        onChange={(e) => setEdit({ conceptId: selected.id, text: e.target.value })}
                        className="flex-1 min-h-[400px] bg-bg border border-border rounded p-3 text-sm font-mono"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await patchConcept(selected.id, { rawMarkdown: edit.text });
                            setEdit(null);
                          }}
                          className="bg-good text-bg px-3 py-1.5 rounded font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEdit(null)}
                          className="bg-panel2 px-3 py-1.5 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setEdit({ conceptId: selected.id, text: selected.rawMarkdown })}
                        className="text-xs text-accent hover:underline mb-3"
                      >
                        Edit raw markdown
                      </button>
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{selected.rawMarkdown}</pre>
                    </div>
                  )}
                </div>
              )}

              {centerTab === "prompts" && (
                <PromptsPanel
                  heroId={hero.id}
                  concept={selected}
                  onSaved={refresh}
                />
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-muted">Select a concept on the left.</div>
        )}
      </section>

      {/* RIGHT: clips for selected concept */}
      <aside className="col-span-4 bg-panel border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
          <div>
            <div className="font-semibold">Animations</div>
            <div className="text-xs text-muted">
              {selected ? `${selected.clips.length} for ${selected.id} · newest first` : "No concept selected"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => detectAllAnchors(false)}
              disabled={aligningAll}
              className="text-xs px-2 py-1 rounded bg-panel2 border border-border hover:border-accent disabled:opacity-50"
              title="Auto-detect eye + foot anchors for every keyed clip on this hero (skips clips that already have anchors.json)"
            >
              {aligningAll ? "Detecting…" : "Align all"}
            </button>
            <button
              onClick={recomposeAllAligned}
              className="text-xs px-2 py-1 rounded bg-panel2 border border-border hover:border-accent"
              title="Queue a recompose job for every clip that has anchors.json. Produces *_fg_alpha_aligned.mov/.mp4; originals are preserved."
            >
              Recompose all aligned
            </button>
            <button
              onClick={() => setPreview({ mode: "sequence" })}
              className="text-xs px-2 py-1 rounded bg-panel2 border border-border hover:border-accent"
              title="Preview idle×N → power over the hero-screen mockup (uses favorited + aligned + delivered clips)"
            >
              ▶ Preview
            </button>
            <button
              onClick={() => setFavOverlayOpen(true)}
              className="text-xs px-2 py-1 rounded bg-panel2 border border-border hover:border-accent"
              title="Show all favourited clips across concepts"
            >
              ★ Favourites ({favoriteClips.length})
            </button>
          </div>
        </div>
        {selection.size > 0 && (
          <SelectionBar
            count={selection.size}
            onClear={clearSelection}
            onDelete={() => setDeleteConfirm(Array.from(selection))}
            onRekey={() => setRekeyModal({ clipNames: Array.from(selection) })}
            onUpload={() => setUploadModal({ clipNames: Array.from(selection) })}
            onDeliver={() => requestDeliver(Array.from(selection))}
            deliverSize={deliverSize}
            onDeliverSizeChange={setDeliverSize}
            onMarkUpload={() => markClips(Array.from(selection), { markedUpload: true })}
            onMarkKey={() => markClips(Array.from(selection), { markedKey: true })}
          />
        )}
        <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-3">
          {selected?.clips.map((clip) => (
            <ClipCard
              key={clip.name}
              clip={clip}
              onPatch={patchClip}
              onQueueKey={queueKeying}
              onRekey={() => setRekeyModal({ clipNames: [clip.name] })}
              onOpenFiles={() => setExplorerClip(clip.name)}
              onAlign={() => setAlignClip(clip.name)}
              onPreview={() => setPreview({ mode: "single", clipName: clip.name })}
              selected={selection.has(clip.name)}
              onToggleSelect={() => toggleSelect(clip.name)}
            />
          ))}
          {selected && selected.clips.length === 0 && (
            <div className="text-sm text-muted px-2">No clips yet for {selected.id}.</div>
          )}
        </div>
      </aside>

      {generatorOpen && selected && (
        <GeneratorModal
          hero={hero}
          concept={selected}
          onClose={() => setGeneratorOpen(false)}
          onSubmitting={setGenerating}
          generating={generating}
          onHeroRefresh={refresh}
          goToJobs={goToJobs}
        />
      )}

      {explorerClip && (
        <ClipExplorer
          heroId={hero.id}
          clipName={explorerClip}
          onClose={() => setExplorerClip(null)}
        />
      )}

      {alignClip && (
        <AlignmentModal
          heroId={hero.id}
          clipName={alignClip}
          firstFrameSrc={`/api/clips/${encodeURIComponent(hero.id)}/${encodeURIComponent(alignClip)}/first-frame`}
          onClose={() => setAlignClip(null)}
        />
      )}

      {deliverWarn && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-panel border border-border rounded-lg p-5 max-w-lg w-full">
            <div className="text-lg font-semibold mb-2">Some clips aren&apos;t aligned</div>
            <div className="text-sm text-muted mb-3">
              {deliverWarn.unaligned.length} of {deliverWarn.aligned.length + deliverWarn.unaligned.length} selected clip(s)
              have no aligned output yet. Delivering them will either skip them or use the unaligned MOV.
            </div>
            <div className="text-xs font-mono bg-panel2 rounded p-2 mb-4 max-h-48 overflow-auto">
              <div className="text-muted mb-1">Not aligned:</div>
              {deliverWarn.unaligned.map((n) => <div key={n}>• {n}</div>)}
              {deliverWarn.aligned.length > 0 && (
                <>
                  <div className="text-muted mt-2 mb-1">Aligned:</div>
                  {deliverWarn.aligned.map((n) => <div key={n}>• {n}</div>)}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 justify-end flex-wrap">
              <button
                onClick={() => setDeliverWarn(null)}
                className="px-3 py-1.5 rounded bg-panel2 text-text border border-border hover:border-accent text-sm"
              >
                Cancel
              </button>
              {deliverWarn.aligned.length > 0 && (
                <button
                  onClick={() => submitDeliver(deliverWarn.aligned, false)}
                  className="px-3 py-1.5 rounded bg-panel2 text-text border border-border hover:border-accent text-sm"
                  title="Skip the unaligned clips and deliver only the aligned ones"
                >
                  Deliver aligned only ({deliverWarn.aligned.length})
                </button>
              )}
              <button
                onClick={() => submitDeliver([...deliverWarn.aligned, ...deliverWarn.unaligned], true)}
                className="px-3 py-1.5 rounded bg-accent text-bg font-medium hover:opacity-90 text-sm"
                title="Deliver everything — unaligned clips fall back to their unaligned MOV"
              >
                Deliver all anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {favOverlayOpen && (
        <FavouritesOverlay
          heroId={hero.id}
          items={favoriteClips}
          selection={selection}
          onToggleSelect={toggleSelect}
          onSelectAll={(names) => setSelection(new Set(names))}
          onClearSelection={clearSelection}
          onDelete={(names) => setDeleteConfirm(names)}
          onRekey={(names) => setRekeyModal({ clipNames: names })}
          onUpload={(names) => setUploadModal({ clipNames: names })}
          onDeliver={(names) => requestDeliver(names)}
          deliverSize={deliverSize}
          onDeliverSizeChange={setDeliverSize}
          onMarkUpload={(names) => markClips(names, { markedUpload: true })}
          onMarkKey={(names) => markClips(names, { markedKey: true })}
          onClose={() => setFavOverlayOpen(false)}
          onPatch={patchClip}
          onOpenFiles={(name) => { setExplorerClip(name); setFavOverlayOpen(false); }}
          onGoToClip={(conceptId, name) => {
            setSelectedId(conceptId);
            setFavOverlayOpen(false);
            setExplorerClip(name);
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDeleteModal
          clipNames={deleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteClips(deleteConfirm)}
        />
      )}

      {rekeyModal && (
        <RekeyModal
          clipNames={rekeyModal.clipNames}
          onCancel={() => setRekeyModal(null)}
          onSubmit={(despill, alphaMode, screenColor) => submitRekey(rekeyModal.clipNames, despill, alphaMode, screenColor)}
        />
      )}

      {uploadModal && (
        <UploadModal
          clipNames={uploadModal.clipNames}
          clipsByName={clipsByName(hero)}
          onCancel={() => setUploadModal(null)}
          onSubmit={(fileKind, destination) => submitGDriveUpload(uploadModal.clipNames, fileKind, destination)}
        />
      )}

      {preview && (
        <HeroScreenPreview
          hero={hero}
          initialClipName={preview.clipName}
          initialMode={preview.mode}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

function clipsByName(hero: HeroDto): Map<string, ClipDto> {
  const m = new Map<string, ClipDto>();
  for (const c of hero.concepts) for (const cl of c.clips) m.set(cl.name, cl);
  return m;
}

function ConceptList({
  title,
  concepts,
  selectedId,
  onSelect,
  onPatch,
}: {
  title: string;
  concepts: ConceptDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPatch: (id: string, patch: any) => void;
}) {
  if (concepts.length === 0) return null;
  return (
    <div>
      <div className="px-3 py-1.5 text-xs uppercase tracking-wide text-muted bg-panel2/40">{title}</div>
      {concepts.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-3 py-2 border-b border-border/60 flex items-center gap-2 hover:bg-panel2 ${active ? "bg-panel2" : ""}`}
          >
            <div className="font-mono text-xs text-muted w-7">{c.id}</div>
            <div className="flex-1 truncate text-sm">{c.title}</div>
            <div className="text-xs text-muted">{c.clips.length}</div>
            <span
              onClick={(e) => { e.stopPropagation(); onPatch(c.id, { favorite: !c.meta.favorite }); }}
              className={c.meta.favorite ? "text-accent" : "text-border hover:text-muted"}
            >
              {c.meta.favorite ? "★" : "☆"}
            </span>
            {c.meta.rating ? <span className="text-xs text-accent">{c.meta.rating}★</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function ClipCard({
  clip,
  onPatch,
  onQueueKey,
  onRekey,
  onOpenFiles,
  onAlign,
  onPreview,
  selected,
  onToggleSelect,
}: {
  clip: ClipDto;
  onPatch: (clipName: string, patch: any) => void;
  onQueueKey: (clip: ClipDto) => void;
  onRekey: (clip: ClipDto) => void;
  onOpenFiles: () => void;
  onAlign: () => void;
  onPreview: () => void;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  // Prefer the aligned variant; fall back to un-aligned; then to raw greenscreen.
  const playableRel = clip.processed?.fgAlphaMp4AlignedRel ?? clip.processed?.fgAlphaMp4Rel ?? clip.rawMp4Rel;
  const isProcessed = !!clip.processed?.fgAlphaMp4Rel;
  const isAligned = !!clip.processed?.fgAlphaMp4AlignedRel;
  const hasDelivered = (clip.processed?.deliveredWebms?.length ?? 0) > 0;
  const [showAlignment, setShowAlignment] = useState(false);

  return (
    <div className={`bg-panel2 border rounded overflow-hidden flex-shrink-0 ${selected ? "border-accent" : "border-border"}`}>
      <div className="relative bg-bg">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="absolute top-2 left-2 z-10 w-4 h-4 accent-accent"
          title="Select for batch actions"
        />
        {playableRel ? (
          <div className="relative">
            <video
              src={`/api/files/${encodeURI(playableRel)}`}
              controls
              preload="metadata"
              className="block w-full h-auto"
            />
            {showAlignment && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/api/files/character-alignment_960x960_overlay.png"
                alt=""
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ mixBlendMode: "screen" }}
              />
            )}
          </div>
        ) : (
          <div className="text-muted text-sm p-4">No video</div>
        )}
      </div>
      <div className="p-2.5 flex items-center justify-between gap-2">
        <div>
          <div className="font-mono text-sm flex items-center gap-1.5">
            {clip.name}
            {clip.meta.markedUpload && <span title="marked for upload" className="text-[10px] text-accent">↑</span>}
            {clip.meta.markedKey && <span title="marked for keying" className="text-[10px] text-accent">✂</span>}
            {clip.meta.screenColor && (
              <span
                title={`Chroma screen: ${clip.meta.screenColor}. Click Re-key to change.`}
                className={`text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                  clip.meta.screenColor === "blue"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-green-500/20 text-green-300 border border-green-500/40"
                }`}
              >
                {clip.meta.screenColor}
              </span>
            )}
          </div>
          <div className="text-[10px] text-muted">
            {isProcessed ? `keyed · ${clip.processed?.frameCount ?? "?"}f` : "raw greenscreen"}
            {isAligned && <span className="ml-1.5 text-accent">· aligned</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton
            favorite={clip.meta.favorite}
            onChange={(v) => onPatch(clip.name, { favorite: v })}
          />
          <RatingStars
            rating={clip.meta.rating}
            onChange={(r) => onPatch(clip.name, { rating: r })}
            size="sm"
          />
          {isAligned && (
            <button
              onClick={() => setShowAlignment((v) => !v)}
              className={`text-xs px-2 py-1 rounded border ${showAlignment ? "bg-accent text-bg border-accent" : "bg-panel2 text-text border-border hover:border-accent"}`}
              title="Overlay the alignment template on the video to visually check eye+foot positioning"
            >
              Show alignment
            </button>
          )}
          {hasDelivered && (
            <button
              onClick={onPreview}
              className="text-xs px-2 py-1 rounded bg-panel2 text-text border border-border hover:border-accent"
              title="Preview this clip over the hero-screen mockup"
            >
              Preview
            </button>
          )}
          <button
            onClick={onOpenFiles}
            disabled={!isProcessed}
            className={`text-xs px-2 py-1 rounded ${isProcessed ? "bg-panel2 text-text border border-border hover:border-accent" : "bg-panel text-muted cursor-not-allowed"}`}
            title={isProcessed ? "Browse FG / Matte / Comp / Processed frames" : "Key the clip first"}
          >
            Files
          </button>
          {isProcessed && (
            <button
              onClick={onAlign}
              className="text-xs px-2 py-1 rounded bg-panel2 text-text border border-border hover:border-accent"
              title="Align clip to template (eye + ground anchors)"
            >
              Align
            </button>
          )}
          {isProcessed ? (
            <button
              onClick={() => onRekey(clip)}
              className="text-xs px-2 py-1 rounded bg-panel2 text-text border border-border hover:border-accent"
              title="Re-key with different settings (overwrites current processed output)"
            >
              Re-key
            </button>
          ) : (
            <button
              onClick={() => onQueueKey(clip)}
              className="text-xs px-2 py-1 rounded bg-accent text-bg hover:opacity-90"
              title="Queue key + compose"
            >
              Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const DELIVER_SIZE_OPTIONS: number[] = [550, 720, 960];

function SelectionBar({
  count,
  onClear,
  onDelete,
  onRekey,
  onUpload,
  onDeliver,
  deliverSize,
  onDeliverSizeChange,
  onMarkUpload,
  onMarkKey,
}: {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onRekey: () => void;
  onUpload: () => void;
  onDeliver: () => void;
  deliverSize: number;
  onDeliverSizeChange: (size: number) => void;
  onMarkUpload: () => void;
  onMarkKey: () => void;
}) {
  return (
    <div className="bg-panel2 border-b border-border px-3 py-2 flex items-center gap-2 flex-wrap text-xs">
      <span className="font-semibold">{count} selected</span>
      <button onClick={onRekey} className="px-2 py-1 rounded bg-panel text-text border border-border hover:border-accent">Key with settings…</button>
      <div className="flex items-stretch rounded overflow-hidden border border-accent">
        <button
          onClick={onDeliver}
          className="px-2 py-1 bg-accent text-bg font-medium hover:opacity-90"
          title={`Encode aligned MOV → ${deliverSize}×${deliverSize} WebM`}
        >
          Deliver (WebM {deliverSize})
        </button>
        <select
          value={deliverSize}
          onChange={(e) => onDeliverSizeChange(Number(e.target.value))}
          className="bg-accent text-bg font-medium border-l border-bg/30 px-1 hover:opacity-90 focus:outline-none"
          title="Output size"
          aria-label="Deliver size"
        >
          {DELIVER_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <button onClick={onUpload} className="px-2 py-1 rounded bg-panel text-text border border-border hover:border-accent">Upload to GDrive</button>
      <button onClick={onMarkUpload} className="px-2 py-1 rounded bg-panel text-muted border border-border hover:text-text">Mark for upload</button>
      <button onClick={onMarkKey} className="px-2 py-1 rounded bg-panel text-muted border border-border hover:text-text">Mark for keying</button>
      <button onClick={onDelete} className="px-2 py-1 rounded bg-panel text-bad border border-border hover:border-bad">Delete</button>
      <button onClick={onClear} className="ml-auto px-2 py-1 text-muted hover:text-text">Clear</button>
    </div>
  );
}

function FavouritesOverlay({
  heroId,
  items,
  selection,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDelete,
  onRekey,
  onUpload,
  onDeliver,
  deliverSize,
  onDeliverSizeChange,
  onMarkUpload,
  onMarkKey,
  onClose,
  onPatch,
  onOpenFiles,
  onGoToClip,
}: {
  heroId: string;
  items: { concept: ConceptDto; clip: ClipDto }[];
  selection: Set<string>;
  onToggleSelect: (clipName: string) => void;
  onSelectAll: (names: string[]) => void;
  onClearSelection: () => void;
  onDelete: (names: string[]) => void;
  onRekey: (names: string[]) => void;
  onUpload: (names: string[]) => void;
  onDeliver: (names: string[]) => void;
  deliverSize: number;
  onDeliverSizeChange: (size: number) => void;
  onMarkUpload: (names: string[]) => void;
  onMarkKey: (names: string[]) => void;
  onClose: () => void;
  onPatch: (clipName: string, patch: any) => void;
  onOpenFiles: (clipName: string) => void;
  onGoToClip: (conceptId: string, clipName: string) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, { concept: ConceptDto; clips: ClipDto[] }>();
    for (const it of items) {
      const g = map.get(it.concept.id) ?? { concept: it.concept, clips: [] };
      g.clips.push(it.clip);
      map.set(it.concept.id, g);
    }
    return Array.from(map.values());
  }, [items]);

  const allNames = useMemo(() => items.map((i) => i.clip.name), [items]);
  const selectedInOverlay = useMemo(
    () => allNames.filter((n) => selection.has(n)),
    [allNames, selection],
  );
  const allSelected = allNames.length > 0 && selectedInOverlay.length === allNames.length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg w-[860px] max-w-[95vw] max-h-[85vh] flex flex-col">
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <div className="font-semibold">Favourite clips · {heroId} <span className="text-xs text-muted ml-2">({items.length})</span></div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => (allSelected ? onClearSelection() : onSelectAll(allNames))}
              disabled={allNames.length === 0}
              className="text-xs text-accent hover:underline disabled:text-muted disabled:no-underline"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <button onClick={onClose} className="text-muted hover:text-text">×</button>
          </div>
        </div>
        {selectedInOverlay.length > 0 && (
          <SelectionBar
            count={selectedInOverlay.length}
            onClear={onClearSelection}
            onDelete={() => onDelete(selectedInOverlay)}
            onRekey={() => onRekey(selectedInOverlay)}
            onUpload={() => onUpload(selectedInOverlay)}
            onDeliver={() => onDeliver(selectedInOverlay)}
            deliverSize={deliverSize}
            onDeliverSizeChange={onDeliverSizeChange}
            onMarkUpload={() => onMarkUpload(selectedInOverlay)}
            onMarkKey={() => onMarkKey(selectedInOverlay)}
          />
        )}
        <div className="overflow-y-auto flex-1 p-4 space-y-5">
          {groups.length === 0 && <div className="text-sm text-muted">No favourited clips yet.</div>}
          {groups.map((g) => (
            <div key={g.concept.id}>
              <div className="text-xs uppercase tracking-wide text-muted mb-2">
                {g.concept.id} · {g.concept.title}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {g.clips.map((cl) => {
                  const playableRel = cl.processed?.fgAlphaMp4Rel ?? cl.rawMp4Rel;
                  const isSelected = selection.has(cl.name);
                  return (
                    <div key={cl.name} className={`bg-panel2 border rounded overflow-hidden ${isSelected ? "border-accent" : "border-border"}`}>
                      <div className="relative bg-bg">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(cl.name)}
                          className="absolute top-2 left-2 z-10 w-4 h-4 accent-accent"
                          title="Select for batch actions"
                        />
                        {playableRel ? (
                          <video src={`/api/files/${encodeURI(playableRel)}`} controls preload="metadata" className="block w-full h-auto" />
                        ) : (
                          <div className="text-muted text-sm p-4">No video</div>
                        )}
                      </div>
                      <div className="p-2 flex items-center justify-between gap-2">
                        <div className="font-mono text-xs flex items-center gap-1.5">
                          {cl.name}
                          {cl.meta.markedUpload && <span title="marked for upload" className="text-[10px] text-accent">↑</span>}
                          {cl.meta.markedKey && <span title="marked for keying" className="text-[10px] text-accent">✂</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <FavoriteButton favorite={cl.meta.favorite} onChange={(v) => onPatch(cl.name, { favorite: v })} />
                          <button onClick={() => onGoToClip(g.concept.id, cl.name)} className="text-xs text-accent hover:underline">open</button>
                          {cl.processed?.fgAlphaMp4Rel && (
                            <button onClick={() => onOpenFiles(cl.name)} className="text-xs text-muted hover:text-text">files</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  clipNames,
  onCancel,
  onConfirm,
}: {
  clipNames: string[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg p-5 w-[480px]">
        <div className="text-lg font-semibold mb-1">Delete {clipNames.length} clip{clipNames.length === 1 ? "" : "s"}?</div>
        <div className="text-xs text-muted mb-3">
          This removes the raw .mp4, all keyed output (FG/Matte/Comp + composed videos), and the favourite/rating record. This cannot be undone.
        </div>
        <ul className="text-xs font-mono bg-bg border border-border rounded p-2 max-h-40 overflow-y-auto mb-4">
          {clipNames.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="bg-panel2 px-3 py-1.5 rounded">Cancel</button>
          <button onClick={onConfirm} className="bg-bad text-bg px-3 py-1.5 rounded font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}

function RekeyModal({
  clipNames,
  onCancel,
  onSubmit,
}: {
  clipNames: string[];
  onCancel: () => void;
  onSubmit: (
    despill: number,
    alphaMode: "birefnet+chroma" | "birefnet" | "chroma",
    screenColor: "auto" | "green" | "blue",
  ) => void;
}) {
  const [despill, setDespill] = useState(0.3);
  const [alphaMode, setAlphaMode] = useState<"birefnet+chroma" | "birefnet" | "chroma">("birefnet+chroma");
  const [screenColor, setScreenColor] = useState<"auto" | "green" | "blue">("auto");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg p-5 w-[480px]">
        <div className="text-lg font-semibold mb-1">Key with settings</div>
        <div className="text-xs text-muted mb-4">
          {clipNames.length === 1 ? clipNames[0] : `${clipNames.length} clips`} — already-keyed clips are overwritten.
        </div>
        <div className="space-y-3">
          <Field label={`Despill (${despill.toFixed(2)})`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={despill}
              onChange={(e) => setDespill(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-[10px] text-muted">0 = no despill, 0.3 = default, higher = more aggressive spill suppression</div>
          </Field>
          <Field label="Alpha mode">
            <select
              value={alphaMode}
              onChange={(e) => setAlphaMode(e.target.value as any)}
              className="w-full bg-bg border border-border rounded p-2 text-sm"
            >
              <option value="birefnet+chroma">birefnet + chroma (default)</option>
              <option value="birefnet">birefnet only</option>
              <option value="chroma">chroma only</option>
            </select>
          </Field>
          <Field label="Screen color">
            <select
              value={screenColor}
              onChange={(e) => setScreenColor(e.target.value as any)}
              className="w-full bg-bg border border-border rounded p-2 text-sm"
            >
              <option value="auto">auto-detect (sample first frame corners)</option>
              <option value="green">green</option>
              <option value="blue">blue (use for green-VFX heroes e.g. Dragonwitch)</option>
            </select>
            <div className="text-[10px] text-muted">Forces the chroma channel passed to batch_pipeline.py. Auto-detect persists the resolved value to clip metadata.</div>
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="bg-panel2 px-3 py-1.5 rounded">Cancel</button>
          <button onClick={() => onSubmit(despill, alphaMode, screenColor)} className="bg-accent text-bg px-3 py-1.5 rounded font-medium">Queue keying</button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({
  clipNames,
  clipsByName,
  onCancel,
  onSubmit,
}: {
  clipNames: string[];
  clipsByName: Map<string, ClipDto>;
  onCancel: () => void;
  onSubmit: (
    fileKind: "deliveredWebm" | "fgAlphaMov" | "fgAlphaMp4" | "compMp4" | "rawMp4",
    destination: "Auto" | "Final" | "Final_960" | "Previs",
  ) => void;
}) {
  const [fileKind, setFileKind] = useState<"deliveredWebm" | "fgAlphaMov" | "fgAlphaMp4" | "compMp4" | "rawMp4">("deliveredWebm");
  // Destination is auto-suggested from fileKind:
  //   deliveredWebm → "Auto" (routes 960 → Final_960, 550 → Final by filename suffix)
  //   everything else → "Previs"
  // The user can still override per upload via the toggle.
  type Dest = "Auto" | "Final" | "Final_960" | "Previs";
  const [destination, setDestination] = useState<Dest>("Auto");
  const [destinationTouched, setDestinationTouched] = useState(false);
  const suggestedDestination: Dest = fileKind === "deliveredWebm" ? "Auto" : "Previs";
  useEffect(() => {
    if (!destinationTouched) setDestination(suggestedDestination);
  }, [suggestedDestination, destinationTouched]);

  const missingKeyed = (() => {
    if (fileKind === "rawMp4") return [];
    return clipNames.filter((n) => {
      const cl = clipsByName.get(n);
      if (fileKind === "deliveredWebm") return (cl?.processed?.deliveredWebms?.length ?? 0) === 0;
      if (fileKind === "fgAlphaMov")    return !cl?.processed?.fgAlphaMovRel;
      if (fileKind === "fgAlphaMp4")    return !cl?.processed?.fgAlphaMp4AlignedRel && !cl?.processed?.fgAlphaMp4Rel;
      if (fileKind === "compMp4")       return !cl?.processed?.compMp4Rel;
      return false;
    });
  })();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg p-5 w-[480px]">
        <div className="text-lg font-semibold mb-1">Upload to Google Drive</div>
        <div className="text-xs text-muted mb-4">
          {clipNames.length} clip{clipNames.length === 1 ? "" : "s"}. Files land in{" "}
          <code>
            &lt;Hero&gt;/
            {destination === "Auto" ? "Final or Final_960 (by size)" : destination}
            /
          </code>{" "}
          under the configured Drive root.
        </div>
        <div className="space-y-3">
          <Field label="File">
            <select
              value={fileKind}
              onChange={(e) => setFileKind(e.target.value as any)}
              className="w-full bg-bg border border-border rounded p-2 text-sm"
            >
              <option value="deliveredWebm">Final delivered .webm (default)</option>
              <option value="fgAlphaMp4">FG + alpha .mp4 (light preview)</option>
              <option value="fgAlphaMov">FG + alpha .mov</option>
              <option value="compMp4">Comp preview .mp4</option>
              <option value="rawMp4">Raw greenscreen .mp4</option>
            </select>
          </Field>
          <Field label="Destination">
            <div className="flex gap-2 flex-wrap">
              {(["Auto", "Final", "Final_960", "Previs"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDestination(d); setDestinationTouched(true); }}
                  className={`flex-1 min-w-[80px] px-3 py-1.5 rounded text-sm border ${destination === d ? "bg-accent text-bg border-accent" : "bg-bg text-muted border-border hover:text-fg"}`}
                >
                  {d === "Auto" ? "Auto" : `${d}/`}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted mt-1">
              {destination === "Auto"
                ? "Auto-routes delivered .webm by size: 960 → Final_960/, otherwise → Final/."
                : destination === "Final"
                ? "Client deliverables (legacy 550) — keep tidy, replace in place."
                : destination === "Final_960"
                ? "Full-resolution 960×960 deliverables — separate from Final/ so the 550s aren't overwritten."
                : "Team-share previews — generations and previews you want collaborators to see."}
            </div>
          </Field>
          {missingKeyed.length > 0 && (
            <div className="text-xs text-bad">
              {missingKeyed.length} selected clip{missingKeyed.length === 1 ? " is" : "s are"} {fileKind === "deliveredWebm" ? "not delivered" : "not keyed"} yet:
              <span className="font-mono ml-1">{missingKeyed.slice(0, 3).join(", ")}{missingKeyed.length > 3 ? "…" : ""}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="bg-panel2 px-3 py-1.5 rounded">Cancel</button>
          <button
            onClick={() => onSubmit(fileKind, destination)}
            disabled={missingKeyed.length > 0}
            className={`px-3 py-1.5 rounded font-medium ${missingKeyed.length > 0 ? "bg-panel2 text-muted" : "bg-accent text-bg"}`}
          >
            Queue upload
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneratorModal({
  hero,
  concept,
  onClose,
  onSubmitting,
  generating,
  onHeroRefresh,
  goToJobs,
}: {
  hero: HeroDto;
  concept: ConceptDto;
  onClose: () => void;
  onSubmitting: (b: boolean) => void;
  generating: boolean;
  onHeroRefresh: () => Promise<void> | void;
  goToJobs: () => void;
}) {
  const [model, setModel] = useState(concept.promptFiles[0]?.model ?? "Seedance");
  const promptsForModel = concept.promptFiles.filter((p) => p.model === model);
  const [promptFile, setPromptFile] = useState(promptsForModel[0]?.fileName ?? "");
  const [duration, setDuration] = useState(5);
  const [aspect, setAspect] = useState("1:1");
  const [tier, setTier] = useState<"pro" | "fast">("pro");
  const [fflfBuilderOpen, setFflfBuilderOpen] = useState(false);

  // Image options: every FFLF + the source PNG. Default: first FFLF if any, else source.
  const imageOptions = useMemo(() => {
    const opts: { label: string; relPath: string }[] = [];
    for (const f of hero.fflfs) opts.push({ label: f.name, relPath: f.relPath });
    if (hero.sourceImageRel) opts.push({ label: `Source · ${hero.sourceImageRel.split("/").pop()}`, relPath: hero.sourceImageRel });
    return opts;
  }, [hero.fflfs, hero.sourceImageRel]);

  const defaultImage = hero.fflfs[0]?.relPath ?? hero.sourceImageRel ?? "";
  const [startImage, setStartImage] = useState<string>(defaultImage);
  const [endImage, setEndImage] = useState<string>(defaultImage);

  // If hero gets a new FFLF, default to it.
  useEffect(() => {
    if (!startImage && hero.fflfs[0]?.relPath) {
      setStartImage(hero.fflfs[0].relPath);
      setEndImage(hero.fflfs[0].relPath);
    }
  }, [hero.fflfs, startImage]);

  // Pre-fill duration/aspect from the selected prompt file's metadata header.
  useEffect(() => {
    if (!promptFile) return;
    const pf = concept.promptFiles.find((p) => p.fileName === promptFile);
    if (!pf) return;
    const d = parsePromptDuration(pf.rawMarkdown);
    if (d != null) setDuration(d);
    const a = parsePromptAspect(pf.rawMarkdown);
    if (a) setAspect(a);
  }, [promptFile, concept.promptFiles]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-panel border border-border rounded-lg p-5 w-[640px] max-h-[90vh] overflow-auto">
        <div className="text-lg font-semibold mb-1">Generate animation</div>
        <div className="text-xs text-muted mb-4">{hero.displayName} · {concept.id} {concept.title}</div>

        <div className="space-y-3">
          <Field label="Model">
            <select value={model} onChange={(e) => { setModel(e.target.value); setPromptFile(""); }} className="w-full bg-bg border border-border rounded p-2 text-sm">
              {Array.from(new Set(concept.promptFiles.map((p) => p.model))).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              {concept.promptFiles.length === 0 && <option value="Seedance">Seedance (no prompt files)</option>}
            </select>
          </Field>

          <Field label="Prompt file">
            <select value={promptFile} onChange={(e) => setPromptFile(e.target.value)} className="w-full bg-bg border border-border rounded p-2 text-sm">
              <option value="">— select —</option>
              {promptsForModel.map((p) => (
                <option key={p.fileName} value={p.fileName}>{p.fileName}</option>
              ))}
            </select>
          </Field>

          {/* Start + End image */}
          <div className="grid grid-cols-2 gap-3">
            <ImagePicker
              label="Start frame"
              options={imageOptions}
              value={startImage}
              onChange={setStartImage}
            />
            <ImagePicker
              label="End frame"
              options={imageOptions}
              value={endImage}
              onChange={setEndImage}
              extraAction={
                <button
                  type="button"
                  onClick={() => setEndImage(startImage)}
                  className="text-xs text-accent hover:underline"
                  title="Match start (closed loop)"
                >= start</button>
              }
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted">
              {hero.fflfs.length === 0 ? "No FFLF images yet — create one first." : `${hero.fflfs.length} FFLF available`}
            </div>
            <button
              type="button"
              onClick={() => setFflfBuilderOpen(true)}
              className="text-accent hover:underline"
            >+ Build new FFLF</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Duration (s)">
              <input type="number" min={4} max={15} value={duration} onChange={(e) => setDuration(parseInt(e.target.value || "5", 10))} className="w-full bg-bg border border-border rounded p-2 text-sm" />
            </Field>
            <Field label="Aspect">
              <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="w-full bg-bg border border-border rounded p-2 text-sm">
                {["1:1", "9:16", "16:9", "4:3", "21:9"].map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Tier">
              <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="w-full bg-bg border border-border rounded p-2 text-sm">
                <option value="pro">pro</option>
                <option value="fast">fast</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="bg-panel2 px-3 py-1.5 rounded">Cancel</button>
          <button
            disabled={!promptFile || !startImage || !endImage || generating}
            onClick={async () => {
              onSubmitting(true);
              const res = await fetch("/api/jobs/seedance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  heroId: hero.id,
                  conceptId: concept.id,
                  model,
                  promptFile,
                  duration,
                  aspect,
                  tier,
                  startImageRel: startImage,
                  endImageRel: endImage,
                }),
              });
              onSubmitting(false);
              if (res.ok) {
                onClose();
                goToJobs();
              } else {
                const err = await res.text();
                alert(`Failed: ${err}`);
              }
            }}
            className={`px-3 py-1.5 rounded font-medium ${promptFile && startImage && endImage && !generating ? "bg-accent text-bg" : "bg-panel2 text-muted"}`}
          >
            {generating ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      {fflfBuilderOpen && (
        <FFLFBuilder
          heroId={hero.id}
          heroSourceRel={hero.sourceImageRel}
          onClose={() => setFflfBuilderOpen(false)}
          onSaved={async (saved) => {
            await onHeroRefresh();
            setStartImage(saved.relPath);
            setEndImage(saved.relPath);
          }}
        />
      )}
    </div>
  );
}

function ImagePicker({
  label,
  options,
  value,
  onChange,
  extraAction,
}: {
  label: string;
  options: { label: string; relPath: string }[];
  value: string;
  onChange: (v: string) => void;
  extraAction?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted">{label}</div>
        {extraAction}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg border border-border rounded p-2 text-sm"
      >
        <option value="">— select —</option>
        {options.map((o) => (
          <option key={o.relPath} value={o.relPath}>{o.label}</option>
        ))}
      </select>
      {value && (
        <div className="mt-2 aspect-square bg-bg border border-border rounded overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/files/${encodeURI(value)}`} alt={value} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm border-b-2 transition-colors ${active ? "border-accent text-text" : "border-transparent text-muted hover:text-text"}`}
    >
      {children}
    </button>
  );
}

function PromptsPanel({
  heroId,
  concept,
  onSaved,
}: {
  heroId: string;
  concept: ConceptDto;
  onSaved: () => Promise<void> | void;
}) {
  if (concept.promptFiles.length === 0) {
    return (
      <div className="p-6 text-sm text-muted">
        No prompt files for {concept.id} yet.
        <div className="mt-2 font-mono text-xs">
          Expected at <code>Output/{heroId}/Prompts/&lt;Model&gt;/{concept.id}_*.md</code>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      {concept.promptFiles.map((p) => (
        <PromptCard key={`${p.model}/${p.fileName}`} heroId={heroId} prompt={p} onSaved={onSaved} />
      ))}
    </div>
  );
}

function PromptCard({
  heroId,
  prompt,
  onSaved,
}: {
  heroId: string;
  prompt: PromptFileDto;
  onSaved: () => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(prompt.rawMarkdown);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Sync local text when the underlying file content updates (e.g. external edit picked up by refresh).
  useEffect(() => {
    if (!editing) setText(prompt.rawMarkdown);
  }, [prompt.rawMarkdown, editing]);

  const dirty = editing && text !== prompt.rawMarkdown;

  const save = async () => {
    setSaving(true); setErr(null);
    try {
      const res = await fetch(
        `/api/prompts/${encodeURIComponent(heroId)}/${encodeURIComponent(prompt.model)}/${encodeURIComponent(prompt.fileName)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawMarkdown: text }),
        },
      );
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error ?? "Save failed");
      await onSaved();
      setEditing(false);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-panel2 border border-border rounded">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="font-mono text-sm">
          <span className="text-muted">{prompt.model}/</span>{prompt.fileName}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-accent hover:underline">edit</button>
          )}
          {editing && (
            <>
              <button
                onClick={save}
                disabled={saving || !dirty}
                className={`px-2 py-1 rounded ${dirty && !saving ? "bg-good text-bg" : "bg-panel text-muted cursor-not-allowed"}`}
              >
                {saving ? "saving…" : "save"}
              </button>
              <button
                onClick={() => { setEditing(false); setText(prompt.rawMarkdown); setErr(null); }}
                className="px-2 py-1 rounded bg-panel hover:bg-border"
              >
                cancel
              </button>
            </>
          )}
        </div>
      </div>
      {err && <div className="px-3 py-1 text-xs text-bad">{err}</div>}
      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-bg border-0 p-3 text-xs font-mono leading-relaxed min-h-[320px] resize-y"
          spellCheck={false}
        />
      ) : (
        <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed p-3">{prompt.rawMarkdown}</pre>
      )}
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
