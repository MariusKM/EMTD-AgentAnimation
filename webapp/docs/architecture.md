# Architecture

## Big picture

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Browser (React, App Router)                       │
│   /  /heroes/[hero]  /jobs                                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP (Range for video, JSON for everything else)
┌──────────────────────────────▼──────────────────────────────────────┐
│                      Next.js server (Node)                          │
│                                                                     │
│   route handlers ──► lib/scan.ts ──► HeroAnimation/ filesystem      │
│         │                                                           │
│         ├──────────► lib/db.ts ───► data/app.db (SQLite)            │
│         │                                                           │
│         ├──────────► lib/jobs.ts (enqueue) ──► jobs table           │
│         │                                                           │
│         ├──────────► lib/seedance.ts (submitSeedanceJob) ──► fal    │
│         │                                                           │
│         └──────────► lib/concepts.ts / meta.ts (writes back to fs)  │
│                                                                     │
│   instrumentation.ts (boot)                                         │
│         ├──────────► lib/worker.ts   (single-slot, key+compose)     │
│         └──────────► lib/poller.ts   (every 10s, fal seedance)      │
│                                                                     │
│   HTTP out:                                                         │
│   lib/fal.ts ──► https://queue.fal.run/... (status / result / DL)   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ child_process.spawn(BASH_BIN, [...])
                ┌──────────────┼──────────────┬───────────────────┐
                ▼              ▼              ▼                   ▼
        seedance-video.sh   upload.sh    batch_pipeline.py   compose_frames.py
        --async submit      (fal CDN)    (CorridorKey venv)  (project venv)
