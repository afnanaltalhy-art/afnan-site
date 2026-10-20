"use client";
export async function api<T = unknown>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const j = await res.json().catch(() => ({}));
  if (res.status === 401) { window.location.href = `/admin/login?next=${encodeURIComponent(location.pathname)}`; throw new Error("انتهت الجلسة"); }
  if (!res.ok) throw new Error((j as { error?: string }).error ?? "حدث خطأ");
  return j as T;
}

let cfg: Promise<{ db: boolean; blob: boolean }> | null = null;
export const getConfig = () => (cfg ??= api<{ db: boolean; blob: boolean }>("/api/admin/config"));

export type Uploaded = { url: string; name: string; size: number; mime: string };

export async function uploadFile(file: File, onProgress?: (p: number) => void): Promise<Uploaded> {
  const { blob } = await getConfig();
  if (blob) {
    const { upload } = await import("@vercel/blob/client");
    const r = await upload(`lessons/${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/blob", onUploadProgress: (e) => onProgress?.(e.percentage) });
    return { url: r.url, name: file.name, size: file.size, mime: file.type || "application/octet-stream" };
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload-local");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.((e.loaded / e.total) * 100);
    xhr.onload = () => { try { const j = JSON.parse(xhr.responseText); if (xhr.status < 300) resolve(j); else reject(new Error(j.error ?? "فشل الرفع")); } catch { reject(new Error("فشل الرفع")); } };
    xhr.onerror = () => reject(new Error("فشل الاتصال"));
    const fd = new FormData(); fd.append("file", file); xhr.send(fd);
  });
}

/** Upload + register in the media library. */
export async function uploadAndRecord(file: File, lessonId?: string | null, onProgress?: (p: number) => void) {
  const u = await uploadFile(file, onProgress);
  return api<{ id: string; url: string; name: string; kind: string }>("/api/admin/files", "POST", { ...u, lessonId: lessonId ?? null });
}

export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} م.ب` : `${Math.max(1, Math.round(n / 1024))} ك.ب`);
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "short", day: "numeric" });
