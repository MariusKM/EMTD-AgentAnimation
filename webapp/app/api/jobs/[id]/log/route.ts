import fs from "node:fs";
import { NextResponse } from "next/server";
import { getJobLogPath } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const p = getJobLogPath(id);
  if (!fs.existsSync(p)) return new Response("", { headers: { "Content-Type": "text/plain" } });
  // Return last ~200 KB
  const stat = fs.statSync(p);
  const start = Math.max(0, stat.size - 200_000);
  const buf = fs.readFileSync(p);
  return new Response(buf.subarray(start).toString("utf8"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
