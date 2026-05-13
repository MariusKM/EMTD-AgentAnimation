import { NextResponse } from "next/server";
import { getJob, setStatus } from "@/lib/jobs";
import { cancelActive } from "@/lib/worker";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (job.status === "queued") {
    setStatus(id, "cancelled", { result: { ...(job.result ?? {}), reason: "cancelled before start" } });
    return NextResponse.json({ ok: true, status: "cancelled" });
  }
  if (job.status === "running" && job.kind === "key+compose") {
    const ok = cancelActive(id);
    if (ok) return NextResponse.json({ ok: true, status: "cancelling" });
    setStatus(id, "cancelled", { result: { ...(job.result ?? {}), reason: "no active child found" } });
    return NextResponse.json({ ok: true, status: "cancelled" });
  }
  // For seedance jobs, mark cancelled (fal job continues but we ignore the result).
  setStatus(id, "cancelled", { result: { ...(job.result ?? {}), reason: "user cancelled" } });
  return NextResponse.json({ ok: true, status: "cancelled" });
}
