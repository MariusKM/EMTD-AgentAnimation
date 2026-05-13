---
name: compose-frames
description: Compose processed frame sequences (FG + Matte + Comp) into video files. Use when the user has frame sequences from the external keying pipeline and needs them assembled into .mov (alpha), .mp4, and comp preview videos.
argument-hint: <clip-dir-or-parent> [--fps 24] [--output-dir <path>] [--no-audio]
---

# Compose Frames

Assemble processed frame sequences into final video files.

## Context

The external keying pipeline outputs three frame types per clip:
- **FG** — Despilled foreground (RGB)
- **Matte** — Alpha matte (grayscale)
- **Comp** — Composite preview (for checking mask quality)

This skill combines them into deliverable video files.

## Script

Located at: `HeroAnimation/scripts/compose_frames.py`

Run with the project's local `.venv`:
```bash
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py $ARGUMENTS
```

If `$ARGUMENTS` is empty, ask the user which clip(s) to process.

## What It Produces

For each clip directory:

| Output | Format | Contents |
|--------|--------|----------|
| `<clip>_fg_alpha.mov` | PNG .mov with alpha | FG RGB + Matte as alpha channel (lossless), PCM s16le audio |
| `<clip>_fg_alpha.mp4` | H.264 MP4 | FG composited over neutral gray (for preview), AAC 192k audio |
| `<clip>_comp.mp4` | H.264 MP4 | Comp sequence (mask quality check), AAC 192k audio |

Output goes to the clip root `<clip>/` by default, or `--output-dir` if specified. `<clip>/Processed/` still exists as the folder holding keyed PNG sequences.

## Audio Muxing (default on)

Audio is **muxed by default** from the original source video sitting next to the clip directory — e.g. `Animations/P1_0.mp4` supplies the audio for composited outputs of `Animations/P1_0/`. The script probes `.mp4`, `.mov`, `.mkv`, `.webm` in that order.

- `.mov` alpha deliverable gets PCM s16le (lossless).
- Both `.mp4` previews get AAC 192k.
- If no sibling source video exists, or it has no audio stream, the script falls back to silent outputs and logs a note.
- Pass `--no-audio` to force silent outputs.

## Usage Examples

```bash
# Process a single clip
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py HeroAnimation/Output/New_King/Animations/I1_0

# Process all clips under a directory
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py HeroAnimation/Output/New_King/Animations

# Custom output directory
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py HeroAnimation/Output/New_King/Animations --output-dir HeroAnimation/Output/New_King/Finals

# Different frame rate
.venv/Scripts/python HeroAnimation/scripts/compose_frames.py HeroAnimation/Output/New_King/Animations --fps 30
```

## Expected Directory Structure

```
<ClipName>/
├── Comp/                         # frame_000000.png, frame_000001.png, ...
├── FG/                           # frame_000000.png, frame_000001.png, ...
├── Matte/                        # frame_000000.png, frame_000001.png, ...
├── Processed/                    # frame_000000.png, frame_000001.png, ... (RGBA keyed frames)
├── <ClipName>_fg_alpha.mov       # Output videos land in the clip root
├── <ClipName>_fg_alpha.mp4
└── <ClipName>_comp.mp4
```
