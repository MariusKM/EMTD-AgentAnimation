import fs from "node:fs";
import path from "node:path";
import { getHero } from "@/lib/scan";
import { OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

/**
 * Serves the first PNG from Processed/ (or FG/ as fallback) so the alignment UI can
 * pin anchors to the exact frame detection was run against.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ hero: string; clipName: string }> }) {
  const { hero: heroParam, clipName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return new Response("Hero not found", { status: 404 });

  const clipDir = path.posix.join(OUTPUT_ROOT, hero.id, "Animations", clipName);
  for (const sub of ["Processed", "FG"]) {
    const d = path.posix.join(clipDir, sub);
    if (!fs.existsSync(d)) continue;
    const frames = fs.readdirSync(d).filter(f => f.toLowerCase().endsWith(".png")).sort();
    if (frames.length === 0) continue;
    const full = path.posix.join(d, frames[0]);
    const stat = fs.statSync(full);
    const stream = fs.createReadStream(full);
    // @ts-ignore Node Readable → web
    const body = (require("node:stream").Readable as any).toWeb(stream);
    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(stat.size),
        "Cache-Control": "no-cache",
      },
    });
  }
  return new Response("No frames found", { status: 404 });
}
