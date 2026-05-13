# EMTD Pipelines — Setup Guide

This repo ships two pipelines:

- **Hero animation** (webapp + skill) — concepts → prompts → fal-seedance I2V → CorridorKey keying → align → deliver WebM → optional Drive upload.
- **Unit progression** (skill-only, CLI-driven) — L1→L10 rank PNG ramps via `fal-ai/nano-banana-pro/edit` + NAFNet deblur + `composite-keeper` diff-mask.

> **For an interactive guided setup, run `/setup` in Claude Code from the repo root.** This document is the static reference covering the same ground.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 20+ | Project developed on 20.15. Required for the webapp. |
| **Python** | 3.10+ | Required for `compose_frames.py`, `composite-keeper`, `deliver_webm.py`. |
| **Git** | any | Plus **Git Bash** on Windows (provides `bash` + `usr/bin` POSIX tools). |
| **ffmpeg** | any recent | On `PATH`. Used by frame composition + delivery encoding. |
| **jq** | any recent | On `PATH`. Required by `seedance-video.sh` and `upload.sh`. Install with `winget install jqlang.jq` (Windows) or `brew install jq` (macOS). |
| **GPU for keying** | — | Required for keying (CorridorKey + BiRefNet). Windows / Linux: **NVIDIA + CUDA, 8 GB+ VRAM** recommended. macOS: **Apple Silicon (M1+)** — CorridorKey runs natively via MLX (1.5–2× faster than MPS); alpha generators (SAM2, GVM, VideoMaMa, MatAnyone2) run on MPS and are slower than CUDA. |

VS C++ Build Tools (Windows) or Xcode CLT (macOS) are required to compile `better-sqlite3` during `npm install`.

---

## Step 1 — Project Python venv

Used by `HeroAnimation/scripts/compose_frames.py`, `detect_anchors.py`, `deliver_webm.py`, `composite-keeper`.

### Windows
```
cd "<repo root>"
python -m venv .venv
.venv\Scripts\activate
pip install pillow numpy imageio imageio-ffmpeg
```

### macOS / Linux
```
cd <repo-root>
python3 -m venv .venv
source .venv/bin/activate
pip install pillow numpy imageio imageio-ffmpeg
```

Verify by activating the venv and running `python -c "import PIL, numpy, imageio; print('ok')"`.

---

## Step 2 — EZ-CorridorKey (greenscreen keying)

EZ-CorridorKey is an external tool that wraps CorridorKey + BiRefNet for headless keying. The EMTD pipeline ships two patches against it (see Step 2d). Supported on **Windows** (NVIDIA + CUDA), **macOS** (Apple Silicon M1+, MLX), and **Linux** (NVIDIA + CUDA — upstream-supported but untested by EMTD).

> **Already have it installed?** If EZ-CorridorKey is already present on this machine (e.g. used for another project), skip to **Step 2d (apply patches)** and point the webapp env vars in Step 4 at your existing install. Verify the install dir contains the platform-appropriate installer (`1-install.bat` on Windows, `1-install.sh` on macOS/Linux) before reusing it.

### 2a. Clone

Default install path: **sibling to the EMTD repo** — i.e. `<parent-of-repo>/EZ-CorridorKey/`. So if the repo is at `D:/code/empire-titans/`, EZ-CorridorKey installs at `D:/code/EZ-CorridorKey/`. Sibling-of-repo keeps EZ-CorridorKey's own `.venv/` cleanly isolated from the project `.venv/` and avoids polluting the EMTD repo.

```
cd ..    # one level up from the EMTD repo root
git clone https://github.com/edenaion/EZ-CorridorKey.git
```

If you install elsewhere, override `KEYCLIPS_PYTHON` and `KEYCLIPS_SCRIPT` in `webapp/.env.local` to point at your install.

### 2b. Run the upstream installer

EZ-CorridorKey ships a one-click installer that handles managed Python 3.11, virtual environment, dependencies, **the correct backend for your GPU** (auto-detected: CUDA on Windows/Linux, MLX on Apple Silicon), verification, and **model downloads**.

