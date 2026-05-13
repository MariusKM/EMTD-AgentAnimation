import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { NextResponse } from "next/server";
import { getHero } from "@/lib/scan";
import { COMPOSE_PYTHON, DETECT_ANCHORS_SCRIPT, HEROANIM_ROOT, SOURCE_HEROES } from "@/lib/paths";

export const dynamic = "force-dynamic";

/**
 * Run eye + foot detection on an arbitrary hero-related PNG (defaults to the hero's source art).
 * Used by the FFLFBuilder's "Auto-align to template" button. Synchronous — ~1s.
 *
 * Body (all optional):
 *   { imageRel?: string }        // path relative to HEROANIM_ROOT; defaults to Source/Heroes Stylized/<hero>.png
 */
export async function POST(req: Request, ctx: { params: Promise<{ hero: string }> }) {
  const { hero: heroId } = await ctx.params;
  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  let body: any = {};
  try { body = await req.json(); } catch {}
  const imageRel = typeof body.imageRel === "string" ? body.imageRel : undefined;

  let imagePath: string;
  if (imageRel) {
    const root = HEROANIM_ROOT.replace(/\\/g, "/");
    const resolved = path.posix.normalize(path.posix.join(root, imageRel));
    if (!resolved.toLowerCase().startsWith(root.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden path" }, { status: 403 });
    }
    imagePath = resolved;
  } else {
    imagePath = path.posix.join(SOURCE_HEROES, `${hero.id}.png`);
  }

  if (!fs.existsSync(imagePath)) {
    return NextResponse.json({ error: `Image not found: ${imagePath}` }, { status: 404 });
  }

  const result = spawnSync(
    COMPOSE_PYTHON,
    [DETECT_ANCHORS_SCRIPT, imagePath, "--image"],
    { encoding: "utf8", windowsHide: true },
  );
  if (result.status !== 0) {
    return NextResponse.json(
      { error: "detect_anchors failed", code: result.status, stderr: result.stderr, stdout: result.stdout },
      { status: 500 },
    );
  }

  // The script prints JSON on its own line; other output (TF/MediaPipe noise) can appear on stderr.
  const lines = result.stdout.trim().split(/\r?\n/).filter(Boolean);
  let parsed: any = null;
  for (const line of lines.reverse()) {
    try { parsed = JSON.parse(line); break; } catch {}
  }
  if (!parsed) {
    return NextResponse.json({ error: "Could not parse detect_anchors stdout", stdout: result.stdout }, { status: 500 });
  }

  return NextResponse.json({ ok: true, anchors: parsed, imagePath });
}
