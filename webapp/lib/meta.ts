import { db } from "./db";

export type ConceptMeta = { favorite: boolean; rating: number | null; notes: string | null };
export type ScreenColor = "green" | "blue";

export type ClipMeta = {
  favorite: boolean;
  rating: number | null;
  notes: string | null;
  markedUpload: boolean;
  markedKey: boolean;
  edgeFade: number; // 0..1, 0 = no mask
  overflowSize: number | null; // px, null = no overflow padding (use delivery size as-is)
  screenColor: ScreenColor | null; // null = unknown (defaults to green at keying time)
};

export function getConceptMetaMap(heroId: string): Record<string, ConceptMeta> {
  const rows = db()
    .prepare("SELECT concept_id, favorite, rating, notes FROM concept_meta WHERE hero_id = ?")
    .all(heroId) as any[];
  const out: Record<string, ConceptMeta> = {};
  for (const r of rows) {
    out[r.concept_id] = {
      favorite: !!r.favorite,
      rating: r.rating ?? null,
      notes: r.notes ?? null,
    };
  }
  return out;
}

export function getClipMetaMap(heroId: string): Record<string, ClipMeta> {
  const rows = db()
    .prepare(
      "SELECT clip_name, favorite, rating, notes, marked_upload, marked_key, edge_fade, overflow_size, screen_color FROM clip_meta WHERE hero_id = ?",
    )
    .all(heroId) as any[];
  const out: Record<string, ClipMeta> = {};
  for (const r of rows) {
    out[r.clip_name] = {
      favorite: !!r.favorite,
      rating: r.rating ?? null,
      notes: r.notes ?? null,
      markedUpload: !!r.marked_upload,
      markedKey: !!r.marked_key,
      edgeFade: clamp01(r.edge_fade),
      overflowSize: validOverflow(r.overflow_size),
      screenColor: validScreenColor(r.screen_color),
    };
  }
  return out;
}

export function getClipScreenColor(heroId: string, clipName: string): ScreenColor | null {
  const row = db()
    .prepare("SELECT screen_color FROM clip_meta WHERE hero_id = ? AND clip_name = ?")
    .get(heroId, clipName) as { screen_color: string | null } | undefined;
  return validScreenColor(row?.screen_color);
}

function validScreenColor(v: string | null | undefined): ScreenColor | null {
  return v === "green" || v === "blue" ? v : null;
}

export function getClipEdgeFade(heroId: string, clipName: string): number {
  const row = db()
    .prepare("SELECT edge_fade FROM clip_meta WHERE hero_id = ? AND clip_name = ?")
    .get(heroId, clipName) as { edge_fade: number | null } | undefined;
  return clamp01(row?.edge_fade);
}

export function getClipOverflowSize(heroId: string, clipName: string): number | null {
  const row = db()
    .prepare("SELECT overflow_size FROM clip_meta WHERE hero_id = ? AND clip_name = ?")
    .get(heroId, clipName) as { overflow_size: number | null } | undefined;
  return validOverflow(row?.overflow_size);
}

function validOverflow(v: number | null | undefined): number | null {
  if (v == null || !Number.isFinite(v)) return null;
  const n = Math.floor(v);
  // Sane bounds — anything below 64 or above 4096 is junk.
  if (n < 64 || n > 4096) return null;
  return n;
}

function clamp01(v: number | null | undefined): number {
  if (v == null || !Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function upsertConceptMeta(
  heroId: string,
  conceptId: string,
  patch: Partial<ConceptMeta>,
): ConceptMeta {
  const existing = (db()
    .prepare("SELECT favorite, rating, notes FROM concept_meta WHERE hero_id = ? AND concept_id = ?")
    .get(heroId, conceptId) as any) ?? { favorite: 0, rating: null, notes: null };
  const merged = {
    favorite: patch.favorite !== undefined ? (patch.favorite ? 1 : 0) : existing.favorite,
    rating: patch.rating !== undefined ? patch.rating : existing.rating,
    notes: patch.notes !== undefined ? patch.notes : existing.notes,
  };
  db()
    .prepare(
      `INSERT INTO concept_meta (hero_id, concept_id, favorite, rating, notes, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(hero_id, concept_id) DO UPDATE SET
         favorite=excluded.favorite, rating=excluded.rating, notes=excluded.notes, updated_at=excluded.updated_at`,
    )
    .run(heroId, conceptId, merged.favorite, merged.rating, merged.notes);
  return { favorite: !!merged.favorite, rating: merged.rating, notes: merged.notes };
}

export function upsertClipMeta(
  heroId: string,
  clipName: string,
  patch: Partial<ClipMeta>,
): ClipMeta {
  const existing = (db()
    .prepare(
      "SELECT favorite, rating, notes, marked_upload, marked_key, edge_fade, overflow_size, screen_color FROM clip_meta WHERE hero_id = ? AND clip_name = ?",
    )
    .get(heroId, clipName) as any) ?? {
      favorite: 0,
      rating: null,
      notes: null,
      marked_upload: 0,
      marked_key: 0,
      edge_fade: null,
      overflow_size: null,
      screen_color: null,
    };
  const merged = {
    favorite: patch.favorite !== undefined ? (patch.favorite ? 1 : 0) : existing.favorite,
    rating: patch.rating !== undefined ? patch.rating : existing.rating,
    notes: patch.notes !== undefined ? patch.notes : existing.notes,
    marked_upload:
      patch.markedUpload !== undefined ? (patch.markedUpload ? 1 : 0) : existing.marked_upload,
    marked_key:
      patch.markedKey !== undefined ? (patch.markedKey ? 1 : 0) : existing.marked_key,
    edge_fade:
      patch.edgeFade !== undefined
        ? clamp01(patch.edgeFade)
        : existing.edge_fade,
    overflow_size:
      patch.overflowSize !== undefined
        ? validOverflow(patch.overflowSize)
        : existing.overflow_size,
    screen_color:
      patch.screenColor !== undefined
        ? validScreenColor(patch.screenColor as any)
        : validScreenColor(existing.screen_color),
  };
  db()
    .prepare(
      `INSERT INTO clip_meta (hero_id, clip_name, favorite, rating, notes, marked_upload, marked_key, edge_fade, overflow_size, screen_color, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(hero_id, clip_name) DO UPDATE SET
         favorite=excluded.favorite,
         rating=excluded.rating,
         notes=excluded.notes,
         marked_upload=excluded.marked_upload,
         marked_key=excluded.marked_key,
         edge_fade=excluded.edge_fade,
         overflow_size=excluded.overflow_size,
         screen_color=excluded.screen_color,
         updated_at=excluded.updated_at`,
    )
    .run(
      heroId,
      clipName,
      merged.favorite,
      merged.rating,
      merged.notes,
      merged.marked_upload,
      merged.marked_key,
      merged.edge_fade,
      merged.overflow_size,
      merged.screen_color,
    );
  return {
    favorite: !!merged.favorite,
    rating: merged.rating,
    notes: merged.notes,
    markedUpload: !!merged.marked_upload,
    markedKey: !!merged.marked_key,
    edgeFade: clamp01(merged.edge_fade),
    overflowSize: validOverflow(merged.overflow_size),
    screenColor: validScreenColor(merged.screen_color),
  };
}

export function deleteClipMeta(heroId: string, clipName: string): void {
  db().prepare("DELETE FROM clip_meta WHERE hero_id = ? AND clip_name = ?").run(heroId, clipName);
}
