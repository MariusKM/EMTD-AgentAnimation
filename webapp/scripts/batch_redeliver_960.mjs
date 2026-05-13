// One-off: re-deliver every previously-delivered hero clip at 960 and upload
// the resulting WebM to <Hero>/Final_960/ on Drive.
//
// Source of truth = local HeroAnimation/Output/<Hero>/Final/*_final_<size>.webm
//
// Rules (per user 2026-05-11):
//   sizes={550}                 → ENCODE @960, then upload
//   sizes={...,960}             → SKIP encode, upload existing 960
//   sizes={550, X} where X≠960  → SKIP entirely (tuned overflow variant)
//
// Phase 1: queue deliver jobs.
// Phase 2: poll until queue drains.
// Phase 3: queue gdrive uploads (destination=Final_960; route filters webms by size).

import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUTPUT_ROOT = path.resolve(
  process.cwd(),
  "..",
  "HeroAnimation",
  "Output",
);

const PATTERN = /^(.+)_final_(\d+)\.webm$/;

function scanPlan() {
  const heroes = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const plan = []; // {hero, clip, action: "encode"|"upload-only"|"skip", sizes}
  for (const hero of heroes) {
    const finalDir = path.join(OUTPUT_ROOT, hero, "Final");
    if (!fs.existsSync(finalDir)) continue;
    const clips = new Map(); // clip -> Set<size>
    for (const fn of fs.readdirSync(finalDir)) {
      const m = PATTERN.exec(fn);
      if (!m) continue;
      const clip = m[1];
      const size = Number(m[2]);
      if (!clips.has(clip)) clips.set(clip, new Set());
      clips.get(clip).add(size);
    }
    for (const [clip, sizeSet] of [...clips.entries()].sort()) {
      const sizes = [...sizeSet].sort((a, b) => a - b);
      let action;
      if (sizeSet.has(960)) action = "upload-only";
      else if (sizes.length === 1 && sizes[0] === 550) action = "encode";
      else action = "skip";
      plan.push({ hero, clip, action, sizes });
    }
  }
  return plan;
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data };
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function waitForJob(jobId, label) {
  const startedAt = Date.now();
  while (true) {
    const r = await getJSON(`${BASE}/api/jobs/${jobId}`);
    const status = r?.job?.status;
    if (status === "done") return { ok: true };
    if (status === "error" || status === "cancelled") {
      return { ok: false, status, result: r?.job?.result };
    }
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
    process.stdout.write(`\r  [${label}] ${status} (${elapsed}s elapsed) `);
    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function main() {
  const plan = scanPlan();
  const toEncode = plan.filter((p) => p.action === "encode");
  const uploadOnly = plan.filter((p) => p.action === "upload-only");
  const skipped = plan.filter((p) => p.action === "skip");

  console.log(`Plan: encode=${toEncode.length}, upload-only=${uploadOnly.length}, skip=${skipped.length}`);
  if (skipped.length > 0) {
    console.log("Skipped (overflow variants):");
    for (const s of skipped) console.log(`  ${s.hero}/${s.clip} sizes=${JSON.stringify(s.sizes)}`);
  }

  // -- Phase 1: queue deliver jobs (one POST per hero, batch of clips). --
  console.log(`\n=== Phase 1: queue ${toEncode.length} deliver jobs (size=960) ===`);
  const deliverJobIds = []; // {jobId, hero, clip}
  const byHero = new Map();
  for (const p of toEncode) {
    if (!byHero.has(p.hero)) byHero.set(p.hero, []);
    byHero.get(p.hero).push(p.clip);
  }
  for (const [hero, clips] of byHero) {
    const body = {
      clips: clips.map((c) => ({ heroId: hero, clipName: c })),
      size: 960,
      allowUnaligned: false,
    };
    const r = await postJSON(`${BASE}/api/jobs/deliver`, body);
    if (!r.ok) {
      console.log(`  [${hero}] HTTP ${r.status} ${JSON.stringify(r.data)}`);
      continue;
    }
    const { enqueued = [], errors = [] } = r.data ?? {};
    console.log(`  [${hero}] enqueued=${enqueued.length} errors=${errors.length}`);
    for (const e of enqueued) deliverJobIds.push({ jobId: e.jobId, hero, clip: e.clipName });
    for (const e of errors) console.log(`    ERROR ${e.clipName}: ${e.error}`);
  }

  // -- Phase 2: poll until each deliver job finishes. The worker is single-slot
  // for deliver, so jobs serialize naturally. We poll them in submission order. --
  console.log(`\n=== Phase 2: wait for ${deliverJobIds.length} deliver jobs ===`);
  const deliverResults = []; // {hero, clip, ok, error?}
  for (let i = 0; i < deliverJobIds.length; i++) {
    const j = deliverJobIds[i];
    const label = `${i + 1}/${deliverJobIds.length} ${j.hero}/${j.clip}`;
    const r = await waitForJob(j.jobId, label);
    process.stdout.write("\n");
    if (r.ok) {
      console.log(`  ✓ ${j.hero}/${j.clip}`);
      deliverResults.push({ hero: j.hero, clip: j.clip, ok: true });
    } else {
      console.log(`  ✗ ${j.hero}/${j.clip} status=${r.status} result=${JSON.stringify(r.result)}`);
      deliverResults.push({ hero: j.hero, clip: j.clip, ok: false, error: r.result });
    }
  }

  // -- Phase 3: upload to Final_960. Combine the freshly-encoded clips and the
  // pre-existing 960 clips. One gdrive job per hero (the route filters by size). --
  console.log(`\n=== Phase 3: upload to Final_960/ ===`);
  const uploadByHero = new Map();
  for (const r of deliverResults.filter((d) => d.ok)) {
    if (!uploadByHero.has(r.hero)) uploadByHero.set(r.hero, []);
    uploadByHero.get(r.hero).push(r.clip);
  }
  for (const p of uploadOnly) {
    if (!uploadByHero.has(p.hero)) uploadByHero.set(p.hero, []);
    uploadByHero.get(p.hero).push(p.clip);
  }

  const uploadJobIds = [];
  for (const [hero, clips] of uploadByHero) {
    const body = {
      heroId: hero,
      clipNames: clips,
      fileKind: "deliveredWebm",
      destination: "Final_960",
    };
    const r = await postJSON(`${BASE}/api/jobs/gdrive`, body);
    if (!r.ok) {
      console.log(`  [${hero}] HTTP ${r.status} ${JSON.stringify(r.data)}`);
      continue;
    }
    console.log(`  [${hero}] gdrive job ${r.data.jobId} clips=${clips.length} enqueued=${r.data.enqueued}`);
    uploadJobIds.push({ jobId: r.data.jobId, hero });
  }

  console.log(`\n=== Phase 4: wait for ${uploadJobIds.length} upload jobs ===`);
  for (let i = 0; i < uploadJobIds.length; i++) {
    const j = uploadJobIds[i];
    const label = `${i + 1}/${uploadJobIds.length} ${j.hero}`;
    const r = await waitForJob(j.jobId, label);
    process.stdout.write("\n");
    if (r.ok) console.log(`  ✓ ${j.hero}`);
    else console.log(`  ✗ ${j.hero} ${JSON.stringify(r.result)}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
