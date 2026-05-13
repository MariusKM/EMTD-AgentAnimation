import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { invalidateScanCache } from "@/lib/scan";
import { ALIGNMENT_TEMPLATE, OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

/**
 * Copy the source clip's anchors.json to one or more target clips, optionally
 * queueing a recompose for each. Used to pin a known-good alignment across
 * sibling clips that share the same FFLF — works around per-clip anchor drift
 * caused by tiny pixel differences in the keyed first frame.
 *
 * Coords are auto-scaled if a target's frame dimensions differ from the source's
 * (read from the PNG IHDR of frame_000000.png in each clip's Processed/ dir).
 *
 * Body:
 *   {
 *     targetClipNames: string[],   // clips on the SAME hero
 *     recompose?: boolean,         // default true — enqueue recompose-aligned per target
 *     notes?: string,              // override notes on the new anchors files
 *   }
 *
 * Response:
 *   {
 *     copied: [{ clipName, recomposeJobId? }],
 *     errors: [{ clipName, error }]
 *   }
 */
export async function POST(req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName: sourceClip } = await ctx.params;
  const heroId = decodeURIComponent(heroParam);

  const body = await req.json().catch(() => ({}));
  const targets = body?.targetClipNames as string[] | undefined;
  const recompose = body?.recompose !== false;
  const notesOverride = typeof body?.notes === "string" ? body.notes : undefined;

  if (!Array.isArray(targets) || targets.length === 0) {
    return NextResponse.json({ error: "targetClipNames must be a non-empty array" }, { status: 400 });
  }

  const sourceDir = path.posix.join(OUTPUT_ROOT, heroId, "Animations", sourceClip);
  const sourceAnchorsPath = path.posix.join(sourceDir, "anchors.json");
  if (!fs.existsSync(sourceAnchorsPath)) {
    return NextResponse.json(
      { error: `Source clip ${sourceClip} has no anchors.json. Set anchors there first.` },
      { status: 400 },
    );
  }

  let sourceAnchors: any;
  try {
    sourceAnchors = JSON.parse(fs.readFileSync(sourceAnchorsPath, "utf8"));
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to read source anchors: ${err?.message ?? err}` },
      { status: 500 },
    );
  }

  if (!sourceAnchors?.eye || !sourceAnchors?.foot) {
    return NextResponse.json({ error: "Source anchors.json is malformed (missing eye/foot)" }, { status: 500 });
  }

  const sourceW = sourceAnchors?.frame?.width ?? null;
  const sourceH = sourceAnchors?.frame?.height ?? null;

  const copied: { clipName: string; recomposeJobId?: string }[] = [];
  const errors: { clipName: string; error: string }[] = [];

  for (const target of targets) {
    if (target === sourceClip) {
      errors.push({ clipName: target, error: "Cannot copy a clip's anchors onto itself" });
      continue;
    }
    try {
      const targetDir = path.posix.join(OUTPUT_ROOT, heroId, "Animations", target);
      if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
        throw new Error(`Target clip dir not found: ${targetDir}`);
      }

      // Resolve target's reference frame so we can scale coords if dims differ.
      const targetFrame = readTargetFrame(targetDir);
      let { x: eyeX, y: eyeY } = sourceAnchors.eye;
      let { x: footX, y: footY } = sourceAnchors.foot;

      if (sourceW && sourceH && targetFrame && (targetFrame.width !== sourceW || targetFrame.height !== sourceH)) {
        const sx = targetFrame.width / sourceW;
        const sy = targetFrame.height / sourceH;
        eyeX *= sx; eyeY *= sy;
        footX *= sx; footY *= sy;
      }

      const next = {
        schemaVersion: 1,
        frame: targetFrame ?? sourceAnchors.frame ?? null,
        eye:  { x: eyeX,  y: eyeY,  confidence: 1.0, source: `copied-from-${sourceClip}` },
        foot: { x: footX, y: footY, confidence: 1.0, source: `copied-from-${sourceClip}` },
        detectedAt: new Date().toISOString(),
        notes: notesOverride ?? `Copied from ${sourceClip} on ${new Date().toISOString()}`,
      };

      fs.writeFileSync(path.posix.join(targetDir, "anchors.json"), JSON.stringify(next, null, 2));

      const result: { clipName: string; recomposeJobId?: string } = { clipName: target };
      if (recompose) {
        const job = enqueueJob({
          kind: "key+compose",
          hero_id: heroId,
          clip_name: target,
          payload: {
            rawMp4: path.posix.join(OUTPUT_ROOT, heroId, "Animations", `${target}.mp4`),
            outputDir: targetDir,
            clipName: target,
            heroId,
            skipKeying: true,
            alignToTemplate: true,
            // ALIGNMENT_TEMPLATE is read by the worker if present.
          },
        });
        result.recomposeJobId = job.id;
        // Touch ALIGNMENT_TEMPLATE here just to silence the unused-import warning
        // when the worker ends up not using it on this code path.
        void ALIGNMENT_TEMPLATE;
      }
      copied.push(result);
    } catch (err: any) {
      errors.push({ clipName: target, error: String(err?.message ?? err) });
    }
  }

  invalidateScanCache();
  return NextResponse.json({ copied, errors });
}

/**
 * Read the dimensions + reference frame info for a target clip's first Processed frame.
 * Returns null if no Processed dir / no frame_NNNNNN.png exists yet.
 */
function readTargetFrame(targetDir: string): { width: number; height: number; index: number; path: string } | null {
  const processed = path.posix.join(targetDir, "Processed");
  if (!fs.existsSync(processed)) return null;
  const files = fs.readdirSync(processed).filter(f => f.endsWith(".png")).sort();
  if (files.length === 0) return null;
  const first = files[0];
  const fullPath = path.posix.join(processed, first);
  const dims = readPngDims(fullPath);
  if (!dims) return null;
  const m = /frame_(\d+)/.exec(first);
  return {
    width: dims.w,
    height: dims.h,
    index: m ? parseInt(m[1], 10) : 0,
    path: `Processed/${first}`,
  };
}

function readPngDims(filePath: string): { w: number; h: number } | null {
  try {
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}
