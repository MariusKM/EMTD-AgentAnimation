# EMTD Animation Studio

Local Next.js webapp covering the hero animation pipeline for Empire: Titans & Dragons:

**Hero animations** — concepts → prompts → FFLF → fal-seedance I2V → CorridorKey keying → align → deliver WebM (960 default; 550/720 also available) → preview/stitch → Drive upload.

The webapp is **single-user**, runs entirely on your machine, and treats `HeroAnimation/` as the source of truth for all content. A small SQLite database stores only metadata (locks, ratings, verdicts, job queue).

## Quick start

```bash
cd webapp
npm install
cp .env.local.example .env.local   # adjust paths if your venvs live elsewhere
npm run dev
# → http://localhost:3000
```

`better-sqlite3` is a native module — `npm install` will compile it for your Node version. On Windows you need VS C++ build tools available.

## What you can do

| Page | Purpose |
|---|---|
| `/` | Characters grid with portraits, concept counts, clip counts. |
| `/heroes/[hero]` | Three-column workspace: concept list · concept/prompts editor · animations for the selected concept. Prompts tab is the default. |
| `/jobs` | Live job table. Polls every 3s. Click a job to tail its log. Cancel running jobs. |

Per concept you can:
- **Favorite + rate** (1–5 stars). Persists to SQLite.
- **Edit concept markdown** — the matching `### P#` / `#### P#` block is rewritten in `Output/<Hero>/concepts.md`, leaving everything else untouched.
- **View + edit prompt files** — `Output/<Hero>/Prompts/<Model>/<ConceptID>_*.md` are loaded into the Prompts tab; saving writes back via PATCH.
- **Build FFLF images** in-app — composite the source PNG (transparent) onto a solid background (green, blue, etc.) with a drag/scale gizmo, or click **Auto-align to template** to detect eye+foot on the source and snap it onto the Eye Level / Ground lines automatically. Saves to `Output/<Hero>/<Hero>_FFLF_<n>.png`.
- **Generate** — pick a model + prompt + start image + end image, and the app submits to fal-seedance asynchronously. The new `.mp4` lands under the concept automatically when fal finishes.

Per clip you can:
- **Favorite + rate**.
- **Queue keying** — one click runs `EZ-CorridorKey` then `compose-frames`. The job runs locally, one at a time (GPU-bound).
- **Browse keyed files** — click "Files" on a keyed clip to scrub through FG / Matte / Comp / Processed frames, plus download the composited `.mov` / `.mp4` outputs.
- **Align to template** — click "Align" on a processed clip. Auto-detects eye+foot anchors (MediaPipe FaceMesh + alpha bbox) with manual-override crosshairs; "Save + recompose aligned" writes `_fg_alpha_aligned.{mov,mp4}` alongside the originals. Uses normalized positions from `HeroAnimation/character-alignment.json` — resolution-independent, so the same template covers 960×960 dev output and 550×550 final delivery.
- **Show alignment** — on clips with an aligned output, the inline preview plays the aligned video by default. A "Show alignment" toggle overlays the template guide lines on top of the video so you can visually confirm eye+foot positioning frame-by-frame.

Per hero, two batch buttons at the top of the Animations column:
- **Align all** — runs auto-detection on every keyed clip in one synchronous pass (~1s per clip).
- **Recompose all aligned** — enqueues one compose-only job per clip with anchors. Fast (reuses existing `Processed/` frames), produces the `_aligned.{mov,mp4}` variants.

And in the selection bar:
- **Deliver (WebM `<size>`)** — encodes VP8/WebM with alpha at `<size>`×`<size>` **and muxes audio from the raw Seedance mp4 (Vorbis)**. Default size is **960** (pass-through from the aligned 960 canvas, no scaling); pick 550 or 720 from the segmented selector next to the button to downscale. Outputs to `Output/<Hero>/Final/<ClipName>_final_<size>.webm`.

### Preview + share

- Per-clip **Preview** button (and a top-of-column **▶ Preview** for sequence mode) opens a modal that composites delivered WebMs onto `HeroAnimation/HeroScreen.png` — the in-game mobile Hero Screen mockup.
- **Edit placement** — drag the slot to move, scale slider (0–300%), `x` / `y` number fields for exact positioning. The rect is stored app-wide.
- **Sequence mode** — client-side playlist that plays `idle×N → power` using favorited + aligned + delivered clips. Idle loops 1–5.
- **⤓ Export shareable MP4** — renders the sequence as a single H.264/AAC MP4 with the mockup baked in. Outputs to `Output/<Hero>/Final/<Hero>_preview_*.mp4`. Previews inline in Slack/Drive without needing alpha-WebM playback support.

