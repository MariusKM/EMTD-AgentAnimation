import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { getJobLogPath, listJobs, setStatus } from "./jobs";
import { BASH_BIN, FAL_UPLOAD_SCRIPT, OUTPUT_ROOT, SEEDANCE_SCRIPT } from "./paths";
import fsSync from "node:fs";
import pathMod from "node:path";
import { invalidateScanCache } from "./scan";
import { downloadToFile, falResult, falStatus } from "./fal";

let stopped = false;

export function startSeedancePoller() {
  if ((global as any).__emtdPollerStarted) return;
  (global as any).__emtdPollerStarted = true;

  const tick = async () => {
    if (stopped) return;
    try { await pollOnce(); } catch (err) { console.error("[poller] tick error", err); }
    setTimeout(tick, 10_000);
  };
  setTimeout(tick, 4000);
}

export function stopSeedancePoller() { stopped = true; }

async function pollOnce() {
  const jobs = listJobs({ status: ["running"], kind: "seedance", limit: 50 });
  if (jobs.length === 0) return;
  for (const job of jobs) {
    try {
      await pollSeedanceJob(job.id);
    } catch (err: any) {
      // Surface into the job log too — console-only would be invisible to the user.
      fs.appendFileSync(
        getJobLogPath(job.id),
        `[poll ${new Date().toISOString()}] EXCEPTION ${String(err?.stack ?? err?.message ?? err)}\n`,
      );
      console.error("[poller] tick error for job", job.id, err);
    }
  }
}

/**
 * Poll one seedance job once, updating its status in place.
 * Returns a structured summary of what happened (used by the manual /poll endpoint
 * to give the UI immediate feedback). Always appends to the job log.
 */
export async function pollSeedanceJob(jobId: string): Promise<{
  state: string | null;
  action: "completed" | "failed" | "in_progress" | "no_request_id" | "not_running" | "no_status_json";
  outputMp4?: string;
  raw?: string;
}> {
  const job = (listJobs({ limit: 200 })).find((j) => j.id === jobId);
  if (!job) throw new Error(`Job not found: ${jobId}`);
  const log = getJobLogPath(job.id);

  if (job.status !== "running") {
    fs.appendFileSync(log, `[poll ${new Date().toISOString()}] skipped — status=${job.status}\n`);
    return { state: null, action: "not_running" };
  }
  const reqId = job.result?.requestId;
  if (!reqId) {
    fs.appendFileSync(log, `[poll ${new Date().toISOString()}] no requestId in job.result\n`);
    return { state: null, action: "no_request_id" };
  }

  const tier: "pro" | "fast" = (job.result?.tier ?? job.payload?.tier ?? "pro") as "pro" | "fast";

  fs.appendFileSync(log, `[poll ${new Date().toISOString()}] GET status (tier=${tier} reqId=${reqId})\n`);
  const status = await falStatus(reqId, tier);
  fs.appendFileSync(log, `[poll status http=${status.httpCode} state=${status.state ?? "(none)"}]\n${status.body}\n`);

  if (status.httpCode >= 400 || !status.json) {
    setStatus(job.id, "error", {
      result: { ...job.result, stage: "poll_failed", httpCode: status.httpCode, body: status.body.slice(-2000) },
    });
    return { state: status.state, action: "failed", raw: status.body.slice(-1000) };
  }

  const state = status.state ?? "";

  if (state === "COMPLETED" || state === "OK" || state === "SUCCESS") {
    const heroId = job.hero_id!;
    const conceptId = job.concept_id!;
    const targetMp4 = nextIterationPath(heroId, conceptId);
    fs.appendFileSync(log, `[poll ${new Date().toISOString()}] COMPLETED — fetching result\n`);
    const result = await falResult(reqId, tier);
    fs.appendFileSync(log, `[poll result http=${result.httpCode}]\n${result.body}\n`);

    if (result.httpCode >= 400 || !result.videoUrl) {
      setStatus(job.id, "error", {
        result: { ...job.result, stage: "result_fetch_failed", httpCode: result.httpCode, body: result.body.slice(-2000) },
      });
      return { state, action: "failed", raw: result.body.slice(-1000) };
    }

    fs.appendFileSync(log, `[poll ${new Date().toISOString()}] downloading ${result.videoUrl} → ${targetMp4}\n`);
    const bytes = await downloadToFile(result.videoUrl, targetMp4);
    fs.appendFileSync(log, `[poll ${new Date().toISOString()}] wrote ${bytes} bytes to ${targetMp4}\n`);

    setStatus(job.id, "done", {
      result: {
        ...job.result,
        stage: "completed",
        finalUrl: result.videoUrl,
        outputMp4: targetMp4,
        fileExists: fs.existsSync(targetMp4),
        bytes,
      },
    });
    invalidateScanCache();
    return { state, action: "completed", outputMp4: targetMp4 };
  }

  if (state === "FAILED" || state === "ERROR") {
    setStatus(job.id, "error", { result: { ...job.result, stage: "failed", statusJson: status.json } });
    return { state, action: "failed" };
  }

  fs.appendFileSync(log, `[poll ${new Date().toISOString()}] state=${state || "unknown"} — still in progress\n`);
  return { state, action: "in_progress" };
}

