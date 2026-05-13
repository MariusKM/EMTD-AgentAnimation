# Filesystem & naming conventions

This document is the authoritative reference for what the app expects on disk. **The app only looks at files matching these conventions** — anything else is ignored.

## Hero IDs

A hero's ID is its source PNG filename minus the `.png` extension.

| Source file | Hero ID | Display name |
|---|---|---|
| `Source/Heroes Stylized/Blacksmith.png` | `Blacksmith` | `Blacksmith` |
| `Source/Heroes Stylized/New_King.png` | `New_King` | `New King` |
| `Source/Heroes Stylized/Count_Wilhelm.png` | `Count_Wilhelm` | `Count Wilhelm` |

Display name = ID with underscores replaced by spaces. Matching between source PNGs and `Output/<Hero>/` directories is **case-insensitive** but the canonical ID preserves the source-file casing.

The 15 canonical heroes are everything in `Source/Heroes Stylized/*.png` excluding files containing `copy` (case-insensitive).

## Per-hero directory layout

```
Output/<Hero>/
├── concepts.md                                   # the concept doc — see below
├── <Hero>_FFLF.png                               # FFLF without index (treated as index 0)
├── <Hero>_FFLF_<N>.png                           # FFLF with explicit index
├── Prompts/
│   └── <Model>/                                  # e.g. Seedance, Kling
│       └── <ConceptID>_<slug>.md                 # one per (concept, model) pair
├── Animations/
│   ├── <ConceptID>_<iter>.mp4                    # raw greenscreen output from fal
│   └── <ConceptID>_<iter>/                       # post-processed dir (after key+compose)
│       ├── FG/frame_NNNNNN.png                   # despilled foreground RGB frames
│       ├── Matte/frame_NNNNNN.png                # alpha matte frames (grayscale)
│       ├── Comp/frame_NNNNNN.png                 # composite preview frames
│       ├── Processed/frame_NNNNNN.png            # final RGBA frames
│       ├── anchors.json                          # alignment sidecar (eye + foot) — see below
│       ├── <ConceptID>_<iter>_fg_alpha.mov       # composed RGBA, PNG/QuickTime + alpha
│       ├── <ConceptID>_<iter>_fg_alpha.mp4       # H.264 preview composited over gray
│       ├── <ConceptID>_<iter>_fg_alpha_aligned.mov  # aligned-to-template variant (optional)
│       ├── <ConceptID>_<iter>_fg_alpha_aligned.mp4  # aligned-to-template mp4 preview
│       ├── <ConceptID>_<iter>_comp.mp4           # mask QA video
│       └── .corridorkey_manifest.json            # keying pipeline metadata
└── Final/
    ├── <ConceptID>_<iter>_final_<size>.webm      # delivery output, VP8 + Vorbis audio + alpha (default size=550)
    └── <Hero>_preview_<Clip>[xN]_<Clip>_<timestamp>.mp4  # shareable stitched preview, H.264 + AAC over HeroScreen.png mockup
```

Top-level (shared across all heroes):
```
HeroAnimation/
├── HeroScreen.png                                # mobile Hero Screen mockup used as the preview background
├── character-alignment.png                       # visual reference for the alignment template
├── character-alignment.json                      # normalized positions (canonical) — see below
├── character-alignment_960x960.png               # resized overlay (opaque) for editing-software overlay (generated)
├── character-alignment_960x960_overlay.png       # resized overlay (transparent, lines only) — used by the webapp's "Show alignment" toggle
├── character-alignment_550x550.png               # resized overlay (opaque) for final-resolution review (generated)
├── character-alignment_550x550_overlay.png       # resized overlay (transparent) for 550 final-review (generated)
└── scripts/
    ├── compose_frames.py                         # existing: FG+Matte → RGBA → mov/mp4
    ├── detect_anchors.py                         # eye+foot detection → anchors.json
    ├── deliver_webm.py                           # aligned .mov → VP8 WebM with alpha (muxes audio from raw Seedance mp4)
    ├── stitch_preview.py                         # delivered webms → H.264 MP4 composited over HeroScreen.png
    └── scale_template.py                         # resize character-alignment.png to any resolution
```

The app discovers everything by walking these paths. There's no index file — adding a new clip is just dropping the `.mp4` in the right place; adding a new prompt is just creating the `.md`.

## Concept IDs and clip names

| Pattern | Meaning | Example |
|---|---|---|
| `P<N>` | Power-movement concept | `P1`, `P5`, `P12` |
| `I<N>` | Idle-movement concept | `I2`, `I3` |
| `<ConceptID>_<iter>` | Clip name (concept + iteration) | `P1_0`, `P1_1`, `I2_0` |

Clip → concept linking is done **purely by filename prefix**. Drop a file called `P1_2.mp4` into `Output/Blacksmith/Animations/`, and it shows up under Blacksmith's P1 concept on next page load.

