import path from "node:path";
import fs from "node:fs";
import { db } from "./db";
import { ensureHeroSubfolder, uploadOrReplaceFile } from "./gdrive";
import { getJob, getJobLogPath, listJobs, setStatus } from "./jobs";
import { spawnLogged } from "./shell";
import { ALIGNMENT_TEMPLATE, COMPOSE_PYTHON, COMPOSE_SCRIPT, DELIVER_WEBM_SCRIPT, KEYCLIPS_PYTHON, KEYCLIPS_SCRIPT, OUTPUT_ROOT, STITCH_PREVIEW_SCRIPT, SWAP_BG_SCRIPT } from "./paths";
import { spawnSync } from "node:child_process";
import { invalidateScanCache } from "./scan";

let running = false;
let activePid: number | null = null;
let activeChild: import("node:child_process").ChildProcess | null = null;
let activeJobId: string | null = null;
let stopped = false;

let uploadRunning = false;
let deliverRunning = false;
let stitchRunning = false;

export function startWorker() {
  if ((global as any).__emtdWorkerStarted) return;
  (global as any).__emtdWorkerStarted = true;

  // Recover orphaned 'running' jobs from a previous process.
  const orphans = db()
    .prepare(
      "SELECT id, kind FROM jobs WHERE status = 'running' AND kind IN ('key+compose', 'gdrive-upload', 'deliver', 'preview-stitch')",
    )
    .all() as any[];
  for (const o of orphans) {
    setStatus(o.id, "error", { result: { error: "Process restarted while job was running" } });
  }

  const tick = async () => {
    if (stopped) return;
    if (!running) await pickAndRun();
    setTimeout(tick, 1500);
  };
  tick();

  // Separate loop for gdrive-upload (network-bound, can run alongside keying).
  const uploadTick = async () => {
    if (stopped) return;
    if (!uploadRunning) await pickAndRunUpload();
    setTimeout(uploadTick, 2000);
  };
  uploadTick();

  // Separate loop for deliver (ffmpeg VP8 encode — CPU-only, safe alongside keying).
  const deliverTick = async () => {
    if (stopped) return;
    if (!deliverRunning) await pickAndRunDeliver();
    setTimeout(deliverTick, 1500);
  };
  deliverTick();

  // Separate loop for preview-stitch (ffmpeg H.264 encode — CPU-only, safe alongside keying).
  const stitchTick = async () => {
    if (stopped) return;
    if (!stitchRunning) await pickAndRunStitch();
    setTimeout(stitchTick, 1500);
  };
  stitchTick();
}

export function stopWorker() { stopped = true; }

export function getActive(): { jobId: string | null; pid: number | null } {
  return { jobId: activeJobId, pid: activePid };
}

export function cancelActive(jobId: string): boolean {
  if (activeJobId !== jobId || !activeChild) return false;
  try { activeChild.kill("SIGTERM"); } catch {}
  return true;
}

async function pickAndRun() {
  const queued = listJobs({ status: ["queued"], kind: "key+compose", limit: 1 });
  if (queued.length === 0) return;
  const job = queued[0];
  running = true;
  activeJobId = job.id;
  try {
    await runKeyCompose(job.id);
  } catch (err: any) {
    setStatus(job.id, "error", { result: { error: String(err?.message ?? err) } });
  } finally {
    running = false;
    activeJobId = null;
    activePid = null;
    activeChild = null;
    invalidateScanCache();
  }
}

async function pickAndRunDeliver() {
  const queued = listJobs({ status: ["queued"], kind: "deliver", limit: 1 });
  if (queued.length === 0) return;
  const job = queued[0];
  deliverRunning = true;
  try {
    await runDeliver(job.id);
  } catch (err: any) {
    setStatus(job.id, "error", { result: { error: String(err?.message ?? err) } });
  } finally {
    deliverRunning = false;
    invalidateScanCache();
  }
}

