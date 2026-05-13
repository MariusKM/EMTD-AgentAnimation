import fs from "node:fs";
import path from "node:path";
import { OUTPUT_ROOT, SOURCE_HEROES } from "./paths";
import { ConceptBlock, readConcepts } from "./concepts";

export type ProcessedClip = {
  fgAlphaMov?: string;
  fgAlphaMp4?: string;
  compMp4?: string;
  fgAlphaMovAligned?: string;
  fgAlphaMp4Aligned?: string;
  deliveredWebms?: { size: number; path: string }[];
  frameCount?: number;
  hasAnchors?: boolean;
};

export type Clip = {
  name: string;          // "P1_0"
  conceptId: string;     // "P1"
  iter: number;          // 0
  rawMp4?: string;       // absolute fs path
  processedDir?: string; // absolute fs path
  processed?: ProcessedClip;
};

export type PromptFile = {
  model: string;
  fileName: string;
  fullPath: string;
  rawMarkdown: string;
};

export type Concept = ConceptBlock & {
  promptFiles: PromptFile[];
  clips: Clip[];
};

export type FFLFImage = {
  name: string;       // file name, e.g. "Blacksmith_FFLF.png" or "New_King_FFLF_1.png"
  index: number | null; // numeric suffix if present (..._FFLF_2.png → 2), else null
  fullPath: string;
  relPath: string;    // path relative to HEROANIM_ROOT for /api/files
};

export type Hero = {
  id: string;             // canonical: matches Output dir name (e.g. "Blacksmith", "New_King")
  displayName: string;    // "Blacksmith", "New King"
  sourceImagePath?: string;
  sourceImageRel?: string; // path relative to HEROANIM_ROOT for /api/files
  conceptsMdPath?: string;
  outputDir?: string;
  fflfs: FFLFImage[];
  concepts: Concept[];
};

const CLIP_RE = /^([PI]\d+)_(\d+)\.mp4$/i;
const CLIP_DIR_RE = /^([PI]\d+)_(\d+)$/i;

let _cache: { at: number; data: Hero[] } | null = null;
const CACHE_MS = 3000;

export function invalidateScanCache() { _cache = null; }

