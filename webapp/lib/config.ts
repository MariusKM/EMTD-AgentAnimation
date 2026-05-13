import { db } from "./db";

export type MockupSlotRect = {
  // Normalized 0..1 coords on the HeroScreen.png mockup.
  // (x, y) = top-left corner; (w, h) = size. Kept normalized so the value
  // is resolution-independent if we ever swap in a higher-res mockup.
  x: number;
  y: number;
  w: number;
  h: number;
};

// Sensible default: roughly the empty portrait area of HeroScreen.png (750x1624).
// Can (and will) be overridden by the user via the preview modal.
export const DEFAULT_MOCKUP_SLOT: MockupSlotRect = {
  x: 0.08,
  y: 0.18,
  w: 0.84,
  h: 0.38,
};

export function getConfig<T = unknown>(key: string): T | null {
  const row = db().prepare("SELECT value FROM app_config WHERE key = ?").get(key) as { value: string } | undefined;
  if (!row) return null;
  try { return JSON.parse(row.value) as T; } catch { return null; }
}

export function setConfig(key: string, value: unknown) {
  const v = JSON.stringify(value);
  db()
    .prepare(
      `INSERT INTO app_config(key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    )
    .run(key, v);
}

// Size may exceed 1 (slot larger than mockup → video extends beyond edges,
// fine for ffmpeg overlay). Position may go negative for the same reason.
// Cap at a sane upper bound to avoid bad input crashing ffmpeg with huge scales.
const MAX_SIZE = 5;
const MAX_POS = 5;

export function getMockupSlot(): MockupSlotRect {
  const stored = getConfig<Partial<MockupSlotRect>>("mockup_slot_rect");
  if (!stored) return DEFAULT_MOCKUP_SLOT;
  const rect: MockupSlotRect = {
    x: clampPos(stored.x ?? DEFAULT_MOCKUP_SLOT.x),
    y: clampPos(stored.y ?? DEFAULT_MOCKUP_SLOT.y),
    w: clampSize(stored.w ?? DEFAULT_MOCKUP_SLOT.w),
    h: clampSize(stored.h ?? DEFAULT_MOCKUP_SLOT.h),
  };
  return rect;
}

export function setMockupSlot(rect: MockupSlotRect) {
  setConfig("mockup_slot_rect", {
    x: clampPos(rect.x),
    y: clampPos(rect.y),
    w: clampSize(rect.w),
    h: clampSize(rect.h),
  });
}

function clampSize(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(MAX_SIZE, v));
}

function clampPos(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(-MAX_POS, Math.min(MAX_POS, v));
}
