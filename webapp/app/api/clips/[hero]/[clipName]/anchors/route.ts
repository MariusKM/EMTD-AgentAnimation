import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import {
  COMPOSE_PYTHON,
  DETECT_ANCHORS_SCRIPT,
  OUTPUT_ROOT,
} from "@/lib/paths";

export const dynamic = "force-dynamic";

function anchorsPath(heroId: string, clipName: string): string {
  return path.posix.join(OUTPUT_ROOT, heroId, "Animations", clipName, "anchors.json");
}

export async function GET(_req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const p = anchorsPath(hero.id, clipName);
  if (!fs.existsSync(p)) return NextResponse.json({ anchors: null, path: p });
  try {
    const anchors = JSON.parse(fs.readFileSync(p, "utf8"));
    return NextResponse.json({ anchors, path: p });
  } catch (err: any) {
    return NextResponse.json({ error: `Failed to read anchors: ${err?.message ?? err}` }, { status: 500 });
  }
}

/**
 * PUT = manual override (from the alignment UI). Marks eye/foot source="manual".
 * Body: { eye: {x, y}, foot: {x, y}, notes?: string }
 */
export async function PUT(req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const body = await req.json();
  if (!body?.eye || !body?.foot) {
    return NextResponse.json({ error: "Body must include eye:{x,y} and foot:{x,y}" }, { status: 400 });
  }

  const p = anchorsPath(hero.id, clipName);
  let existing: any = {};
  if (fs.existsSync(p)) {
    try { existing = JSON.parse(fs.readFileSync(p, "utf8")); } catch {}
  }

  const next = {
    schemaVersion: 1,
    frame: existing.frame ?? body.frame ?? null,
    eye:  { x: +body.eye.x,  y: +body.eye.y,  confidence: 1.0, source: "manual" },
    foot: { x: +body.foot.x, y: +body.foot.y, confidence: 1.0, source: "manual" },
    detectedAt: new Date().toISOString(),
    notes: body.notes ?? existing.notes ?? "",
  };

  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(next, null, 2));
  invalidateScanCache();
  return NextResponse.json({ ok: true, anchors: next, path: p });
}

/**
 * POST = re-run auto-detect. Synchronous (fast — one frame). Use the job queue only
 * for the batch "detect all" endpoint.
 */
export async function POST(_req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const clipDir = path.posix.join(OUTPUT_ROOT, hero.id, "Animations", clipName);
  if (!fs.existsSync(clipDir)) {
    return NextResponse.json({ error: `Clip dir not found: ${clipDir}` }, { status: 404 });
  }

  const result = spawnSync(
    COMPOSE_PYTHON,
    [DETECT_ANCHORS_SCRIPT, clipDir, "--force"],
    { encoding: "utf8", windowsHide: true },
  );
  if (result.status !== 0) {
    return NextResponse.json(
      { error: "detect_anchors failed", code: result.status, stderr: result.stderr, stdout: result.stdout },
      { status: 500 },
    );
  }

  const p = anchorsPath(hero.id, clipName);
  if (!fs.existsSync(p)) {
    return NextResponse.json({ error: "detect_anchors succeeded but no anchors.json written", log: result.stdout }, { status: 500 });
  }
  const anchors = JSON.parse(fs.readFileSync(p, "utf8"));
  invalidateScanCache();
  return NextResponse.json({ ok: true, anchors, path: p, log: result.stdout });
}
