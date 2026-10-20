import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";

export const LOCAL_DIR = path.join(process.cwd(), "uploads");

export function safeName(name: string) {
  const ext = (name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "bin";
  const base = name.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^\w؀-ۿ-]+/g, "-").replace(/-+/g, "-").slice(0, 60) || "file";
  return `${Date.now().toString(36)}-${base}.${ext}`;
}

export async function saveLocal(file: File) {
  await mkdir(LOCAL_DIR, { recursive: true });
  const name = safeName(file.name);
  await writeFile(path.join(LOCAL_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/files/${encodeURIComponent(name)}`;
}

export async function deleteStored(url: string) {
  try {
    if (url.startsWith("/api/files/")) {
      const name = decodeURIComponent(url.slice("/api/files/".length));
      if (!name.includes("/") && !name.includes("..")) await unlink(path.join(LOCAL_DIR, name));
    } else if (process.env.BLOB_READ_WRITE_TOKEN && /\.blob\.vercel-storage\.com\//.test(url)) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch (e) {
    console.error("[storage delete]", e);
  }
}
