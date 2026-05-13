import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { COMPOSE_PYTHON, DETECT_ANCHORS_SCRIPT, OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

/**
 * Batch auto-detect anchors for every processed clip under a hero's Animations dir.
 * Fast (≲1s per clip), runs synchronously.
 *
 * Body: { heroId: string, force?: boolean }
 *   force=true regenerates anchors even if anchors.json already exists.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const heroId = String(body.heroId ?? "");
  const force = body.force === true;
  if (!heroId) return NextResponse.json({ error: "heroId is required" }, { status: 400 });

  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const animDir = path.posix.join(OUTPUT_ROOT, hero.id, "Animations");
  if (!fs.existsSync(animDir)) {
    return NextResponse.json({ error: `No Animations dir for ${hero.id}` }, { status: 404 });
  }

  const args = [DETECT_ANCHORS_SCRIPT, animDir, "--all"];
  if (force) args.push("--force");

  const result = spawnSync(COMPOSE_PYTHON, args, {
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 20 * 1024 * 1024,
  });

  invalidateScanCache();

  if (result.status !== 0) {
    return NextResponse.json(
      { error: "detect_anchors failed", code: result.status, stderr: result.stderr, stdout: result.stdout },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, stdout: result.stdout });
}
