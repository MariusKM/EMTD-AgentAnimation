import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";
import { getHero } from "@/lib/scan";
import { HEROANIM_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type FileKind = "deliveredWebm" | "fgAlphaMov" | "fgAlphaMp4" | "compMp4" | "rawMp4";
type Destination = "Final" | "Final_960" | "Previs";

const VALID_DESTINATIONS: ReadonlySet<Destination> = new Set(["Final", "Final_960", "Previs"]);

// Routes a delivered .webm to a Drive subfolder by its embedded size suffix
// (`<clip>_final_<size>.webm`). 960 → Final_960, anything else → Final.
function destinationForWebm(filename: string): "Final" | "Final_960" {
  const m = filename.match(/_final_(\d+)\.webm$/i);
  if (m && Number(m[1]) >= 960) return "Final_960";
  return "Final";
}

function resolveAbs(rel: string | undefined): string | null {
  if (!rel) return null;
  const abs = path.posix.join(HEROANIM_ROOT.replace(/\\/g, "/"), rel);
  return fs.existsSync(abs) ? abs : null;
}

export async function POST(req: Request) {
  const body = await req.json();
  const heroId: string = body.heroId;
  const clipNames: string[] = Array.isArray(body.clipNames) ? body.clipNames : [];
  const fileKind: FileKind = body.fileKind ?? "fgAlphaMov";
  const requestedDestination: Destination | "Auto" =
    body.destination === "Auto" ? "Auto"
    : VALID_DESTINATIONS.has(body.destination) ? (body.destination as Destination)
    : "Final";
  if (!heroId || clipNames.length === 0) {
    return NextResponse.json({ error: "heroId and clipNames[] are required" }, { status: 400 });
  }

  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const items: { clipName: string; localPath: string; driveName: string; destination: Destination }[] = [];
  const missing: string[] = [];
  for (const name of clipNames) {
    let clip: any = null;
    for (const c of hero.concepts) {
      const found = c.clips.find((cl) => cl.name === name);
      if (found) { clip = found; break; }
    }
    if (!clip) { missing.push(name); continue; }

    if (fileKind === "deliveredWebm") {
      // One clip may have multiple delivered WebMs (e.g. 550 + 960). For "Auto",
      // route each file to Final/Final_960 by its `_final_<size>.webm` suffix.
      // For explicit Final / Final_960, only include webms that *belong* to that
      // size bucket so a "send to Final_960" request never accidentally re-uploads
      // the 550 alongside (and vice versa). Previs gets all webms — it's a
      // catch-all sharing folder.
      const allWebms = (clip.processed?.deliveredWebms ?? []).filter((w: any) => w?.path && fs.existsSync(w.path));
      if (allWebms.length === 0) { missing.push(name); continue; }
      let added = 0;
      for (const w of allWebms) {
        const driveName = path.posix.basename(w.path);
        const naturalDest = destinationForWebm(driveName);
        let dest: Destination;
        if (requestedDestination === "Auto") {
          dest = naturalDest;
        } else if (requestedDestination === "Previs") {
          dest = "Previs";
        } else {
          // Explicit Final or Final_960 — filter out non-matching sizes.
          if (naturalDest !== requestedDestination) continue;
          dest = requestedDestination;
        }
        items.push({ clipName: name, localPath: w.path, driveName, destination: dest });
        added++;
      }
      if (added === 0) missing.push(name);
      continue;
    }

    let absPath: string | null = null;
    let suffix = "";
    if (fileKind === "fgAlphaMov") {
      absPath = clip.processed?.fgAlphaMov ?? null;
      suffix = "_fg_alpha.mov";
    } else if (fileKind === "fgAlphaMp4") {
      // Prefer aligned mp4, fall back to un-aligned. Suffix tracks which was chosen so
      // re-uploads of the same kind replace in-place but mixing aligned/un-aligned uploads
      // remain distinguishable in Drive.
      if (clip.processed?.fgAlphaMp4Aligned) {
        absPath = clip.processed.fgAlphaMp4Aligned;
        suffix = "_fg_alpha_aligned.mp4";
      } else if (clip.processed?.fgAlphaMp4) {
        absPath = clip.processed.fgAlphaMp4;
        suffix = "_fg_alpha.mp4";
      }
    } else if (fileKind === "compMp4") {
      absPath = clip.processed?.compMp4 ?? null;
      suffix = "_comp.mp4";
    } else if (fileKind === "rawMp4") {
      absPath = clip.rawMp4 ?? null;
      suffix = ".mp4";
    }

    if (!absPath || !fs.existsSync(absPath)) { missing.push(name); continue; }
    // Non-webm kinds don't have a meaningful 960 split — Auto falls back to Final
    // (deliverables) or whatever was explicitly requested.
    const dest: Destination = requestedDestination === "Auto" ? "Final" : requestedDestination;
    items.push({ clipName: name, localPath: absPath, driveName: `${name}${suffix}`, destination: dest });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "No uploadable files resolved", missing }, { status: 400 });
  }

  // Worker still accepts a batch-level destination as a fallback when an item omits
  // its own — use the first item's resolved destination for back-compat / logging.
  const batchDestination: Destination = items[0].destination;

  const job = enqueueJob({
    kind: "gdrive-upload",
    hero_id: hero.id,
    payload: { heroId: hero.id, fileKind, destination: batchDestination, items },
  });

  return NextResponse.json({ jobId: job.id, enqueued: items.length, missing });
}