export function scanHeroes(): Hero[] {
  if (_cache && Date.now() - _cache.at < CACHE_MS) return _cache.data;

  const heroes = new Map<string, Hero>();

  // 1. Discover from Source/Heroes Stylized/*.png — the canonical 16 heroes
  //    (including Dragon).
  if (fs.existsSync(SOURCE_HEROES)) {
    for (const f of fs.readdirSync(SOURCE_HEROES)) {
      if (!f.toLowerCase().endsWith(".png")) continue;
      if (f.toLowerCase().includes("copy")) continue;
      const base = f.replace(/\.png$/i, "");
      const id = base;
      if (heroes.has(id.toLowerCase())) continue;
      heroes.set(id.toLowerCase(), {
        id,
        displayName: base.replace(/_/g, " "),
        sourceImagePath: path.posix.join(SOURCE_HEROES, f),
        sourceImageRel: `Source/Heroes Stylized/${f}`,
        fflfs: [],
        concepts: [],
      });
    }
  }

  // 2. Walk Output/<Hero>/ to attach concepts + clips.
  if (fs.existsSync(OUTPUT_ROOT)) {
    for (const dir of fs.readdirSync(OUTPUT_ROOT)) {
      if (dir.startsWith("_") || dir.startsWith(".")) continue;
      const heroDir = path.posix.join(OUTPUT_ROOT, dir);
      if (!fs.statSync(heroDir).isDirectory()) continue;

      const key = dir.toLowerCase();
      let hero = heroes.get(key);
      if (!hero) {
        // Output-only entries (Output/<Id>/ with no matching Source/ PNG).
        hero = { id: dir, displayName: dir.replace(/_/g, " "), fflfs: [], concepts: [] };
        heroes.set(key, hero);
      }
      hero.outputDir = heroDir;

      // FFLF images at hero output root: <Hero>_FFLF.png, <Hero>_FFLF_<N>.png (case-insensitive)
      const fflfRe = new RegExp(`^${escapeRe(hero.id)}_FFLF(?:_(\\d+))?\\.png$`, "i");
      for (const f of fs.readdirSync(heroDir)) {
        const m = fflfRe.exec(f);
        if (!m) continue;
        const full = path.posix.join(heroDir, f);
        if (!fs.statSync(full).isFile()) continue;
        hero.fflfs.push({
          name: f,
          index: m[1] ? parseInt(m[1], 10) : null,
          fullPath: full,
          relPath: `Output/${hero.id}/${f}`,
        });
      }
      hero.fflfs.sort((a, b) => (a.index ?? -1) - (b.index ?? -1) || a.name.localeCompare(b.name));

      const conceptsMd = path.posix.join(heroDir, "concepts.md");
      if (fs.existsSync(conceptsMd)) {
        hero.conceptsMdPath = conceptsMd;
        const blocks = readConcepts(conceptsMd);
        hero.concepts = blocks.map(b => ({ ...b, promptFiles: [], clips: [] }));
      }

      // Prompt files per model
      const promptsDir = path.posix.join(heroDir, "Prompts");
      if (fs.existsSync(promptsDir)) {
        for (const model of fs.readdirSync(promptsDir)) {
          const modelDir = path.posix.join(promptsDir, model);
          if (!fs.statSync(modelDir).isDirectory()) continue;
          for (const pf of fs.readdirSync(modelDir)) {
            if (!pf.toLowerCase().endsWith(".md")) continue;
            // Match prompt file to concept by leading "P#_" or "I#_"
            const idMatch = /^([PI]\d+)/i.exec(pf);
            if (!idMatch) continue;
            const cid = idMatch[1].toUpperCase();
            const concept = hero.concepts.find(c => c.id === cid);
            if (concept) {
              const fullPath = path.posix.join(modelDir, pf);
              let rawMarkdown = "";
              try { rawMarkdown = fs.readFileSync(fullPath, "utf8"); } catch {}
              concept.promptFiles.push({
                model,
                fileName: pf,
                fullPath,
                rawMarkdown,
              });
            }
          }
        }
      }

      // Animation clips
      const animDir = path.posix.join(heroDir, "Animations");
      if (fs.existsSync(animDir)) {
        const clipsByName = new Map<string, Clip>();

        for (const e of fs.readdirSync(animDir)) {
          const full = path.posix.join(animDir, e);
          const stat = fs.statSync(full);

          if (stat.isFile()) {
            const m = CLIP_RE.exec(e);
            if (!m) continue;
            const conceptId = m[1].toUpperCase();
            const iter = parseInt(m[2], 10);
            const name = `${conceptId}_${iter}`;
            const c = clipsByName.get(name) ?? { name, conceptId, iter };
            c.rawMp4 = full;
            clipsByName.set(name, c);
          } else if (stat.isDirectory()) {
            const m = CLIP_DIR_RE.exec(e);
            if (!m) continue;
            const conceptId = m[1].toUpperCase();
            const iter = parseInt(m[2], 10);
            const name = `${conceptId}_${iter}`;
            const c = clipsByName.get(name) ?? { name, conceptId, iter };
            c.processedDir = full;
            const proc: ProcessedClip = {};
            for (const pf of fs.readdirSync(full)) {
              // Order matters: check aligned variants first since they also end with _fg_alpha.mov/.mp4.
              if (pf.endsWith("_fg_alpha_aligned.mov")) proc.fgAlphaMovAligned = path.posix.join(full, pf);
              else if (pf.endsWith("_fg_alpha_aligned.mp4")) proc.fgAlphaMp4Aligned = path.posix.join(full, pf);
              else if (pf.endsWith("_fg_alpha.mov")) proc.fgAlphaMov = path.posix.join(full, pf);
              else if (pf.endsWith("_fg_alpha.mp4")) proc.fgAlphaMp4 = path.posix.join(full, pf);
              else if (pf.endsWith("_comp.mp4")) proc.compMp4 = path.posix.join(full, pf);
            }
            proc.hasAnchors = fs.existsSync(path.posix.join(full, "anchors.json"));
            const procFrames = path.posix.join(full, "Processed");
            if (fs.existsSync(procFrames)) {
              try { proc.frameCount = fs.readdirSync(procFrames).filter(x => x.endsWith(".png")).length; } catch {}
            }
            c.processed = proc;
            clipsByName.set(name, c);
          }
        }

        // Attach clips to their concepts
        for (const clip of clipsByName.values()) {
          const concept = hero.concepts.find(c => c.id === clip.conceptId);
          if (concept) concept.clips.push(clip);
        }

        // Scan Output/<Hero>/Final/ and attach delivered WebMs to the matching clips.
        // Filename shape: <ClipName>_final_<size>.webm  (e.g. I1_0_final_550.webm)
        const finalDir = path.posix.join(heroDir, "Final");
        if (fs.existsSync(finalDir)) {
          const finalRe = /^([PI]\d+_\d+)_final_(\d+)\.webm$/i;
          for (const f of fs.readdirSync(finalDir)) {
            const m = finalRe.exec(f);
            if (!m) continue;
            const clip = clipsByName.get(m[1]) ?? clipsByName.get(m[1].toUpperCase());
            if (!clip) continue;
            clip.processed ??= {};
            clip.processed.deliveredWebms ??= [];
            clip.processed.deliveredWebms.push({
              size: parseInt(m[2], 10),
              path: path.posix.join(finalDir, f),
            });
          }
          for (const clip of clipsByName.values()) {
            if (clip.processed?.deliveredWebms) {
              clip.processed.deliveredWebms.sort((a, b) => a.size - b.size);
            }
          }
        }
        for (const concept of hero.concepts) {
          concept.clips.sort((a, b) => b.iter - a.iter);
        }
      }
    }
  }

  const list = Array.from(heroes.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  _cache = { at: Date.now(), data: list };
  return list;
}

export function getHero(heroId: string): Hero | undefined {
  return scanHeroes().find(h => h.id.toLowerCase() === heroId.toLowerCase());
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
