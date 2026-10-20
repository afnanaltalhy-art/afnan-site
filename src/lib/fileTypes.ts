import type { DriveFile, FileKind } from "./types";

export function kindFromMime(mime: string, name = ""): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/vnd.google-apps.form") return "form";
  if (mime === "application/vnd.google-apps.shortcut") return "link";
  if (
    mime === "application/vnd.google-apps.document" ||
    mime.includes("wordprocessingml") ||
    mime === "application/msword" ||
    mime === "text/plain" ||
    ["doc", "docx", "txt", "rtf"].includes(ext)
  )
    return "doc";
  if (
    mime === "application/vnd.google-apps.spreadsheet" ||
    mime.includes("spreadsheetml") ||
    mime === "application/vnd.ms-excel" ||
    mime === "text/csv" ||
    ["xls", "xlsx", "csv"].includes(ext)
  )
    return "sheet";
  if (
    mime === "application/vnd.google-apps.presentation" ||
    mime.includes("presentationml") ||
    mime === "application/vnd.ms-powerpoint" ||
    ["ppt", "pptx"].includes(ext)
  )
    return "slides";
  if (mime.includes("zip") || mime.includes("rar") || ["zip", "rar", "7z"].includes(ext)) return "archive";
  return "other";
}

export const KIND_LABEL: Record<FileKind, string> = {
  pdf: "ملف PDF",
  image: "صورة",
  video: "فيديو",
  audio: "تسجيل صوتي",
  doc: "مستند",
  sheet: "جدول بيانات",
  slides: "عرض تقديمي",
  form: "نموذج",
  archive: "ملف مضغوط",
  link: "اختصار",
  other: "ملف",
};

export const KIND_ORDER: FileKind[] = ["pdf", "image", "doc", "slides", "sheet", "video", "audio", "form", "archive", "link", "other"];

export function previewUrl(f: Pick<DriveFile, "id" | "mimeType">) {
  const id = encodeURIComponent(f.id);
  if (f.mimeType === "application/vnd.google-apps.document") return `https://docs.google.com/document/d/${id}/preview`;
  if (f.mimeType === "application/vnd.google-apps.spreadsheet") return `https://docs.google.com/spreadsheets/d/${id}/preview`;
  if (f.mimeType === "application/vnd.google-apps.presentation") return `https://docs.google.com/presentation/d/${id}/preview`;
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function openUrl(f: Pick<DriveFile, "id" | "mimeType">) {
  const id = encodeURIComponent(f.id);
  if (f.mimeType === "application/vnd.google-apps.document") return `https://docs.google.com/document/d/${id}/edit?usp=sharing`;
  if (f.mimeType === "application/vnd.google-apps.spreadsheet") return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing`;
  if (f.mimeType === "application/vnd.google-apps.presentation") return `https://docs.google.com/presentation/d/${id}/edit?usp=sharing`;
  if (f.mimeType === "application/vnd.google-apps.form") return `https://docs.google.com/forms/d/${id}/viewform`;
  return `https://drive.google.com/file/d/${id}/view?usp=sharing`;
}

export function thumbnailUrl(id: string, width = 640) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${width}`;
}

export function folderUrl(id: string) {
  return `https://drive.google.com/drive/folders/${encodeURIComponent(id)}`;
}

/** Strip file extensions and leading ordering numbers for display */
export function displayName(name: string) {
  return name.replace(/\.(pdf|docx?|pptx?|xlsx?|jpe?g|png|gif|webp|heic|mp4|mov|txt|csv|zip|rar)$/i, "").trim();
}

export function cleanFolderName(name: string) {
  return name.replace(/^\s*[\d٠-٩]+\s*[-–—.)_:]\s*/, "").trim() || name;
}

export function formatSize(bytes?: number) {
  if (!bytes) return "";
  const units = ["بايت", "ك.ب", "م.ب", "ج.ب"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export const arCollator = new Intl.Collator("ar", { numeric: true, sensitivity: "base" });

/** Arabic-Indic numerals to match dates and the rest of the page */
export const ar = (n: number) => n.toLocaleString("ar-SA");
