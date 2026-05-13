import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getHero, invalidateScanCache } from "@/lib/scan";
import { OUTPUT_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

function resolvePromptPath(heroId: string, model: string, fileName: string): string {
  // Defend against path traversal: no slashes, no ..
  for (const seg of [model, fileName]) {
    if (seg.includes("/") || seg.includes("\\") || seg.includes("..")) {
      throw new Error("Invalid path segment");
    }
  }
  return path.posix.join(OUTPUT_ROOT, heroId, "Prompts", model, fileName);
}

export async function GET(_req: Request, ctx: { params: Promise<{ hero: string; model: string; fileName: string }> }) {
  const { hero: heroParam, model, fileName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  try {
    const full = resolvePromptPath(hero.id, decodeURIComponent(model), decodeURIComponent(fileName));
    if (!fs.existsSync(full)) return NextResponse.json({ error: "Not found", path: full }, { status: 404 });
    return NextResponse.json({ rawMarkdown: fs.readFileSync(full, "utf8"), path: full });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ hero: string; model: string; fileName: string }> }) {
  const { hero: heroParam, model, fileName } = await ctx.params;
  const hero = getHero(decodeURIComponent(heroParam));
  if (!hero) return NextResponse.json({ error: "Hero not found" }, { status: 404 });

  const body = await req.json();
  if (typeof body.rawMarkdown !== "string") {
    return NextResponse.json({ error: "rawMarkdown (string) required" }, { status: 400 });
  }

  try {
    const full = resolvePromptPath(hero.id, decodeURIComponent(model), decodeURIComponent(fileName));
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body.rawMarkdown, "utf8");
    invalidateScanCache();
    return NextResponse.json({ ok: true, rawMarkdown: body.rawMarkdown, path: full });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