async function runDeliver(jobId: string) {
  const job = getJob(jobId);
  if (!job) return;
  const payload = job.payload as {
    heroId: string;
    clipName: string;
    inputMov: string;
    outputWebm: string;
    size: number;
    edgeFade?: number;
    overflowSize?: number | null;
  };
  const logFile = getJobLogPath(jobId);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, `[start deliver] ${JSON.stringify(payload)}\n`);

  if (!fs.existsSync(payload.inputMov)) {
    setStatus(jobId, "error", { result: { error: `Input MOV missing: ${payload.inputMov}` } });
    return;
  }

  // Pull audio from the raw Seedance mp4 if present. The aligned .mov is RGBA PNG-in-MOV
  // and never has audio; the raw generation mp4 is where SFX lives.
  const rawMp4 = path.posix.join(OUTPUT_ROOT, payload.heroId, "Animations", `${payload.clipName}.mp4`);
  const hasRaw = fs.existsSync(rawMp4);
  if (!hasRaw) fs.appendFileSync(logFile, `[audio] raw mp4 not found at ${rawMp4} — encoding silent\n`);

  const overflow = payload.overflowSize ?? 0;
  const useOverflow = overflow > payload.size;

  // For overflow delivery: re-run compose_frames with a padded canvas so the
  // affine transform extends past the standard template canvas boundary —
  // this preserves any animation that overshoots the slot (raised swords,
  // big VFX) instead of cropping it. Then deliver_webm encodes the padded
  // MOV directly to overflow_size; no internal pad in deliver is needed.
  let inputMov = payload.inputMov;
  let deliverSize = payload.size;
  if (useOverflow) {
    const clipDir = path.posix.join(OUTPUT_ROOT, payload.heroId, "Animations", payload.clipName);
    const T = getAlignedCanvasSize(clipDir);
    const D = payload.size;
    const O = overflow;
    const pad = Math.round((T * (O - D)) / (2 * D));
    fs.appendFileSync(logFile, `[overflow] T=${T} D=${D} O=${O} canvas_pad=${pad}\n`);

    setStatus(jobId, "running", { result: { stage: "padding", canvas_pad: pad } });
    const sizeFactor = getHeroSizeFactor(payload.heroId);
    const composeArgs: string[] = [
      COMPOSE_SCRIPT, clipDir, "--fps", "24",
      "--align-to-template",
      "--canvas-pad", String(pad),
      "--output-suffix", "_padded",
      "--size-factor", String(sizeFactor),
    ];
    if (fs.existsSync(ALIGNMENT_TEMPLATE)) {
      composeArgs.push("--template", ALIGNMENT_TEMPLATE);
    }
    const composeRun = spawnLogged(COMPOSE_PYTHON, composeArgs, { logPath: logFile });
    const composeResult = await composeRun.done;
    if (composeResult.code !== 0) {
      setStatus(jobId, "error", {
        result: { stage: "padding", code: composeResult.code, stderr: composeResult.stderrTail },
      });
      return;
    }
    const paddedMov = path.posix.join(clipDir, `${payload.clipName}_fg_alpha_aligned_padded.mov`);
    if (!fs.existsSync(paddedMov)) {
      setStatus(jobId, "error", {
        result: { stage: "padding", error: `Padded MOV not produced at ${paddedMov}` },
      });
      return;
    }
    inputMov = paddedMov;
    deliverSize = overflow;
  }

  setStatus(jobId, "running", { result: { stage: "encoding", size: deliverSize } });

  const args = [
    DELIVER_WEBM_SCRIPT,
    inputMov,
    "--size", String(deliverSize),
    "--output", payload.outputWebm,
  ];
  if (hasRaw) args.push("--audio-source", rawMp4);
  const fade = payload.edgeFade ?? 0;
  if (fade > 0) args.push("--edge-fade", String(fade));
  const run = spawnLogged(COMPOSE_PYTHON, args, { logPath: logFile });
  const result = await run.done;

  if (result.code !== 0) {
    setStatus(jobId, "error", { result: { stage: "encoding", code: result.code, stderr: result.stderrTail } });
    return;
  }
  setStatus(jobId, "done", { result: { stage: "done", outputWebm: payload.outputWebm } });
}

