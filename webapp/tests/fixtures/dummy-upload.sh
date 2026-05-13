#!/usr/bin/env bash
# Dummy stand-in for fal-generate/scripts/upload.sh.
# Emits one fake fal CDN URL on stdout (last non-empty line — same shape as the real script).

set -e

FILE_PATH=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --file) FILE_PATH="$2"; shift 2;;
    *) shift;;
  esac
done

if [[ -z "$FILE_PATH" ]]; then
  echo "dummy-upload: --file required" >&2
  exit 2
fi
if [[ ! -f "$FILE_PATH" ]]; then
  echo "dummy-upload: file not found: $FILE_PATH" >&2
  exit 3
fi

BASE=$(basename "$FILE_PATH")
echo "[dummy-upload] uploading $BASE ($(wc -c < "$FILE_PATH") bytes)" >&2
echo "https://fake.fal.media/files/${BASE}"