### Drive upload

The selection bar also offers **Upload to GDrive** for delivered WebMs. Each hero gets a `<root>/<HeroId>/Final/` subfolder created on demand; uploads are same-name replace-in-place. Configure with the `GDRIVE_*` env vars below.

## Documentation

- [docs/architecture.md](docs/architecture.md) — system architecture, module map, data flow, async vs. local job execution.
- [docs/api.md](docs/api.md) — full HTTP endpoint reference with request/response shapes.
- [docs/conventions.md](docs/conventions.md) — filesystem layout the app expects, file-naming rules, prompt markdown formats, FFLF format.
- [docs/workflows.md](docs/workflows.md) — step-by-step walkthroughs for hero workflows (concept → prompt → FFLF → generate → key → review).

## Repository layout

```
webapp/
├── README.md, docs/
├── package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs
├── .env.local.example
├── instrumentation.ts                  # boots the worker once on server start
├── data/                               # gitignored: app.db (SQLite) + logs/<jobId>.log
├── lib/
│   ├── paths.ts                        # all filesystem roots, env-driven
│   ├── db.ts                           # better-sqlite3 singleton + migrations
│   ├── scan.ts                         # filesystem → Hero / Concept / Clip / FFLF tree (3s cache)
│   ├── concepts.ts                     # parse concepts.md, rewrite individual blocks
│   ├── meta.ts                         # concept_meta + clip_meta CRUD
│   ├── config.ts                       # app_config (key → JSON) helpers
│   ├── jobs.ts                         # job queue CRUD (kinds: seedance / key+compose / deliver / preview-stitch / gdrive-upload)
│   ├── shell.ts                        # spawn helper that tees stdout/stderr to log file
│   ├── worker.ts                       # job loops covering hero pipeline
│   ├── poller.ts                       # fal seedance auto-poller + manual pollSeedanceJob()
│   ├── seedance.ts                     # shared submitSeedanceJob() (used by submit + rerun)
│   ├── fal.ts                          # direct HTTP client for fal queue (status/result/download)
│   └── gdrive.ts                       # Drive upload helpers
├── app/
│   ├── layout.tsx, globals.css, page.tsx       # nav + hero grid
│   ├── heroes/[hero]/page.tsx                  # 3-column hero workspace
│   ├── jobs/page.tsx                           # live job table + log viewer + rerun/poll
│   └── api/                                    # all backend routes (see docs/api.md)
└── components/
    ├── HeroWorkspace.tsx               # main hero UI + GeneratorModal + PromptsPanel
    ├── ClipExplorer.tsx                # per-clip frame browser modal
    ├── FFLFBuilder.tsx                 # canvas-based FFLF compositor
    ├── HeroScreenPreview.tsx           # mockup-overlay preview modal
    ├── AlignmentModal.tsx              # auto-detect + manual-override anchors
    ├── CharactersGrid.tsx              # main page hero grid
    └── RatingStars.tsx, FavoriteButton.tsx
```

## Environment variables

See [.env.local.example](.env.local.example) for the full list. The defaults assume:

| Var | Default |
|---|---|
| `HEROANIM_ROOT` | `<PROJECT_ROOT>/HeroAnimation` (auto-derived from cwd) |
| `PROJECT_ROOT` | parent of webapp's cwd (auto-derived; explicit override only if running webapp from a non-standard cwd) |
| `BASH_BIN` | `C:/Program Files/Git/usr/bin/bash.exe` (Windows; falls back to `bash` on non-Windows) |
| `SEEDANCE_SCRIPT` | `.claude/skills/fal-api-skills/skills/fal-seedance-2/scripts/seedance-video.sh` |
| `FAL_UPLOAD_SCRIPT` | `.claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh` |
| `KEYCLIPS_PYTHON` | `<parent-of-repo>/EZ-CorridorKey/.venv/Scripts/python.exe` (sibling-of-repo install) |
| `KEYCLIPS_SCRIPT` | `<parent-of-repo>/EZ-CorridorKey/scripts/batch_pipeline.py` |
| `COMPOSE_PYTHON` | `<PROJECT_ROOT>/.venv/Scripts/python.exe` (Windows) / `<PROJECT_ROOT>/.venv/bin/python` (macOS/Linux) |
| `COMPOSE_SCRIPT` | `HeroAnimation/scripts/compose_frames.py` |
| `DELIVER_WEBM_SCRIPT` | `HeroAnimation/scripts/deliver_webm.py` |
| `STITCH_PREVIEW_SCRIPT` | `HeroAnimation/scripts/stitch_preview.py` |
| `SWAP_BG_SCRIPT` | `HeroAnimation/scripts/swap_bg_channels.py` (used only for blue-screen clips) |
| `HERO_SCREEN_MOCKUP` | `HeroAnimation/HeroScreen.png` |
| `ALIGNMENT_TEMPLATE` | `HeroAnimation/character-alignment.json` |
| `FAL_KEY` | *(required)* Your fal API key. |
| `GDRIVE_SERVICE_ACCOUNT` | Path to the Google service-account JSON key. Required for Drive upload. The service account must be added as Content Manager (or higher) on the target Shared Drive. |
| `GDRIVE_ROOT_FOLDER_ID` | Drive folder ID under which uploads land. Each hero gets `<root>/<HeroId>/Final/` created on demand. |

