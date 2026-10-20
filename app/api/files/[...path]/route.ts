import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { LOCAL_DIR } from "@/lib/storage";

export const runtime = "nodejs";
const TYPES: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", mp4: "video/mp4", webm: "video/webm", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation", ppt: "application/vnd.ms-powerpoint", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const name = decodeURIComponent(params.path.join("/"));
  if (name.includes("/") || name.includes("..")) return new Response("Not found", { status: 404 });
  const p = path.join(LOCAL_DIR, name);
  try {
    await stat(p);
    const buf = await readFile(p);
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    return new Response(buf, { headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff", ...(ext === "svg" ? { "Content-Security-Policy": "script-src 'none'" } : {}) } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
