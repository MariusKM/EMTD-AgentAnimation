import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getHero } from "@/lib/scan";
import { HEROANIM_ROOT, OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

const FRAME_DIRS = ["FG", "Matte", "Comp", "Processed"] as const;
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"]);
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function rel(absPath: string): string {
  return path.posix.relative(
    HEROANIM_ROOT.replace(/\\/g, "/"),
    absPath.replace(/\\/g, "/"),
  );
}

export async function GET(_req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const clipDir = path.posix.join(OUTPUT_ROOT, hero.id, "Animations", clipName);
  if (!fs.existsSync(clipDir)) {
    return NextResponse.json({ error: "Clip dir not found", path: clipDir }, { status: 404 });
  }

  const frames: Record<string, string[]> = {};
  for (const sub of FRAME_DIRS) {
    const subPath = path.posix.join(clipDir, sub);
    if (!fs.existsSync(subPath)) continue;
    const files = fs
      .readdirSync(subPath)
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort();
    frames[sub] = files.map((f) => rel(path.posix.join(subPath, f)));
  }

  const outputs: { name: string; rel: string; ext: string; sizeBytes: number }[] = [];
  for (const f of fs.readdirSync(clipDir)) {
    const full = path.posix.join(clipDir, f);
    const stat = fs.statSync(full);
    if (!stat.isFile()) continue;
    const ext = path.extname(f).toLowerCase();
    if (VIDEO_EXTS.has(ext) || ext === ".json") {
      outputs.push({ name: f, rel: rel(full), ext, sizeBytes: stat.size });
    }
  }

  return NextResponse.json({
    clipName,
    clipDirRel: rel(clipDir),
    frames,
    outputs,
  });
}