Clip names match the regex `^[PI]\d+_\d+(\.mp4)?$` (case-insensitive).

## `concepts.md` format

The app parses `### P# Title` and `#### P# Title` headings. Both 3- and 4-hash headings work — there are documents using each style in the project.

```markdown
# Hero Name — Animation Concepts

## Approved Shortlist

### Power Movement

#### P1: Ground Slam
- **Action**: ...
- **Emotional arc**: ...
- **Timing feel**: ...
- **VFX**: ...

#### P2: Shoulder Rest
- **Action**: ...

### Idle Movement

#### I2: Steady Breath
- **Subtle action**: ...

---

## Follow-ups

#### P5: Pistol Check — blocked
- **Notes**: ...
```

Rules used by [lib/concepts.ts](../lib/concepts.ts):

1. **Heading regex**: `^#{3,4}\s+([PI])(\d+)\s*[:\-—]\s*(.+?)\s*$`. The `:`, `-`, or `—` separator is required.
2. **Block end**: a new heading at the same depth, or any `## ` heading (next major section), or a standalone `---` line.
3. **Title** is everything after the separator. Trailing parentheticals (`"The Watchful King" (4s)`) are part of the title.
4. **Frontmatter, prose, and other sections are ignored.** They show up in the rendered markdown but the parser skips them.

When the app rewrites a concept block, it replaces only the slice from the heading line through the last non-blank body line, leaving every surrounding line byte-for-byte intact.

## Prompt file format

```markdown
# <ConceptID> — <Title> (<Model>)

**Source image**: `Source/Heroes Stylized/<Hero>.png`
**Duration target**: 5s
**Aspect**: 9:16

---

Subject:     <one paragraph describing the character>

Action:      <one paragraph describing what happens, beat by beat>

Camera:      <focal length, framing, movement>

Style:       <model-friendly style words>

Sound:       <SFX cues>

Constraints: <hard "no" list, duration, loop note>
```

The `---` is the boundary between author metadata (above) and the prompt body (below). When generating, the app sends only the body to seedance — the title and `**Source image**` / `**Duration**` / `**Aspect**` lines are for you, not the model.

Adding new metadata fields above `---` is safe; the model never sees them.

## FFLF (First Frame / Last Frame) images

The I2V workflow uses one image as the start frame and another (or the same) as the end frame. Because the source PNG is transparent and the keying pipeline expects a solid chroma background, you compose an FFLF image: source PNG over a solid color (typically green `#00ff00`).

Naming:

| Pattern | Notes |
|---|---|
| `<Hero>_FFLF.png` | Unnumbered. Treated as index 0 by the auto-incrementer. |
| `<Hero>_FFLF_<N>.png` | Explicit index. `N` is a non-negative integer. |

Examples:

| Hero | Files in `Output/<Hero>/` |
|---|---|
| Blacksmith | `Blacksmith_FFLF.png` |
| New King | `New_King_FFLF_0.png`, `New_King_FFLF_1.png` |

The Generate modal lists every `<Hero>_FFLF*.png` plus the bare source PNG as candidate images. You can pick different FFLFs for start vs. end to get an A→B animation, or pick the same one for a closed loop.

When you build a new FFLF in-app:
- The default chroma is green `#00ff00` (matches the keying pipeline's default `birefnet+chroma`). Use blue `#0000ff` for heroes whose VFX include green elements (Dragonwitch's flame, etc.). The keying job auto-detects the screen color from the raw mp4's corner pixels, persists it to `clip_meta.screen_color`, and on blue runs a B↔G-swap-based pipeline (see [architecture.md](architecture.md#blue-screen-handling-swap-based)) that works around CorridorKey's green-only despill stage. The detected/forced value is shown as a small green/blue pill on the clip row.
- The default canvas is 9:16 portrait at 720×1280.
- The hero is auto-fit to ~85% of the smaller axis on load.
- Save picks the next free index automatically.

## Alignment template

`HeroAnimation/character-alignment.json` — normalized (0–1) target positions. Shared across all heroes and all output resolutions. The actual values are measured from `character-alignment.png` (1000×1000).

```json
{
  "eyeLevelY": 0.41,
  "groundY": 0.88,
  "centerX": 0.50,
  "eyeRangeHalfWidth": 0.15,
  "outputCanvas": { "mode": "source" }
}
```

- All `Y` values are fractions of canvas height (top=0, bottom=1).
- `outputCanvas.mode`:
  - `"source"` — aligned outputs preserve the source video resolution (default). Animations at 960×960 stay 960×960.
  - `"template"` — alias for a fixed square output, used rarely.
- Because positions are normalized, the same template works unchanged across dev (960×960 animations) and final delivery (550×550 WebM).

