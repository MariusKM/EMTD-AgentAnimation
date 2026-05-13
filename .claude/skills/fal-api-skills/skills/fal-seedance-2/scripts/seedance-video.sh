#!/bin/bash
set -e

# seedance-video.sh — Generate videos with ByteDance Seedance 2.0 on fal.ai
# Modes: image-to-video, text-to-video, reference-to-video
# Tiers: pro (default), fast

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

MODE=""
TIER="pro"
PROMPT=""
IMAGE_URL=""
FILE_PATH=""
END_IMAGE_URL=""
IMAGE_URLS=""
VIDEO_URLS=""
AUDIO_URLS=""
RESOLUTION=""
DURATION=""
ASPECT_RATIO=""
GEN_AUDIO=""
SEED=""
OUTPUT=""
ASYNC=0
STATUS_ID=""
RESULT_ID=""
CANCEL_ID=""
POLL_INTERVAL=5
TIMEOUT=900
EXTRA_PARAMS=""

show_help() {
  cat >&2 <<EOF
seedance-video.sh — ByteDance Seedance 2.0 on fal.ai

Usage:
  $0 --mode MODE --prompt TEXT [options]
  $0 --status REQUEST_ID --mode MODE
  $0 --result REQUEST_ID --mode MODE
  $0 --cancel REQUEST_ID --mode MODE

Modes:
  image-to-video, text-to-video, reference-to-video

Key options:
  --prompt, -p TEXT          Prompt (required for new jobs)
  --tier TIER                pro | fast  (default: pro)
  --image-url URL            Start-frame image (I2V)
  --file, --image PATH       Local file, auto-uploaded (I2V)
  --end-image-url URL        End-frame image (I2V transition)
  --image-urls A,B,C         Reference images (R2V, max 9)
  --video-urls A,B           Reference videos (R2V, max 3)
  --audio-urls A,B           Reference audio (R2V, max 3)
  --resolution 480p|720p     (default: 720p)
  --duration auto|4..15      (default: auto)
  --aspect-ratio X           auto|21:9|16:9|4:3|1:1|3:4|9:16 (default: auto)
  --no-audio                 Disable generate_audio
  --seed N                   Reproducibility seed
  --output PATH              Download result MP4 to PATH
  --async                    Submit and return immediately
  --param K=V                Extra raw JSON param (repeatable)
  --poll-interval N          Seconds between status checks (default: 5)
  --timeout N                Max wait seconds (default: 900)
  --add-fal-key KEY          Save FAL_KEY to .env and exit
  --help, -h                 This help
EOF
  exit 0
}

# Load .env from common locations
[ -f "$SCRIPT_DIR/../../.env" ] && source "$SCRIPT_DIR/../../.env" 2>/dev/null || true
[ -f "$SCRIPT_DIR/../.env" ] && source "$SCRIPT_DIR/../.env" 2>/dev/null || true
[ -f ".env" ] && source ".env" 2>/dev/null || true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="$2"; shift 2;;
    --tier) TIER="$2"; shift 2;;
    --prompt|-p) PROMPT="$2"; shift 2;;
    --image-url) IMAGE_URL="$2"; shift 2;;
    --file|--image) FILE_PATH="$2"; shift 2;;
    --end-image-url) END_IMAGE_URL="$2"; shift 2;;
    --image-urls) IMAGE_URLS="$2"; shift 2;;
    --video-urls) VIDEO_URLS="$2"; shift 2;;
    --audio-urls) AUDIO_URLS="$2"; shift 2;;
    --resolution) RESOLUTION="$2"; shift 2;;
    --duration) DURATION="$2"; shift 2;;
    --aspect-ratio) ASPECT_RATIO="$2"; shift 2;;
    --no-audio) GEN_AUDIO="false"; shift;;
    --seed) SEED="$2"; shift 2;;
    --output) OUTPUT="$2"; shift 2;;
    --async) ASYNC=1; shift;;
    --status) STATUS_ID="$2"; shift 2;;
    --result) RESULT_ID="$2"; shift 2;;
    --cancel) CANCEL_ID="$2"; shift 2;;
    --poll-interval) POLL_INTERVAL="$2"; shift 2;;
    --timeout) TIMEOUT="$2"; shift 2;;
    --param) EXTRA_PARAMS="$EXTRA_PARAMS $2"; shift 2;;
    --add-fal-key)
      KEY_VALUE="$2"
      if [[ -z "$KEY_VALUE" || "$KEY_VALUE" == --* ]]; then
        echo "Enter your fal.ai API key:" >&2
        read -r KEY_VALUE
      fi
      grep -v '^FAL_KEY=' .env > .env.tmp 2>/dev/null || true
      mv .env.tmp .env 2>/dev/null || true
      echo "FAL_KEY=$KEY_VALUE" >> .env
      echo "FAL_KEY saved to .env" >&2
      exit 0;;
    --help|-h) show_help;;
    *) echo "Unknown argument: $1" >&2; exit 1;;
  esac
