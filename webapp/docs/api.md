# API reference

All routes live under `app/api/`. Every route uses `export const dynamic = "force-dynamic"` (no caching).

Path params are URL-decoded server-side. `[...path]` is a Next catch-all that joins segments with `/`.

## Heroes

### `GET /api/heroes`

List all heroes from `Source/Heroes Stylized/*.png` plus any extra `Output/*` dirs.

| Query param | Purpose |
|---|---|
| `refresh=1` | Skip the 3s scan cache. |

**Response**
```json
{
  "heroes": [
    {
      "id": "Blacksmith",
      "displayName": "Blacksmith",
      "kind": "hero",
      "sourceImageRel": "Source/Heroes Stylized/Blacksmith.png",
      "conceptCount": 8,
      "clipCount": 6,
      "favoriteCount": 0,
      "hasOutput": true
    }
  ]
}
```

### `GET /api/heroes/[hero]`

Hero detail: every concept, every prompt file (with raw markdown content), every clip (raw + processed paths), every FFLF, plus merged metadata.

**Response (abridged)**
```json
{
  "hero": {
    "id": "Blacksmith",
    "displayName": "Blacksmith",
    "sourceImageRel": "Source/Heroes Stylized/Blacksmith.png",
    "hasOutputDir": true,
    "hasConceptsMd": true,
    "fflfs": [{ "name": "Blacksmith_FFLF.png", "index": null, "relPath": "Output/Blacksmith/Blacksmith_FFLF.png" }],
    "concepts": [
      {
        "id": "P1",
        "kind": "power",
        "title": "Ground Slam",
        "slug": "P1_Ground_Slam",
        "rawMarkdown": "#### P1: Ground Slam\n- **Action**: ...",
        "meta": { "favorite": false, "rating": null, "notes": null },
        "promptFiles": [
          { "model": "Seedance", "fileName": "P1_Ground_Slam.md", "rawMarkdown": "# P1 — Ground Slam ..." }
        ],
        "clips": [
          {
            "name": "P1_0",
            "conceptId": "P1",
            "iter": 0,
            "rawMp4Rel": "Output/Blacksmith/Animations/P1_0.mp4",
            "processed": {
              "fgAlphaMovRel":         "Output/Blacksmith/Animations/P1_0/P1_0_fg_alpha.mov",
              "fgAlphaMp4Rel":         "Output/Blacksmith/Animations/P1_0/P1_0_fg_alpha.mp4",
              "compMp4Rel":            "Output/Blacksmith/Animations/P1_0/P1_0_comp.mp4",
              "fgAlphaMovAlignedRel":  "Output/Blacksmith/Animations/P1_0/P1_0_fg_alpha_aligned.mov",
              "fgAlphaMp4AlignedRel":  "Output/Blacksmith/Animations/P1_0/P1_0_fg_alpha_aligned.mp4",
              "deliveredWebms": [{ "size": 550, "rel": "Output/Blacksmith/Final/P1_0_final_550.webm" }],
              "frameCount": 121,
              "hasAnchors": true
            },
            "meta": { "favorite": false, "rating": null, "notes": null }
          }
        ]
      }
    ]
  }
}
```

`processed` is `null` when the clip hasn't been keyed yet.

### `POST /api/heroes/[hero]/fflf`

Save a base64-encoded PNG as the next `<Hero>_FFLF_<N>.png` in the hero output dir.

**Body**
```json
{ "pngBase64": "data:image/png;base64,iVBORw0KGgo...", "index": 3 }
```

`pngBase64` may be a full data URL or just the base64 payload. `index` is optional — if omitted the route picks the next free integer (treats unnumbered `_FFLF.png` as 0).

**Response**
```json
{
  "ok": true,
  "fflf": { "name": "Blacksmith_FFLF_2.png", "index": 2, "relPath": "Output/Blacksmith/Blacksmith_FFLF_2.png" }
}
```

Errors with 400 if the decoded blob isn't a valid PNG (signature checked).

### `POST /api/heroes/[hero]/auto-align-source`

Run eye + foot detection on a single hero-related PNG. Used by the FFLFBuilder's "Auto-align to template" button so the builder can snap the source image onto the Eye Level / Ground lines before saving an FFLF. Synchronous (~1s).

