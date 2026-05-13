import { NextResponse } from "next/server";
import { JobKind, JobStatus, listJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const kind = url.searchParams.get("kind") as JobKind | null;
  const limit = parseInt(url.searchParams.get("limit") ?? "100", 10);
  const statusList = status ? (status.split(",") as JobStatus[]) : undefined;
  const jobs = listJobs({ status: statusList, kind: kind ?? undefined, limit });
  return NextResponse.json({ jobs });
}
