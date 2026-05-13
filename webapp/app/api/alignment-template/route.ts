import fs from "node:fs";
import { NextResponse } from "next/server";
import { ALIGNMENT_TEMPLATE } from "@/lib/paths";

export const dynamic = "force-dynamic";

const DEFAULT = {
  eyeLevelY: 0.41,
  groundY: 0.88,
  centerX: 0.50,
  eyeRangeHalfWidth: 0.15,
  outputCanvas: { mode: "source" },
};

export async function GET() {
  if (!fs.existsSync(ALIGNMENT_TEMPLATE)) {
    return NextResponse.json({ template: DEFAULT, path: ALIGNMENT_TEMPLATE, fallback: true });
  }
  try {
    const tpl = JSON.parse(fs.readFileSync(ALIGNMENT_TEMPLATE, "utf8"));
    return NextResponse.json({ template: { ...DEFAULT, ...tpl }, path: ALIGNMENT_TEMPLATE, fallback: false });
  } catch (err: any) {
    return NextResponse.json({ error: `Failed to read template: ${err?.message ?? err}`, template: DEFAULT, fallback: true });
  }
}
