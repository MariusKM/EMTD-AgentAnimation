import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { OUTPUT_ROOT } from "@/lib/paths";
import { getClipEdgeFade, getClipOverflowSize } from "@/lib/meta";

export const dynamic = "force-dynamic";

/**
 * Final-delivery encode: aligned RGBA .mov -> VP8/WebM with alpha at target size (default 960).
 *
 * The aligned MOV is already rendered at the alignment-template canvas size (typically 960),
 * so delivering at 960 is a pass-through with no scaling. The 550 size remains available as
 * an opt-in via the `size` body param for any callers that still need the smaller deliverable.
 *
 * Body:
 *   {
 *     clips: [{heroId, clipName}],
 *     size?: number,               // default 960
 *     allowUnaligned?: boolean,    // default false — without this, clips missing
 *                                  // _fg_alpha_aligned.mov are rejected. When true,
 *                                  // the endpoint falls back to _fg_alpha.mov.
 *   }
 */
export async function POST(req: Request) {
  const body = await req.json();
  const clips = body.clips as { heroId: string; clipName: string }[];
  if (!Array.isArray(clips) || clips.length === 0) {
    return NextResponse.json({ error: "Provide clips: [{heroId, clipName}]" }, { status: 400 });
  }
  const size = typeof body.size === "number" ? body.size : 960;
  const allowUnaligned = body.allowUnaligned === true;

  const enqueued: any[] = [];
  const errors: any[] = [];
  for (const c of clips) {
    try {
      const clipDir = path.posix.join(OUTPUT_ROOT, c.heroId, "Animations", c.clipName);
      const aligned = path.posix.join(clipDir, `${c.clipName}_fg_alpha_aligned.mov`);
      const unaligned = path.posix.join(clipDir, `${c.clipName}_fg_alpha.mov`);

      let inputMov: string;
      let usedUnaligned = false;
      if (fs.existsSync(aligned)) {
        inputMov = aligned;
      } else if (allowUnaligned && fs.existsSync(unaligned)) {
        inputMov = unaligned;
        usedUnaligned = true;
      } else {
        throw new Error(
          fs.existsSync(unaligned)
            ? "Clip is not aligned (no _fg_alpha_aligned.mov). Align first, or set allowUnaligned=true."
            : `No fg_alpha MOV found for ${c.clipName}`,
        );
      }

      const finalDir = path.posix.join(OUTPUT_ROOT, c.heroId, "Final");
      if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

      const edgeFade = getClipEdgeFade(c.heroId, c.clipName);
      const overflowSize = getClipOverflowSize(c.heroId, c.clipName);
      // The webm is named after its actual output dimensions. With overflow
      // the worker recomposes a padded aligned MOV and scales to overflow_size,
      // so the file lands as <clip>_final_<overflow>.webm.
      const finalSize = overflowSize && overflowSize > size ? overflowSize : size;
      const outputWebm = path.posix.join(finalDir, `${c.clipName}_final_${finalSize}.webm`);
      const job = enqueueJob({
        kind: "deliver",
        hero_id: c.heroId,
        clip_name: c.clipName,
        payload: {
          heroId: c.heroId,
          clipName: c.clipName,
          inputMov,
          outputWebm,
          size,
          usedUnaligned,
          edgeFade,
          overflowSize,
        },
      });
      enqueued.push({ jobId: job.id, ...c, usedUnaligned, edgeFade, overflowSize });
    } catch (err: any) {
      errors.push({ ...c, error: String(err?.message ?? err) });
    }
  }
  return NextResponse.json({ enqueued, errors });
}
