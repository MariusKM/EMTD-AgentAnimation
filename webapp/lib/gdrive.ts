import fs from "node:fs";
import { google, drive_v3 } from "googleapis";
import { GDRIVE_ROOT_FOLDER_ID, GDRIVE_SERVICE_ACCOUNT } from "./paths";

let _drive: drive_v3.Drive | null = null;

export function getDrive(): drive_v3.Drive {
  if (_drive) return _drive;
  if (!fs.existsSync(GDRIVE_SERVICE_ACCOUNT)) {
    throw new Error(
      `Google Drive service account JSON not found at ${GDRIVE_SERVICE_ACCOUNT}. ` +
        "Drop the file in place and share the target Drive folder with the service-account email.",
    );
  }
  if (!GDRIVE_ROOT_FOLDER_ID) {
    throw new Error("GDRIVE_ROOT_FOLDER_ID env var is not set.");
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: GDRIVE_SERVICE_ACCOUNT,
    scopes: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"],
  });
  _drive = google.drive({ version: "v3", auth });
  return _drive;
}

const folderCache = new Map<string, string>();

async function ensureSubfolder(parentId: string, name: string): Promise<string> {
  const cacheKey = `${parentId}:${name}`;
  const cached = folderCache.get(cacheKey);
  if (cached) return cached;

  const drive = getDrive();
  const q = [
    `'${parentId}' in parents`,
    `name = '${name.replace(/'/g, "\\'")}'`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false",
  ].join(" and ");
  const list = await drive.files.list({
    q,
    fields: "files(id,name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const existing = list.data.files?.[0]?.id;
  if (existing) {
    folderCache.set(cacheKey, existing);
    return existing;
  }
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
    supportsAllDrives: true,
  });
  const id = created.data.id!;
  folderCache.set(cacheKey, id);
  return id;
}

export async function ensureHeroFolder(heroId: string, rootFolderId?: string): Promise<string> {
  const root = rootFolderId && rootFolderId.length > 0 ? rootFolderId : GDRIVE_ROOT_FOLDER_ID;
  return ensureSubfolder(root, heroId);
}

export async function ensureHeroSubfolder(
  heroId: string,
  subfolderName: string,
  rootFolderId?: string,
): Promise<string> {
  const heroFolderId = await ensureHeroFolder(heroId, rootFolderId);
  return ensureSubfolder(heroFolderId, subfolderName);
}

export async function ensureFinalFolder(heroId: string): Promise<string> {
  return ensureHeroSubfolder(heroId, "Final");
}

export async function uploadOrReplaceFile(
  localPath: string,
  parentId: string,
  name: string,
): Promise<{ id: string; name: string; size: number; replaced: boolean }> {
  if (!fs.existsSync(localPath)) throw new Error(`Local file not found: ${localPath}`);
  const size = fs.statSync(localPath).size;
  const drive = getDrive();

  // Same-name lookup is scoped to non-folder, non-trashed siblings only.
  const q = [
    `'${parentId}' in parents`,
    `name = '${name.replace(/'/g, "\\'")}'`,
    "mimeType != 'application/vnd.google-apps.folder'",
    "trashed = false",
  ].join(" and ");
  const list = await drive.files.list({
    q,
    fields: "files(id,name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const existing = list.data.files?.[0];

  if (existing?.id) {
    // Replace contents in-place: keeps the file ID, share link, and version history.
    const res = await drive.files.update({
      fileId: existing.id,
      media: { body: fs.createReadStream(localPath) },
      fields: "id,name",
      supportsAllDrives: true,
    });
    return { id: res.data.id!, name: res.data.name ?? name, size, replaced: true };
  }

  const res = await drive.files.create({
    requestBody: { name, parents: [parentId] },
    media: { body: fs.createReadStream(localPath) },
    fields: "id,name",
    supportsAllDrives: true,
  });
  return { id: res.data.id!, name: res.data.name ?? name, size, replaced: false };
}