async function pickAndRunStitch() {
  const queued = listJobs({ status: ["queued"], kind: "preview-stitch", limit: 1 });
  if (queued.length === 0) return;
  const job = queued[0];
  stitchRunning = true;
  try {
    await runStitch(job.id);
  } catch (err: any) {
    setStatus(job.id, "error", { result: { error: String(err?.message ?? err) } });
  } finally {
    stitchRunning = false;
    invalidateScanCache();
  }
}

async function runStitch(jobId: string) {
  const job = getJob(jobId);
  if (!job) return;
  const payload = job.payload as {
    heroId: string;
    clipPaths: string[];
    loops: number[];
    fades?: number[];
    overflows?: number[];
    contentSize?: number;
    mockup: string;
    slot: { x: number; y: number; w: number; h: number };
    outputPath: string;
  };
  const logFile = getJobLogPath(jobId);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, `[start preview-stitch] ${JSON.stringify(payload)}\n`);

  for (const p of payload.clipPaths) {
    if (!fs.existsSync(p)) {
      setStatus(jobId, "error", { result: { error: `Clip missing: ${p}` } });
      return;
    }
  }
  if (!fs.existsSync(payload.mockup)) {
    setStatus(jobId, "error", { result: { error: `Mockup missing: ${payload.mockup}` } });
    return;
  }

  setStatus(jobId, "running", { result: { stage: "encoding" } });

  const slotStr = `${Math.round(payload.slot.x)},${Math.round(payload.slot.y)},${Math.round(payload.slot.w)},${Math.round(payload.slot.h)}`;
  const args = [
    STITCH_PREVIEW_SCRIPT,
    "--clips", payload.clipPaths.join(","),
    "--loops", payload.loops.join(","),
    "--mockup", payload.mockup,
    `--slot=${slotStr}`,
    "--output", payload.outputPath,
  ];
  const fades = payload.fades ?? [];
  if (fades.length && fades.some(f => f > 0)) {
    args.push("--edge-fades", fades.join(","));
  }
  const overflows = payload.overflows ?? [];
  if (overflows.length && overflows.some(o => o > 0)) {
    args.push("--overflow-sizes", overflows.join(","));
  }
  if (payload.contentSize) args.push("--content-size", String(payload.contentSize));
  const run = spawnLogged(COMPOSE_PYTHON, args, { logPath: logFile });
  const result = await run.done;

  if (result.code !== 0) {
    setStatus(jobId, "error", { result: { stage: "encoding", code: result.code, stderr: result.stderrTail } });
    return;
  }
  setStatus(jobId, "done", { result: { stage: "done", outputPath: payload.outputPath } });
}

async function pickAndRunUpload() {
  const queued = listJobs({ status: ["queued"], kind: "gdrive-upload", limit: 1 });
  if (queued.length === 0) return;
  const job = queued[0];
  uploadRunning = true;
  try {
    await runGDriveUpload(job.id);
  } catch (err: any) {
    setStatus(job.id, "error", { result: { error: String(err?.message ?? err) } });
  } finally {
    uploadRunning = false;
  }
}