```

**Split responsibility for fal:**
- **Submission** (upload end image, POST to queue) still goes through the bash scripts — they handle multipart upload and are easier than re-implementing.
- **Status + result + download** bypass the script and go through `lib/fal.ts` with Node's `fetch`. This is historical: the script's status URL is buggy (includes `/image-to-video` which returns HTTP 405), so we go direct. It's also faster (no bash spawn per poll tick).

## Source-of-truth split

The app maintains a strict separation:

| Kind of state | Lives in | Owner |
|---|---|---|
| Hero portraits | `Source/Heroes Stylized/<Hero>.png` | art team |
| Concept docs | `Output/<Hero>/concepts.md` | you (editable in-app) |
| Prompt files | `Output/<Hero>/Prompts/<Model>/<ConceptID>_*.md` | you (editable in-app) |
| FFLF images | `Output/<Hero>/<Hero>_FFLF[_N].png` | you (built in-app) |
| Raw greenscreen videos | `Output/<Hero>/Animations/<ConceptID>_<iter>.mp4` | fal seedance |
| Keyed frame sequences | `Output/<Hero>/Animations/<ConceptID>_<iter>/{FG,Matte,Comp,Processed}/` | CorridorKey |
| Composited outputs | `Output/<Hero>/Animations/<ConceptID>_<iter>/<ClipName>_fg_alpha.{mov,mp4}` | compose-frames |
| Alignment anchors | `Output/<Hero>/Animations/<ConceptID>_<iter>/anchors.json` | detect_anchors / the app (manual override) |
| Aligned outputs | `Output/<Hero>/Animations/<ConceptID>_<iter>/<ClipName>_fg_alpha_aligned.{mov,mp4}` | compose-frames (`--align-to-template`) |
| Final delivery WebMs | `Output/<Hero>/Final/<ClipName>_final_<size>.webm` | deliver_webm (ffmpeg VP8 + alpha + Vorbis audio muxed from the raw Seedance mp4) |
| Shareable stitched previews | `Output/<Hero>/Final/<Hero>_preview_*.mp4` | stitch_preview (ffmpeg H.264 + AAC, mockup baked in) |
| Hero Screen mockup | `HeroAnimation/HeroScreen.png` | project (opaque mobile-screen reference used as preview background) |
| Alignment template | `HeroAnimation/character-alignment.{png,json}` | project (canonical) |
| Favorites / ratings / notes | `data/app.db` (SQLite) | the app |
| Job queue + history + fal request_ids | `data/app.db` (SQLite) | the app |
| Job stdout/stderr logs | `data/logs/<jobId>.log` | the app |
| Mockup character-slot rect | `data/app.db` → `app_config.mockup_slot_rect` | the app (set from the preview modal's placement editor) |

**The app never copies, mirrors, or duplicates content.** Everything in `HeroAnimation/` stays where it is. The DB only stores metadata and references.

## Module map (lib/)

| Module | Responsibility |
|---|---|
| [paths.ts](../lib/paths.ts) | All filesystem roots, env-driven. Exports `HEROANIM_ROOT`, `OUTPUT_ROOT`, `SOURCE_HEROES`, `BASH_BIN`, plus paths to the seedance / upload / keying / compose scripts and venvs. |
| [db.ts](../lib/db.ts) | better-sqlite3 singleton. Enables WAL mode. Runs idempotent schema migrations on first call. Tables: `concept_meta`, `clip_meta`, `jobs`, `app_config` (generic key → JSON store for app-wide settings like the mockup slot rect). |
| [config.ts](../lib/config.ts) | Typed accessors over `app_config`. `getMockupSlot()` / `setMockupSlot()` read/write the normalized rect with clamping (size `0..5`, pos `-5..5`) so the preview modal's scale slider and drag can safely go beyond the mockup bounds. |
| [scan.ts](../lib/scan.ts) | Walks `Source/Heroes Stylized/*.png` and `Output/*` to build the in-memory `Hero[]` tree (concepts, prompts with rawMarkdown, clips, FFLFs). Cached for 3 seconds; `invalidateScanCache()` flushes it. |
| [concepts.ts](../lib/concepts.ts) | Parses `concepts.md` into addressable blocks (`### P#` / `#### P#`). `writeConceptBlock(file, conceptId, newRawMarkdown)` rewrites a single block in place, preserving everything else byte-for-byte. |
| [meta.ts](../lib/meta.ts) | Concept and clip metadata CRUD against SQLite. Always merges with existing values so a partial PATCH doesn't clobber other fields. |
| [jobs.ts](../lib/jobs.ts) | Job queue: `enqueueJob`, `getJob`, `listJobs`, `setStatus`. `setStatus` automatically sets `started_at` on first transition to `running` and `finished_at` on terminal states. |
| [shell.ts](../lib/shell.ts) | `spawnLogged()` wrapper: runs a child process, tee's stdout/stderr to a file, returns both the live `child` handle (for cancellation) and a promise resolving on exit with the tail of stdout/stderr. Used by the key+compose worker. |
| [worker.ts](../lib/worker.ts) | Four independent loops: (1) **key+compose** — single-slot, GPU-bound; (2) **gdrive-upload** — network-bound, single-slot; (3) **deliver** — CPU-bound ffmpeg VP8 encode, single-slot, runs alongside keying; (4) **preview-stitch** — CPU-bound ffmpeg H.264 encode of concatenated webms over the mockup, single-slot. Each polls `jobs` for its own `kind`. Holds a reference to the active child for cancellation on the key+compose loop. Recovers orphan `running` jobs on boot for all four kinds. |
| [poller.ts](../lib/poller.ts) | Spawns bash (`BASH_BIN` with Git `usr/bin`, `mingw64/bin`, `bin` prepended to PATH) for `runSeedance(--async)` and `uploadToFal()`. Hosts the auto-poll loop (every 10s) + the reusable `pollSeedanceJob(id)` used by the manual `/api/jobs/[id]/poll` endpoint. |
| [seedance.ts](../lib/seedance.ts) | `submitSeedanceJob(input)` — the shared enqueue + upload + POST chain used by both `/api/jobs/seedance` (initial submit) and `/api/jobs/[id]/rerun` (re-submit). Keeps the two code paths in sync. |
| [fal.ts](../lib/fal.ts) | Direct HTTP client for fal queue (`falStatus`, `falResult`, `downloadToFile`, `getFalKey`). Used for status/result/download because the shell script's status URL is broken. `getFalKey()` prefers `process.env` and falls back to scanning `.env` next to the skill scripts. |
| [gdrive.ts](../lib/gdrive.ts) | Service-account-authed Google Drive client (`getDrive`, `ensureHeroFolder`, `ensureHeroSubfolder`, `ensureFinalFolder`, `uploadOrReplaceFile`). `ensureSubfolder` is the shared list-or-create primitive; results cache per-process so repeat uploads don't re-list. `ensureHeroSubfolder(heroId, name)` is the parametric form used by the worker to dispatch into `Final/` or `Previs/` based on the upload's destination. `uploadOrReplaceFile` looks up a same-name non-trashed sibling first and `files.update`s contents in place when one exists, preserving file ID + share link + version history; otherwise `files.create`. All calls pass `supportsAllDrives: true` so the Shared Drive root works. |

## Concept markdown round-trip

`Output/<Hero>/concepts.md` is sectioned by headings like `### P1: Royal Salute` or `#### P1: Ground Slam`. The parser ([lib/concepts.ts](../lib/concepts.ts)) walks line-by-line:

1. A line matching `^#{3,4}\s+([PI])(\d+)\s*[:\-—]\s*(.+)\s*$` opens a new block.
2. A line matching `^##\s` (a top-level section) or a standalone `---` closes the current block.
3. The block's body is captured between the heading line and the close line.

Editing a single block ([writeConceptBlock](../lib/concepts.ts)) finds the block by ID, walks back to drop trailing blank lines, and replaces only that slice. The rest of the file (`## Reference`, `## Approved Shortlist`, follow-ups, deferred concepts) is preserved verbatim. EOL style is detected (CRLF vs LF) and preserved.

## Prompt markdown convention

Every prompt file follows:

```
# <ConceptID> — <Title> (<Model>)

**Source image**: ...
**Duration target**: 5s
**Aspect**: 9:16

---

Subject:     ...
Action:      ...
Camera:      ...
Style:       ...
Sound:       ...
Constraints: ...
```

The first `---` is the boundary. The seedance route ([app/api/jobs/seedance/route.ts](../app/api/jobs/seedance/route.ts)) only sends the body **after** the `---` to the model — the title and metadata above are author notes. Inside the body, any remaining `#` headings are dropped defensively.

## FFLF builder data flow

The user opens the FFLF builder from the Generate modal. The builder loads the hero's source PNG into an `<img>`, then renders to a `<canvas>`:

1. Background fill (color picker + presets).
2. Hero PNG drawn at `(cx, cy)` = normalized `(tx, ty) × (canvasW, canvasH)`, scaled by `scale × naturalSize`.
3. On Save, `canvas.toDataURL("image/png")` produces a base64 PNG which POSTs to `/api/heroes/[hero]/fflf`.
4. The route validates the PNG signature, picks the next free `<Hero>_FFLF_<N>.png` filename, writes the bytes, and invalidates the scan cache.
5. The Generate modal's `onSaved` callback re-fetches the hero and selects the new file as both Start and End image.

## Job execution model

Two job kinds, two execution models — both share the same `jobs` table.

### Seedance (truly async via fal)

```
POST /api/jobs/seedance            POST /api/jobs/[id]/rerun
         │                                   │
         └───── both call ──► lib/seedance.ts submitSeedanceJob(...)
                                             │
                                             ├─► enqueue (status='queued')
                                             │
                                             └─► (background, fire-and-forget):
                                                    status='running' stage='uploading_end_image'
                                                    → uploadToFal(endImage) ─► fal CDN URL
                                                    status='running' stage='submitted'
                                                    → seedance-video.sh --async --file=<start> --end-image-url=<endUrl>
                                                    → parse request_id, save to result.requestId

[every 10s] lib/poller.ts auto-tick:                 POST /api/jobs/[id]/poll (manual):
   for each running seedance job:                    ├─► pollSeedanceJob(id)
     call pollSeedanceJob(id) ──────────────────────►│
                                                     │
                              pollSeedanceJob(id) uses lib/fal.ts directly (HTTP):
                                 GET  queue.fal.run/bytedance/seedance-2.0/requests/<id>/status
                                 if state=COMPLETED:
                                   GET  queue.fal.run/bytedance/seedance-2.0/requests/<id>
                                   GET  <video.url>  →  write to Output/<Hero>/Animations/<ConceptID>_<iter>.mp4
                                   mark 'done', invalidate scan cache
                                 if state=FAILED:   mark 'error'
                                 else:               append [poll state=...] to log
```

Notes:
- No concurrency limit on the app side — fal's queue handles parallelism.
- Submission still goes through the bash script (handles upload + queue POST). Status/result/download goes direct over HTTP because the script's status URL builder is buggy (includes `/image-to-video` → returns HTTP 405 with empty body).
- Every poll (auto or manual) writes `[poll status http=... state=...]` plus the full response body to the job log. You can open the log modal on any running job to see exactly what fal returned on the last tick.

### Key+compose (local GPU, single slot)

```
POST /api/jobs/key  (body: { clips: [{heroId, clipName}, ...] })
   │
   └─► enqueue one 'key+compose' job per clip (status='queued')

[every 1.5s] lib/worker.ts ticks (only if no job is currently running):
   pick oldest queued key+compose job
   status='running' stage='keying'
       (if screen_color=blue: ffmpeg pre-swap B<->G → keying input is synthetic green)
       → batch_pipeline.py -i <raw.mp4> -o <Animations/<ClipName>/> --alpha birefnet+chroma --despill 0.3 \
                            --chroma-subtract-channel green
       (if screen_color=blue: swap_bg_channels.py FG Comp Processed → restores true colors)
   status='running' stage='compose'
       → compose_frames.py <Animations/<ClipName>/> --fps 24
   status='done', result.outputs = { fgAlphaMov, fgAlphaMp4, compMp4 }
   invalidate scan cache → UI shows the keyed/composited results

DELETE /api/jobs/[id] on a running key+compose job:
   if job is the active one, SIGTERM the child process, mark 'cancelled'
```

The single slot is enforced by a module-level `running` flag in [worker.ts](../lib/worker.ts). Because the worker is started exactly once at boot via `instrumentation.ts` + a `globalThis.__emtdWorkerStarted` guard, even Next's HMR can't double-start it.

#### Blue-screen handling (swap-based)

CorridorKey's despill stage is hardcoded to remove green spill — `cu.despill(fg, green_limit_mode="average", strength=despill_strength)` in `CorridorKeyModule/core/color_utils.py:184` has no `screen_color` parameter, and `inference.py` passes none through. Running blue-screen footage straight through leaves untreated blue spill on the character's edges and semi-transparent regions, producing visible artefacts.

The webapp works around this without patching CorridorKey: when `clip_meta.screen_color = "blue"`, the worker (a) writes a temporary swap of the raw mp4 with B↔G channels exchanged via `ffmpeg -vf colorchannelmixer=rr=1:rg=0:rb=0:gr=0:gg=0:gb=1:br=0:bg=1:bb=0`, (b) feeds the swapped mp4 to `batch_pipeline.py --chroma-subtract-channel green`, and (c) walks the resulting `FG/`, `Comp/`, and `Processed/` PNG sequences with `scripts/swap_bg_channels.py` to swap B↔G back. The swap is luminance-preserving and exactly inverts itself, so despill, BiRefNet segmentation, and the chroma subtract matte all run on a synthetic-green frame where the math is correct, and the final PNG sequences carry the character's true colors. `Matte/` is grayscale alpha and is left untouched. The temporary swapped mp4 is deleted after keying succeeds.

> **Gotcha:** `colorchannelmixer`'s diagonal coefficients (`rr`, `gg`, `bb`) default to **1** and the off-diagonals default to 0, so a partial filter like `rr=1:gb=1:bg=1` is **additive** (`G_out = G + B`, `B_out = G + B`) rather than a swap, and produces a cyan-tinted output that breaks both the chroma matte and the despill stage. Always set all 9 coefficients explicitly when doing a channel swap with this filter.

Despill strength behaves differently on the blue path than the green path. Because anything originally blue on the character has its colors swapped to green before keying, despill (which only knows how to remove green) is more aggressive on blue clips than on green clips at the same numeric setting. Recommended values live in [workflows.md §5](workflows.md). The webapp does **not** auto-adjust despill for blue clips — the user picks it via the Re-key modal, defaulting to 0.3 for both paths.

### Alignment pipeline

Alignment is layered on top of the existing key+compose output — it never overwrites originals.

```
┌─ Stage A: detect anchors ────────────────────────────────────────────────┐
│ POST /api/clips/[hero]/[clip]/anchors      (one clip, sync)              │
│ POST /api/jobs/detect-anchors              (whole hero, sync, --all)     │
│    │                                                                     │
│    └─► spawnSync(compose_python, detect_anchors.py, <clipDir | animDir>) │
│           ├─ read first frame (Processed/frame_000000.png or FG+Matte)   │
│           ├─ eye    = MediaPipe FaceMesh → Haar → heuristic (cascade)    │
│           ├─ foot   = alpha-bbox bottom                                  │
│           └─ write  <clipDir>/anchors.json                               │
│ PUT  /api/clips/[hero]/[clip]/anchors      (manual override from modal)  │
└──────────────────────────────────────────────────────────────────────────┘

┌─ Stage B: re-compose with alignment ─────────────────────────────────────┐
│ POST /api/jobs/recompose   (body: { clips: [...], alignToTemplate })     │
│    │                                                                     │
│    └─► enqueue 'key+compose' job with { skipKeying: true,                │
│                                         alignToTemplate: true }          │
│                                                                          │
│ [worker.ts key+compose loop]:                                            │
│    skipKeying=true → reuse existing FG/Matte/Comp/Processed frames       │
│    compose_frames.py <clipDir> --fps 24 --align-to-template \            │
│                                         --template character-alignment.json│
│       └─ reads anchors.json, computes uniform affine                     │
│          (scale, dx, dy) such that eye lands on eyeLevelY × H and        │
│          foot lands on groundY × H in output coords;                     │
│          applies same matrix to every RGBA frame                         │
│       └─ writes <ClipName>_fg_alpha_aligned.{mov,mp4}                    │
│           (originals _fg_alpha.{mov,mp4} and _comp.mp4 are untouched)    │
└──────────────────────────────────────────────────────────────────────────┘
```

Key design invariants:

- **Anchors are per-clip**, not per-hero — handles the case where different concepts (idle vs. power) use different FFLF poses.
- **The transform is uniform across the whole clip**. A single matrix is computed from the reference frame's anchors and applied to every frame. Per-frame detection would cause the character to wobble.
- **Alignment is post-key**, never pre-key. The user must be able to generate animations whose extents reach beyond the FFLF canvas (weapon swings, magic bursts) without being cropped at I2V time. Aligning the keyed output preserves those extents and translates/scales them uniformly.
- **Originals are preserved**. Re-running compose with `--align-to-template` writes `_aligned` variants only. The non-aligned `_fg_alpha.mov/.mp4` and `_comp.mp4` are untouched.

### Delivery pipeline (VP8/WebM with alpha)

```
POST /api/jobs/deliver   (body: { clips: [...], size?: 960, allowUnaligned?: false })
   │
   ├─ per clip: locate <ClipName>_fg_alpha_aligned.mov (or un-aligned fallback if
   │            allowUnaligned=true)
   └─ enqueue 'deliver' job for each

[worker.ts deliver loop, every 1.5s]:
   pick oldest queued deliver job
   status='running' stage='encoding'
       → worker resolves the raw mp4 at Output/<Hero>/Animations/<ClipName>.mp4
         (the aligned .mov carries no audio — the raw Seedance output is the only
          source of SFX, so the worker passes it as --audio-source)
       → deliver_webm.py <inputMov> --size <size> --output <Final/...webm>
                        [--audio-source <raw.mp4>] [--edge-fade <fade>]
           └─ ffmpeg -c:v libvpx -pix_fmt yuva420p -auto-alt-ref 0
                     -vf scale=<size>:<size>:flags=lanczos
                     -crf 15 -b:v 2M
                     -metadata:s:v:0 alpha_mode=1
                     -c:a libvorbis -b:a 128k -shortest
                     -y <Final/<ClipName>_final_<size>.webm>
           (audio muxing is conditional: if the script can't find an audio
           stream in --audio-source via ffprobe, it falls back to -an silent)
   status='done', result.outputWebm = <...>.webm
```

The deliver loop is independent of key+compose (ffmpeg is CPU-only; GPU-heavy keying can run in parallel). Delivery output always lands in `Output/<Hero>/Final/`, keeping the `Animations/<Clip>/` directory focused on keying/alignment artifacts. The UI surfaces delivery state through `processed.deliveredWebms: [{size, rel}]` on the clip DTO — populated by a second pass in [scan.ts](../lib/scan.ts) that walks each hero's `Final/` dir and links files back to clips by filename prefix. A clip may have multiple entries here (e.g. one for `_final_550.webm` and one for `_final_960.webm`); the gdrive upload route's `Auto` destination uses the filename size suffix to split each file into either `Final/` (sub-960) or `Final_960/`.

### Preview + share pipeline (mockup + stitch)

Two surfaces, both built on the same slot-rect config:

```
┌─ Client-side: live preview modal ────────────────────────────────────────┐
│ components/HeroScreenPreview.tsx                                         │
│   ├─ GET /api/config/mockup-slot    → normalized {x,y,w,h}               │
│   ├─ <img src=HeroScreen.png> as background                              │
│   ├─ <video src=/api/files/.../final_550.webm> overlay at slot rect      │
│   │     (max-w-none is important — tailwind preflight otherwise caps     │
│   │      the video at parent width and breaks scaling above 100%)        │
│   ├─ Edit placement: drag to move, scale slider (0–300%), x/y inputs.    │
│   │     PUT /api/config/mockup-slot on every change.                     │
│   └─ Sequence mode: client-side playlist swaps <video src> on `ended`    │
│         filters clip options to favorited + aligned + delivered          │
│         shape: idle×N → power (one-shot)                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌─ Server-side: shareable stitched MP4 ────────────────────────────────────┐
│ POST /api/jobs/preview-stitch   (body: { heroId, items: [{name, loops}]})│
│    │                                                                     │
│    ├─ resolves each item to Output/<Hero>/Final/<Clip>_final_550.webm    │
│    ├─ reads HeroScreen.png dimensions (PNG IHDR header) and multiplies   │
│    │  the normalized mockup_slot_rect by those to get px coords          │
│    └─ enqueues 'preview-stitch' job                                      │
│                                                                          │
│ [worker.ts preview-stitch loop, every 1.5s]:                             │
│    pick oldest queued preview-stitch job                                 │
│    → stitch_preview.py --clips a.webm,b.webm --loops N,M                 │
│                        --mockup HeroScreen.png --slot X,Y,W,H            │
│                        --output ...preview_<ts>.mp4                      │
│        └─ ffmpeg -c:v libvpx [-stream_loop N-1] -i each webm             │
│                  -loop 1 -framerate 24 -i HeroScreen.png                 │
│                  -filter_complex:                                        │
│                     scale each input to WxH + format=yuva420p            │
│                     concat v+a across all inputs                         │
│                     overlay onto mockup with alpha + format=yuv420p      │
│                  -c:v libx264 -crf 18 -c:a aac -b:a 128k output.mp4      │
│    status='done', result.outputPath = <...>.mp4                          │
└──────────────────────────────────────────────────────────────────────────┘
```

Key invariants:

- **The slot rect is app-wide, not per-hero.** One value configured once applies to every hero. This matches the workflow — the mockup doesn't change per hero, only the video content does.
- **The normalized rect is resolution-independent.** Stored as `{x,y,w,h}` in `0..1` (with overflow allowed for scaled-up slots). Multiplying by mockup pixels happens at the consumer (client CSS layout, server ffmpeg). If the mockup PNG is swapped for a higher-res version, the rect still applies.
- **Alpha preservation through ffmpeg requires explicit pixel-format coercion.** VP8 alpha webms decode to `yuva420p` only when the `libvpx` decoder is forced (`-c:v libvpx` before `-i`), and `scale` drops alpha by default — the filter chain appends `format=yuva420p` after every scale, then `overlay` blends into the mockup, then a final `format=yuv420p` flattens to H.264-compatible output.
- **Audio flows from the raw Seedance mp4 all the way through.** Raw mp4 → muxed into the delivered WebM (Vorbis) → concatenated through the stitch's `concat` filter → output MP4 (AAC). No silent links in the chain after the delivery re-run.

## Boot sequence

1. Next process starts.
2. `instrumentation.ts` runs `register()` (Node runtime only), which dynamically imports `lib/worker.ts` and `lib/poller.ts`.
3. `startWorker()` runs orphan recovery (any leftover `running` job — across kinds `key+compose` / `gdrive-upload` / `deliver` / `preview-stitch` — from a previous process is marked `error`) and starts four independent tick loops: key+compose (1.5s, single GPU slot), gdrive-upload (2s), deliver (1.5s), preview-stitch (1.5s).
4. `startSeedancePoller()` schedules the first 10s tick after a 4s delay (so the boot doesn't immediately race the first request).
5. The first HTTP request triggers `db()` (which creates `data/` and runs migrations) and `scanHeroes()` (which walks the filesystem and caches).

## Streaming videos

Videos are served via `/api/files/[...path]` ([app/api/files/[...path]/route.ts](../app/api/files/[...path]/route.ts)). The route resolves the requested relative path against `HEROANIM_ROOT` and rejects anything that escapes the root. It honors `Range:` headers (returns 206 with the requested byte range), so the browser's `<video>` element can seek without downloading the entire file.

## Bash spawn on Windows

Node's `spawn("bash", ...)` resolves through Windows `PATH`, which puts `C:\Windows\System32\bash.exe` (the WSL launcher) first. WSL fails if there's no distro installed, so we force Git Bash by spawning `BASH_BIN` (default `C:/Program Files/Git/usr/bin/bash.exe`) directly.

Git Bash when invoked non-interactively does **not** source `/etc/profile`, so its `PATH` doesn't include `/usr/bin` (`basename`, etc.) or `mingw64/bin` (`curl`). The `runBash` helper in [lib/poller.ts](../lib/poller.ts) walks up from `BASH_BIN` to find the `Git/` ancestor dir, then prepends these Windows-form paths to the child `PATH`:

- `<Git>\usr\bin` — `basename`, `sed`, `awk`, `sh`, etc.
- `<Git>\mingw64\bin` — `curl`, `openssl`, etc.
- `<Git>\bin` — `bash`, `git`, etc.

`jq` is **not bundled** with Git Bash. If `winget install jqlang.jq` added a path to user `PATH`, normal `process.env.PATH` inheritance picks it up. Alternatively drop `jq.exe` into `<Git>\mingw64\bin\` and the prepend logic will find it.

## Filesystem scan caching

`scanHeroes()` is cached for 3 seconds. Invalidation happens automatically:
- After any job completes (worker / poller call `invalidateScanCache()`).
- After a concept/prompt/FFLF write (hero API routes call `invalidateScanCache()`).

Server components and the `/api/heroes/*` routes call `invalidateScanCache()` defensively before reading, so editing the filesystem externally only requires a page reload to be picked up.

---

