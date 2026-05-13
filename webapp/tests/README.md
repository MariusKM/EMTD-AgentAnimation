# Tests

## test-pipeline.mjs

Self-contained end-to-end test for the seedance job pipeline. Mirrors `runBash`, `uploadToFal`, `parseRequestId`, and `parseLastJson` from [lib/poller.ts](../lib/poller.ts) and exercises them against the dummy scripts in [fixtures/](fixtures/).

What it verifies:

| # | Assertion |
|---|---|
| 1 | Git Bash is reachable at `BASH_BIN` and `basename` / `curl` are on PATH after our prepend |
| 2 | `FAL_KEY` injected via spawn `env` reaches the child script |
| 3 | `uploadToFal()` returns the `https://...` URL printed by `upload.sh` |
| 4 | `runSeedance --async` returns a parseable UUID `request_id` |
| 5 | `runSeedance --status <id>` returns JSON with `status: "COMPLETED"` |
| 6 | `runSeedance --result <id> --output <path>` writes a non-empty file to `<path>` |

Run:

```bash
cd webapp
node tests/test-pipeline.mjs
```

No dev server, no network, no DB. Pure spawn + parsing layer.

If you change `runBash` / `uploadToFal` / `parseRequestId` / `parseLastJson` in [lib/poller.ts](../lib/poller.ts), update the mirrored implementations in this script — they're kept in sync intentionally so the test can run in plain Node without needing tsx.

## fixtures/

| File | Purpose |
|---|---|
| `dummy-seedance.sh` | Stand-in for `fal-seedance-2/scripts/seedance-video.sh`. Supports `--async` (prints fake JSON with a fixed UUID), `--status` (always returns `COMPLETED`), `--result` (writes a 33-byte fake mp4 to `--output`). Persists state in `$TMPDIR/dummy-seedance-state.json`. |
| `dummy-upload.sh` | Stand-in for `fal-generate/scripts/upload.sh`. Validates `--file` exists, then prints a fake fal CDN URL on its last line (matches the real script's output convention). |

To use the dummies against the real dev server (instead of fal), point `SEEDANCE_SCRIPT` and `FAL_UPLOAD_SCRIPT` at them in `.env.local`:

```
SEEDANCE_SCRIPT=<absolute path to>/webapp/tests/fixtures/dummy-seedance.sh
FAL_UPLOAD_SCRIPT=<absolute path to>/webapp/tests/fixtures/dummy-upload.sh
```

Restart `npm run dev`, submit a generation, and watch the job tick through `queued → uploading_end_image → submitted → done` without any actual fal calls. The downloaded "video" will be 33 bytes — useful for testing UI behavior on completion.
