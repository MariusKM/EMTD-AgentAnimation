import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { upsertConceptMeta } from "@/lib/meta";
import { writeConceptBlock } from "@/lib/concepts";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ hero: string; conceptId: string }> }) {
  const { hero: heroId, conceptId } = await ctx.params;
  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const body = await req.json();
  let metaPatch: any = undefined;
  let updatedMd: string | undefined;

  if (body.favorite !== undefined || body.rating !== undefined || body.notes !== undefined) {
    metaPatch = upsertConceptMeta(hero.id, conceptId, {
      favorite: body.favorite,
      rating: body.rating,
      notes: body.notes,
    });
  }

  if (typeof body.rawMarkdown === "string") {
    if (!hero.conceptsMdPath) {
      return NextResponse.json({ error: "concepts.md not found for this hero" }, { status: 400 });
    }
    writeConceptBlock(hero.conceptsMdPath, conceptId, body.rawMarkdown);
    updatedMd = body.rawMarkdown;
    invalidateScanCache();
  }

  return NextResponse.json({ ok: true, meta: metaPatch, rawMarkdown: updatedMd });
}