**Body** (all optional)
```json
{ "imageRel": "Source/Heroes Stylized/New_King.png" }
```

- `imageRel` — path relative to `HEROANIM_ROOT`. Must resolve inside the root (rejects traversal with 403).
- If omitted, defaults to `Source/Heroes Stylized/<hero>.png`.

**Response**
```json
{
  "ok": true,
  "anchors": {
    "frame": { "width": 2048, "height": 2048 },
    "eye":   { "x": 991.35, "y": 462.76, "confidence": 0.9, "source": "mediapipe" },
    "foot":  { "x": 1224.88, "y": 2023.0, "confidence": 1.0, "source": "alpha-bbox" }
  },
  "imagePath": "d:/.../Source/Heroes Stylized/New_King.png"
}
```

Returns a **partial** anchors dict — no `frame.path`, `detectedAt`, or `schemaVersion`, since nothing is written to disk. The FFLFBuilder uses `frame.width/height` plus `eye` and `foot` to compute the required scale + offset on the builder canvas.

Errors with 500 + the full stdout/stderr if `detect_anchors.py --image` fails. MediaPipe / OpenCV chatter on stderr is harmless — the endpoint parses JSON from the last non-empty stdout line.

## Concepts

### `PATCH /api/concepts/[hero]/[conceptId]`

Update concept metadata, raw markdown, or both. Any subset of fields may be sent.

**Body**
```json
{
  "favorite": true,
  "rating": 4,
  "notes": "approved 2026-04-15",
  "rawMarkdown": "#### P1: Ground Slam\n- **Action**: ..."
}
```

If `rawMarkdown` is provided, the matching block in `Output/<Hero>/concepts.md` is replaced and the scan cache is invalidated. Other fields persist to `concept_meta` in SQLite.

**Response**
```json
{ "ok": true, "meta": { "favorite": true, "rating": 4, "notes": null }, "rawMarkdown": "..." }
```

## Clips

### `PATCH /api/clips/[hero]/[clipName]`

Update clip metadata only (favorite / rating / notes / marked_upload / marked_key / edge_fade / overflow_size / screen_color).

**Body**
```json
{ "favorite": true, "rating": 5, "edgeFade": 0.2, "overflowSize": 768, "screenColor": "blue" }
```

- `edgeFade` ∈ [0, 1] — soft circular alpha mask, baked into the WebM the next time `/api/jobs/deliver` runs on this clip.
- `overflowSize` (px, integer ≥ 64) or `null` — outer canvas size for delivery. When set above the standard delivery size (550), `deliver_webm.py` encodes the WebM at this larger resolution with the actual aligned content centred in a 550×550 region surrounded by transparent padding. Use this for clips whose action overshoots the in-game slot — the engine can position the larger asset on the same slot centre and the overshoot renders past the slot edges. Pass `null` to clear.
- `screenColor` ∈ `"green" | "blue" | null` — overrides the chroma channel passed to `batch_pipeline.py` for the next keying job on this clip. `null` clears (next key falls back to auto-detect).

**Response**
```json
{ "ok": true, "meta": { "favorite": true, "rating": 5, "notes": null, "edgeFade": 0.2, "overflowSize": 768, "screenColor": "blue" } }
```

### `GET /api/clips/[hero]/[clipName]/files`

List every PNG frame in `FG/Matte/Comp/Processed/` plus every video / json output at the clip dir root.

**Response**
```json
{
  "clipName": "P1_0",
  "clipDirRel": "Output/Blacksmith/Animations/P1_0",
  "frames": {
    "FG":        ["Output/Blacksmith/Animations/P1_0/FG/frame_000000.png", ...],
    "Matte":     [...],
    "Comp":      [...],
    "Processed": [...]
  },
  "outputs": [
    { "name": "P1_0_fg_alpha.mov", "rel": "Output/Blacksmith/Animations/P1_0/P1_0_fg_alpha.mov", "ext": ".mov", "sizeBytes": 8421376 },
    { "name": "P1_0_fg_alpha.mp4", "rel": "...",                                                 "ext": ".mp4", "sizeBytes": 1245312 },
    { "name": "P1_0_comp.mp4",     "rel": "...",                                                 "ext": ".mp4", "sizeBytes": 2104256 },
    { "name": ".corridorkey_manifest.json", "rel": "...", "ext": ".json", "sizeBytes": 412 }
  ]
}
```

