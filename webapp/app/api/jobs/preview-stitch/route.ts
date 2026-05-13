import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { HERO_SCREEN_MOCKUP, HEROANIM_ROOT, OUTPUT_ROOT } from "@/lib/paths";
import { getMockupSlot } from "@/lib/config";
import { getClipEdgeFade, getClipOverflowSize } from "@/lib/meta";

export const dynamic = "force-dynamic";

/**
 * Shareable stitched preview: composite a list of delivered WebMs over the
 * HeroScreen.png mockup into a single H.264 MP4 with audio.
 *
 * Body:
 *   {
 *     heroId: string,
 *     items: [{ clipName: string, loops: number }],   // in playback order
 *     webmSize?: number,                               // default 550
 *   }
 *
 * Resolves each `clipName` to `Output/<Hero>/Final/<ClipName>_final_<size>.webm`.
 * The slot rect comes from app_config (set by the preview modal's placement editor).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const heroId = body.heroId as string | undefined;
  const items = body.items as { clipName: string; loops: number; edgeFade?: number; overflowSize?: number | null }[] | undefined;
  const webmSize = typeof body.webmSize === "number" ? body.webmSize : 550;

  if (!heroId) return NextResponse.json({ error: "heroId required" }, { status: 400 });
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items must be non-empty [{clipName, loops}]" }, { status: 400 });
  }

  if (!fs.existsSync(HERO_SCREEN_MOCKUP)) {
    return NextResponse.json({ error: `Mockup not found: ${HERO_SCREEN_MOCKUP}` }, { status: 400 });
  }

  const finalDir = path.posix.join(OUTPUT_ROOT, heroId, "Final");
  const clipPaths: string[] = [];
  const loops: number[] = [];
  // Per-clip edge fade + overflow. Each item can override; if not, fall back
  // to the value persisted on that clip's metadata. The deliverable WebM
  // already has its mask + overflow baked in by deliver_webm.py, so the UI
  // typically passes 0 / null here to avoid double-application.
  const fades: number[] = [];
  const overflows: number[] = [];
  for (const it of items) {
    const o = it.overflowSize !== undefined ? it.overflowSize : getClipOverflowSize(heroId, it.clipName);
    overflows.push(o ?? 0);
    // The on-disk WebM is named after its actual output dimensions. Overflow
    // clips live as <clip>_final_<overflowSize>.webm; non-overflow clips live
    // as <clip>_final_<webmSize>.webm. Pick the right one per item — using a
    // single fixed size for all items would grab the un-padded WebM for
    // overflow clips and stretch it visibly oversized in the stitched MP4.
    const itemSize = (o && o > webmSize) ? o : webmSize;
    const p = path.posix.join(finalDir, `${it.clipName}_final_${itemSize}.webm`);
    if (!fs.existsSync(p)) {
      return NextResponse.json({ error: `Delivered WebM missing: ${path.posix.relative(HEROANIM_ROOT, p)}. Deliver it first.` }, { status: 400 });
    }
    clipPaths.push(p);
    loops.push(Math.max(1, Math.floor(it.loops || 1)));
    const f = typeof it.edgeFade === "number" ? it.edgeFade : getClipEdgeFade(heroId, it.clipName);
    fades.push(Math.max(0, Math.min(1, f)));
  }

  // Measure mockup to resolve the normalized slot rect into pixels.
  // PNG header: IHDR width/height live at bytes 16..23 (big-endian u32).
  let mockupW = 0, mockupH = 0;
  try {
    const fd = fs.openSync(HERO_SCREEN_MOCKUP, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    mockupW = buf.readUInt32BE(16);
    mockupH = buf.readUInt32BE(20);
  } catch {}
  if (!mockupW || !mockupH) {
    return NextResponse.json({ error: "Could not read mockup dimensions" }, { status: 500 });
  }

  const slotNorm = getMockupSlot();
  const slot = {
    x: slotNorm.x * mockupW,
    y: slotNorm.y * mockupH,
    w: slotNorm.w * mockupW,
    h: slotNorm.h * mockupH,
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const nameParts = items.map((it) => `${it.clipName}${it.loops > 1 ? `x${it.loops}` : ""}`);
  const baseName = `${heroId}_preview_${nameParts.join("_")}_${stamp}.mp4`;
  const outputPath = path.posix.join(finalDir, baseName);

  if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

  const job = enqueueJob({
    kind: "preview-stitch",
    hero_id: heroId,
    payload: {
      heroId,
      clipPaths,
      loops,
      fades,
      overflows,
      contentSize: webmSize,
      mockup: HERO_SCREEN_MOCKUP,
      slot,
      outputPath,
    },
  });
  return NextResponse.json({ jobId: job.id, outputPath });
}
