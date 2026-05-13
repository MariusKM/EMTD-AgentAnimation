import { randomUUID } from "node:crypto";
import { db, logPath } from "./db";

export type JobKind =
  | "seedance"
  | "key+compose"
  | "gdrive-upload"
  | "deliver"
  | "preview-stitch";
export type JobStatus = "queued" | "running" | "done" | "error" | "cancelled";

export type Job = {
  id: string;
  kind: JobKind;
  status: JobStatus;
  hero_id: string | null;
  concept_id: string | null;
  clip_name: string | null;
  payload: any;
  result: any;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  pid: number | null;
};

function rowToJob(r: any): Job {
  return {
    id: r.id,
    kind: r.kind,
    status: r.status,
    hero_id: r.hero_id,
    concept_id: r.concept_id,
    clip_name: r.clip_name,
    payload: r.payload_json ? JSON.parse(r.payload_json) : null,
    result: r.result_json ? JSON.parse(r.result_json) : null,
    created_at: r.created_at,
    started_at: r.started_at,
    finished_at: r.finished_at,
    pid: r.pid,
  };
}

export function enqueueJob(input: {
  kind: JobKind;
  hero_id?: string;
  concept_id?: string;
  clip_name?: string;
  payload?: any;
}): Job {
  const id = randomUUID();
  db()
    .prepare(
      `INSERT INTO jobs (id, kind, status, hero_id, concept_id, clip_name, payload_json)
       VALUES (?, ?, 'queued', ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.kind,
      input.hero_id ?? null,
      input.concept_id ?? null,
      input.clip_name ?? null,
      input.payload ? JSON.stringify(input.payload) : null,
    );
  return getJob(id)!;
}

export function getJob(id: string): Job | null {
  const r = db().prepare("SELECT * FROM jobs WHERE id = ?").get(id) as any;
  return r ? rowToJob(r) : null;
}

export function listJobs(filter?: { status?: JobStatus[]; kind?: JobKind; limit?: number }): Job[] {
  const where: string[] = [];
  const args: any[] = [];
  if (filter?.status?.length) {
    where.push(`status IN (${filter.status.map(() => "?").join(",")})`);
    args.push(...filter.status);
  }
  if (filter?.kind) {
    where.push("kind = ?");
    args.push(filter.kind);
  }
  const sql =
    "SELECT * FROM jobs" +
    (where.length ? " WHERE " + where.join(" AND ") : "") +
    " ORDER BY created_at DESC LIMIT " + (filter?.limit ?? 200);
  const rows = db().prepare(sql).all(...args) as any[];
  return rows.map(rowToJob);
}

export function setStatus(id: string, status: JobStatus, patch?: { result?: any; pid?: number | null }) {
  const now = new Date().toISOString();
  const startedAt = status === "running" ? now : null;
  const finishedAt = ["done", "error", "cancelled"].includes(status) ? now : null;

  const sets: string[] = ["status = ?"];
  const args: any[] = [status];
  if (startedAt) {
    sets.push("started_at = COALESCE(started_at, ?)");
    args.push(startedAt);
  }
  if (finishedAt) {
    sets.push("finished_at = ?");
    args.push(finishedAt);
  }
  if (patch?.result !== undefined) {
    sets.push("result_json = ?");
    args.push(JSON.stringify(patch.result));
  }
  if (patch?.pid !== undefined) {
    sets.push("pid = ?");
    args.push(patch.pid);
  }
  db().prepare(`UPDATE jobs SET ${sets.join(", ")} WHERE id = ?`).run(...args, id);
}

export function getJobLogPath(id: string): string {
  return logPath(id);
}