async function runGDriveUpload(jobId: string) {
  const job = getJob(jobId);
  if (!job) return;
  const payload = job.payload as {
    heroId: string;
    items: { clipName: string; localPath: string; driveName?: string; destination?: string }[];
    destination?: string;
    rootFolderId?: string;
  };
  const batchDestination = payload.destination ?? "Final";
  const logFile = getJobLogPath(jobId);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, `[start gdrive-upload] hero=${payload.heroId} dest=${batchDestination} items=${payload.items.length}\n`);

  setStatus(jobId, "running", { result: { stage: "uploading", total: payload.items.length, done: 0 } });

  const folderCache = new Map<string, string>();
  const resolveFolder = async (dest: string): Promise<string> => {
    const cached = folderCache.get(dest);
    if (cached) return cached;
    const id = await ensureHeroSubfolder(payload.heroId, dest, payload.rootFolderId);
    folderCache.set(dest, id);
    return id;
  };

  let firstParentId: string;
  try {
    firstParentId = await resolveFolder(batchDestination);
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    fs.appendFileSync(logFile, `[auth-error] ${msg}\n`);
    setStatus(jobId, "error", { result: { stage: "auth", error: msg } });
    return;
  }

  const uploaded: { name: string; id: string; size: number; destination: string }[] = [];
  const failed: { clipName: string; error: string }[] = [];
  for (let i = 0; i < payload.items.length; i++) {
    const it = payload.items[i];
    const driveName = it.driveName ?? path.posix.basename(it.localPath);
    const itemDest = it.destination ?? batchDestination;
    try {
      const parentId = itemDest === batchDestination ? firstParentId : await resolveFolder(itemDest);
      const res = await uploadOrReplaceFile(it.localPath, parentId, driveName);
      uploaded.push({ name: res.name, id: res.id, size: res.size, destination: itemDest });
      const verb = res.replaced ? "replaced" : "uploaded";
      fs.appendFileSync(logFile, `[ok] ${verb} ${driveName} → ${itemDest}/${res.id} (${res.size} bytes)\n`);
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      failed.push({ clipName: it.clipName, error: msg });
      fs.appendFileSync(logFile, `[fail] ${driveName}: ${msg}\n`);
    }
    setStatus(jobId, "running", {
      result: { stage: "uploading", total: payload.items.length, done: i + 1 },
    });
  }

  setStatus(jobId, failed.length > 0 && uploaded.length === 0 ? "error" : "done", {
    result: {
      stage: "done",
      uploaded,
      failed,
      destinations: Array.from(folderCache.entries()).map(([dest, id]) => ({ dest, id })),
    },
  });
}

