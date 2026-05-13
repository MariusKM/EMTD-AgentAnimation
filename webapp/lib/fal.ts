import fs from "node:fs";
import path from "node:path";
import { SEEDANCE_SCRIPT } from "./paths";

/**
 * Direct HTTP client for fal's queue API. The seedance shell script builds
 * the wrong URL for status/result (includes /image-to-video suffix, which
 * returns 405) — so we go directly to fal here for polling and result fetch.
 * Submission still goes through the script (it handles the upload + jq parsing).
 */

function falBase(tier: "pro" | "fast"): string {
  return tier === "fast"
    ? "https://queue.fal.run/bytedance/seedance-2.0/fast"
    : "https://queue.fal.run/bytedance/seedance-2.0";
}

export type FalStatus = {
  httpCode: number;
  body: string;
  json: any | null;
  state: string | null;          // "COMPLETED" / "IN_PROGRESS" / "IN_QUEUE" / "FAILED" / null
};

export async function falStatus(reqId: string, tier: "pro" | "fast"): Promise<FalStatus> {
  const apiKey = getFalKey();
  if (!apiKey) throw new Error("FAL_KEY not set (in process.env or any of the skill .env locations)");
  const url = `${falBase(tier)}/requests/${encodeURIComponent(reqId)}/status?logs=1`;
  const res = await fetch(url, { headers: { Authorization: `Key ${apiKey}` } });
  const body = await res.text();
  let json: any = null;
  try { json = JSON.parse(body); } catch {}
  const state = (json?.status ?? json?.state ?? null) as string | null;
  return { httpCode: res.status, body, json, state: state ? String(state).toUpperCase() : null };
}

export type FalResult = {
  httpCode: number;
  body: string;
  json: any | null;
  videoUrl: string | null;
};

export async function falResult(reqId: string, tier: "pro" | "fast"): Promise<FalResult> {
  const apiKey = getFalKey();
  if (!apiKey) throw new Error("FAL_KEY not set");
  const url = `${falBase(tier)}/requests/${encodeURIComponent(reqId)}`;
  const res = await fetch(url, { headers: { Authorization: `Key ${apiKey}` } });
  const body = await res.text();
  let json: any = null;
  try { json = JSON.parse(body); } catch {}
  return { httpCode: res.status, body, json, videoUrl: json?.video?.url ?? null };
}

export async function downloadToFile(url: string, destPath: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.byteLength;
}

/**
 * Same lookup the spawn helpers use: prefer process.env, fall back to scanning
 * the skill's .env locations.
 */
export function getFalKey(): string {
  if (process.env.FAL_KEY && process.env.FAL_KEY.length > 0) return process.env.FAL_KEY;
  const seedanceDir = path.posix.dirname(SEEDANCE_SCRIPT.replace(/\\/g, "/"));
  const candidates = [
    path.posix.join(seedanceDir, ".env"),
    path.posix.join(seedanceDir, "..", ".env"),
    path.posix.join(seedanceDir, "..", "..", ".env"),
    path.posix.join(seedanceDir, "..", "..", "..", ".env"),
  ];
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    try {
      const m = fs.readFileSync(c, "utf8").match(/^\s*FAL_KEY\s*=\s*(.*?)\s*$/m);
      if (m) {
        const v = m[1].replace(/^['"]|['"]$/g, "").trim();
        if (v) return v;
      }
    } catch {}
  }
  return "";
}
