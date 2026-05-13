// Self-contained pipeline test.
// Re-implements the runBash + uploadToFal + parseRequestId + parseLastJson logic
// from lib/poller.ts EXACTLY (kept in sync — see comments) and runs the full
// upload → submit-async → poll-status → fetch-result chain against the dummy
// scripts in tests/fixtures/. No dev server, no DB, no Next.js — proves only
// that the bash/spawn/parsing layer works on Windows with Git Bash + PATH
// prepend + env injection.
//
// Run: node tests/test-pipeline.mjs

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// ─── Mirrors lib/paths.ts ──────────────────────────────────────────────────
const BASH_BIN = process.env.BASH_BIN || "C:/Program Files/Git/usr/bin/bash.exe";
const SEEDANCE_SCRIPT = path.posix.join(
  process.cwd().replace(/\\/g, "/"),
  "tests/fixtures/dummy-seedance.sh",
);
const UPLOAD_SCRIPT = path.posix.join(
  process.cwd().replace(/\\/g, "/"),
  "tests/fixtures/dummy-upload.sh",
);

// ─── Mirrors lib/poller.ts ─────────────────────────────────────────────────
function runBash(script, args, opts = {}) {
  return new Promise((resolve) => {
    if (!fs.existsSync(BASH_BIN)) {
      resolve({ code: -1, stdout: "", stderr: `bash not found at ${BASH_BIN}` });
      return;
    }
    const env = { ...process.env, ...(opts.env ?? {}) };
    if (process.platform === "win32" && /Git\/[^/]+\/bash\.exe$/i.test(BASH_BIN)) {
      const usrBinDir = path.posix.dirname(BASH_BIN);
      const gitRoot = path.posix.dirname(path.posix.dirname(usrBinDir));
      const extra = [
        usrBinDir,
        path.posix.join(gitRoot, "mingw64", "bin"),
        path.posix.join(gitRoot, "bin"),
      ].map((p) => p.replace(/\//g, "\\"));
      env.PATH = `${extra.join(";")};${env.PATH ?? env.Path ?? ""}`;
    }
    const child = spawn(BASH_BIN, [script, ...args], { env, windowsHide: true });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (err) => resolve({ code: -1, stdout, stderr: stderr + String(err) }));
  });
}

async function uploadToFal(localPath) {
  const res = await runBash(UPLOAD_SCRIPT, ["--file", localPath], {
    env: { FAL_KEY: "test-not-used-by-dummy" },
  });
  if (res.code !== 0) throw new Error(`upload.sh failed (${res.code}): ${res.stderr.slice(-500)}`);
  const lines = res.stdout.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  const url = lines[lines.length - 1]?.trim();
  if (!url || !/^https?:\/\//.test(url)) {
    throw new Error(`upload.sh did not return a URL: ${res.stdout.slice(-500)}`);
  }
  return url;
}

function runSeedance(args) {
  return runBash(SEEDANCE_SCRIPT, args, { env: { FAL_KEY: "test-not-used-by-dummy" } });
}

function parseRequestId(stdout) {
  const uuid = stdout.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuid) return uuid[0];
  const m = stdout.match(/"request_id"\s*:\s*"([^"]+)"/);
  if (m) return m[1];
  return null;
}

function parseLastJson(stdout) {
  const text = stdout.trim();
  let depth = 0, start = -1, lastStart = -1, lastEnd = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{") { if (depth === 0) start = i; depth++; }
    else if (c === "}") { depth--; if (depth === 0 && start !== -1) { lastStart = start; lastEnd = i + 1; } }
  }
  if (lastStart === -1) return null;
  try { return JSON.parse(text.slice(lastStart, lastEnd)); } catch { return null; }
}

// ─── Test runner ───────────────────────────────────────────────────────────
const errors = [];
let passed = 0;

function check(name, cond, detail) {
  if (cond) { console.log(`  PASS  ${name}`); passed++; }
  else { console.log(`  FAIL  ${name}${detail ? "  — " + detail : ""}`); errors.push(name); }
}