### Why `BASH_BIN`?

On Windows, `bash` on `PATH` resolves to `C:\Windows\System32\bash.exe` (WSL), which fails to run our scripts. The app explicitly spawns Git Bash (`C:/Program Files/Git/usr/bin/bash.exe`) and prepends Git's `usr/bin`, `mingw64/bin`, and `bin` to the child `PATH` so standard POSIX tools (`basename`, `curl`, `jq`) are reachable without sourcing `/etc/profile`.

### System prerequisites

- **Node 20+** (this project uses Node 20.15 in development).
- **Git Bash for Windows** — for spawning `seedance-video.sh` / `upload.sh`.
- **`jq`** — both the seedance script and `upload.sh` use it. Install with `winget install jqlang.jq`, or drop `jq.exe` into `C:\Program Files\Git\mingw64\bin\` and it'll be picked up by the PATH prepend.
- **CUDA-enabled Python venv** for CorridorKey if you want to run keying locally. `COMPOSE_PYTHON` can point at a lighter venv (just needs `imageio` + `numpy` + `Pillow`).

## What the app does NOT do

- It doesn't replace VSCode for deep markdown / prompt editing — it edits the blocks you'd edit by hand and views the rest, but you're free to keep editing files directly. The 3-second filesystem scan cache means external edits show up on next request.
- It doesn't keep its own copy of any video, image, or markdown file. Everything lives where it always lived, under `HeroAnimation/`.
- It doesn't manage the source PNGs in `Source/Heroes Stylized/` — those are the art team's canonical files.

## Resetting state

| To reset… | Do this |
|---|---|
| All metadata (ratings, favorites, job history) | Stop the dev server, delete `webapp/data/app.db*`, restart. |
| Job logs only | Delete `webapp/data/logs/`. |
| The Next build cache | Delete `webapp/.next/`. Sometimes needed if HMR gets wedged. |

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Every API returns HTTP 500 | Dev server is wedged — usually a TypeScript compile error in a hot-reloaded file. Restart `npm run dev`. |
| `EPERM: open '.next/trace'` on dev startup | Another `next dev` process is still holding the lock. Find it (`netstat -ano \| grep :3000`) and kill it. |
| New hero / concept / clip not showing up | Filesystem scan is cached for 3s. If it still doesn't appear, check naming (see [docs/conventions.md](docs/conventions.md)). |
| `basename: command not found` in a seedance/upload job log | Your `BASH_BIN` is set to WSL (`C:\Windows\System32\bash.exe`) or another bash without Git's `/usr/bin` on PATH. Set `BASH_BIN=C:/Program Files/Git/usr/bin/bash.exe` in `.env.local` and restart. |
| `jq: command not found` in a job log | Install jq (`winget install jqlang.jq`) and restart the dev server so the new PATH is inherited. |
| `upload.sh failed (1): Error: FAL_KEY not set` | `FAL_KEY` isn't reaching the child script. Put it in `webapp/.env.local` (Next loads it into `process.env`, which the app forwards to spawn). |
| Seedance job stuck in `running` / stage `submitted` | Click the `poll` button on the job in `/jobs`. The log modal will show `[poll status http=... state=...]` with the raw fal response. Most common: auto-poller hit a transient error; manual poll usually recovers it. |
| Key+compose job errors out immediately | Check `KEYCLIPS_PYTHON` resolves to the CorridorKey venv on E:, and the venv has CUDA-enabled torch. |