**Windows:**
```
cd EZ-CorridorKey
1-install.bat
```

**macOS / Linux:**
```
cd EZ-CorridorKey
chmod +x 1-install.sh
./1-install.sh
```

The installer is interactive in places; let it run to completion. First-time install downloads several GB of models and can take 5–15 minutes. You do **not** need to pre-install Python — the installer provisions managed Python 3.11 itself.

### 2c. (Removed — handled by 2b)

### 2d. Apply EMTD patches

The pipeline ships two patches against the upstream EZ-CorridorKey at `.claude/skills/setup/patches/`:

- `batch_pipeline.patch` — diff against `scripts/batch_pipeline.py` (headless mode, EMTD defaults: `birefnet+chroma` alpha merge, despill 0.2, PNG outputs, project auto-cleanup, output-folder layout).
- `gvm_wrapper.patch` — diff against `gvm_core/wrapper.py`.

Apply both:

```
cd <EZ-CorridorKey install dir>
git apply "<EMTD repo root>/.claude/skills/setup/patches/batch_pipeline.patch"
git apply "<EMTD repo root>/.claude/skills/setup/patches/gvm_wrapper.patch"
```

If a patch fails to apply cleanly, try `git apply --3way <patch>` for tolerance, or resolve conflicts manually and confirm with the EMTD team.

### 2e. Verify

**Windows:**
```
cd <EZ-CorridorKey install dir>
.venv\Scripts\activate
python scripts/batch_pipeline.py --help
```

**macOS / Linux:**
```
cd <EZ-CorridorKey install dir>
source .venv/bin/activate
python scripts/batch_pipeline.py --help
```

Should print the headless CLI options. If it errors out, recheck the patch step.

---

## Step 3 — Webapp install

```
cd webapp
npm install
copy .env.local.example .env.local        # Windows
# cp .env.local.example .env.local        # macOS / Linux
```

`better-sqlite3` is a native module and will compile on `npm install`. On Windows you need VS C++ Build Tools available; on macOS you need Xcode Command Line Tools.

---

## Step 4 — Configure environment variables

Edit `webapp/.env.local`. The required-for-functionality vars:

| Var | What it is | Required for |
|---|---|---|
| `FAL_KEY` | Your fal.ai API key | All generation (hero seedance, unit nano-banana-pro/edit, NAFNet) |
| `HEROANIM_ROOT` | Absolute path to `HeroAnimation/` | All hero pipeline ops (default works for the standard checkout) |
| `BASH_BIN` | Absolute path to Git Bash | Windows only — defaults to `C:/Program Files/Git/usr/bin/bash.exe` |
| `KEYCLIPS_PYTHON` | Path to EZ-CorridorKey's venv python | Hero keying. Default = sibling-of-repo install. Windows: `<parent-of-repo>/EZ-CorridorKey/.venv/Scripts/python.exe`. macOS/Linux: `<parent-of-repo>/EZ-CorridorKey/.venv/bin/python`. |
| `KEYCLIPS_SCRIPT` | Path to `batch_pipeline.py` | Hero keying. Defaults to `<parent-of-repo>/EZ-CorridorKey/scripts/batch_pipeline.py` |
| `COMPOSE_PYTHON` | Path to the project venv python from Step 1 | Frame composition + delivery. |
| `GDRIVE_SERVICE_ACCOUNT` | Path to your Google service-account JSON key | Drive upload (optional — see Step 5) |
| `GDRIVE_ROOT_FOLDER_ID` | Drive folder ID for hero deliveries | Drive upload (optional) |

The other paths (script locations, project root) default to standard checkout layouts — only override if you've moved things.

---

## Step 5 — Google Drive service account (optional)

Required only if you want the **Upload to GDrive** button to work (delivers WebMs to a shared team Drive folder).

