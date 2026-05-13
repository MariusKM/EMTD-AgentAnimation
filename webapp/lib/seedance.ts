import fs from "node:fs";
import { enqueueJob, getJobLogPath, setStatus } from "./jobs";
import { runSeedance, uploadToFal } from "./poller";

export type SubmitSeedanceInput = {
  heroId: string;
  conceptId: string;
  model: string;
  tier: "pro" | "fast";
  duration: number;
  aspect: string;
  promptFile?: string;          // optional, recorded for reference
  promptText: string;           // already-extracted body to send to the model
  startImage: string;           // absolute path to start frame on disk
  endImage: string;             // absolute path to end frame on disk
  seed?: number;                // optional reproducibility seed (32-bit integer); passed to fal as `seed`
};

/**
 * Enqueue a seedance job and kick off the async upload + submit chain.
 * Returns the new jobId synchronously; the actual fal submission happens
 * fire-and-forget. The poller (lib/poller.ts) will pick the running job
 * up on its next tick to check status / download the result.
 */
export function submitSeedanceJob(input: SubmitSeedanceInput): string {
  const job = enqueueJob({
    kind: "seedance",
    hero_id: input.heroId,
    concept_id: input.conceptId,
    payload: {
      mode: "image-to-video",
      model: input.model,
      tier: input.tier,
      duration: input.duration,
      aspect: input.aspect,
      promptFile: input.promptFile,
      promptText: input.promptText,
      startImage: input.startImage,
      endImage: input.endImage,
      sameImage: input.startImage === input.endImage,
      seed: input.seed,
    },
  });

  // fire-and-forget
  (async () => {
    const log = getJobLogPath(job.id);
    try {
      fs.appendFileSync(log, `[seedance prep] start=${input.startImage} end=${input.endImage}\n`);
      setStatus(job.id, "running", { result: { stage: "uploading_end_image" } });
      const endUrl = await uploadToFal(input.endImage);
      fs.appendFileSync(log, `[seedance prep] endImageUrl=${endUrl}\n`);

      const args = [
        "--mode", "image-to-video",
        "--tier", input.tier,
        "--file", input.startImage,
        "--end-image-url", endUrl,
        "--prompt", input.promptText,
        "--duration", String(input.duration),
        "--aspect-ratio", input.aspect,
        "--async",
      ];
      if (typeof input.seed === "number" && Number.isInteger(input.seed)) {
        args.push("--seed", String(input.seed));
      }
      fs.appendFileSync(log, `[seedance submit] ${JSON.stringify(args)}\n`);
      const result = await runSeedance(args);
      fs.appendFileSync(log, `[seedance stdout]\n${result.stdout}\n[stderr]\n${result.stderr}\n`);
      const requestId = parseRequestId(result.stdout);
      if (!requestId) {
        setStatus(job.id, "error", {
          result: { stage: "submit_failed", stderr: result.stderr.slice(-2000), stdout: result.stdout.slice(-2000) },
        });
        return;
      }
      setStatus(job.id, "running", {
        result: { stage: "submitted", requestId, tier: input.tier, mode: "image-to-video", endImageUrl: endUrl },
      });
    } catch (err: any) {
      fs.appendFileSync(log, `[seedance error] ${String(err?.stack ?? err?.message ?? err)}\n`);
      setStatus(job.id, "error", { result: { stage: "submit_exception", error: String(err?.message ?? err) } });
    }
  })();

  return job.id;
}

function parseRequestId(stdout: string): string | null {
  const uuid = stdout.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuid) return uuid[0];
  const m = stdout.match(/"request_id"\s*:\s*"([^"]+)"/);
  if (m) return m[1];
  return null;
}