async function runKeyCompose(jobId: string) {
  const job = getJob(jobId);
  if (!job) return;
  const payload = job.payload as {
    rawMp4: string;
    outputDir: string;
    clipName: string;
    heroId: string;
    despill?: number;
    alphaMode?: "birefnet+chroma" | "birefnet" | "chroma";
    screenColor?: "green" | "blue";
    rerun?: boolean;
    alignToTemplate?: boolean;
    skipKeying?: boolean;
  };

  const logFile = getJobLogPath(jobId);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, `[start key+compose] ${JSON.stringify(payload)}\n`);

  if (payload.rerun && !payload.skipKeying && fs.existsSync(payload.outputDir)) {
    fs.rmSync(payload.outputDir, { recursive: true, force: true });
    fs.appendFileSync(logFile, `[rerun] wiped ${payload.outputDir}\n`);
  }

  if (!payload.skipKeying) {
    setStatus(jobId, "running", { result: { stage: "keying" } });
    fs.mkdirSync(payload.outputDir, { recursive: true });

    const despill = typeof payload.despill === "number" ? payload.despill : 0.3;
    const alphaMode = payload.alphaMode ?? "birefnet+chroma";
    const screenColor = payload.screenColor === "blue" ? "blue" : "green";

    let keyInput = payload.rawMp4;
    let swappedTempMp4: string | null = null;
    if (screenColor === "blue") {
      swappedTempMp4 = path.posix.join(payload.outputDir, "_bgswap_input.mp4");
      fs.appendFileSync(logFile, `[blue-screen] pre-swap B<->G via ffmpeg → ${swappedTempMp4}\n`);
      const swap = spawnSync(
        "ffmpeg",
        [
          "-y",
          "-i", payload.rawMp4,
          "-vf", "colorchannelmixer=rr=1:rg=0:rb=0:gr=0:gg=0:gb=1:br=0:bg=1:bb=0",
          "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
          "-pix_fmt", "yuv420p",
          "-an",
          swappedTempMp4,
        ],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      if (swap.status !== 0) {
        const stderrTail = (swap.stderr ?? Buffer.alloc(0)).toString("utf8").slice(-2000);
        fs.appendFileSync(logFile, `[blue-screen] pre-swap ffmpeg failed (code=${swap.status})\n${stderrTail}\n`);
        setStatus(jobId, "error", {
          result: { stage: "blue-pre-swap", code: swap.status, stderr: stderrTail },
        });
        return;
      }
      keyInput = swappedTempMp4;
    }

    const keyArgs = [
      KEYCLIPS_SCRIPT,
      "-i", keyInput,
      "-o", payload.outputDir,
      "--alpha", alphaMode,
      "--despill", String(despill),
      "--chroma-subtract-channel", "green",
    ];
    const keyRun = spawnLogged(KEYCLIPS_PYTHON, keyArgs, { logPath: logFile });
    activeChild = keyRun.child;
    activePid = keyRun.child.pid ?? null;
    setStatus(jobId, "running", { pid: activePid, result: { stage: "keying", pid: activePid, screen: screenColor } });

    const keyResult = await keyRun.done;
    if (keyResult.code !== 0) {
      if (stopped || activeChild === null) {
        setStatus(jobId, "cancelled", { result: { stage: "keying", code: keyResult.code } });
      } else {
        setStatus(jobId, "error", { result: { stage: "keying", code: keyResult.code, stderr: keyResult.stderrTail } });
      }
      return;
    }

    if (swappedTempMp4) {
      try { fs.rmSync(swappedTempMp4, { force: true }); } catch {}
    }

    if (screenColor === "blue") {
      setStatus(jobId, "running", { result: { stage: "blue-post-swap" } });
      const swapDirs = ["FG", "Comp", "Processed"]
        .map((d) => path.posix.join(payload.outputDir, d))
        .filter((d) => fs.existsSync(d));
      if (swapDirs.length > 0) {
        fs.appendFileSync(logFile, `[blue-screen] post-swap B<->G on ${swapDirs.join(", ")}\n`);
        const swapBack = spawnLogged(COMPOSE_PYTHON, [SWAP_BG_SCRIPT, ...swapDirs], { logPath: logFile });
        const swapBackResult = await swapBack.done;
        if (swapBackResult.code !== 0) {
          setStatus(jobId, "error", {
            result: { stage: "blue-post-swap", code: swapBackResult.code, stderr: swapBackResult.stderrTail },
          });
          return;
        }
      }
    }
  } else {
    fs.appendFileSync(logFile, `[skip-keying] reusing existing Processed/ frames in ${payload.outputDir}\n`);
  }

  setStatus(jobId, "running", { result: { stage: "compose" } });
  const composeArgs = [COMPOSE_SCRIPT, payload.outputDir, "--fps", "24"];
  if (payload.alignToTemplate) {
    composeArgs.push("--align-to-template");
    if (fs.existsSync(ALIGNMENT_TEMPLATE)) {
      composeArgs.push("--template", ALIGNMENT_TEMPLATE);
    }
    const sizeFactor = getHeroSizeFactor(payload.heroId);
    composeArgs.push("--size-factor", String(sizeFactor));
  }
  const composeRun = spawnLogged(COMPOSE_PYTHON, composeArgs, { logPath: logFile });
  activeChild = composeRun.child;
  activePid = composeRun.child.pid ?? null;
  setStatus(jobId, "running", { pid: activePid, result: { stage: "compose", pid: activePid } });

  const composeResult = await composeRun.done;
  if (composeResult.code !== 0) {
    setStatus(jobId, "error", { result: { stage: "compose", code: composeResult.code, stderr: composeResult.stderrTail } });
    return;
  }

  const outputs: any = {};
  for (const f of fs.readdirSync(payload.outputDir)) {
    if (f.endsWith("_fg_alpha.mov")) outputs.fgAlphaMov = path.posix.join(payload.outputDir, f);
    else if (f.endsWith("_fg_alpha.mp4")) outputs.fgAlphaMp4 = path.posix.join(payload.outputDir, f);
    else if (f.endsWith("_comp.mp4")) outputs.compMp4 = path.posix.join(payload.outputDir, f);
  }
  setStatus(jobId, "done", { result: { stage: "done", outputs } });
}

