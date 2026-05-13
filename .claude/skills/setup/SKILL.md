---
name: setup
description: Guide a new team member through environment setup for the EMTD pipelines via an interactive agent walkthrough. Covers Python venv, webapp install, FAL API key, Google Drive service account (optional), EZ-CorridorKey clone + patch (Windows-only), and end-to-end smoke tests. Resume mid-flow with `--step <name>`.
argument-hint: [--step prereqs|venv|webapp|fal|env|corridorkey|gdrive|smoketest]
---

# Setup Wizard

Walk the user through installing and configuring the EMTD pipelines as an interactive chat. Detect the host platform, run verification commands at each step, write config to disk, and ask for confirmation before moving to the next stage.

`SETUP.md` at the repo root is the static reference covering the same ground. This skill is the interactive version.

If `$ARGUMENTS` contains `--step <name>`, resume from that step. Otherwise start from Stage 0.

---

## Stage 0 — Platform detection + prerequisites

1. Detect host OS (`uname -s` on Unix-likes; PowerShell `$IsWindows` / Node `process.platform` on Windows). Record as one of: `windows`, `macos`, `linux`.
2. **EZ-CorridorKey is Windows-only currently.** On macOS / Linux, warn that Stage 5 (keying) will be skipped — the team can still run hero generation + composition; only keying is unsupported on non-Windows hosts.
3. Verify required tools by running version-check commands:
   - `node --version` → must be 20.x or higher
   - `python --version` (or `python3 --version` on macOS/Linux) → must be 3.10+
   - `git --version`
   - `ffmpeg -version | head -1`
   - `jq --version`
4. Windows-only additionally:
   - Test `ls "C:/Program Files/Git/usr/bin/bash.exe"` for Git Bash
5. Report missing prerequisites with install commands:
   - Windows: `winget install jqlang.jq`, install Node from nodejs.org, install Python from python.org, install ffmpeg via `winget install Gyan.FFmpeg`, install Git from git-scm.com (provides Git Bash)
   - macOS: `brew install node python jq ffmpeg git`
6. Pause until the user confirms missing tools are installed. **Do not proceed if Node < 20 or Python < 3.10** — every downstream step will fail.

---

## Stage 1 — Project Python venv

Used by `compose_frames.py`, `composite-keeper`, `deliver_webm.py`.

Run the appropriate command for the detected platform:

**Windows:**
```
cd "<repo root>"
python -m venv .venv
.venv\Scripts\activate
pip install pillow numpy imageio imageio-ffmpeg
```

**macOS / Linux:**
```
cd <repo root>
python3 -m venv .venv
source .venv/bin/activate
pip install pillow numpy imageio imageio-ffmpeg
```

Verify by running `python -c "import PIL, numpy, imageio; print('ok')"` inside the venv. Record the resolved venv python path — used in Stage 4 to seed `COMPOSE_PYTHON` and `VENV_PYTHON`.

---

## Stage 2 — Webapp install

```
cd webapp
npm install
```

This compiles `better-sqlite3` natively. If it fails:
- Windows: install VS C++ Build Tools via the Visual Studio Installer (Desktop development with C++ workload)
- macOS: `xcode-select --install`

Then copy the env template:

**Windows:**
```
copy .env.local.example .env.local
```

**macOS / Linux:**
```
cp .env.local.example .env.local
```

---

## Stage 3 — FAL API key

Prompt: *"Paste your fal.ai API key (will not be echoed)."*

Write it to `webapp/.env.local`:
```
FAL_KEY=<value>
```

Verify with a no-op fal API call to catch typos before moving on. Example test request (using `curl`):
```
curl -s -H "Authorization: Key <FAL_KEY>" https://queue.fal.run/health
```
A successful response means the key reaches fal. Pause if the call fails.

---

## Stage 4 — Other env vars + path resolution

Walk through `webapp/.env.local` and fill in each value. Auto-detect defaults where possible:

- **`HEROANIM_ROOT`** — auto-detect from `cwd` (repo root + `/HeroAnimation`).
- **`PROJECT_ROOT`** — auto-detect from `cwd`.
- **`BASH_BIN`** — Windows: `C:/Program Files/Git/usr/bin/bash.exe`. macOS/Linux: `bash`.
- **`COMPOSE_PYTHON`** / **`VENV_PYTHON`** — auto-fill from Stage 1's resolved venv path.
- **`KEYCLIPS_PYTHON`** / **`KEYCLIPS_SCRIPT`** — leave as placeholder defaults; will be confirmed after Stage 5 if Windows. Skip on macOS/Linux.
- **All other vars** (`SEEDANCE_SCRIPT`, `FAL_UPLOAD_SCRIPT`, `COMPOSE_SCRIPT`, etc.) — fall through to `.env.local.example` defaults.

Surface each value to the user before writing. Don't write blind.

---

## Stage 5 — EZ-CorridorKey install + patch (Windows only — skip otherwise)

On macOS / Linux: skip this entire stage. Note that keying requires Windows for now; advise the user to run keying on a Windows machine when needed.

On Windows:

### 5a. Already installed?

**Ask the user first:** *"Do you already have EZ-CorridorKey installed somewhere on this machine? If yes, paste the install path (the directory containing `1-install.bat`); if no, type `n` and the skill will clone + install fresh."*

- If the user supplies an existing path, **skip to 5d (apply patches)**. Verify the path exists and contains `1-install.bat` before proceeding; if either check fails, fall through to fresh-install.
- If `n`: continue with 5b.

### 5b. Clone

