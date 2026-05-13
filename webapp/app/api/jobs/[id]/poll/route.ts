import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";
import { pollSeedanceJob } from "@/lib/poller";

export const dynamic = "force-dynamic";

// Manual re-poll for seedance jobs whose worker exited (timeout, crash) but
// whose fal request_id may still complete.
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    if (job.kind === "seedance") {
      const summary = await pollSeedanceJob(id);
      return NextResponse.json({ ok: true, ...summary });
    }
    return NextResponse.json(
      { error: `Manual poll not supported for ${job.kind}. Supported kinds: seedance.` },
      { status: 400 },
    );
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
