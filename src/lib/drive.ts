import "server-only";
import { createSign } from "node:crypto";
import { arCollator, kindFromMime } from "./fileTypes";
import type { DriveFile, DriveFolder, DriveStatus } from "./types";

/**
 * Google Drive integration.
 * Two modes:
 *  - API key: reads folders/files shared "anyone with the link" only.
 *  - Service account: reads everything shared with the service account;
 *    each file is tagged isPublic so visitors only ever see link-shared files.
 */

const API = "https://www.googleapis.com/drive/v3";
const FOLDER = "application/vnd.google-apps.folder";
const SHORTCUT = "application/vnd.google-apps.shortcut";
const MAX_DEPTH = 6;
export const DRIVE_REVALIDATE = 600; // seconds
export const DRIVE_TAG = "drive";

export const ROOT_FOLDER_ID = process.env.DRIVE_ROOT_FOLDER_ID || "17rtgy8oaRNnS27bjsL0u5-bcjD1xbEXS";

type Mode = "api-key" | "service-account";

function mode(): Mode | null {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) return "service-account";
  if (process.env.GOOGLE_API_KEY) return "api-key";
  return null;
}

// ───────── Service-account auth (JWT bearer, no extra dependency) ─────────
let cachedToken: { token: string; exp: number } | null = null;

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function serviceAccountToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(key));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new DriveError("error", `تعذر التحقق من حساب الخدمة (${res.status})`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

class DriveError extends Error {
  constructor(public reason: "no-access" | "error", message: string) {
    super(message);
  }
}

async function driveFetch(path: string, params: Record<string, string>, asText = false) {
  const m = mode();
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const headers: Record<string, string> = {};
  if (m === "api-key") url.searchParams.set("key", process.env.GOOGLE_API_KEY!);
  else headers.Authorization = `Bearer ${await serviceAccountToken()}`;
  const res = await fetch(url, { headers, next: { revalidate: DRIVE_REVALIDATE, tags: [DRIVE_TAG] } });
  if (res.status === 404 || res.status === 403) throw new DriveError("no-access", `لا توجد صلاحية للوصول (${res.status})`);
  if (!res.ok) throw new DriveError("error", `خطأ من Google Drive (${res.status})`);
  return asText ? res.text() : res.json();
}

interface RawFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  description?: string;
  permissionIds?: string[];
  shortcutDetails?: { targetId: string; targetMimeType: string };
}

const FIELDS =
  "nextPageToken,files(id,name,mimeType,size,createdTime,modifiedTime,description,permissionIds,shortcutDetails(targetId,targetMimeType))";

async function listChildren(folderId: string): Promise<RawFile[]> {
  const out: RawFile[] = [];
  let pageToken = "";
  do {
    const params: Record<string, string> = {
      q: `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false`,
      fields: FIELDS,
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    };
    if (pageToken) params.pageToken = pageToken;
    const json = (await driveFetch("/files", params)) as { files?: RawFile[]; nextPageToken?: string };
    out.push(...(json.files ?? []));
    pageToken = json.nextPageToken ?? "";
  } while (pageToken);
  return out;
}

function isPublic(raw: RawFile, m: Mode) {
  if (m === "api-key") return true; // an API key can only see link-shared items
  const ids = raw.permissionIds ?? [];
  return ids.includes("anyoneWithLink") || ids.includes("anyone");
}

async function walk(
  id: string,
  name: string,
  path: string[],
  topFolderId: string,
  depth: number,
  m: Mode,
  meta?: Partial<RawFile>,
): Promise<DriveFolder> {
  const children = await listChildren(id);
  const folder: DriveFolder = { id, name, description: meta?.description, modifiedTime: meta?.modifiedTime, folders: [], files: [] };
  const subfolders: { raw: RawFile; targetId: string }[] = [];

  for (const raw of children) {
    const effMime = raw.mimeType === SHORTCUT ? raw.shortcutDetails?.targetMimeType ?? "" : raw.mimeType;
    const effId = raw.mimeType === SHORTCUT ? raw.shortcutDetails?.targetId ?? raw.id : raw.id;
    if (effMime === FOLDER) {
      subfolders.push({ raw, targetId: effId });
      continue;
    }
    folder.files.push({
      id: effId,
      name: raw.name,
      mimeType: effMime,
      kind: kindFromMime(effMime, raw.name),
      size: raw.size ? Number(raw.size) : undefined,
      createdTime: raw.createdTime,
      modifiedTime: raw.modifiedTime,
      description: raw.description,
      isPublic: isPublic(raw, m),
      path,
      topFolderId: topFolderId || id,
      parentId: id,
    });
  }

  if (depth < MAX_DEPTH) {
    folder.folders = await Promise.all(
      subfolders.map(({ raw, targetId }) =>
        walk(targetId, raw.name, [...path, raw.name], topFolderId || targetId, depth + 1, m, raw).catch(
          () => ({ id: targetId, name: raw.name, folders: [], files: [] }) as DriveFolder,
        ),
      ),
    );
  }
  folder.folders.sort((a, b) => arCollator.compare(a.name, b.name));
  folder.files.sort((a, b) => arCollator.compare(a.name, b.name));
  return folder;
}

export interface DriveSnapshot {
  status: DriveStatus;
  root: DriveFolder | null;
}

export async function loadDriveTree(): Promise<DriveSnapshot> {
  const m = mode();
  if (!m) {
    return {
      status: { ok: false, reason: "not-configured", message: "لم يتم ربط Google Drive بعد." },
      root: null,
    };
  }
  try {
    const meta = (await driveFetch(`/files/${ROOT_FOLDER_ID}`, {
      fields: "id,name,description,modifiedTime,mimeType",
      supportsAllDrives: "true",
    })) as RawFile;
    const root = await walk(meta.id, meta.name, [], "", 0, m, meta);
    // top-level folders are their own "topFolderId"; fix files sitting directly in root
    root.files.forEach((f) => (f.topFolderId = root.id));
    return { status: { ok: true, mode: m, syncedAt: new Date().toISOString() }, root };
  } catch (e) {
    const err = e as DriveError;
    return {
      status: {
        ok: false,
        reason: err.reason ?? "error",
        message:
          err.reason === "no-access"
            ? "لا يمكن الوصول إلى مجلد ملف الإنجاز. تأكدي من مشاركته بالطريقة الموضحة في دليل التفعيل."
            : err.message || "حدث خطأ أثناء قراءة Google Drive.",
      },
      root: null,
    };
  }
}

/** Plain text of a Google Doc (used to present the intro documents as written) */
export async function exportDocText(fileId: string): Promise<string | null> {
  if (!mode()) return null;
  try {
    return (await driveFetch(`/files/${fileId}/export`, { mimeType: "text/plain" }, true)) as string;
  } catch {
    return null;
  }
}

export function flattenFiles(folder: DriveFolder): DriveFile[] {
  return [...folder.files, ...folder.folders.flatMap(flattenFiles)];
}

export function flattenFolders(folder: DriveFolder): DriveFolder[] {
  return [folder, ...folder.folders.flatMap(flattenFolders)];
}