Default install path: **sibling to the EMTD repo** — i.e. one directory up from the repo root, named `EZ-CorridorKey`. So if the repo is at `D:/code/empire-titans/`, the default EZ-CorridorKey install lands at `D:/code/EZ-CorridorKey/`. Sibling-of-repo keeps EZ-CorridorKey's own `.venv/` cleanly isolated from the project `.venv/` and avoids polluting the EMTD repo.

Prompt: *"Where should EZ-CorridorKey be installed?"* (default = sibling-of-repo as above; user can override).

```
git clone https://github.com/edenaion/EZ-CorridorKey.git <target>
```

### 5c. Run the upstream installer

EZ-CorridorKey ships a one-click installer that handles managed Python 3.11, virtual environment, dependencies, **the correct PyTorch backend for the user's GPU** (auto-detected), verification, and **model downloads**. Use it instead of installing dependencies manually.

```
cd <target>
1-install.bat
```

(On macOS/Linux upstream supports `chmod +x 1-install.sh && ./1-install.sh`, but our pipeline is Windows-only for now — see Stage 0 platform check.)

The installer is interactive in places; let it run to completion. First-time install downloads several GB of models, can take 5–15 minutes.

### 5d. Apply EMTD patches

The pipeline ships two patches at `.claude/skills/setup/patches/`:

- `batch_pipeline.patch` — diff against `scripts/batch_pipeline.py`
- `gvm_wrapper.patch` — diff against `gvm_core/wrapper.py`

Apply both:

```
cd <target>
git apply "<repo root>/.claude/skills/setup/patches/batch_pipeline.patch"
git apply "<repo root>/.claude/skills/setup/patches/gvm_wrapper.patch"
```

If a patch fails to apply cleanly, retry with `git apply --3way` for tolerance. On real conflicts, show the conflicting hunks to the user and ask them to resolve manually before proceeding.

### 5e. Verify

```
cd <target>
.venv\Scripts\activate
python scripts/batch_pipeline.py --help
```

Should print the headless CLI options. If it errors, recheck the patch step.

### 5f. Write paths back to webapp/.env.local

Update `KEYCLIPS_PYTHON` and `KEYCLIPS_SCRIPT` in `webapp/.env.local` to point at the installed location:
- `KEYCLIPS_PYTHON=<target>/.venv/Scripts/python.exe`
- `KEYCLIPS_SCRIPT=<target>/scripts/batch_pipeline.py`

---

## Stage 6 — Google Drive service account (optional)

Prompt: *"Will the team push deliverables to Google Drive? [y/N]"*

If **no**: skip this stage. The pipeline works without Drive; the **Upload to GDrive** button in the webapp will simply error if clicked, with a clear "service account not configured" message.

If **yes**, walk through:

1. Open Google Cloud Console at https://console.cloud.google.com/iam-admin/serviceaccounts
2. Create a service account (or pick an existing one).
3. Enable the **Google Drive API** for the project.
4. Generate a JSON key for the service account → download.
5. Save the JSON to `HeroAnimation/env/service_account.json` (create the `env/` dir if needed). Set `GDRIVE_SERVICE_ACCOUNT` in `webapp/.env.local` to that path.
6. Open the target Drive folder (must be a **Shared Drive**). Share it with the service account email (`<account>@<project>.iam.gserviceaccount.com`) as **Content Manager** or higher.
7. Copy the folder ID from the URL (the part after `/folders/`). Set `GDRIVE_ROOT_FOLDER_ID` in `webapp/.env.local`.

Skip end-to-end Drive testing here (depends on a real folder + content). Flag that the **Upload to GDrive** button in the webapp will validate the setup on first real use.

---

## Stage 7 — Smoke test

### 7a. Hero pipeline

Start the webapp:
```
cd webapp
npm run dev
```

Wait until the console shows `Ready in <Xms>` + the URL.

Walk the user through:
1. Open `http://localhost:3000`.
2. Click any hero (recommend **Blacksmith** as the showcase — a clean reference).
3. **Concepts** tab → pick a concept.
4. **Prompts** tab → pick a prompt.
5. Verify an FFLF exists for that hero (in the FFLF Builder section). If none, build one — composite the source PNG onto green background, save.
6. **Generate** → wait ~60s for fal-seedance to complete.
7. The new clip appears under the concept. Confirm it plays.
8. Click the clip → **Key** (Windows only) → wait ~1 min.
9. **Align** → **Save + recompose aligned**.
10. **Deliver (WebM 550)** → final WebM lands in `HeroAnimation/Output/Blacksmith/Final/`.

If any step fails, tail the job log at `/jobs` in the webapp.

### 7b. Unit progression smoke test (optional)

The unit-progression pipeline is skill-driven, not webapp-driven. Confirm with the user whether to run a smoke test:

```
/unit-progression Cavalry --level L2
```

The skill walks through generating L2 from the locked v3 chain. Confirms fal access + composite-keeper + project venv all work end-to-end on the unit side.

### 7c. macOS / Linux completion

On non-Windows: stop after hero **Generate** confirms (Step 6 above). Report to the user that keying needs a Windows host; the rest of the pipeline (generate, deliver without keying) works on their machine.

---

## Done

Once smoke tests pass, the environment is ready. Point the user at:

- `webapp/README.md` — webapp usage
- `.claude/skills/hero-animation/SKILL.md` — hero pipeline workflow
- `.claude/skills/unit-progression/SKILL.md` — unit-progression workflow
- `SETUP.md` — static reference for re-installs / troubleshooting

If a future install hits an issue not covered here, surface it to the EMTD team so this skill + `SETUP.md` can be updated.
