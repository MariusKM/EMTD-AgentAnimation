#!/usr/bin/env python
"""Google Drive upload skill — service account auth.

Subcommands:
  setup        Register a service account key path (locally or globally).
  add-folder   Add a named folder mapping.
  list-folders List saved folder mappings.
  upload       Upload a file or directory to a target Drive folder.
"""

from __future__ import annotations

import argparse
import datetime
import json
import os
import re
import shutil
import sys
from pathlib import Path

# Persistent config (per-user, cross-project)
CONFIG_DIR = Path.home() / ".claude" / "gdrive-upload"
CONFIG_FILE = CONFIG_DIR / "config.json"
GLOBAL_KEY_PATH = CONFIG_DIR / "service_account.json"

# Skill-local files
SKILL_DIR = Path(__file__).resolve().parent.parent
FOLDER_LINKS_FILE = SKILL_DIR / "folder_links.json"


# ---------- config + folder links persistence ----------

def load_config() -> dict:
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    return {}


def save_config(config: dict) -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_FILE.write_text(json.dumps(config, indent=2), encoding="utf-8")


def load_folder_links() -> dict:
    if FOLDER_LINKS_FILE.exists():
        return json.loads(FOLDER_LINKS_FILE.read_text(encoding="utf-8"))
    return {}


def save_folder_links(links: dict) -> None:
    FOLDER_LINKS_FILE.write_text(json.dumps(links, indent=2), encoding="utf-8")


# ---------- key resolution ----------

def resolve_key_path(cli_key: str | None = None) -> Path | None:
    if cli_key:
        return Path(cli_key)
    env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env:
        return Path(env)
    cfg = load_config()
    if "service_account_path" in cfg:
        return Path(cfg["service_account_path"])
    if GLOBAL_KEY_PATH.exists():
        return GLOBAL_KEY_PATH
    return None


# ---------- helpers ----------

def extract_folder_id(link_or_id: str) -> str:
    """Pull a folder ID out of a Drive URL, or return the input if it already looks like an ID."""
    m = re.search(r"/folders/([a-zA-Z0-9_-]+)", link_or_id)
    if m:
        return m.group(1)
    m = re.search(r"[?&]id=([a-zA-Z0-9_-]+)", link_or_id)
    if m:
        return m.group(1)
    # Bare ID (no slashes, no scheme)
    if re.fullmatch(r"[a-zA-Z0-9_-]{10,}", link_or_id):
        return link_or_id
    return link_or_id  # last resort — let the API reject it


def resolve_target_folder(target: str) -> str:
    """target can be: a saved name, a folder ID, or a Drive folder URL."""
    links = load_folder_links()
    if target in links:
        return links[target]["folder_id"]
    return extract_folder_id(target)


def _import_drive_libs():
    try:
        from google.oauth2 import service_account  # noqa: F401
        from googleapiclient.discovery import build  # noqa: F401
        from googleapiclient.http import MediaFileUpload  # noqa: F401
    except ImportError:
        print(
            "ERROR: google-auth + google-api-python-client are not installed.\n"
            "Run: pip install google-auth google-api-python-client",
            file=sys.stderr,
        )
        sys.exit(2)


def get_drive_service(key_path: Path):
    _import_drive_libs()
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_file(
        str(key_path),
        scopes=["https://www.googleapis.com/auth/drive"],
    )
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def find_or_create_subfolder(svc, parent_id: str, name: str) -> str:
    safe_name = name.replace("'", "\\'")
    q = (
        f"'{parent_id}' in parents and name='{safe_name}' "
        f"and mimeType='application/vnd.google-apps.folder' and trashed=false"
    )
    results = svc.files().list(
        q=q,
        fields="files(id,name)",
        supportsAllDrives=True,
        includeItemsFromAllDrives=True,
    ).execute()
    files = results.get("files", [])
    if files:
        return files[0]["id"]
    body = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_id],
    }
    result = svc.files().create(body=body, fields="id", supportsAllDrives=True).execute()
    return result["id"]


def list_existing_files_in_folder(svc, folder_id: str) -> list[dict]:
    q = f"'{folder_id}' in parents and trashed=false"
    results = svc.files().list(
        q=q,
        fields="files(id,name,mimeType)",
        supportsAllDrives=True,
        includeItemsFromAllDrives=True,
    ).execute()
    return results.get("files", [])


def upload_one_file(svc, local_path: Path, parent_id: str) -> dict:
    from googleapiclient.http import MediaFileUpload

    media = MediaFileUpload(str(local_path), resumable=False)
    body = {"name": local_path.name, "parents": [parent_id]}
    return svc.files().create(
        body=body,
        media_body=media,
        fields="id,name,webViewLink",
        supportsAllDrives=True,
    ).execute()


# ---------- subcommands ----------

def cmd_setup(args) -> int:
    key_src = Path(args.key).expanduser()
    if not key_src.is_file():
        print(f"ERROR: key file not found: {key_src}", file=sys.stderr)
        return 1

    if args.global_:
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        if key_src.resolve() != GLOBAL_KEY_PATH.resolve():
            shutil.copy2(key_src, GLOBAL_KEY_PATH)
            print(f"Copied key to global location: {GLOBAL_KEY_PATH}")
        else:
            print(f"Key already at global location: {GLOBAL_KEY_PATH}")
        final_path = GLOBAL_KEY_PATH
    else:
        final_path = key_src.resolve()
        print(f"Using key in place: {final_path}")

    config = load_config()
    config["service_account_path"] = str(final_path)
    save_config(config)
    print(f"Config saved to: {CONFIG_FILE}")

    # Verify
    try:
        svc = get_drive_service(final_path)
        about = svc.about().get(fields="user").execute()
        email = about.get("user", {}).get("emailAddress", "unknown")
        print(f"Verified: authenticated as {email}")
    except SystemExit:
        raise
    except Exception as e:
        print(f"WARNING: could not verify credentials ({e})", file=sys.stderr)
        return 2
    return 0


