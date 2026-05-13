import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, DB_PATH, LOG_DIR } from "./paths";

let _db: Database.Database | null = null;

export function db(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const d = new Database(DB_PATH);
  d.pragma("journal_mode = WAL");
  d.pragma("foreign_keys = ON");
  migrate(d);
  _db = d;
  return d;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS concept_meta (
      hero_id TEXT NOT NULL,
      concept_id TEXT NOT NULL,
      favorite INTEGER NOT NULL DEFAULT 0,
      rating INTEGER,
      notes TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (hero_id, concept_id)
    );

    CREATE TABLE IF NOT EXISTS clip_meta (
      hero_id TEXT NOT NULL,
      clip_name TEXT NOT NULL,
      favorite INTEGER NOT NULL DEFAULT 0,
      rating INTEGER,
      notes TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (hero_id, clip_name)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      status TEXT NOT NULL,
      hero_id TEXT,
      concept_id TEXT,
      clip_name TEXT,
      payload_json TEXT,
      result_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      started_at TEXT,
      finished_at TEXT,
      pid INTEGER
    );

    CREATE INDEX IF NOT EXISTS jobs_status_kind ON jobs(status, kind);
    CREATE INDEX IF NOT EXISTS jobs_created ON jobs(created_at DESC);

    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  addColumnIfMissing(d, "clip_meta", "marked_upload", "INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing(d, "clip_meta", "marked_key", "INTEGER NOT NULL DEFAULT 0");
  // Per-clip soft circular alpha mask, expressed as fraction of half-min-side
  // (0..1). Applied at delivery time by deliver_webm.py and in the preview modal.
  // NULL = no mask (treated as 0); explicit 0 also = no mask.
  addColumnIfMissing(d, "clip_meta", "edge_fade", "REAL");
  // Per-clip overflow output size (px). When > delivery size, deliver_webm.py
  // encodes the WebM at this outer resolution with the actual aligned content
  // sitting in the central <size>×<size> region and transparent padding around
  // it. Lets clips whose action overshoots the in-game slot (raised swords,
  // big VFX) render past the slot edges. NULL = no overflow.
  addColumnIfMissing(d, "clip_meta", "overflow_size", "INTEGER");
  // Per-clip chroma screen color used when generating + keying. NULL = unknown
  // (treated as 'green' default by the keying pipeline). Set explicitly when
  // the user picks a blue FFLF for VFX-heavy heroes (e.g. Dragonwitch's green
  // magic), or auto-detected from the raw mp4 corners on first key.
  addColumnIfMissing(d, "clip_meta", "screen_color", "TEXT");
}

function addColumnIfMissing(d: Database.Database, table: string, column: string, decl: string) {
  const cols = d.prepare(`PRAGMA table_info(${table})`).all() as any[];
  if (cols.some((c) => c.name === column)) return;
  d.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${decl}`);
}

export function logPath(jobId: string): string {
  return path.posix.join(LOG_DIR, `${jobId}.log`);
}