1. Create a Google Cloud project + service account at https://console.cloud.google.com/iam-admin/serviceaccounts
2. Enable the **Google Drive API** for that project
3. Generate a JSON key for the service account; download it
4. Save the JSON somewhere on disk (e.g. `HeroAnimation/env/service_account.json`)
5. Set `GDRIVE_SERVICE_ACCOUNT` in `webapp/.env.local` to that path
6. Open the target Drive folder (must be a Shared Drive) and add the service account email (`<account>@<project>.iam.gserviceaccount.com`) as **Content Manager** or higher
7. Set `GDRIVE_ROOT_FOLDER_ID` to the folder ID (the long string in the folder URL after `/folders/`)

Skip this step entirely if you don't need Drive delivery — the rest of the pipeline works without it.

---

## Step 6 — Hero animation smoke test

```
cd webapp
npm run dev
# → http://localhost:3000
```

1. Open `http://localhost:3000`, click any hero (Blacksmith is a good showcase).
2. **Concepts** tab → pick a concept → **Prompts** tab → pick a prompt.
3. Build an FFLF in the FFLF Builder (or use an existing one).
4. **Generate** → wait for fal-seedance to complete (~60s).
5. Click the new clip → **Key** → wait for keying (~1 min/clip on CUDA; longer on Apple Silicon for the alpha-hint pass).
6. **Align** → **Save + recompose aligned**.
7. **Deliver (WebM 550)** → final WebM lands in `HeroAnimation/Output/<Hero>/Final/`.

If any step fails, open `/jobs` in the webapp to tail the job log.

---

## Step 7 — Unit progression smoke test (skill-driven, no UI)

The unit-progression pipeline is **agent-driven, no webapp**. From Claude Code in the repo root:

```
/unit-progression Cavalry
```

The skill reads `UnitProgression/Cavalry/CLAUDE.md` and walks through generating a level by:
1. Uploading the prior composite to fal CDN
2. POSTing to `fal-ai/nano-banana-pro/edit`
3. NAFNet deblur on the locked keeper
4. Running `composite-keeper` against the prior level
5. Inspecting QC and chaining forward

You can also run `composite-keeper` standalone:

```
.venv\Scripts\python .claude/skills/composite-keeper/scripts/composite_keeper.py \
  --raw   <denoised_keeper.png> \
  --input <prior_composite.png> \
  --output <out_composite.png> \
  --qc-image <qc.png> \
  --qc-json <qc.json>
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `bash: command not found` or scripts hang on Windows | `BASH_BIN` is resolving to WSL (`C:\Windows\System32\bash.exe`). Set `BASH_BIN=C:/Program Files/Git/usr/bin/bash.exe` in `webapp/.env.local`. |
| `jq: command not found` in a job log | Install jq (`winget install jqlang.jq`) and restart the webapp dev server so the new PATH is inherited. |
| `FAL_KEY not set` errors | Add `FAL_KEY=<your key>` to `webapp/.env.local`. Restart `npm run dev`. |
| Keying job errors immediately | Check `KEYCLIPS_PYTHON` resolves to the EZ-CorridorKey venv (Windows: `.venv/Scripts/python.exe`, macOS/Linux: `.venv/bin/python`). On Windows/Linux confirm the venv has CUDA-enabled torch; on macOS confirm MLX is the active backend (re-run `1-install.sh` if not). |
| `EPERM: open '.next/trace'` on dev startup | Another `next dev` process is still holding the lock. Find it (`netstat -ano \| grep :3000`) and kill it. |
| `better-sqlite3` build fails on `npm install` | You need VS C++ Build Tools (Windows) or Xcode CLT (macOS). Install, delete `node_modules`, retry. |
| Seedance job stuck in `running` | Click **poll** on the job in `/jobs`. The log modal shows the raw fal response. |
| Composite-keeper QC warns on a level | Open `_qc.png` (5-tile review) + `_qc.json`. Common fixes: bump `--dilate` for tier breaks (15) or large edits (20). See the QC table in `.claude/skills/composite-keeper/SKILL.md`. |