export type KeyComposePayload = {
  rawMp4: string;
  outputDir: string;
  clipName: string;
  heroId: string;
  despill?: number;
  alphaMode?: "birefnet+chroma" | "birefnet" | "chroma";
  screenColor?: "green" | "blue";
  rerun?: boolean;
  alignToTemplate?: boolean;
  skipKeying?: boolean;
};

export function buildKeyComposePayload(
  heroId: string,
  clipName: string,
  opts: {
    despill?: number;
    alphaMode?: "birefnet+chroma" | "birefnet" | "chroma";
    screenColor?: "green" | "blue";
    alignToTemplate?: boolean;
    skipKeying?: boolean;
  } = {},
): KeyComposePayload {
  const heroDir = path.posix.join(OUTPUT_ROOT, heroId);
  const rawMp4 = path.posix.join(heroDir, "Animations", `${clipName}.mp4`);
  if (!fs.existsSync(rawMp4)) throw new Error(`Raw clip not found: ${rawMp4}`);
  const outputDir = path.posix.join(heroDir, "Animations", clipName);
  return {
    rawMp4,
    outputDir,
    clipName,
    heroId,
    despill: opts.despill,
    alphaMode: opts.alphaMode,
    screenColor: opts.screenColor,
    alignToTemplate: opts.alignToTemplate,
    skipKeying: opts.skipKeying,
  };
}

function getHeroSizeFactor(heroId: string): number {
  try {
    if (!fs.existsSync(ALIGNMENT_TEMPLATE)) return 1.0;
    const j = JSON.parse(fs.readFileSync(ALIGNMENT_TEMPLATE, "utf8"));
    const factors = (j?.sizeFactors ?? {}) as Record<string, number>;
    const heroSizes = (j?.heroSizes ?? {}) as Record<string, string>;
    const needle = heroId.toLowerCase();
    let sizeName = "medium";
    for (const [name, value] of Object.entries(heroSizes)) {
      if (name.toLowerCase() === needle) {
        sizeName = value;
        break;
      }
    }
    const f = factors[sizeName];
    if (typeof f === "number" && Number.isFinite(f) && f > 0) return f;
  } catch {}
  return 1.0;
}

function getAlignedCanvasSize(clipDir: string): number {
  try {
    if (fs.existsSync(ALIGNMENT_TEMPLATE)) {
      const j = JSON.parse(fs.readFileSync(ALIGNMENT_TEMPLATE, "utf8"));
      const canvas = j?.outputCanvas;
      if (canvas?.mode === "template" && Number.isFinite(canvas?.width)) {
        return Number(canvas.width);
      }
    }
  } catch {}
  try {
    const processed = path.posix.join(clipDir, "Processed");
    if (fs.existsSync(processed)) {
      const files = fs.readdirSync(processed).filter(f => f.endsWith(".png")).sort();
      if (files.length > 0) {
        const fd = fs.openSync(path.posix.join(processed, files[0]), "r");
        const buf = Buffer.alloc(24);
        fs.readSync(fd, buf, 0, 24, 0);
        fs.closeSync(fd);
        const w = buf.readUInt32BE(16);
        if (w > 0) return w;
      }
    }
  } catch {}
  return 960;
}