function nextIterationPath(heroId: string, conceptId: string): string {
  const animDir = path.posix.join(OUTPUT_ROOT, heroId, "Animations");
  fs.mkdirSync(animDir, { recursive: true });
  let max = -1;
  for (const f of fs.readdirSync(animDir)) {
    const m = new RegExp(`^${conceptId}_(\\d+)\\.mp4$`, "i").exec(f);
    if (m) max = Math.max(max, parseInt(m[1], 10));
    const md = new RegExp(`^${conceptId}_(\\d+)$`, "i").exec(f);
    if (md) max = Math.max(max, parseInt(md[1], 10));
  }
  const next = max + 1;
  return path.posix.join(animDir, `${conceptId}_${next}.mp4`);
}

export function runSeedance(args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return runBash(SEEDANCE_SCRIPT, args, { env: extraFalEnv() });
}

export async function uploadToFal(localPath: string): Promise<string> {
  const res = await runBash(FAL_UPLOAD_SCRIPT, ["--file", localPath], { env: extraFalEnv() });
  if (res.code !== 0) throw new Error(`upload.sh failed (${res.code}): ${res.stderr.slice(-500)}`);
  // upload.sh prints the URL on the last non-empty line.
  const lines = res.stdout.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  const url = lines[lines.length - 1]?.trim();
  if (!url || !/^https?:\/\//.test(url)) {
    throw new Error(`upload.sh did not return a URL: ${res.stdout.slice(-500)}`);
  }
  return url;
}

/**
 * Resolve FAL_KEY from process.env first, then from any of the .env files the seedance
 * script itself searches (so a user who already set up the skill doesn't have to duplicate the key).
 * Returned object is meant to be merged into the spawn env.
 */
function extraFalEnv(): Record<string, string> {
  if (process.env.FAL_KEY && process.env.FAL_KEY.length > 0) {
    return { FAL_KEY: process.env.FAL_KEY };
  }
  const seedanceDir = pathMod.posix.dirname(SEEDANCE_SCRIPT.replace(/\\/g, "/"));
  const candidates = [
    pathMod.posix.join(seedanceDir, ".env"),                       // .../fal-seedance-2/scripts/.env
    pathMod.posix.join(seedanceDir, "..", ".env"),                 // .../fal-seedance-2/.env
    pathMod.posix.join(seedanceDir, "..", "..", ".env"),           // .../skills/.env
    pathMod.posix.join(seedanceDir, "..", "..", "..", ".env"),     // .../fal-api-skills/.env
  ];
  for (const cand of candidates) {
    if (!fsSync.existsSync(cand)) continue;
    try {
      const content = fsSync.readFileSync(cand, "utf8");
      const m = content.match(/^\s*FAL_KEY\s*=\s*(.*?)\s*$/m);
      if (m) {
        const val = m[1].replace(/^['"]|['"]$/g, "").trim();
        if (val) return { FAL_KEY: val };
      }
    } catch {}
  }
  return {};
}

function runBash(
  script: string,
  args: string[],
  opts: { env?: Record<string, string> } = {},
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    if (!fsSync.existsSync(BASH_BIN)) {
      resolve({
        code: -1,
        stdout: "",
        stderr: `bash binary not found at ${BASH_BIN}. Set BASH_BIN in .env.local to point to a real bash (e.g. Git Bash at "C:/Program Files/Git/usr/bin/bash.exe"). On Windows, do NOT use C:\\Windows\\System32\\bash.exe (that's WSL).`,
      });
      return;
    }
    const env = { ...process.env, ...(opts.env ?? {}) };
    // Non-interactive Git Bash doesn't source /etc/profile, so PATH lacks /usr/bin
    // (basename, curl, etc.) and mingw64/bin. Walk up from BASH_BIN looking for a "Git"
    // ancestor dir, then prepend its standard bin locations.
    if (process.platform === "win32") {
      const segs = BASH_BIN.replace(/\\/g, "/").split("/");
      const gitIdx = segs.findIndex((s) => s.toLowerCase() === "git");
      if (gitIdx > 0) {
        const gitRoot = segs.slice(0, gitIdx + 1).join("/");
        const extra = [
          pathMod.posix.join(gitRoot, "usr", "bin"),
          pathMod.posix.join(gitRoot, "mingw64", "bin"),
          pathMod.posix.join(gitRoot, "bin"),
        ].map((p) => p.replace(/\//g, "\\"));
        env.PATH = `${extra.join(";")};${env.PATH ?? env.Path ?? ""}`;
      }
    }
    const child = spawn(BASH_BIN, [script, ...args], { env, windowsHide: true });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (err) => resolve({ code: -1, stdout, stderr: stderr + String(err) }));
  });
}
