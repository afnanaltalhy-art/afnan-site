import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "./auth";
import { hasDb } from "./db";

export async function isAdmin() {
  return verifySession(cookies().get(ADMIN_COOKIE)?.value);
}

/** Wraps an admin handler: checks the session again (defense in depth) and that a DB exists. */
export function adminRoute<A extends unknown[]>(fn: (...args: A) => Promise<Response>, needDb = true) {
  return async (...args: A) => {
    if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    if (needDb && !hasDb) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة: أضيفي DATABASE_URL" }, { status: 503 });
    try {
      return await fn(...args);
    } catch (e) {
      console.error("[admin api]", e);
      const msg = e instanceof Error && /Unique constraint/.test(e.message) ? "القيمة مستخدمة مسبقًا (مثل رابط الدرس)" : "حدث خطأ في الخادم";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  };
}

export const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
export const ok = (data: unknown = { ok: true }) => NextResponse.json(data);

export function fileKind(name: string, mime = "") {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (["ppt", "pptx", "pps", "ppsx"].includes(ext)) return "pptx";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (mime.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext)) return "video";
  return "other";
}
