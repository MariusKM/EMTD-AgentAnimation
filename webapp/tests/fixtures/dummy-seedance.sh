#!/usr/bin/env bash
# Dummy stand-in for fal-seedance-2/scripts/seedance-video.sh.
# Supports --async (submit), --status (poll), --result (download).
# Persists "submitted" jobs in a tmp file so --status can simulate progression.

set -e

REQ_FILE="${TMPDIR:-/tmp}/dummy-seedance-state.json"

ACTION=""
REQUEST_ID=""
OUTPUT=""
FILE_PATH=""
END_URL=""
PROMPT=""
DURATION=""
ASPECT=""
TIER="pro"
MODE=""
ASYNC=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --async) ASYNC=1; shift;;
    --status) ACTION=status; REQUEST_ID="$2"; shift 2;;
    --result) ACTION=result; REQUEST_ID="$2"; shift 2;;
    --cancel) ACTION=cancel; REQUEST_ID="$2"; shift 2;;
    --file) FILE_PATH="$2"; shift 2;;
    --end-image-url) END_URL="$2"; shift 2;;
    --prompt) PROMPT="$2"; shift 2;;
    --duration) DURATION="$2"; shift 2;;
    --aspect-ratio) ASPECT="$2"; shift 2;;
    --tier) TIER="$2"; shift 2;;
    --mode) MODE="$2"; shift 2;;
    --output) OUTPUT="$2"; shift 2;;
    *) shift;;
  esac
done

# --- Submit -----------------------------------------------------------------
if [[ $ASYNC -eq 1 && -z "$ACTION" ]]; then
  if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
    echo "dummy-seedance: --file required and must exist (got: $FILE_PATH)" >&2
    exit 2
  fi
  if [[ -z "$END_URL" ]]; then
    echo "dummy-seedance: --end-image-url required for I2V loop test" >&2
    exit 2
  fi
  REQ="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
  # Persist the request so --status / --result remember it
  cat > "$REQ_FILE" <<EOF
{"request_id":"$REQ","start_file":"$FILE_PATH","end_url":"$END_URL","prompt":"$PROMPT","poll_count":0}
EOF
  echo "[dummy-seedance] submitted async, request_id=$REQ" >&2
  echo "{\"request_id\":\"$REQ\",\"queue_position\":0}"
  exit 0
fi

# --- Status -----------------------------------------------------------------
if [[ "$ACTION" == "status" ]]; then
  if [[ ! -f "$REQ_FILE" ]]; then
    echo "{\"status\":\"NOT_FOUND\"}"
    exit 0
  fi
  POLL=$(grep -oE '"poll_count":[0-9]+' "$REQ_FILE" | head -1 | grep -oE '[0-9]+$')
  POLL=$((POLL + 1))
  # Update the poll counter in place (cheap awk-free rewrite)
  sed -i "s/\"poll_count\":[0-9]*/\"poll_count\":$POLL/" "$REQ_FILE"
  if [[ $POLL -ge 1 ]]; then
    echo "{\"status\":\"COMPLETED\",\"request_id\":\"$REQUEST_ID\"}"
  else
    echo "{\"status\":\"IN_PROGRESS\",\"request_id\":\"$REQUEST_ID\"}"
  fi
  exit 0
fi

# --- Result -----------------------------------------------------------------
if [[ "$ACTION" == "result" ]]; then
  URL="https://fake.fal.media/files/dummy-${REQUEST_ID}.mp4"
  if [[ -n "$OUTPUT" ]]; then
    mkdir -p "$(dirname "$OUTPUT")"
    # Write a recognizable fake mp4 (just a few bytes, NOT a real container)
    printf '\x00\x00\x00\x18ftypmp42dummy-seedance-output' > "$OUTPUT"
    echo "[dummy-seedance] wrote fake video to $OUTPUT ($(wc -c < "$OUTPUT") bytes)" >&2
  fi
  echo "{\"video\":{\"url\":\"$URL\"},\"seed\":12345}"
  exit 0
fi

echo "dummy-seedance: nothing to do (action='$ACTION', async=$ASYNC)" >&2
exit 1
