import path from "node:path";

function env(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env var ${name}`);
}

// Auto-detect repo root from cwd. Webapp is started from <repo>/webapp/ via
// `npm run dev`, so cwd's parent is the repo root. All other defaults derive
// from PROJECT_ROOT — set PROJECT_ROOT explicitly in webapp/.env.local to
// override (e.g. when running webapp from somewhere other than its own dir).
const DEFAULT_PROJECT_ROOT = path.resolve(process.cwd(), "..").replace(/\\/g, "/");

export const PROJECT_ROOT = env("PROJECT_ROOT", DEFAULT_PROJECT_ROOT).replace(/\\/g, "/");
export const HEROANIM_ROOT = env("HEROANIM_ROOT", path.posix.join(PROJECT_ROOT, "HeroAnimation")).replace(/\\/g, "/");
export const SOURCE_HEROES = path.posix.join(HEROANIM_ROOT, "Source/Heroes Stylized");
export const OUTPUT_ROOT = path.posix.join(HEROANIM_ROOT, "Output");

export const VENV_PYTHON = env(
  "VENV_PYTHON",
  process.platform === "win32"
    ? path.posix.join(PROJECT_ROOT, ".venv/Scripts/python.exe")
    : path.posix.join(PROJECT_ROOT, ".venv/bin/python"),
).replace(/\\/g, "/");

// Path to a real bash binary. On Windows, `bash` on PATH may resolve to WSL
// (C:\Windows\System32\bash.exe), which fails to run our shell scripts. Force Git Bash by default.
export const BASH_BIN = env(
  "BASH_BIN",
  process.platform === "win32" ? "C:/Program Files/Git/usr/bin/bash.exe" : "bash",
).replace(/\\/g, "/");

export const SEEDANCE_SCRIPT = env(
  "SEEDANCE_SCRIPT",
  path.posix.join(PROJECT_ROOT, ".claude/skills/fal-api-skills/skills/fal-seedance-2/scripts/seedance-video.sh"),
).replace(/\\/g, "/");

export const FAL_UPLOAD_SCRIPT = env(
  "FAL_UPLOAD_SCRIPT",
  path.posix.join(PROJECT_ROOT, ".claude/skills/fal-api-skills/skills/fal-generate/scripts/upload.sh"),
).replace(/\\/g, "/");

// Default to the sibling-of-repo install path used by SETUP.md / the /setup
// skill. Override via env if EZ-CorridorKey lives elsewhere on this machine.
const DEFAULT_EZCK = path.posix.join(PROJECT_ROOT, "../EZ-CorridorKey");

export const KEYCLIPS_PYTHON = env(
  "KEYCLIPS_PYTHON",
  path.posix.join(DEFAULT_EZCK, ".venv/Scripts/python.exe"),
).replace(/\\/g, "/");

export const KEYCLIPS_SCRIPT = env(
  "KEYCLIPS_SCRIPT",
  path.posix.join(DEFAULT_EZCK, "scripts/batch_pipeline.py"),
).replace(/\\/g, "/");

export const COMPOSE_PYTHON = env(
  "COMPOSE_PYTHON",
  process.platform === "win32"
    ? path.posix.join(PROJECT_ROOT, ".venv/Scripts/python.exe")
    : path.posix.join(PROJECT_ROOT, ".venv/bin/python"),
).replace(/\\/g, "/");

export const COMPOSE_SCRIPT = env(
  "COMPOSE_SCRIPT",
  path.posix.join(HEROANIM_ROOT, "scripts/compose_frames.py"),
).replace(/\\/g, "/");

export const DETECT_ANCHORS_SCRIPT = env(
  "DETECT_ANCHORS_SCRIPT",
  path.posix.join(HEROANIM_ROOT, "scripts/detect_anchors.py"),
).replace(/\\/g, "/");

export const DELIVER_WEBM_SCRIPT = env(
  "DELIVER_WEBM_SCRIPT",
  path.posix.join(HEROANIM_ROOT, "scripts/deliver_webm.py"),
).replace(/\\/g, "/");

export const STITCH_PREVIEW_SCRIPT = env(
  "STITCH_PREVIEW_SCRIPT",
  path.posix.join(HEROANIM_ROOT, "scripts/stitch_preview.py"),
).replace(/\\/g, "/");

export const SWAP_BG_SCRIPT = env(
  "SWAP_BG_SCRIPT",
  path.posix.join(HEROANIM_ROOT, "scripts/swap_bg_channels.py"),
).replace(/\\/g, "/");

export const HERO_SCREEN_MOCKUP = env(
  "HERO_SCREEN_MOCKUP",
  path.posix.join(HEROANIM_ROOT, "HeroScreen.png"),
).replace(/\\/g, "/");

export const ALIGNMENT_TEMPLATE = env(
  "ALIGNMENT_TEMPLATE",
  path.posix.join(HEROANIM_ROOT, "character-alignment.json"),
).replace(/\\/g, "/");

export const DATA_DIR = path.posix.join(process.cwd().replace(/\\/g, "/"), "data");
export const DB_PATH = path.posix.join(DATA_DIR, "app.db");
export const LOG_DIR = path.posix.join(DATA_DIR, "logs");

export const GDRIVE_SERVICE_ACCOUNT = env(
  "GDRIVE_SERVICE_ACCOUNT",
  path.posix.join(DATA_DIR, "service_account.json"),
).replace(/\\/g, "/");
export const GDRIVE_ROOT_FOLDER_ID = process.env.GDRIVE_ROOT_FOLDER_ID ?? "";
