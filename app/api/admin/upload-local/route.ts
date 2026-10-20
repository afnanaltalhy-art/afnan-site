import { adminRoute, bad, ok } from "@/lib/api";
import { saveLocal } from "@/lib/storage";

export const runtime = "nodejs";
const MAX = 50 * 1024 * 1024;

export const POST = adminRoute(async (req: Request) => {
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) return bad("على Vercel يلزم تفعيل Vercel Blob لرفع الملفات (BLOB_READ_WRITE_TOKEN).", 503);
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return bad("لم يُرفق ملف");
  if (file.size > MAX) return bad("الحد الأقصى للملف 50 ميجابايت");
  const url = await saveLocal(file);
  return ok({ url, name: file.name, size: file.size, mime: file.type || "application/octet-stream" });
}, false);
