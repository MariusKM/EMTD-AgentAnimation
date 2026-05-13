import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

// POST body: { pngBase64: string (data URL or raw base64), index?: number }
// Saves to Output/<Hero>/<Hero>_FFLF[_N].png. If index is omitted, picks the next free integer.
export async function POST(req: Request, ctx: { params: Promise<{ hero: string }> }) {
  const { hero: heroParam } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const body = await req.json();
  const raw: string | undefined = body.pngBase64;
  if (!raw) return NextResponse.json({ error: "pngBase64 required" }, { status: 400 });

  const b64 = raw.startsWith("data:") ? raw.split(",")[1] : raw;
  let buf: Buffer;
  try {
    buf = Buffer.from(b64, "base64");
  } catch {
    return NextResponse.json({ error: "Invalid base64" }, { status: 400 });
  }
  if (!isPng(buf)) {
    return NextResponse.json({ error: "Decoded blob is not a PNG" }, { status: 400 });
  }

  const outDir = path.posix.join(OUTPUT_ROOT, hero.id);
  fs.mkdirSync(outDir, { recursive: true });

  let index: number;
  if (typeof body.index === "number") {
    index = body.index;
  } else {
    index = nextFreeIndex(outDir, hero.id);
  }
  const fileName = `${hero.id}_FFLF_${index}.png`;
  const fullPath = path.posix.join(outDir, fileName);
  fs.writeFileSync(fullPath, buf);
  invalidateScanCache();

  return NextResponse.json({
    ok: true,
    fflf: {
      name: fileName,
      index,
      relPath: `Output/${hero.id}/${fileName}`,
    },
  });
}

function nextFreeIndex(dir: string, heroId: string): number {
  const re = new RegExp(`^${heroId.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}_FFLF(?:_(\\d+))?\\.png$`, "i");
  let max = -1;
  for (const f of fs.readdirSync(dir)) {
    const m = re.exec(f);
    if (!m) continue;
    const n = m[1] ? parseInt(m[1], 10) : 0; // unnumbered counts as 0
    if (n > max) max = n;
  }
  return max + 1;
}

function isPng(buf: Buffer): boolean {
  return (
    buf.length > 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  );
}
