import fs from "node:fs";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { buildKeyComposePayload } from "@/lib/worker";

export const dynamic = "force-dynamic";

/**
 * Compose-only re-run. Skips keying, reuses existing Processed/ frames,
 * and optionally applies --align-to-template using the clip's anchors.json.
 *
 * Body:
 *   { clips: [{heroId, clipName}], alignToTemplate?: boolean }
 */
export async function POST(req: Request) {
  const body = await req.json();
  const clips = body.clips as { heroId: string; clipName: string }[];
  if (!Array.isArray(clips) || clips.length === 0) {
    return NextResponse.json({ error: "Provide clips: [{heroId, clipName}]" }, { status: 400 });
  }
  const alignToTemplate = body.alignToTemplate !== false;  // default true for this endpoint

  const enqueued: any[] = [];
  const errors: any[] = [];
  for (const c of clips) {
    try {
      const payload = buildKeyComposePayload(c.heroId, c.clipName, {
        alignToTemplate,
        skipKeying: true,
      });
      if (!fs.existsSync(payload.outputDir)) {
        throw new Error(`No processed dir to re-compose: ${payload.outputDir}`);
      }
      const job = enqueueJob({
        kind: "key+compose",
        hero_id: c.heroId,
        clip_name: c.clipName,
        payload,
      });
      enqueued.push({ jobId: job.id, ...c });
    } catch (err: any) {
      errors.push({ ...c, error: String(err?.message ?? err) });
    }
  }
  return NextResponse.json({ enqueued, errors });
}