def cmd_add_folder(args) -> int:
    links = load_folder_links()
    folder_id = extract_folder_id(args.link)
    url = (
        args.link
        if args.link.startswith("http")
        else f"https://drive.google.com/drive/folders/{folder_id}"
    )
    if args.name in links:
        print(f"NOTE: overwriting existing mapping for '{args.name}'")
    links[args.name] = {
        "folder_id": folder_id,
        "url": url,
        "description": args.description or "",
        "added": datetime.date.today().isoformat(),
    }
    save_folder_links(links)
    print(f"Saved folder mapping: {args.name} -> {folder_id}")
    print(f"  url: {url}")
    return 0


def cmd_list_folders(args) -> int:
    links = load_folder_links()
    if not links:
        print("(no folders saved yet — use add-folder to add one)")
        return 0
    for name, info in sorted(links.items()):
        print(f"  {name}")
        print(f"    id:          {info['folder_id']}")
        print(f"    url:         {info['url']}")
        if info.get("description"):
            print(f"    description: {info['description']}")
        if info.get("added"):
            print(f"    added:       {info['added']}")
    return 0


def cmd_upload(args) -> int:
    key_path = resolve_key_path(args.key)
    if not key_path or not key_path.is_file():
        print("ERROR: no service account key found.", file=sys.stderr)
        print("Run: python .claude/skills/gdrive-upload/scripts/gdrive.py setup --key <path> [--global]", file=sys.stderr)
        return 1

    parent_id = resolve_target_folder(args.target)
    if not parent_id:
        print(f"ERROR: could not resolve target folder: {args.target}", file=sys.stderr)
        return 1

    local = Path(args.local_path).expanduser()
    if not local.exists():
        print(f"ERROR: local path not found: {local}", file=sys.stderr)
        return 1

    if local.is_file():
        files_to_upload = [local]
    else:
        files_to_upload = sorted(f for f in local.iterdir() if f.is_file())

    if not files_to_upload:
        print(f"WARNING: no files to upload in {local}", file=sys.stderr)
        return 1

    print(f"Plan:")
    print(f"  source:        {local}")
    print(f"  target folder: {parent_id}")
    if args.subfolder:
        print(f"  subfolder:     '{args.subfolder}' (will be created if missing)")
    print(f"  files ({len(files_to_upload)}):")
    for f in files_to_upload:
        print(f"    - {f.name}  ({f.stat().st_size:,} bytes)")

    if args.dry_run:
        print("\n[dry-run] no upload performed")
        return 0

    svc = get_drive_service(key_path)

    if args.subfolder:
        target_id = find_or_create_subfolder(svc, parent_id, args.subfolder)
        print(f"\nSubfolder '{args.subfolder}' resolved to id: {target_id}")
    else:
        target_id = parent_id

    # Warn about same-named existing files
    existing = list_existing_files_in_folder(svc, target_id)
    existing_names = {f["name"] for f in existing}
    name_collisions = [f.name for f in files_to_upload if f.name in existing_names]
    if name_collisions:
        print("\nWARNING: target folder already contains files with these names:")
        for n in name_collisions:
            print(f"  - {n}")
        print("Drive will create duplicates (it does not overwrite). Cancel and re-run with a different subfolder if undesired.")

    print(f"\nUploading {len(files_to_upload)} file(s) to id={target_id} ...")
    for f in files_to_upload:
        result = upload_one_file(svc, f, target_id)
        print(f"  {f.name}  -> id={result['id']}  {result.get('webViewLink', '')}")

    print(f"\nDone. Folder: https://drive.google.com/drive/folders/{target_id}")
    return 0


# ---------- argparse plumbing ----------

def main() -> None:
    ap = argparse.ArgumentParser(prog="gdrive", description=__doc__)
    sp = ap.add_subparsers(dest="cmd", required=True)

    p = sp.add_parser("setup", help="Register a service account key path")
    p.add_argument("--key", required=True, help="path to service account JSON key file")
    p.add_argument("--global", dest="global_", action="store_true",
                   help="copy the key to ~/.claude/gdrive-upload/service_account.json for cross-project reuse")
    p.set_defaults(func=cmd_setup)

    p = sp.add_parser("add-folder", help="Add a named folder mapping")
    p.add_argument("name", help="short name for this folder (e.g. hero-animation)")
    p.add_argument("link", help="Drive folder URL or ID")
    p.add_argument("--description", help="optional description")
    p.set_defaults(func=cmd_add_folder)

    p = sp.add_parser("list-folders", help="List saved folder mappings")
    p.set_defaults(func=cmd_list_folders)

    p = sp.add_parser("upload", help="Upload a file or directory")
    p.add_argument("local_path", help="local file or directory (top-level files only — not recursive)")
    p.add_argument("target", help="saved folder name OR Drive folder URL OR folder ID")
    p.add_argument("--subfolder", help="optional subfolder under target (created if missing)")
    p.add_argument("--key", help="override service account key path")
    p.add_argument("--dry-run", action="store_true", help="print plan without uploading")
    p.set_defaults(func=cmd_upload)

    args = ap.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