done

if [ -z "$FAL_KEY" ]; then
  echo "Error: FAL_KEY not set. Use --add-fal-key or export FAL_KEY=..." >&2
  exit 1
fi

command -v jq >/dev/null 2>&1 || { echo "Error: jq is required" >&2; exit 1; }

# Resolve endpoint from mode + tier
if [ -z "$MODE" ]; then
  echo "Error: --mode is required (image-to-video | text-to-video | reference-to-video)" >&2
  exit 1
fi
case "$TIER" in
  pro) TIER_PATH="";;
  fast) TIER_PATH="fast/";;
  *) echo "Error: --tier must be 'pro' or 'fast'" >&2; exit 1;;
esac
case "$MODE" in
  image-to-video|text-to-video|reference-to-video) ;;
  *) echo "Error: invalid --mode '$MODE'" >&2; exit 1;;
esac
MODEL="bytedance/seedance-2.0/${TIER_PATH}${MODE}"
BASE_URL="https://queue.fal.run/$MODEL"

# Queue management branches
if [ -n "$STATUS_ID" ]; then
  curl -s "$BASE_URL/requests/$STATUS_ID/status?logs=1" \
    -H "Authorization: Key $FAL_KEY" | jq .
  exit 0
fi
if [ -n "$RESULT_ID" ]; then
  curl -s "$BASE_URL/requests/$RESULT_ID" \
    -H "Authorization: Key $FAL_KEY" | jq .
  exit 0
fi
if [ -n "$CANCEL_ID" ]; then
  curl -s -X PUT "$BASE_URL/requests/$CANCEL_ID/cancel" \
    -H "Authorization: Key $FAL_KEY" | jq .
  exit 0
fi

# New-job validation
if [ -z "$PROMPT" ]; then echo "Error: --prompt required" >&2; exit 1; fi

# Auto-upload local file for I2V
if [ "$MODE" = "image-to-video" ] && [ -n "$FILE_PATH" ] && [ -z "$IMAGE_URL" ]; then
  UPLOAD_SH="$SCRIPT_DIR/../../fal-generate/scripts/upload.sh"
  if [ ! -f "$UPLOAD_SH" ]; then
    echo "Error: cannot find upload.sh at $UPLOAD_SH — pass --image-url instead" >&2
    exit 1
  fi
  echo "Uploading $FILE_PATH to fal CDN..." >&2
  IMAGE_URL=$(bash "$UPLOAD_SH" --file "$FILE_PATH" | tail -n1)
  if [ -z "$IMAGE_URL" ] || [[ "$IMAGE_URL" != http* ]]; then
    echo "Error: upload failed. Got: $IMAGE_URL" >&2
    exit 1
  fi
  echo "Uploaded: $IMAGE_URL" >&2
fi

# Build JSON payload with jq (proper escaping)
PAYLOAD=$(jq -n --arg prompt "$PROMPT" '{prompt: $prompt}')

add_str() {
  local key="$1" val="$2"
  [ -z "$val" ] && return
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$key" --arg v "$val" '. + {($k): $v}')
}
add_bool() {
  local key="$1" val="$2"
  [ -z "$val" ] && return
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$key" --argjson v "$val" '. + {($k): $v}')
}
add_int() {
  local key="$1" val="$2"
  [ -z "$val" ] && return
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$key" --argjson v "$val" '. + {($k): $v}')
}
add_array() {
  local key="$1" csv="$2"
  [ -z "$csv" ] && return
  local json_array
  json_array=$(echo "$csv" | jq -R -c 'split(",") | map(gsub("^\\s+|\\s+$"; ""))')
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$key" --argjson v "$json_array" '. + {($k): $v}')
}