Each subdir is omitted from `frames` if missing. Frames are sorted lexicographically (so `frame_000000.png` first).

## Alignment

Alignment lives per-clip as an `anchors.json` sidecar (see [conventions.md § anchors.json](conventions.md#anchorsjson-sidecar)). These routes read/write it.

### `GET /api/clips/[hero]/[clipName]/anchors`

Return the clip's `anchors.json`, or `{ anchors: null }` if it doesn't exist yet.

**Response**
```json
{
  "anchors": {
    "schemaVersion": 1,
    "frame": { "width": 960, "height": 960, "index": 0, "path": "Processed/frame_000000.png" },
    "eye":  { "x": 469.54, "y": 318.08, "confidence": 0.9, "source": "mediapipe" },
    "foot": { "x": 537.91, "y": 768.0,  "confidence": 1.0, "source": "alpha-bbox" },
    "detectedAt": "2026-04-21T09:35:48+00:00",
    "notes": ""
  },
  "path": "d:/.../Output/Blacksmith/Animations/P1_0/anchors.json"
}
```

### `POST /api/clips/[hero]/[clipName]/anchors`

Re-run auto-detection on this single clip. Synchronous (fast — ~1s per clip). Overwrites any existing `anchors.json`. Used by the "Re-detect" button inside the AlignmentModal.

**Response**
```json
{ "ok": true, "anchors": { ...see GET... }, "path": "...", "log": "detect_anchors.py stdout" }
```

### `PUT /api/clips/[hero]/[clipName]/anchors`

Manual override from the AlignmentModal (draggable crosshairs). Writes `source: "manual"` and `confidence: 1.0` for both anchors.

**Body**
```json
{
  "eye":  { "x": 470, "y": 318 },
  "foot": { "x": 540, "y": 770 },
  "notes": "scepter pose, corrected eye for crown tilt"
}
```

**Response**
```json
{ "ok": true, "anchors": { ...new anchors object... }, "path": "..." }
```

### `POST /api/clips/[hero]/[clipName]/anchors/propagate`

Copy this clip's `anchors.json` to one or more sibling clips on the same hero, optionally enqueueing a recompose for each. Wired to the AlignmentModal's "Apply to other clips…" button.

Used to pin a known-good alignment across siblings that share the same FFLF — works around per-clip anchor drift caused by tiny pixel differences in the keyed first frame (Seedance generates slightly different output even for identical FFLF input, BiRefNet keying then magnifies the difference, alpha-bbox foot detection latches onto the drifted matte edge → ~1% scale variation between deliverables).

**Body**
```json
{
  "targetClipNames": ["P1_1", "P1_2", "I3_0"],
  "recompose": true,
  "notes": "pinned from P1_0 reference frame"
}
```

- `targetClipNames` — clips on the same hero, none of which can be the source clip.
- `recompose` — defaults to `true`. Enqueues a `key+compose` job per target with `skipKeying: true, alignToTemplate: true` (same shape as `/api/jobs/recompose`).
- `notes` — optional override for the `notes` field written into each target's anchors.json. Default note records the source clip + timestamp.

**Coordinate scaling.** Eye/foot pixel coords are auto-scaled if a target's first Processed frame has different dimensions than the source's (read from PNG IHDR). For our pipeline all clips end up at 960×960 so this is usually a no-op, but it keeps the endpoint robust if mixed dimensions ever appear.

The new anchors record is marked `source: "copied-from-<sourceClipName>"` and `confidence: 1.0` so it's distinguishable from auto-detected/manual anchors in the data.

**Response**
```json
{
  "copied": [
    { "clipName": "P1_1", "recomposeJobId": "abc…" },
    { "clipName": "P1_2", "recomposeJobId": "def…" }
  ],
  "errors": [
    { "clipName": "I3_0", "error": "Target clip dir not found: …" }
  ]
}
```

### `GET /api/clips/[hero]/[clipName]/first-frame`

Serves the PNG of the clip's frame 0 (from `Processed/` if available, otherwise `FG/`). Used by the AlignmentModal to render the draggable canvas.

Returns the raw image bytes with `Content-Type: image/png`.

### `GET /api/alignment-template`

Returns the normalized template config (from `HeroAnimation/character-alignment.json`, or a built-in default if the file is missing). Used by the AlignmentModal to draw the magenta guide lines.

**Response**
```json
{
  "template": {
    "eyeLevelY": 0.41,
    "groundY": 0.88,
    "centerX": 0.50,
    "eyeRangeHalfWidth": 0.15,
    "outputCanvas": { "mode": "source" }
  },
  "path": "d:/.../HeroAnimation/character-alignment.json",
  "fallback": false
}
```

`fallback: true` means the JSON file wasn't found and defaults were returned.

## Prompts

### `GET /api/prompts/[hero]/[model]/[fileName]`

Return the raw markdown of one prompt file.

**Response**
```json
{ "rawMarkdown": "# P1 — Ground Slam ...", "path": "/abs/path/to/P1_Ground_Slam.md" }
```

### `PATCH /api/prompts/[hero]/[model]/[fileName]`

Replace the file's content.

**Body**
```json
{ "rawMarkdown": "# P1 — Ground Slam (Seedance 2.0)\n\n---\n\nSubject: ..." }
```

`model` and `fileName` are validated to reject `/`, `\`, and `..` segments (no path traversal).

## Files (static)

### `GET /api/files/[...path]`

Serve any file under `HEROANIM_ROOT` by its relative path. Used by the UI for `<img>` and `<video>` sources.

- Path is normalized and checked against the root — anything that escapes returns 403.
- MIME type from the file extension (`.mp4`, `.mov`, `.png`, `.md`, etc.).
- Honors `Range:` headers — returns `206 Partial Content` with `Content-Range` so the browser can seek videos.
- `Cache-Control: no-cache` to ensure newly written files (e.g. fresh seedance output) show up immediately.

## Config

### `GET /api/config/mockup-slot`

Return the persisted character-slot rect used by the Hero Screen preview modal (both for live overlay positioning and for the server-side stitched export). Stored in SQLite `app_config` under the key `mockup_slot_rect`.

**Response**
```json
{
  "slot":    { "x": 0.08, "y": 0.18, "w": 0.84, "h": 0.388 },
  "default": { "x": 0.08, "y": 0.18, "w": 0.84, "h": 0.38  }
}
```

All four values are **normalized** (multiply by the mockup's pixel dimensions to get absolute coords). `w` and `h` may exceed `1.0` and `x`/`y` may be negative when the slot is scaled beyond the mockup — ffmpeg's `overlay` filter accepts this. The rect is app-wide (not per-hero) so the same positioning applies to every hero preview.

> **Note:** the soft circular alpha mask was previously stored here as `edgeFade`, but is now per-clip in `clip_meta.edge_fade` (see `PATCH /api/clips/[hero]/[clipName]`). The slot config no longer carries a fade.

### `PUT /api/config/mockup-slot`

Overwrite the rect. Called by the preview modal every time the user drags the overlay or moves the scale slider.

**Body**
```json
{ "x": 0.08, "y": 0.18, "w": 0.84, "h": 0.388 }
```

All four keys are required and must be finite numbers. Values are clamped in [lib/config.ts](../lib/config.ts) to size `0..5` and position `-5..5` to avoid pathological input crashing ffmpeg.

**Response** — the stored (clamped) rect, same shape as `GET`.

## Jobs

### `GET /api/jobs`

List jobs newest-first.

| Query param | Default | Notes |
|---|---|---|
| `status` | (all) | Comma-separated subset of `queued,running,done,error,cancelled`. |
| `kind`   | (all) | One of `seedance`, `key+compose`, `deliver`, `gdrive-upload`, `preview-stitch`. |
| `limit`  | `100` | Max rows. |

**Response**
```json
{
  "jobs": [
    {
      "id": "0e7c…",
      "kind": "seedance",
      "status": "running",
      "hero_id": "Blacksmith",
      "concept_id": "P1",
      "clip_name": null,
      "payload": { "model": "Seedance", "tier": "pro", "duration": 5, "promptFile": "P1_Ground_Slam.md", "startImage": "...", "endImage": "...", "sameImage": true },
      "result":  { "stage": "submitted", "requestId": "uuid", "tier": "pro", "endImageUrl": "https://v3.fal.media/..." },
      "created_at":  "2026-04-15 09:42:11",
      "started_at":  "2026-04-15 09:42:14",
      "finished_at": null,
      "pid": null
    }
  ]
}
```

### `GET /api/jobs/[id]`

Single job by id.

### `DELETE /api/jobs/[id]`

Cancel a job.

- `queued` → marked `cancelled` immediately.
- Active `key+compose` (the one the worker is running) → SIGTERM the child, mark `cancelled`. Returns `{status: "cancelling"}`.
- `running` `seedance` → marked `cancelled` (fal continues processing on its end; the poller will simply ignore the result).

### `POST /api/jobs/seedance`

Submit an image-to-video generation.

**Body**
```json
{
  "heroId": "Blacksmith",
  "conceptId": "P1",
  "model": "Seedance",
  "promptFile": "P1_Ground_Slam.md",
  "promptText": "Subject: ...",
  "startImageRel": "Output/Blacksmith/Blacksmith_FFLF.png",
  "endImageRel":   "Output/Blacksmith/Blacksmith_FFLF.png",
  "duration": 5,
  "aspect": "9:16",
  "tier": "pro",
  "sourceImagePath": "/abs/path/override"
}
```

- Either `promptFile` or `promptText` must be provided. If `promptFile`, the file is read and `extractPromptText()` is applied — only the body **after** the first `---` is sent.
- `startImageRel` / `endImageRel` are paths relative to `HEROANIM_ROOT`. If omitted, falls back to `sourceImagePath` then to `Source/Heroes Stylized/<Hero>.png`.
- The end image is always uploaded to fal first (via `upload.sh`) so it can be passed as `--end-image-url`. This forces a closed-loop generation even when start == end.
- `tier`: `"pro"` (default, highest quality) or `"fast"`.

**Response**
```json
{ "jobId": "0e7c…", "status": "queued" }
```

The actual fal submission happens in a fire-and-forget background task — poll `GET /api/jobs/[id]` to track progress.

### `POST /api/jobs/key`

Queue keying + compose-frames for one or more clips.

**Body**
```json
{
  "clips": [
    { "heroId": "Blacksmith", "clipName": "P1_0" },
    { "heroId": "Blacksmith", "clipName": "P1_1" }
  ],
  "despill": 0.3,
  "alphaMode": "birefnet+chroma",
  "screenColor": "auto"
}
```

- `despill`, `alphaMode`, and `screenColor` may be set at the batch level or overridden per-clip (each entry in `clips` accepts the same three optional fields).
- `screenColor`: `"auto" | "green" | "blue"`. `"auto"` (default) prefers an existing `clip_meta.screen_color`, otherwise samples the raw mp4's frame-0 corners via ffmpeg and picks whichever of green/blue dominates over red. The resolved value is persisted to `clip_meta` so reruns and the UI badge stay consistent. On `blue`, the worker also passes `--chroma-key 0000FF` to `batch_pipeline.py`.

**Response**
```json
{
  "enqueued": [
    { "jobId": "abc…", "heroId": "Blacksmith", "clipName": "P1_0", "screenColor": "green" },
    { "jobId": "def…", "heroId": "Blacksmith", "clipName": "P1_1", "screenColor": "blue" }
  ],
  "errors": []
}
```

Per-clip `errors` array entries look like `{ "heroId": "...", "clipName": "...", "error": "Raw clip not found: ..." }`. Common cause: the raw `<ClipName>.mp4` doesn't exist (still generating, or wrong name).

### `POST /api/jobs/recompose`

Compose-only re-run. Skips keying entirely and reuses the existing `Processed/` frames — fast (seconds per clip). Optionally applies `--align-to-template` using each clip's `anchors.json`. Used by the "Save + recompose aligned" action in the AlignmentModal and by the "Recompose all aligned" button on the hero workspace.

**Body**
```json
{
  "clips": [{ "heroId": "Blacksmith", "clipName": "P1_0" }],
  "alignToTemplate": true
}
```

- `alignToTemplate` defaults to `true` on this endpoint.
- Internally enqueues `key+compose` jobs with `skipKeying: true, alignToTemplate: true` in their payloads. Aligned outputs land in the clip dir as `<ClipName>_fg_alpha_aligned.{mov,mp4}`; originals and `<ClipName>_comp.mp4` are untouched.
- Fails per-clip if the processed dir doesn't exist (no keyed frames to re-compose).

**Response** — same `enqueued` / `errors` shape as `/api/jobs/key`.

### `POST /api/jobs/detect-anchors`

Batch auto-detect anchors for every processed clip under a hero's `Animations/` dir. Synchronous — runs `detect_anchors.py --all` against the hero's animation directory. Wired to the "Align all" button.

**Body**
```json
{ "heroId": "Blacksmith", "force": false }
```

- `force: true` regenerates `anchors.json` even for clips that already have one. Default: skip clips whose sidecar already exists.

**Response**
```json
{ "ok": true, "stdout": "  ok: P1_0  eye=(470,318) conf=0.90 [mediapipe] foot=(538,768)\n..." }
```

Errors with 500 and the full stdout/stderr if any clip fails. The endpoint is a single spawnSync, so partial progress is visible in the stdout.

### `POST /api/jobs/deliver`

Queue final-delivery encodes (VP8/WebM with alpha, default 960×960). Writes to `Output/<Hero>/Final/<ClipName>_final_<size>.webm`.

**Body**
```json
{
  "clips": [{ "heroId": "Blacksmith", "clipName": "P1_0" }],
  "size": 960,
  "allowUnaligned": false
}
```

- `size` defaults to `960` — the aligned MOV is rendered at the alignment-template canvas size (typically 960), so this is a pass-through with no scaling. Pass `550` (or any positive integer) to downscale. The selection-bar UI exposes a 550 / 720 / 960 segmented control next to the Deliver button.
- `allowUnaligned: false` (default) rejects clips whose `<ClipName>_fg_alpha_aligned.mov` doesn't exist — per-clip `errors` entry, nothing enqueued. Set `true` to fall back to the un-aligned `<ClipName>_fg_alpha.mov`.
- Each enqueued job has `usedUnaligned: boolean` so the `/jobs` view can surface when an un-aligned source was used.
- **Audio is muxed in from the raw Seedance `<ClipName>.mp4`** (VP8 video + Vorbis audio). The aligned `.mov` is RGBA PNG-in-MOV and never carries audio, so the delivery job reads the raw clip's audio track and muxes it at encode time. If the raw mp4 is missing or has no audio stream, the job logs `[audio] …` and falls back to a silent WebM.
- **`edge_fade` is auto-pulled from `clip_meta`** for each clip. If non-zero, `deliver_webm.py` applies a per-frame `geq` alpha multiplier (radial soft mask) before VP8 encode, baking the fade into the deliverable so the in-game player gets a soft edge instead of hard clipping.
- **`overflow_size` is auto-pulled from `clip_meta`** for each clip. If set above `--size`, the script scales the content to `--size`, then `pad`s to `--overflow-size` with transparent padding centred — the WebM is bigger but the central content region matches the standard slot.

**Response**
```json
{
  "enqueued": [{ "jobId": "abc…", "heroId": "Blacksmith", "clipName": "P1_0", "usedUnaligned": false }],
  "errors":   []
}
```

### `POST /api/jobs/gdrive`

Queue an upload of selected clips' files to Google Drive. Files land in `<GDRIVE_ROOT_FOLDER_ID>/<HeroId>/<destination>/`; subfolders are created on demand the first time a hero uploads into them. When the request resolves files across more than one destination (e.g. Auto routing splits a clip into both `Final/` and `Final_960/`), the worker resolves each Drive subfolder on demand, with per-batch caching.

**Body**
```json
{
  "heroId": "Blacksmith",
  "clipNames": ["P1_0", "I1_0"],
  "fileKind": "deliveredWebm",
  "destination": "Final"
}
```

- `destination` is one of `"Auto"`, `"Final"`, `"Final_960"`, or `"Previs"`. Unknown values fall back to `"Final"`.
  - `Final/` — legacy client-delivery folder for sub-960 sizes (550/720). Re-uploads of the same filename replace in place.
  - `Final_960/` — full-source-resolution 960×960 delivery folder. Same replace-in-place semantics. Kept separate from `Final/` so 550s aren't overwritten when 960s land.
  - `Auto` *(suggested default in the UI for `deliveredWebm`)* — splits each clip's webms per file: `<clip>_final_960.webm` → `Final_960/`, anything else → `Final/`. Useful when a clip has both sizes locally.
  - `Previs/` — team-share folder for in-progress generations and previews. Receives every webm regardless of size.
  - **Filtering:** when `fileKind` is `deliveredWebm` and the destination is the explicit `Final` or `Final_960`, the route only uploads webms whose `_final_<size>.webm` suffix matches that bucket (≥960 → `Final_960`, otherwise → `Final`). This prevents a "send to Final_960" request from accidentally re-uploading the 550 too. Non-webm file kinds ignore the filter and use `Final/` when Auto is selected.

- `fileKind` is one of:
  - `deliveredWebm` *(default in the UI)* — uploads entries in `clip.processed.deliveredWebms` for each selected clip, subject to the destination filter above. Drive name is the file's existing basename (e.g. `P1_0_final_960.webm`).
  - `fgAlphaMp4` — uploads the keyed alpha-MP4 as a lightweight preview. Prefers `clip.processed.fgAlphaMp4Aligned` (Drive name `<ClipName>_fg_alpha_aligned.mp4`); falls back to `clip.processed.fgAlphaMp4` (Drive name `<ClipName>_fg_alpha.mp4`). The differing suffix means re-uploads of the same source replace in place, while uploads of the aligned vs un-aligned variant remain distinguishable in Drive.
  - `fgAlphaMov` — uploads `clip.processed.fgAlphaMov` as `<ClipName>_fg_alpha.mov`. Heavier than the MP4 variant (RGBA PNG-in-MOV); use when the recipient needs true alpha for compositing.
  - `compMp4` — uploads `clip.processed.compMp4` as `<ClipName>_comp.mp4`.
  - `rawMp4` — uploads `clip.rawMp4` as `<ClipName>.mp4`.
- A clip whose required source file doesn't exist on disk is dropped from the upload and surfaced in the response under `missing`.
- **Replace-in-place semantics:** if Drive already has a file with the same name in the target `Final/` folder, its contents are updated via `drive.files.update` — the file ID and share link are preserved and Drive retains the prior version (~30 days) under "Manage versions". A new file is only created when no same-name sibling exists.

**Response**
```json
{ "jobId": "abc…", "enqueued": 2, "missing": [] }
```

The `gdrive-upload` worker loop ([worker.ts](../lib/worker.ts) → `runGDriveUpload`) processes one job at a time and writes per-item `[ok] uploaded …` / `[ok] replaced …` / `[fail] …` lines to the job log. Auth/permission errors short-circuit before any item is uploaded and land as `result.stage = "auth"`. The job's terminal `result` payload is `{ stage: "done", uploaded: [{name, id, size, replaced}], failed: [{clipName, error}], parentId }`.

### `POST /api/jobs/preview-stitch`

Render a shareable preview MP4: composite a list of delivered WebMs over `HeroScreen.png` and concat them end-to-end into a single H.264/AAC MP4. Used by the preview modal's "Export shareable MP4" button.

**Body**
```json
{
  "heroId": "Fat_King",
  "items": [
    { "clipName": "I1_0", "loops": 2 },
    { "clipName": "P1_3", "loops": 1, "edgeFade": 0.2 },
    { "clipName": "I1_0", "loops": 1 }
  ],
  "webmSize": 550
}
```

- `items` is an ordered playlist. Each entry's `clipName` is resolved to `Output/<Hero>/Final/<ClipName>_final_<webmSize>.webm`. Clips must already have been delivered — the endpoint 400s otherwise.
- `loops` is the play count for that clip (min 1). The UI uses `[{idle, N}, {power, 1}, {idle, 1}]` for one-shot idle→power→idle demos (the trailing idle exists so you can verify alignment on both entry and exit of the power).
- `webmSize` defaults to `550`.
- Per-item `edgeFade` ∈ [0, 1] is optional. If omitted, falls back to that clip's persisted `clip_meta.edge_fade`. The export then applies per-clip `geq` masks via `stitch_preview.py --edge-fades a,b,c`. This means clips that already have the mask **baked into the delivered WebM** typically get `edgeFade: 0` (or omitted) here to avoid double-application.
- Per-item `overflowSize` (px or `null`) is optional. If omitted, falls back to `clip_meta.overflow_size`. The stitch script scales each clip to `(slot_w × O / contentSize, slot_h × O / contentSize)` and centres it on the slot centre — overflow clips render at a larger pixel size with their central content matching the slot. `--content-size` (default 550) tells the script what S is.
- The slot rect used for compositing comes from `app_config.mockup_slot_rect` (see [`GET /api/config/mockup-slot`](#get-apiconfigmockup-slot) below). The normalized rect is multiplied by the mockup's pixel dimensions (read from the PNG header) to produce absolute pixel coords for ffmpeg's `overlay` filter.
- Output lands at `Output/<Hero>/Final/<Hero>_preview_<clipA>[xN]_<clipB>_<timestamp>.mp4`.

**Response**
```json
{ "jobId": "abc…", "outputPath": "d:/.../Output/Fat_King/Final/Fat_King_preview_I1_0x2_P1_3_2026-04-22T10-35-29.mp4" }
```

### `POST /api/jobs/[id]/rerun`

Re-submit a terminal job (`done` / `error` / `cancelled`) with the same payload. Creates a new job row; the original is untouched.

- **seedance** reruns re-use `startImage`, `endImage`, `promptText`, `model`, `tier`, `duration`, `aspect` from the original payload. Validates the image files still exist on disk.
- **key+compose** reruns re-use `rawMp4`, `outputDir`, `clipName`. Validates the raw mp4 still exists.
- Returns `409` if the original is still `queued` or `running` (cancel it first).

**Response**
```json
{ "ok": true, "jobId": "<new-uuid>", "kind": "seedance" }
```

### `POST /api/jobs/[id]/poll`

Manually poll a `running` seedance job against fal's HTTP API (bypasses the bash script). Useful when the auto-poller is lagging or got wedged on a transient error — and as a diagnostic tool, since the full request/response is written to the job log.

Only supported for `seedance` jobs (returns 400 otherwise).

**Response** summarizes the action the poll took:
```json
{
  "ok": true,
  "state": "COMPLETED",                 // uppercased fal state, or null
  "action": "completed",                // completed | failed | in_progress | no_request_id | not_running | no_status_json
  "outputMp4": "d:/.../Animations/P1_2.mp4"   // present when action === "completed"
}
```

Side effects:
- If fal says `COMPLETED`: fetches the result JSON, downloads the video URL to the next free `<ConceptID>_<iter>.mp4`, marks the job `done`, invalidates the scan cache.
- If fal says `FAILED`: marks the job `error`.
- Otherwise (still `IN_QUEUE` / `IN_PROGRESS`): no state change. Appends a `[poll state=...]` line to the job log.

Every poll writes the HTTP code and full response body to `data/logs/<jobId>.log` — open the log modal on the job in `/jobs` to see exactly what fal returned.

### `GET /api/jobs/[id]/log`

Return the last ~200 KB of `data/logs/<jobId>.log` as `text/plain`. Returns empty body if the file doesn't exist yet.

## Status codes

| Code | Meaning |
|---|---|
| 200 | OK (JSON or 200-with-bytes) |
| 206 | Partial content (video range request) |
| 400 | Bad request (missing/invalid body field) |
| 403 | Path traversal attempt rejected |
| 404 | Hero / concept / clip / file not found |
| 416 | Range not satisfiable |
| 500 | Unhandled exception (check dev server stderr) |

The dev server logs the actual exception to stderr; production would need explicit error handling.

---

