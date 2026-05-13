import fs from "node:fs";
import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { deleteClipMeta, upsertClipMeta } from "@/lib/meta";
import { buildKeyComposePayload } from "@/lib/worker";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroId, clipName } = await ctx.params;
  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const body = await req.json();
  const meta = upsertClipMeta(hero.id, clipName, {
    favorite: body.favorite,
    rating: body.rating,
    notes: body.notes,
    markedUpload: body.markedUpload,
    markedKey: body.markedKey,
    edgeFade: typeof body.edgeFade === "number" ? body.edgeFade : undefined,
    overflowSize:
      body.overflowSize === null
        ? null
        : typeof body.overflowSize === "number"
          ? body.overflowSize
          : undefined,
    screenColor:
      body.screenColor === null
        ? null
        : body.screenColor === "green" || body.screenColor === "blue"
          ? body.screenColor
          : undefined,
  });
  return NextResponse.json({ ok: true, meta });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroId, clipName } = await ctx.params;
  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  let payload;
  try {
    payload = buildKeyComposePayload(hero.id, clipName);
  } catch {
    // Raw clip already gone — still try to clean up processed dir + meta below.
    payload = null;
  }

  const removed: string[] = [];
  if (payload) {
    if (fs.existsSync(payload.rawMp4)) {
      fs.rmSync(payload.rawMp4, { force: true });
      removed.push(payload.rawMp4);
    }
    if (fs.existsSync(payload.outputDir)) {
      fs.rmSync(payload.outputDir, { recursive: true, force: true });
      removed.push(payload.outputDir);
    }
  }
  deleteClipMeta(hero.id, clipName);
  invalidateScanCache();
  return NextResponse.json({ ok: true, removed });
}
