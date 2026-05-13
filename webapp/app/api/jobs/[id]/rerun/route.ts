import fs from "node:fs";
import { NextResponse } from "next/server";
import { enqueueJob, getJob } from "@/lib/jobs";
import { submitSeedanceJob } from "@/lib/seedance";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const original = getJob(id);
  if (!original) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  if (original.status === "queued" || original.status === "running") {
    return NextResponse.json(
      { error: `Job is still ${original.status}; cancel it first if you want to rerun` },
      { status: 409 },
    );
  }

  const p = original.payload ?? {};

  if (original.kind === "seedance") {
    if (!p.startImage || !p.endImage || !p.promptText) {
      return NextResponse.json(
        { error: "Original seedance job is missing payload fields (startImage / endImage / promptText)" },
        { status: 400 },
      );
    }
    if (!fs.existsSync(p.startImage)) {
      return NextResponse.json({ error: `Start image no longer exists: ${p.startImage}` }, { status: 400 });
    }
    if (!fs.existsSync(p.endImage)) {
      return NextResponse.json({ error: `End image no longer exists: ${p.endImage}` }, { status: 400 });
    }
    const newId = submitSeedanceJob({
      heroId: original.hero_id ?? "",
      conceptId: original.concept_id ?? "",
      model: p.model ?? "Seedance",
      tier: p.tier ?? "pro",
      duration: p.duration ?? 5,
      aspect: p.aspect ?? "9:16",
      promptFile: p.promptFile,
      promptText: p.promptText,
      startImage: p.startImage,
      endImage: p.endImage,
    });
    return NextResponse.json({ ok: true, jobId: newId, kind: "seedance" });
  }

  if (original.kind === "key+compose") {
    if (!p.rawMp4 || !p.outputDir || !p.clipName || !p.heroId) {
      return NextResponse.json(
        { error: "Original key+compose job is missing payload fields" },
        { status: 400 },
      );
    }
    if (!fs.existsSync(p.rawMp4)) {
      return NextResponse.json({ error: `Raw clip no longer exists: ${p.rawMp4}` }, { status: 400 });
    }
    const job = enqueueJob({
      kind: "key+compose",
      hero_id: original.hero_id ?? p.heroId,
      clip_name: original.clip_name ?? p.clipName,
      payload: p,
    });
    return NextResponse.json({ ok: true, jobId: job.id, kind: "key+compose" });
  }

  return NextResponse.json({ error: `Unknown job kind: ${original.kind}` }, { status: 400 });
}