To generate resolution-specific overlay PNGs, run:

```bash
# Plain resized overlays (opaque pink bg) — for editor overlay tracks that support blend modes.
python HeroAnimation/scripts/scale_template.py 960 550

# With --transparent, additionally writes lines-only PNGs (alpha bg) — used by the
# webapp's "Show alignment" toggle to composite over video without darkening it.
python HeroAnimation/scripts/scale_template.py 960 550 --transparent
```

Outputs (alongside the master template):

| File | Use |
|---|---|
| `character-alignment_<W>x<H>.png` | Opaque overlay — drag into After Effects / DaVinci / Premiere, set blend to Multiply/Darken. |
| `character-alignment_<W>x<H>_overlay.png` | Transparent overlay (lines only, alpha elsewhere) — consumed by the webapp's "Show alignment" toggle. Must be regenerated if you edit the master PNG. |

## `anchors.json` sidecar

One per clip, written into `Output/<Hero>/Animations/<ClipName>/anchors.json`. Generated by [detect_anchors.py](../../HeroAnimation/scripts/detect_anchors.py) or edited by hand via the AlignmentModal in the UI.

```json
{
  "schemaVersion": 1,
  "frame": { "width": 960, "height": 960, "index": 0, "path": "Processed/frame_000000.png" },
  "eye":  { "x": 469.54, "y": 318.08, "confidence": 0.9,  "source": "mediapipe" },
  "foot": { "x": 537.91, "y": 768.0,  "confidence": 1.0,  "source": "alpha-bbox" },
  "detectedAt": "2026-04-21T09:35:48+00:00",
  "notes": ""
}
```

- **Per-clip, not per-hero.** Each clip has its own anchors because FFLF poses vary between concepts.
- `eye.source`: `"mediapipe"` (FaceMesh landmarks 33+263 averaged), `"haar"` (OpenCV Haar eye cascade fallback), `"heuristic"` (alpha-bbox top + 0.18 × height, last resort), or `"manual"` (user override from the modal).
- `foot.source`: `"alpha-bbox"` (bottom-most non-transparent row; works for most heroes, unreliable for long cloaks/robes) or `"manual"`.
- Coordinates are in **source-frame pixels** (the `frame.width`/`frame.height` canvas) — so they map 1:1 onto every other frame in the same clip because I2V preserves framing.
- The file is the canonical input to [compose_frames.py](../../HeroAnimation/scripts/compose_frames.py) `--align-to-template`.

## Job log files

`data/logs/<jobId>.log` — plain text, append-only.

Format conventions used by the worker / poller:

```
[2026-04-15T09:42:11.123Z] $ <command line>
... stdout/stderr interleaved ...
[exit 0]

[seedance prep] start=... end=...
[seedance prep] endImageUrl=https://...
[seedance submit] ["--mode", "image-to-video", ...]
[seedance stdout]
... tool output ...
[seedance error] <stack trace if it crashed>
[poll 2026-04-15T09:43:00.000Z] state=IN_PROGRESS
```

Last ~200 KB are streamed by `GET /api/jobs/[id]/log` and shown in the Jobs page log modal.

## SQLite schema

`data/app.db`. WAL mode. Created by [lib/db.ts](../lib/db.ts) on first request.

```sql
CREATE TABLE concept_meta (
  hero_id    TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  favorite   INTEGER NOT NULL DEFAULT 0,
  rating     INTEGER,                              -- 1..5 or NULL
  notes      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (hero_id, concept_id)
);

CREATE TABLE clip_meta (
  hero_id    TEXT NOT NULL,
  clip_name  TEXT NOT NULL,
  favorite   INTEGER NOT NULL DEFAULT 0,
  rating     INTEGER,
  notes      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (hero_id, clip_name)
);

CREATE TABLE jobs (
  id            TEXT PRIMARY KEY,                  -- uuid
  kind          TEXT NOT NULL,                     -- 'seedance' | 'key+compose' | 'deliver' | 'gdrive-upload'
  status        TEXT NOT NULL,                     -- 'queued' | 'running' | 'done' | 'error' | 'cancelled'
  hero_id       TEXT,
  concept_id    TEXT,
  clip_name     TEXT,
  payload_json  TEXT,                              -- JSON, see API doc
  result_json   TEXT,                              -- JSON, see API doc
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  started_at    TEXT,
  finished_at   TEXT,
  pid           INTEGER                            -- last child pid (key+compose only)
);

CREATE INDEX jobs_status_kind ON jobs(status, kind);
CREATE INDEX jobs_created     ON jobs(created_at DESC);
```

`hero_id` joins to nothing — the heroes / concepts / clips tables don't exist because that data is the filesystem. The string identifiers are the join key.

To inspect:
```bash
sqlite3 webapp/data/app.db
.mode column
.headers on
SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10;
```

---

