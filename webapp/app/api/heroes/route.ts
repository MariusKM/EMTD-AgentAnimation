import { NextResponse } from "next/server";
import { invalidateScanCache, scanHeroes } from "@/lib/scan";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("refresh") === "1") invalidateScanCache();

  const heroes = scanHeroes();

  // Aggregate counts per hero
  const favCounts = db()
    .prepare("SELECT hero_id, COUNT(*) AS c FROM concept_meta WHERE favorite = 1 GROUP BY hero_id")
    .all() as any[];
  const favMap = new Map(favCounts.map((r) => [r.hero_id, r.c as number]));

  return NextResponse.json({
    heroes: heroes.map((h) => ({
      id: h.id,
      displayName: h.displayName,
      sourceImageRel: h.sourceImageRel,
      conceptCount: h.concepts.length,
      clipCount: h.concepts.reduce((acc, c) => acc + c.clips.length, 0),
      favoriteCount: favMap.get(h.id) ?? 0,
      hasOutput: !!h.outputDir,
    })),
  });
}
