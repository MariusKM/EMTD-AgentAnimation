---
name: gdrive-upload
description: Upload files or directories to Google Drive via service account. Use when the user wants to push deliverables (final renders, assets, exports) to a shared team Drive folder, or when they ask to "upload to Drive" / "push to the team folder" / "save these to Google Drive". Supports named folder mappings so common destinations (e.g. "hero-animation") can be referenced by short name instead of long URL.
argument-hint: <subcommand> [args]
---

# Google Drive Upload Skill

Upload files or directories to Google Drive using a service account. Persists named folder mappings so common destinations can be referenced by short name. Auth is service-account-only — for OAuth user auth, use the `mcp__claude_ai_Google_Drive__*` MCP tools instead.

## Setup (one-time, before first upload)

The service account needs a JSON key file. The agent MUST ask the user during first setup whether to:

- **Leave the key in place** (project-local) — pass the existing path. Useful if the key is already wired into another tool (e.g. the webapp at `HeroAnimation/env/...`).
- **Copy to a global location** (`~/.claude/gdrive-upload/service_account.json`) — accessible from any project / any working directory. Useful for reusability across worktrees.

Then run:

```bash
# Local — leaves the key where it is
python .claude/skills/gdrive-upload/scripts/gdrive.py setup --key <path-to-key.json>

# Global — copies the key to ~/.claude/gdrive-upload/service_account.json
python .claude/skills/gdrive-upload/scripts/gdrive.py setup --key <path-to-key.json> --global
```

`setup` registers the key path in `~/.claude/gdrive-upload/config.json` and verifies the credentials by hitting Drive's `about.get` endpoint. Run again any time to switch keys.

**Key resolution order at upload time:**
1. `--key <path>` CLI flag (override)
2. `$GOOGLE_APPLICATION_CREDENTIALS` env var
3. `~/.claude/gdrive-upload/config.json` → `service_account_path` (set by `setup`)
4. `~/.claude/gdrive-upload/service_account.json` (default global path)
5. Error with setup instructions

## Folder mappings

Saved in `.claude/skills/gdrive-upload/folder_links.json` (gitignored — each clone populates its own).

```bash
python .claude/skills/gdrive-upload/scripts/gdrive.py add-folder hero-animation "https://drive.google.com/drive/folders/1rpfEAZJMCG2PX3n-EZPgSPCmtQz1mTih" --description "EMTD team folder"

python .claude/skills/gdrive-upload/scripts/gdrive.py list-folders
```

**The agent MUST proactively save folder mappings any time the user provides a Drive folder link with a clear context** (e.g. "this is our team folder", "save assets to this Drive folder"). Pick a short kebab-case name based on the context. If unsure of the name, ask the user.

## Upload

```bash
# Upload all files in a directory to a named folder, into a new/existing subfolder
python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
  UnitProgression/Infantry/out/v1/Final \
  hero-animation \
  --subfolder "Infantry Progression"

# Upload a single file using a Drive URL directly (no saved mapping)
python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
  Final/progression_compilation.png \
  "https://drive.google.com/drive/folders/1rpfEAZJMCG2PX3n-EZPgSPCmtQz1mTih"

# Dry run — show what would happen without uploading
python .claude/skills/gdrive-upload/scripts/gdrive.py upload \
  UnitProgression/Infantry/out/v1/Final \
  hero-animation \
  --subfolder "Infantry Progression" \
  --dry-run
```

`upload` arguments:
- `local_path` — file or directory. If a directory, all files at the top level are uploaded (NOT recursive).
- `target` — saved folder name OR full Drive folder URL OR raw folder ID.
- `--subfolder <name>` — optional. If given, the agent finds-or-creates a subfolder of that name under `target` and uploads into it. Idempotent — re-running with the same subfolder name uploads alongside existing files (Drive permits same-named files; agent should warn user if duplicate names are a problem).
- `--key <path>` — override the key path for this upload.
- `--dry-run` — print the plan without uploading.

## Dependencies

```bash
pip install google-auth google-api-python-client
```

The script imports lazily and prints install instructions if the libs are missing.

## Skills the agent should follow

- **Always confirm the target** before a non-dry-run upload. Print the destination + file list, get confirmation if the destination is ambiguous (e.g. user said "the Drive folder" without naming which one).
- **Default to `--dry-run` first** for new destinations / new subfolders. Then run for real after the user confirms.
- **Don't overwrite blindly** — Drive permits same-named files (creates a duplicate, doesn't replace). Agent should warn the user if files of the same name already exist in the target subfolder before uploading.
- **Surface the folder URL** at the end of a successful upload so the user can click through to verify.
- **Save new folder links proactively** — if the user provides a Drive URL with context, run `add-folder` so the next upload to that destination uses the short name.
