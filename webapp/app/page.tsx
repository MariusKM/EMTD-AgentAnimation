import { scanHeroes } from "@/lib/scan";
import { db } from "@/lib/db";
import { CharactersGrid } from "@/components/CharactersGrid";

export const dynamic = "force-dynamic";

export default async function HeroesPage() {
  const heroes = scanHeroes();
  const favCounts = db()
    .prepare("SELECT hero_id, COUNT(*) AS c FROM concept_meta WHERE favorite = 1 GROUP BY hero_id")
    .all() as any[];
  const favMap: Record<string, number> = {};
  for (const r of favCounts) favMap[r.hero_id] = r.c;

  // Hand off plain JSON to the client component (Hero objects carry non-
  // serializable methods at the type level but not at runtime; flatten anyway
  // so we only send what the grid actually renders).
  const items = heroes.map((h) => {
    const clipCount = h.concepts.reduce((acc, c) => acc + c.clips.length, 0);
    return {
      id: h.id,
      displayName: h.displayName,
      sourceImageRel: h.sourceImageRel,
      conceptCount: h.concepts.length,
      clipCount,
      fav: favMap[h.id] ?? 0,
    };
  });

  return <CharactersGrid items={items} />;
}