async function main() {
  console.log(`BASH_BIN          = ${BASH_BIN}`);
  console.log(`SEEDANCE_SCRIPT   = ${SEEDANCE_SCRIPT}`);
  console.log(`UPLOAD_SCRIPT     = ${UPLOAD_SCRIPT}`);
  console.log("");

  // Use a real PNG that exists on disk so the dummy upload can stat it
  const startPng = "../HeroAnimation/Output/Blacksmith/Blacksmith_FFLF.png";
  check("start image exists", fs.existsSync(startPng), startPng);

  // ─── 1) PATH prepend / basename / curl reachable ────────────────────────
  console.log("\n[1] PATH prepend — basename / curl visible from spawned bash");
  {
    const r = await runBash("-c", ["which basename && which curl && which jq || echo 'jq missing'"]);
    check("bash exited 0", r.code === 0, `code=${r.code} stderr=${r.stderr.slice(-200)}`);
    check("basename on PATH", /\/usr\/bin\/basename/.test(r.stdout), r.stdout.trim());
    check("curl on PATH",     /curl(\.exe)?$/m.test(r.stdout) || /\/curl/.test(r.stdout), r.stdout.trim());
    if (!/jq missing/.test(r.stdout)) {
      check("jq on PATH (optional but expected)", /jq(\.exe)?$/m.test(r.stdout) || /\/jq/.test(r.stdout), r.stdout.trim());
    } else {
      console.log("  WARN  jq not installed — real seedance/upload scripts need it");
    }
  }

  // ─── 2) FAL_KEY injection from opts.env ─────────────────────────────────
  console.log("\n[2] FAL_KEY injection via spawn env");
  {
    const r = await runBash("-c", ["echo \"key=$FAL_KEY\""], { env: { FAL_KEY: "abc123-test" } });
    check("FAL_KEY visible to script", /key=abc123-test/.test(r.stdout), r.stdout.trim());
  }

  // ─── 3) Dummy upload returns a URL ──────────────────────────────────────
  console.log("\n[3] uploadToFal");
  let endUrl;
  try {
    endUrl = await uploadToFal(startPng);
    check("upload returned https URL", /^https:\/\//.test(endUrl), endUrl);
  } catch (e) {
    check("upload did not throw", false, String(e.message ?? e));
  }

  // ─── 4) Submit async → parse request_id ─────────────────────────────────
  console.log("\n[4] runSeedance --async + parseRequestId");
  let requestId;
  {
    const args = [
      "--mode", "image-to-video",
      "--tier", "pro",
      "--file", startPng,
      "--end-image-url", endUrl ?? "https://fake/end.png",
      "--prompt", "test prompt body",
      "--duration", "5",
      "--aspect-ratio", "9:16",
      "--async",
    ];
    const r = await runSeedance(args);
    check("submit exited 0", r.code === 0, `code=${r.code} stderr=${r.stderr.slice(-200)}`);
    requestId = parseRequestId(r.stdout);
    check("parseRequestId found a uuid", !!requestId, requestId ?? "(null)");
    check("uuid format", /^[0-9a-f-]{36}$/i.test(requestId ?? ""), requestId ?? "");
  }

  // ─── 5) Status poll → parseLastJson sees state=COMPLETED ────────────────
  console.log("\n[5] runSeedance --status + parseLastJson");
  {
    const r = await runSeedance(["--status", requestId ?? "missing"]);
    check("status exited 0", r.code === 0);
    const j = parseLastJson(r.stdout);
    check("parseLastJson returned object", !!j, JSON.stringify(j));
    check("state == COMPLETED", j?.status === "COMPLETED" || j?.state === "COMPLETED", JSON.stringify(j));
  }

  // ─── 6) Result download writes the output file ──────────────────────────
  console.log("\n[6] runSeedance --result --output writes mp4");
  {
    const out = path.join(os.tmpdir(), `test-pipeline-${Date.now()}.mp4`).replace(/\\/g, "/");
    const r = await runSeedance(["--result", requestId ?? "missing", "--output", out]);
    check("result exited 0", r.code === 0, `code=${r.code} stderr=${r.stderr.slice(-200)}`);
    const j = parseLastJson(r.stdout);
    check("result JSON has video.url", !!j?.video?.url, JSON.stringify(j));
    check("output file written", fs.existsSync(out), out);
    if (fs.existsSync(out)) {
      const sz = fs.statSync(out).size;
      check("output file is non-empty", sz > 0, `${sz} bytes`);
      fs.unlinkSync(out);
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log(`\n${passed} passed, ${errors.length} failed`);
  if (errors.length > 0) {
    console.log("FAILED:", errors.join(", "));
    process.exit(1);
  }
}

main().catch((e) => { console.error("EXCEPTION:", e); process.exit(1); });
