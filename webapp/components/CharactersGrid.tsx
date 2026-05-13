"use client";
import Link from "next/link";

export type CharacterCard = {
  id: string;
  displayName: string;
  sourceImageRel?: string;
  conceptCount: number;
  clipCount: number;
  fav: number;
};

export function CharactersGrid({ items }: { items: CharacterCard[] }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Characters</h1>
          <p className="text-muted text-sm">
            {items.length} heroes · click to manage concepts &amp; animations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((h) => (
          <Link
            key={h.id}
            href={`/heroes/${encodeURIComponent(h.id)}`}
            className="group bg-panel border border-border hover:border-accent rounded-lg overflow-hidden transition-colors"
          >
            <div className="aspect-square bg-panel2 flex items-center justify-center overflow-hidden relative">
              {h.sourceImageRel ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/files/${encodeURI(h.sourceImageRel)}`}
                  alt={h.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="text-muted">No image</div>
              )}
            </div>
            <div className="p-3">
              <div className="font-medium">{h.displayName}</div>
              <div className="text-xs text-muted mt-1 flex gap-3">
                <span>{h.conceptCount} concepts</span>
                <span>{h.clipCount} clips</span>
                {h.fav > 0 && <span className="text-accent">★ {h.fav}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-muted text-sm mt-8">No characters found.</div>
      )}
    </div>
  );
}