case "$MODE" in
  image-to-video)
    if [ -z "$IMAGE_URL" ]; then
      echo "Error: image-to-video requires --image-url or --file" >&2; exit 1
    fi
    add_str image_url "$IMAGE_URL"
    add_str end_image_url "$END_IMAGE_URL"
    ;;
  text-to-video)
    :
    ;;
  reference-to-video)
    add_array image_urls "$IMAGE_URLS"
    add_array video_urls "$VIDEO_URLS"
    add_array audio_urls "$AUDIO_URLS"
    ;;
esac

add_str resolution "$RESOLUTION"
add_str duration "$DURATION"
add_str aspect_ratio "$ASPECT_RATIO"
add_bool generate_audio "$GEN_AUDIO"
add_int seed "$SEED"

# Extra --param K=V overrides
for kv in $EXTRA_PARAMS; do
  K="${kv%%=*}"; V="${kv#*=}"
  if [[ "$V" =~ ^-?[0-9]+$ ]] || [[ "$V" == "true" || "$V" == "false" ]] || [[ "$V" == \[* ]] || [[ "$V" == \{* ]]; then
    PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$K" --argjson v "$V" '. + {($k): $v}')
  else
    PAYLOAD=$(echo "$PAYLOAD" | jq --arg k "$K" --arg v "$V" '. + {($k): $v}')
  fi
done

echo "Submitting $MODE ($TIER) → $MODEL" >&2
echo "Payload: $PAYLOAD" >&2

SUBMIT=$(curl -s -X POST "$BASE_URL" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

REQUEST_ID=$(echo "$SUBMIT" | jq -r '.request_id // empty')
if [ -z "$REQUEST_ID" ]; then
  echo "Error: submission failed" >&2
  echo "$SUBMIT" >&2
  exit 1
fi
echo "Request ID: $REQUEST_ID" >&2

if [ "$ASYNC" = "1" ]; then
  echo "$SUBMIT" | jq .
  echo "" >&2
  echo "Check status: $0 --status $REQUEST_ID --mode $MODE --tier $TIER" >&2
  echo "Get result:   $0 --result $REQUEST_ID --mode $MODE --tier $TIER" >&2
  exit 0
fi

# Poll loop
ELAPSED=0
LAST_STATE=""
while [ "$ELAPSED" -lt "$TIMEOUT" ]; do
  STATUS_JSON=$(curl -s "$BASE_URL/requests/$REQUEST_ID/status?logs=1" \
    -H "Authorization: Key $FAL_KEY")
  STATE=$(echo "$STATUS_JSON" | jq -r '.status // "UNKNOWN"')
  case "$STATE" in
    COMPLETED)
      echo "Completed in ${ELAPSED}s." >&2
      RESULT=$(curl -s "$BASE_URL/requests/$REQUEST_ID" \
        -H "Authorization: Key $FAL_KEY")
      echo "$RESULT" | jq .
      if [ -n "$OUTPUT" ]; then
        VIDEO_URL=$(echo "$RESULT" | jq -r '.video.url // empty')
        if [ -n "$VIDEO_URL" ]; then
          mkdir -p "$(dirname "$OUTPUT")" 2>/dev/null || true
          echo "Downloading → $OUTPUT" >&2
          curl -sL "$VIDEO_URL" -o "$OUTPUT"
          echo "Saved: $OUTPUT" >&2
        else
          echo "Warning: no video.url in result; nothing to download" >&2
        fi
      fi
      exit 0;;
    FAILED|ERROR)
      echo "Job failed:" >&2
      echo "$STATUS_JSON" | jq . >&2
      exit 1;;
    IN_QUEUE)
      POS=$(echo "$STATUS_JSON" | jq -r '.queue_position // "?"')
      [ "$STATE" != "$LAST_STATE" ] && echo "  IN_QUEUE (position: $POS) [${ELAPSED}s]" >&2
      ;;
    IN_PROGRESS)
      LOG=$(echo "$STATUS_JSON" | jq -r '.logs // [] | if type=="array" then (.[-1].message // "") else "" end' 2>/dev/null)
      if [ -n "$LOG" ]; then
        echo "  IN_PROGRESS: $LOG [${ELAPSED}s]" >&2
      else
        [ "$STATE" != "$LAST_STATE" ] && echo "  IN_PROGRESS [${ELAPSED}s]" >&2
      fi
      ;;
    *)
      echo "  State: $STATE [${ELAPSED}s]" >&2;;
  esac
  LAST_STATE="$STATE"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

echo "Timed out after ${TIMEOUT}s. Request ID: $REQUEST_ID" >&2
echo "Resume with: $0 --status $REQUEST_ID --mode $MODE --tier $TIER" >&2
exit 1
