import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getHero } from "@/lib/scan";
import { HEROANIM_ROOT, OUTPUT_ROOT, SOURCE_HEROES } from "@/lib/paths";
import { submitSeedanceJob } from "@/lib/seedance";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const heroId: string = body.heroId;
  const conceptId: string = body.conceptId;
  const promptFileName: string | undefined = body.promptFile;
  const model: string = body.model ?? "Seedance";
  const tier: "pro" | "fast" = body.tier ?? "pro";
  const duration: number = body.duration ?? 5;
  const aspect: string = body.aspect ?? "9:16";
  const startImageRel: string | undefined = body.startImageRel;
  const endImageRel: string | undefined = body.endImageRel;
  const sourceImagePath: string | undefined = body.sourceImagePath;

  const hero = getHero(heroId);
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  let promptText = body.promptText as string | undefined;
  if (!promptText) {
    if (!promptFileName) {
      return NextResponse.json({ error: "Provide promptText or promptFile" }, { status: 400 });
    }
    const promptPath = path.posix.join(OUTPUT_ROOT, hero.id, "Prompts", model, promptFileName);
    if (!fs.existsSync(promptPath)) {
      return NextResponse.json({ error: `Prompt file not found: ${promptPath}` }, { status: 404 });
    }
    promptText = extractPromptText(fs.readFileSync(promptPath, "utf8"));
  }
  if (!promptText) {
    return NextResponse.json({ error: "Empty prompt text" }, { status: 400 });
  }

  function resolveRel(rel: string | undefined): string | null {
    if (!rel) return null;
    const abs = path.posix.join(HEROANIM_ROOT.replace(/\\/g, "/"), rel);
    return fs.existsSync(abs) ? abs : null;
  }

  const startImage =
    resolveRel(startImageRel) ??
    sourceImagePath ??
    hero.sourceImagePath ??
    path.posix.join(SOURCE_HEROES, `${hero.id}.png`);
  if (!startImage || !fs.existsSync(startImage)) {
    return NextResponse.json({ error: `Start image not found: ${startImage}` }, { status: 400 });
  }
  const endImage = resolveRel(endImageRel) ?? startImage;
  if (!fs.existsSync(endImage)) {
    return NextResponse.json({ error: `End image not found: ${endImage}` }, { status: 400 });
  }

  const jobId = submitSeedanceJob({
    heroId: hero.id,
    conceptId,
    model,
    tier,
    duration,
    aspect,
    promptFile: promptFileName,
    promptText,
    startImage,
    endImage,
  });

  return NextResponse.json({ jobId, status: "queued" });
}

function extractPromptText(md: string): string {
  // Convention: prompt files have a metadata header (title, source image, duration, aspect),
  // a `---` separator, then the structured prompt body (Subject/Action/Camera/Style/Sound/Constraints).
  // Send only the body — metadata is for the human author and would just confuse the model.
  const sepMatch = md.match(/^---\s*$/m);
  let body = sepMatch ? md.slice(sepMatch.index! + sepMatch[0].length) : md;
  body = body
    .split(/\r?\n/)
    .filter((l) => !/^#+\s/.test(l))
    .join("\n");
  return body.trim();
}
