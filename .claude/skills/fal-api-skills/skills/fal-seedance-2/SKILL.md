---
name: fal-seedance-2
description: Generate videos with ByteDance Seedance 2.0 via fal.ai — image-to-video, text-to-video, and reference-to-video with native audio, multi-shot editing, director-level camera control, and start/end frame control. Use when the user requests "Seedance", "Seedance 2", "ByteDance video", "image to video with audio", "cinematic I2V", or asks for the seedance model specifically.
metadata:
  author: empire-titans
  version: "1.0.0"
---

# fal-seedance-2

ByteDance Seedance 2.0 is a state-of-the-art video generation model family on fal.ai. It produces cinematic output with native synchronized audio (SFX, ambience, lip-synced speech), multi-shot editing, real-world physics, and director-level camera control.

Three modes, two tiers each (**Pro** = highest quality, **Fast** = lower latency/cost):

| Mode | Endpoint (Pro) | Endpoint (Fast) |
|------|----------------|-----------------|
| `image-to-video` | `bytedance/seedance-2.0/image-to-video` | `bytedance/seedance-2.0/fast/image-to-video` |
| `text-to-video` | `bytedance/seedance-2.0/text-to-video` | `bytedance/seedance-2.0/fast/text-to-video` |
| `reference-to-video` | `bytedance/seedance-2.0/reference-to-video` | `bytedance/seedance-2.0/fast/reference-to-video` |

## Scripts

| Script | Purpose |
|--------|---------|
| `seedance-video.sh` | Submit, poll, and fetch a Seedance 2.0 video job |

## Usage

### Image-to-Video (most common for the EMTD hero pipeline)

Animate a still hero portrait into a cinematic clip. Supports a second image as the final frame for explicit start→end transitions.

```bash
# Basic I2V with a hosted image
./scripts/seedance-video.sh \
  --mode image-to-video \
  --image-url "https://v3.fal.media/files/.../hero.png" \
  --prompt "Hero raises sword, flames ignite from the blade. Slow push-in." \
  --duration 6 \
  --aspect-ratio 16:9

# I2V from a local file (auto-uploads to fal CDN)
./scripts/seedance-video.sh \
  --mode image-to-video \
  --file "HeroAnimation/Source/Heroes Stylized/General.png" \
  --prompt "General points forward and shouts a command. Wind catches his cloak." \
  --duration 5

# I2V with start and end frame
./scripts/seedance-video.sh \
  --mode image-to-video \
  --image-url "https://.../start.png" \
  --end-image-url "https://.../end.png" \
  --prompt "Transition from calm to battle-ready stance."
```

### Text-to-Video

```bash
./scripts/seedance-video.sh \
  --mode text-to-video \
  --prompt "A medieval castle gate opens at dawn, banners unfurling. Cinematic 16:9." \
  --duration 8 \
  --aspect-ratio 16:9
```

### Reference-to-Video (up to 9 images, 3 videos, 3 audio clips)

Reference assets are addressed in the prompt as `@Image1`, `@Video1`, `@Audio1`, etc.

```bash
./scripts/seedance-video.sh \
  --mode reference-to-video \
  --image-urls "https://.../hero.png,https://.../weapon.png" \
  --prompt "@Image1 wields @Image2 and charges into battle." \
  --duration 6
```

### Fast tier for iteration

```bash
./scripts/seedance-video.sh --tier fast --mode image-to-video \
  --image-url "..." --prompt "..." --duration 4
```

### Async / queue operations

```bash
# Submit and return request_id immediately
./scripts/seedance-video.sh --mode text-to-video --prompt "..." --async
# → Request ID: abc-123

# Check status / fetch result / cancel
./scripts/seedance-video.sh --status abc-123 --mode text-to-video
./scripts/seedance-video.sh --result abc-123 --mode text-to-video
./scripts/seedance-video.sh --cancel abc-123 --mode text-to-video
```

### Save the result to disk

```bash
./scripts/seedance-video.sh --mode image-to-video --file hero.png \
  --prompt "..." --output HeroAnimation/King/clip_01.mp4
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--mode` | `image-to-video` \| `text-to-video` \| `reference-to-video` | (required) |
| `--tier` | `pro` \| `fast` | `pro` |
| `--prompt`, `-p` | Text prompt describing motion/action | (required) |
| `--image-url` | Start-frame image URL (I2V) | — |
| `--file`, `--image` | Local file — auto-uploaded to fal CDN (I2V) | — |
| `--end-image-url` | End-frame image URL (I2V) for start→end transitions | — |
| `--image-urls` | Comma-separated reference image URLs (R2V, up to 9) | — |
| `--video-urls` | Comma-separated reference video URLs (R2V, up to 3) | — |
| `--audio-urls` | Comma-separated reference audio URLs (R2V, up to 3) | — |
| `--resolution` | `480p` \| `720p` | `720p` |
| `--duration` | `auto` or `4`–`15` (seconds) | `auto` |
| `--aspect-ratio` | `auto` \| `21:9` \| `16:9` \| `4:3` \| `1:1` \| `3:4` \| `9:16` | `auto` |
| `--no-audio` | Disable synchronized audio generation | audio on |
| `--seed` | Integer seed for reproducibility | — |
| `--output` | Download result MP4 to this path | — |
| `--async` | Submit and print request_id, don't poll | — |
| `--status ID` | Check status of a queued request | — |
| `--result ID` | Fetch completed request result | — |
| `--cancel ID` | Cancel a queued request | — |
| `--poll-interval` | Seconds between status checks | `5` |
| `--timeout` | Max seconds to wait | `900` |
| `--param K=V` | Extra raw JSON parameter (repeatable) | — |

## Constraints

- **I2V images**: JPEG / PNG / WebP, max 30 MB each.
- **R2V**: total files across images + videos + audio must not exceed 12. Videos combined 2–15s, ≤50 MB total, each 480p–720p. Audio ≤3 files, combined ≤15s, ≤15 MB each. If audio is provided, at least one image or video reference is required.
- **Duration** is fixed to the enum (`auto`, `4`–`15`); fractional durations are not supported.
- **Audio cost**: generation cost is the same whether audio is on or off — leave on unless you specifically need a silent plate (e.g. for the EMTD pipeline where audio is added later; use `--no-audio`).

## EMTD Hero Pipeline Notes

For the hero animation I2V pipeline (`HeroAnimation/`), Seedance 2.0 I2V is the target model of interest:

- Use `--mode image-to-video` with the stylized hero PNG from `HeroAnimation/Source/Heroes Stylized/`.
- Typical aspect ratio: `16:9` (hero screens) or `9:16` (portrait actions); use `auto` to infer from source.
- Keep audio off (`--no-audio`) — final delivery already uses separately-produced SFX.
- Duration: hero screen idles / victory / defeat typically land in the 4–6s range.
- Pair this skill with `key-clips` (stage 6.1) to remove green/blue backgrounds and with `compose-frames` for final MOV assembly.

## Output

On completion the script prints the fal API JSON:

```json
{
  "video": { "url": "https://v3.fal.media/files/.../output.mp4", "content_type": "video/mp4", "file_size": ... },
  "seed": 123456
}
```

If `--output PATH` is passed, the MP4 is also downloaded to that path.

## Requirements

- `FAL_KEY` set in the environment or a `.env` file at the project root (same behavior as sibling fal skills).
- `curl` and `jq` on PATH.
