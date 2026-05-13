import path from "node:path";
import { notFound } from "next/navigation";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { getClipMetaMap, getConceptMetaMap } from "@/lib/meta";
import { HEROANIM_ROOT } from "@/lib/paths";
import { HeroWorkspace } from "@/components/HeroWorkspace";

export const dynamic = "force-dynamic";

function rel(p?: string) {
  if (!p) return undefined;
  return path.posix.relative(HEROANIM_ROOT.replace(/\\/g, "/"), p.replace(/\\/g, "/"));
}

export default async function HeroPage({ params }: { params: Promise<{ hero: string }> }) {
  invalidateScanCache();
  const { hero: heroParam } = await params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) notFound();

  const conceptMeta = getConceptMetaMap(hero.id);
  const clipMeta = getClipMetaMap(hero.id);

  const dto = {
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
              frameCount: cl.processed.frameCount ?? null,
            }
          : null,
        meta: clipMeta[cl.name] ?? {
          favorite: false,
          rating: null,
          notes: null,
          markedUpload: false,
          markedKey: false,
        },
      })),
    })),
  };

  return <HeroWorkspace initialHero={dto} />;
}
