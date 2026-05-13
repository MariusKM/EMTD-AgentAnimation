import { NextResponse } from "next/server";
import path from "node:path";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { getClipMetaMap, getConceptMetaMap } from "@/lib/meta";
import { HEROANIM_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

function rel(p?: string): string | undefined {
  if (!p) return undefined;
  const r = path.posix.relative(HEROANIM_ROOT.replace(/\\/g, "/"), p.replace(/\\/g, "/"));
  return r;
}

export async function GET(req: Request, ctx: { params: Promise<{ hero: string }> }) {
  invalidateScanCache();
  const { hero: heroId } = await ctx.params;
  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const conceptMeta = getConceptMetaMap(hero.id);
  const clipMeta = getClipMetaMap(hero.id);

  return NextResponse.json({
    hero: {
      id: hero.id,
      displayName: hero.displayName,
      sourceImageRel: hero.sourceImageRel,
      hasOutputDir: !!hero.outputDir,
      hasConceptsMd: !!hero.conceptsMdPath,
      fflfs: hero.fflfs.map((f) => ({ name: f.name, index: f.index, relPath: f.relPath })),
      concepts: hero.concepts.map((c) => ({
        id: c.id,
        kind: c.kind,
        title: c.title,
        slug: c.slug,
        rawMarkdown: c.rawMarkdown,
        meta: conceptMeta[c.id] ?? { favorite: false, rating: null, notes: null },
        promptFiles: c.promptFiles.map((p) => ({ model: p.model, fileName: p.fileName, rawMarkdown: p.rawMarkdown })),
        clips: c.clips.map((cl) => ({
          name: cl.name,
          conceptId: cl.conceptId,
          iter: cl.iter,
          rawMp4Rel: rel(cl.rawMp4),
          processed: cl.processed
            ? {
                fgAlphaMovRel: rel(cl.processed.fgAlphaMov),
                fgAlphaMp4Rel: rel(cl.processed.fgAlphaMp4),
                compMp4Rel: rel(cl.processed.compMp4),
                fgAlphaMovAlignedRel: rel(cl.processed.fgAlphaMovAligned),
                fgAlphaMp4AlignedRel: rel(cl.processed.fgAlphaMp4Aligned),
                deliveredWebms: (cl.processed.deliveredWebms ?? []).map(d => ({ size: d.size, rel: rel(d.path)! })),
                frameCount: cl.processed.frameCount ?? null,
                hasAnchors: cl.processed.hasAnchors ?? false,
              }
            : null,
          meta: clipMeta[cl.name] ?? {
            favorite: false,
            rating: null,
            notes: null,
            markedUpload: false,
            markedKey: false,
            edgeFade: 0,
            overflowSize: null,
            screenColor: null,
          },
        })),
      })),
    },
  });
}
