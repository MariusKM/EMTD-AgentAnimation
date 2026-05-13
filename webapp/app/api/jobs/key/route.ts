import fs from "node:fs";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { buildKeyComposePayload } from "@/lib/worker";
import { getClipScreenColor, upsertClipMeta, type ScreenColor } from "@/lib/meta";
import { detectScreenColor } from "@/lib/screenColor";

export const dynamic = "force-dynamic";

type AlphaMode = "birefnet+chroma" | "birefnet" | "chroma";
type ScreenChoice = ScreenColor | "auto";

type ClipIn = {
  heroId: string;
  clipName: string;
  despill?: number;
  alphaMode?: AlphaMode;
  screenColor?: ScreenChoice;
};

function normalizeChoice(v: unknown): ScreenChoice | undefined {
  if (v === "green" || v === "blue" || v === "auto") return v;
  return undefined;
}

export async function POST(req: Request) {
  const body = await req.json();
  const clips = body.clips as ClipIn[];
  if (!Array.isArray(clips) || clips.length === 0) {
    return NextResponse.json({ error: "Provide clips: [{heroId, clipName}]" }, { status: 400 });
  }

  const batchDespill = typeof body.despill === "number" ? body.despill : undefined;
  const batchAlphaMode = body.alphaMode as AlphaMode | undefined;
  const batchScreen = normalizeChoice(body.screenColor);

  const enqueued: any[] = [];
  const errors: any[] = [];
  for (const c of clips) {
    try {
      const despill = c.despill ?? batchDespill;
      const alphaMode = c.alphaMode ?? batchAlphaMode;
      const choice = normalizeChoice(c.screenColor) ?? batchScreen ?? "auto";

      // Resolve screen color: explicit user pick > stored meta > auto-detect
      // from raw mp4 corners > final fallback "green".
      let screenColor: ScreenColor;
      if (choice === "green" || choice === "blue") {
        screenColor = choice;
      } else {
        const stored = getClipScreenColor(c.heroId, c.clipName);
        if (stored) {
          screenColor = stored;
        } else {
          // buildKeyComposePayload below will throw if rawMp4 missing — but we
          // need the path now for detection. Resolve it the same way.
          const probe = buildKeyComposePayload(c.heroId, c.clipName);
          screenColor = detectScreenColor(probe.rawMp4) ?? "green";
        }
      }

      // Persist the resolved value so reruns and downstream UI can read it
      // without re-detecting.
      upsertClipMeta(c.heroId, c.clipName, { screenColor });

      const payload = buildKeyComposePayload(c.heroId, c.clipName, {
        despill,
        alphaMode,
        screenColor,
      });
      if (fs.existsSync(payload.outputDir)) {
        payload.rerun = true;
      }
      const job = enqueueJob({
        kind: "key+compose",
        hero_id: c.heroId,
        clip_name: c.clipName,
        payload,
      });
      enqueued.push({ jobId: job.id, screenColor, ...c });
    } catch (err: any) {
      errors.push({ ...c, error: String(err?.message ?? err) });
    }
  }
  return NextResponse.json({ enqueued, errors });
}
