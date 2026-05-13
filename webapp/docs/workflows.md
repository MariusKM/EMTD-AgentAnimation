# Workflows

End-to-end walkthroughs for the things you'll do most often. Read [conventions.md](conventions.md) first if any of the file paths look unfamiliar.

## 1. Start a new hero from scratch

You have the source PNG (`Source/Heroes Stylized/<Hero>.png`) and nothing else.

1. Create the output directory: `Output/<Hero>/`.
2. Add a `concepts.md` file with `### P# / I#` blocks (see [conventions.md § concepts.md format](conventions.md#conceptsmd-format)). The app picks it up on next page load.
3. Open `/heroes/<Hero>` in the app — your concepts appear in the left column.
4. Build at least one FFLF: open the Generate modal on any concept → `+ Build new FFLF` → drop the source PNG on green → Save. Now you have `<Hero>_FFLF_0.png`.
5. Author one prompt per concept: create `Output/<Hero>/Prompts/Seedance/<ConceptID>_<slug>.md`, structured as in [conventions.md § prompt file format](conventions.md#prompt-file-format). The Prompts tab in the center column is where you'll edit these from now on.
6. Generate (workflow #4 below).

## 2. Iterate on a concept's prompt

The Prompts tab is the main editing surface — concept descriptions are background context, prompts are what the model actually sees.

1. Click a concept in the left column. The center column opens on the **Prompts** tab by default.
2. Each prompt file (one per model) is a card. Click `edit` to open a textarea.
3. Make changes. Watch the `save` button — it stays disabled until you've actually changed something.
4. Click `save`. The PATCH writes the file directly to `Output/<Hero>/Prompts/<Model>/<file>.md`. The app refreshes so the new content is reflected everywhere (including the Generate modal's view of the prompt).
5. Submit a new generation (workflow #4).

What the model sees: **only the body after the first `---`** in the file. The title and `**Source image** / **Duration** / **Aspect**` metadata above are author-only notes — seedance never sees them. Add as many human-only notes above `---` as you want; they won't pollute the prompt.

Any `#` headings inside the body (after `---`) are also dropped defensively before submission. This is implemented in `extractPromptText()` in [app/api/jobs/seedance/route.ts](../app/api/jobs/seedance/route.ts).

## 3. Build an FFLF (start/end frame for I2V)

Source PNGs are transparent. Seedance needs a solid-color background so the keying pipeline can chroma-key the result. The FFLF builder composites them.

1. Open the Generate modal on any concept (the FFLF builder is a sub-modal).
2. Click `+ Build new FFLF`. The hero's source PNG loads on a 720×1280 canvas with green `#00ff00` behind it.
3. **Drag** the canvas to reposition the hero, **scroll** to scale (or use the sliders). Alternatively: click **Auto-align to template** — detects eye+foot on the source PNG (`POST /api/heroes/[hero]/auto-align-source`), then sets scale + position so the eye lands on the template's Eye Level line and the foot on the Ground line. A confidence badge under the button shows which detector resolved the eye (`mediapipe` / `haar` / `heuristic`); low-confidence runs may need a manual nudge.
4. Optional: pick a different background color (presets for green, blue, magenta, B/W; or hex / native color picker for anything else).
5. Optional: change the output size (16:9, 1:1, 4:3 also available). **Note:** changing the output size after auto-align invalidates the positioning — re-run Auto-align or drag manually.
6. **Save FFLF** → writes `Output/<Hero>/<Hero>_FFLF_<next>.png`. The Generate modal's Start and End image dropdowns auto-select the new file.

Tips:
- For closed-loop animations (idle), use the same FFLF for both Start and End — the model treats it as a seamless loop point.
- For A→B animations (a power move that ends in a different pose), make two FFLFs (`_0` and `_1`) and pick a different one for End.
- The chroma color you pick here must match what your keying pipeline expects. Default is green; pick **blue** for heroes whose VFX include green elements (e.g. Dragonwitch's green flame would be eaten by a green key). The keying step auto-detects the screen color from the raw mp4's corners on first key, persists it to `clip_meta.screen_color`, and passes `--chroma-subtract-channel <green|blue>` (and `--chroma-key 0000FF` on blue) to `batch_pipeline.py`. You can also force a value from the **Re-key** modal's "Screen color" dropdown.

## 4. Generate an animation

1. Pick a concept in the left column.
2. Click **Generate** (top-right of the center column).
3. In the modal:
   - **Model**: defaults to the first model with prompt files for this concept (usually Seedance).
   - **Prompt file**: defaults to the first matching `.md` file. If empty, author one in the Prompts tab first.
   - **Start frame** + **End frame**: dropdowns of every FFLF + the source PNG. Default = first FFLF for both. Use the `= start` link to copy Start to End.
   - **Duration**: 4–15s. Power moves usually 5–7s, idles 4s.
   - **Aspect**: 9:16 default for portrait heroes.
   - **Tier**: `pro` (highest quality, default) or `fast`.
4. Click **Submit**. You'll see `Job <id> queued`.
5. Open `/jobs` in another tab. The job goes through:
   - `queued` → enqueued
   - `running` stage `uploading_end_image` → calling `upload.sh` for the end frame
   - `running` stage `submitted` (with `requestId` in the result) → fal is processing
   - The poller (every 10s) updates the log with `[poll] state=IN_PROGRESS` lines
   - `done` stage `completed` → the new `.mp4` lands at `Output/<Hero>/Animations/<ConceptID>_<nextIter>.mp4`
6. Switch back to the hero workspace; the new clip appears under the concept (auto-refreshes every 6s).

If the job fails, the result includes a `stage` (where it failed) and a stderr/stdout tail. Open the log modal from `/jobs` for the full output.

## 5. Key + compose a generated clip

Seedance produces a raw greenscreen `.mp4`. To use it in-game it needs to be keyed (alpha-extracted) and composited into the final `_fg_alpha.mov`.

1. In the hero workspace, find the new clip in the right column. It has a "raw greenscreen" label and the `Files` button is disabled.
2. Click **Key**. The job is queued.
3. Open `/jobs`. The worker picks it up (one at a time) and runs:
   - Stage `keying`: for green clips, runs `batch_pipeline.py -i <raw>.mp4 -o <ClipName>/ --alpha birefnet+chroma --despill 0.3 --chroma-subtract-channel green`. For **blue** clips, the worker first writes a B↔G-swapped temp mp4 via ffmpeg, runs the same green-tuned pipeline against it, then post-swaps the FG/Comp/Processed PNGs back to true colors with `scripts/swap_bg_channels.py`. This is required because CorridorKey's despill stage is hardcoded to remove green spill only — see architecture.md "Blue-screen handling" for the full reasoning. Screen color is auto-detected from the raw mp4 the first time a clip is keyed (and persisted to `clip_meta.screen_color`). Takes a few minutes per clip on a 4090.
   - Stage `compose`: `compose_frames.py <ClipName>/ --fps 24` against the project venv. Fast.
4. When `done`, the clip card flips to "keyed" and starts playing the `_fg_alpha.mp4` preview. The `Files` button is now enabled.

To queue multiple clips at once, the API accepts an array — currently the UI fires one at a time, but you can hit `POST /api/jobs/key` directly (see [api.md](api.md)).

### Despill setting per screen color

CorridorKey's despill always removes green spill (the function in `CorridorKeyModule/core/color_utils.py` has no screen-color parameter). For the blue-screen path that means anything originally **blue** on the character gets moved through the swap, hits despill as if it were green, and comes back slightly desaturated — so the same numeric strength is more aggressive on blue clips than green clips.

| Scenario | Suggested `despill` |
|---|---|
| Green-screen, normal hero | **0.3** (default) |
| Green-screen, lots of green VFX touching the body | 0.2 (don't eat the VFX) |
| **Blue-screen**, no significant blue on the character (e.g. Dragonwitch — red / skin / dark hair / green flame) | **0.2** |
| Blue-screen, character has prominent blue costume parts or blue rim | 0.1 |

If blue-screen edges still look too cool, bump up; if originally-blue costume elements look magenta-shifted after delivery, drop down.

## 6. Review keyed output

1. Click **Files** on a keyed clip. The ClipExplorer modal opens.
2. Tabs: `FG | Matte | Comp | Processed | Outputs`. Frame counts in each tab header.
3. The default tab is `Processed` (the final RGBA frames).
4. **Scrub** with the slider, the `← prev` / `next →` buttons, or arrow keys. `Home` / `End` jump to the first/last frame.
5. **Checker bg toggle** (visible on FG and Processed tabs) helps you see the alpha — turn it on to spot transparency issues, off to compare against a uniform bg.
6. **Outputs tab** shows the composited `_fg_alpha.mov` / `.mp4` / `_comp.mp4` with playback + download links.
7. **Esc** closes the modal.

Use this to QA the keying:
- **Matte** should be solid white where the character is, solid black where the bg was, with smooth edges (no jagged or noisy transitions).
- **FG** should have no green spill on the character edges (despill is set to 0.3 by default — bump it in the worker if you see chronic spill).
- **Comp** is the safest at-a-glance check: if the character looks correct here against the original frame, the keying is good.

## 7. Align keyed clips to the template

Keyed animations come out at different scales and positions per hero because FFLFs were composed freehand. The alignment step transforms every frame uniformly so each clip's eye lands on `eyeLevelY` and foot lands on `groundY` of the template (see [conventions.md § Alignment template](conventions.md#alignment-template)).

**Fast path — whole hero in three clicks:**

1. In the hero workspace, click **Align all** (top-right of the Animations column). Runs `detect_anchors.py --all` against the hero's `Animations/` dir — writes `anchors.json` into every clip dir that doesn't already have one.
2. (Optional) open any clip's **Align** button to inspect. The AlignmentModal shows frame 0 with cyan (eye) and pink (foot) crosshairs; drag to correct if the detection looks wrong. Low confidence gets a yellow badge. Click **Save anchors** to persist as `source: "manual"`.
3. Click **Recompose all aligned** (next to "Align all"). Enqueues one recompose job per clip-with-anchors. Navigates to `/jobs`. Each job reuses existing `Processed/` frames (no re-keying) and writes `<ClipName>_fg_alpha_aligned.{mov,mp4}` alongside the originals.

**Per-clip path** — use when a specific clip needs extra attention:

1. Click **Align** on a processed clip. If no `anchors.json` exists, auto-detection runs automatically on open.
2. Drag the crosshairs to correct anchor positions. The dashed magenta guides show where the eye / ground targets are.
3. Click **Save + recompose aligned** — writes `anchors.json` and enqueues a single-clip recompose job.

Originals (`<ClipName>_fg_alpha.{mov,mp4}` and `<ClipName>_comp.mp4`) are never overwritten by alignment. Re-running keying (via **Re-key**) wipes the whole processed dir including aligned variants — you'll need to redo the alignment after that.

**Verifying alignment visually:** once a clip has an aligned output, the right-column preview automatically plays the aligned video (it falls back to the un-aligned preview when no aligned variant exists). A small **Show alignment** button appears next to the rating stars — toggle it to overlay `character-alignment_<W>x<H>_overlay.png` (lines only, transparent elsewhere) on top of the video. If the character's eye stays on the pink Eye Level line and feet stay on the Ground line across the clip, alignment is correct.

**Soft-edge mask for clips that overshoot the slot.** Some power moves reach past the in-game character slot — e.g. a sword raised above the hero. Open the preview modal in **Single** mode, pick the offending clip, drag the **Edge fade** slider in the right panel until the overshoot fades cleanly, then **Save + re-deliver**. The mask is per-clip in `clip_meta.edge_fade` and gets baked into the WebM by `deliver_webm.py --edge-fade <F>`, so the in-game player sees the soft edge directly. Other clips on the hero stay untouched. In **Sequence** mode the per-clip masks just play through as stored — no editing UI; switch to Single to tune.

**Overflow padding for clips whose action just needs more canvas.** If you'd rather *show* the overshoot instead of fading it (e.g. King's raised sword should still be visible above the slot), set **Overflow size** to a larger value (768, 896, 1024) in the same Delivery panel and re-deliver. The WebM gets encoded at that outer resolution with the central 550×550 region holding the actual aligned content and transparent padding around it. The in-game engine renders the larger asset positioned on the same slot — the overshoot extends past the slot edges naturally. Stored per-clip in `clip_meta.overflow_size`. Edge fade and overflow can be combined on the same clip.

> **Engine-integration note (heads-up for the dev team).** Overflow assets aren't drop-in identical to the standard 550 deliverables. The rendering rule we use across preview, stitched MP4, and engine is:
>
> ```
> displayed_size = slot_size × (asset_outer_size / 550)
> position       = centered on the slot's anchor
> ```
>
> A 768×768 overflow asset for a 550-px slot must be drawn at 768 screen-px (centered), so its central 550 region matches a normal 550 asset's footprint and the surrounding ring extends past the slot. If the engine doesn't read each asset's actual width and apply that scale, options to make hand-off uniform are: (a) always deliver every clip at one common size with symmetric transparent padding (single rendering rule, slightly bigger files for clips that don't overshoot); (b) ship a sidecar `<clip>_final_<size>.json` with `contentSize`/`outerSize`; or (c) include a per-export `manifest.json` listing render params per file. None of these are wired today — revisit if the dev team flags integration friction. (See `HeroAnimation/Docs/Todo` for the active follow-up.)

**Hero-size scaling.** Different heroes are different sizes in-game — Fat King and Blacksmith read as larger than Fat Princess, regardless of their source PNG dimensions. The alignment template carries this as a per-hero size category that multiplies the alignment scale, ground-anchored (everyone stands on the same floor; larger heroes grow upward). Edit `HeroAnimation/character-alignment.json`:

```json
"sizeFactors": { "small": 0.7, "medium": 0.85, "large": 1.0 },
"heroSizes":   { "Blacksmith": "large", "Count_Wilhelm": "large", "Fat_King": "large", "Fat_Princess": "small" }
```

Heroes not listed in `heroSizes` default to `medium`. The webapp worker reads this when running `compose_frames.py --align-to-template` (both for fresh keying and recompose-aligned), so re-running **Recompose all aligned** on a hero is enough to apply a size change. The legacy eye-anchored math becomes ground-anchored on this update — for `size_factor=1.0` (every "large" hero) the math is identical, but medium/small heroes will re-align with foot still on the ground line and eye sitting lower than the template line.

**Pinning a reference alignment across sibling clips.** If you notice slight scale variation between clips that share the same FFLF (a known artifact of Seedance generating subtly different first frames + alpha-bbox foot detection latching onto the drifted matte edge), open the AlignmentModal on a clip you're happy with and click **Apply to other clips…**. Pick the target clips, leave **Recompose aligned after copy** on, and apply — the source clip's eye+foot get written verbatim to each target's `anchors.json` (with auto pixel-coord scaling if frame dims differ) and a recompose job is enqueued per target. The aligned output across the group will share the same scale to the pixel.

### Anchor-detection failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Eye crosshair lands on the neck / chest | MediaPipe didn't detect a face; fell back to the heuristic. Badge shows `source: heuristic`. | Drag the eye crosshair manually; save. Stylized/obscured faces (hoods, dragons) are common trigger. |
| Foot crosshair lands below the actual feet on a cloaked character | Alpha-bbox bottom caught the cloak hem. | Drag the foot crosshair to the actual feet manually; save. Heroes to watch: Herald, Fat King (robes), Dragonwitch (cloak). |
| Character shrinks / grows after alignment by >20% | The clip's pose differs from the template's expected proportions. | Acceptable if intentional; otherwise inspect the anchor positions — usually one is wrong. |

### Batch-CLI alternative

Skipping the webapp entirely:

```bash
# Detect anchors for every clip of a hero
python HeroAnimation/scripts/detect_anchors.py HeroAnimation/Output/<Hero>/Animations --all

# Compose with alignment (reads each clip's anchors.json)
python HeroAnimation/scripts/compose_frames.py HeroAnimation/Output/<Hero>/Animations --align-to-template
```

Useful for one-off runs. No job log in the webapp, so if you want the jobs visible in `/jobs` use the UI buttons instead.

## 8. Deliver final WebMs

Once clips are keyed and (ideally) aligned, the final deliverable is VP8/WebM with alpha. The default output size is **960×960** (full alignment-template resolution, pass-through with no scaling); the selection bar exposes a `550 / 720 / 960` segmented selector so you can deliver at a smaller size if a downstream consumer still needs it.

1. Select clips in the right column (checkbox on each card, or the Favourites overlay for cross-concept selection).
2. Pick the output size from the dropdown next to the Deliver button (defaults to **960**). Click **Deliver (WebM 960)**.
3. If any selected clips lack an aligned output, a warning modal appears with three options:
   - **Cancel** — back out.
   - **Deliver aligned only (N)** — skip the unaligned clips.
   - **Deliver all anyway** — fall back to the un-aligned `_fg_alpha.mov` for the missing ones.
4. Jobs enqueue to the `deliver` worker loop and run on CPU (ffmpeg VP8 encode — ~30s per clip on a modern machine, doesn't block keying).
5. Outputs land in `Output/<Hero>/Final/<ClipName>_final_<size>.webm` (e.g. `<ClipName>_final_960.webm`). The size suffix is what drives the Auto Drive-routing later.

Delivered clips surface `processed.deliveredWebms: [{size, rel}]` in the DTO — useful for spotting which clips still need delivery via the API.

### Overlaying the template in your editor

To visually verify a delivered clip's positioning, import the resolution-matched template PNG as an overlay in your editing software (After Effects, DaVinci Resolve, Premiere, etc.):

```bash
# Generate overlay PNGs if you don't have them yet
python HeroAnimation/scripts/scale_template.py 960 550
```

- Overlay `character-alignment_960x960.png` on aligned MOVs (at native dev resolution).
- Overlay `character-alignment_550x550.png` on delivered WebMs.

The character's eye should sit on the Eye Level line and feet on the Ground line. Any mismatch means the anchor was off for that clip — open its Align modal, correct, and re-recompose.

## 9. Upload finals to the client's Google Drive

Once clips are delivered locally, push them to the client's Shared Drive so they're reviewable without local file access.

**One-time setup.** Set `GDRIVE_SERVICE_ACCOUNT` (path to the service-account JSON key) and `GDRIVE_ROOT_FOLDER_ID` (the Drive folder under which uploads land) in `.env.local`. The service account email (e.g. `drive-bridge@<project>.iam.gserviceaccount.com`) must be added as **Content Manager** on the target Shared Drive — sharing with a service account from outside the org sometimes requires the client's Workspace admin to allow external sharing on that drive.

1. Select clips in the right column.
2. Click **Upload to GDrive** in the batch bar.
3. The modal asks for two things:
   - **File kind** — defaults to **Final delivered .webm**, with `FG + alpha .mp4 (light preview)` / `FG + alpha .mov` / `Comp preview .mp4` / `Raw greenscreen .mp4` as alternates. If a selected clip lacks the chosen kind it's flagged red ("not delivered yet" / "not keyed yet") and the queue button is disabled.
   - **Destination** — `Auto`, `Final/`, `Final_960/`, or `Previs/`. Auto-suggested from the file kind (`Auto` for delivered .webm; `Previs` for everything else). `Auto` routes each delivered webm by its filename size suffix: `_final_960.webm` → `Final_960/`, anything else → `Final/`. Pick `Final` or `Final_960` explicitly to push only that bucket. `Previs/` is the team-share folder for in-progress generations and previews.
4. The job lands in the `gdrive-upload` worker loop. Each clip's files are uploaded to `<GDRIVE_ROOT_FOLDER_ID>/<HeroId>/<destination>/`; folders are created on first use. When the request resolves files into more than one destination (Auto split), the worker resolves each Drive subfolder on demand with per-batch caching.
5. **Filtering by size on explicit destinations:** when `destination=Final` or `Final_960` and the file kind is `deliveredWebm`, only the webms in the matching size bucket are uploaded. This is what lets you push the 960 set without re-uploading the legacy 550s to the same folder.
6. **Same-name replace:** re-uploading the same clip into the same destination folder updates the existing Drive file in place rather than duplicating. Drive keeps the prior version under "File info → Manage versions" for ~30 days, and any share link continues to point at the latest content. `Final/`, `Final_960/`, and `Previs/` are independent — the same filename in two destinations creates two separate Drive files.

`New_King`-style heroId mismatches: `ensureHeroFolder` matches by exact name. If the Drive root has `New_King` (underscore) but the in-app hero ID is `New King` (space), the upload will create a sibling `New King` folder. Rename the Drive folder to match, or fix the source-of-truth on whichever side is wrong.

## 10. Preview a delivered clip over the Hero Screen mockup

Once a clip has been delivered (has `Output/<Hero>/Final/<ClipName>_final_550.webm`), you can preview it composited onto `HeroAnimation/HeroScreen.png` — the mobile Hero Screen mockup — to see how the character will read in-context.

1. Click **Preview** on a clip card, or click the top-of-column **▶ Preview** button on the hero workspace to open in sequence mode.
2. The modal shows the mockup with the WebM overlayed inside a character slot. Audio plays from the WebM (muxed in during delivery — if you see a silent preview, re-run **Deliver (WebM 550)** on that clip).
3. Click **Edit placement** once per project to set the slot rect. Drag the box to move. Use the **Scale** slider (0–300%) and the **x / y** number inputs for exact positioning. Values persist to `app_config.mockup_slot_rect` and apply app-wide — every hero uses the same slot, so you only tune it once.
4. **Mute / Replay** controls live in the sidebar.

The slot rect is shared across heroes by design (the mockup PNG has "Count Wilhelm" + his stats baked in, but the character slot geometry is the same on every hero screen). If you later swap in a cleaner hero-agnostic mockup, set `HERO_SCREEN_MOCKUP` in `.env.local` and the stored rect continues to work since it's stored normalized.

## 11. Stitch a shareable idle→power preview

For sending a client a "full hero loop" preview without them needing alpha-WebM playback support, export a pre-composed MP4 with the character baked onto the Hero Screen mockup and audio muxed end-to-end.

1. Open the preview modal (workflow #10) and switch to **Sequence** mode.
2. The clip pickers show only **favorited + aligned + delivered** clips for the current hero, split into idle/power dropdowns. Favorite an eligible idle and a power first if they're empty.
3. Pick an idle, set **Idle loops** (1–5, default 2), pick a power. Watch the client-side preview play `idle×N → power`.
4. Click **⤓ Export shareable MP4**. The job enqueues on the `preview-stitch` worker loop and lands at `Output/<Hero>/Final/<Hero>_preview_<idle>x<N>_<power>_<timestamp>.mp4`.
5. Open `/jobs` to watch progress (H.264 encode — usually <30s).

The exported MP4 is H.264 / AAC / yuv420p — previews inline in Slack, Drive, Teams, and basically every clipboard target without extra software. The slot rect used by the server match is the same one from the preview modal, so what you see is what gets exported.

If the character looks like it has a black background in the exported MP4 (no alpha), that's an ffmpeg pixel-format bug — check [HeroAnimation/scripts/stitch_preview.py](../../HeroAnimation/scripts/stitch_preview.py) still has `format=yuva420p` after each scale and `format=auto,format=yuv420p` on the overlay output.

## 12. Rerun a failed or finished job

Every job in `done`, `error`, or `cancelled` state has a `rerun` button in its row on `/jobs`. Click it to queue a fresh job with the exact same payload — same start/end images, same prompt text, same tier/duration/aspect for seedance, or same raw mp4 for key+compose.

- Creates a new job row; the original is untouched (so the history is preserved).
- Validates the referenced files still exist — if you've deleted a start image or raw mp4, you get a 400 alert with the reason.
- Returns 409 if you try to rerun a `queued` or `running` job. Cancel it first, then rerun.

This is the fastest way to iterate when a prompt edit produces a bad result: edit the prompt in the Prompts tab, then hit `rerun` on the last job. No need to reopen the Generate modal.

## 13. Unstick a seedance job that's stuck `running`

If a seedance job is stuck on stage `submitted` / `uploading_end_image` for longer than ~3 minutes (or you've verified on fal.ai/dashboard that the request completed but the app hasn't updated), click the `poll` button on the job row.

What happens:
1. The app hits fal's queue API directly (`GET /requests/<id>/status`).
2. If `COMPLETED`, it fetches the result and downloads the mp4 to `Output/<Hero>/Animations/<ConceptID>_<nextIter>.mp4`.
3. The job flips to `done` and you get an alert with the file path.
4. If still in progress, you get an alert with the current state (e.g. `IN_QUEUE`).

The manual poll bypasses the bash script entirely and talks to fal directly, so it works even when the auto-poller fails. Every poll (auto or manual) writes the full HTTP status + body to `data/logs/<jobId>.log` — open the log modal to see what fal actually returned if anything looks off.

Common reasons the auto-poller can lag: dev server restarted mid-tick, transient network error, FAL_KEY env not propagating to a poll tick. The manual poll almost always recovers the job.

## 14. Cancel a stuck job

1. Open `/jobs`.
2. Find the job (filter by `running` if needed).
3. Click `cancel`.
   - **Queued** → marked cancelled, never starts.
   - **Running key+compose** → SIGTERM to the child process. Partial frames in `<ClipName>/` may remain — delete the dir and re-run if needed.
   - **Running seedance** → marked cancelled in our DB, but fal continues processing on its end (the API call to fal would charge regardless). The poller stops checking that request once it's marked cancelled.

## 15. Recover from a server crash

If `npm run dev` died mid-key:

1. Restart the dev server.
2. On boot, [lib/worker.ts](../lib/worker.ts) recovers orphan `running` `key+compose` jobs by marking them `error` with a `"Process restarted while job was running"` message.
3. The actual child process from the previous server is dead (or, worst case, an orphan — find it via `tasklist | findstr python` and kill).
4. Find the unfinished clip dir under `Animations/<ClipName>/`, inspect it for partial output, delete and re-queue if needed.

For seedance, restart is safe — the request_id is in `result_json`, and on next poll cycle the poller picks up where it left off and downloads when fal completes.

## 16. Drop in a new prompt file from outside the app

Just create the file. Save it as `Output/<Hero>/Prompts/<Model>/<ConceptID>_<slug>.md`. On the next page load (or after the 3s scan cache expires), it appears in the Prompts tab automatically. No restart needed.

## 17. Drop in raw clips from outside the app

Same idea. Save raw greenscreen `.mp4`s as `Output/<Hero>/Animations/<ConceptID>_<iter>.mp4` (the iter is whatever number you want — just don't collide). They appear under the matching concept on next page load. Use `Key` to process them.

If you have keyed sequences from another tool, drop them as `Output/<Hero>/Animations/<ConceptID>_<iter>/{FG,Matte,Comp,Processed}/frame_NNNNNN.png` and the app will treat the clip as already keyed (the `Files` button enables, no need to re-run keying).
