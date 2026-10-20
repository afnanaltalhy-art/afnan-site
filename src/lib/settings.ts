import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SectionConfig, SiteSettings } from "./types";

/**
 * Admin settings storage.
 * Production (Vercel): Upstash Redis / Vercel KV REST API.
 * Local development: a JSON file in ./.data
 */

const KEY = "afnan-portfolio:settings";
export const SETTINGS_TAG = "settings";

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { key: "intro", title: "مقدمة ملف الإنجاز", subtitle: "التعريف المهني والرؤية والرسالة والأهداف", folderId: "", visible: true, order: 0 },
  { key: "performance", title: "ملف الأداء الوظيفي", subtitle: "عناصر الأداء الوظيفي وشواهدها", folderId: "", visible: true, order: 1 },
  { key: "requirements", title: "البنود المطلوبة من المديرة", subtitle: "متابعة البنود والوثائق وحالة اكتمالها", folderId: "", visible: true, order: 2 },
  { key: "evidence", title: "الشواهد والوثائق", subtitle: "مكتبة رقمية لكل الشواهد المهنية", folderId: "", visible: true, order: 3 },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  sections: DEFAULT_SECTIONS,
  achievements: [],
  hiddenFileIds: [],
  hiddenFolderIds: [],
};

function kv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

const LOCAL_FILE = path.join(process.cwd(), ".data", "settings.json");

function normalize(raw: Partial<SiteSettings> | null): SiteSettings {
  const s = raw ?? {};
  const sections = DEFAULT_SECTIONS.map((d) => ({ ...d, ...(s.sections?.find((x) => x.key === d.key) ?? {}) }));
  return {
    sections: sections.sort((a, b) => a.order - b.order),
    achievements: (s.achievements ?? []).slice().sort((a, b) => a.order - b.order),
    hiddenFileIds: s.hiddenFileIds ?? [],
    hiddenFolderIds: s.hiddenFolderIds ?? [],
    updatedAt: s.updatedAt,
  };
}

export function storageMode(): "kv" | "local" | "none" {
  if (kv()) return "kv";
  if (process.env.VERCEL) return "none";
  return "local";
}

export async function getSettings(): Promise<SiteSettings> {
  const k = kv();
  try {
    if (k) {
      const res = await fetch(`${k.url}/get/${encodeURIComponent(KEY)}`, {
        headers: { Authorization: `Bearer ${k.token}` },
        next: { tags: [SETTINGS_TAG], revalidate: 3600 },
      });
      if (!res.ok) return normalize(null);
      const json = (await res.json()) as { result: string | null };
      return normalize(json.result ? JSON.parse(json.result) : null);
    }
    if (storageMode() === "local") {
      const text = await fs.readFile(LOCAL_FILE, "utf8").catch(() => null);
      return normalize(text ? JSON.parse(text) : null);
    }
  } catch {
    /* fall through to defaults */
  }
  return normalize(null);
}

export async function saveSettings(next: SiteSettings): Promise<{ ok: boolean; message?: string }> {
  const value = JSON.stringify({ ...normalize(next), updatedAt: new Date().toISOString() });
  const k = kv();
  if (k) {
    const res = await fetch(`${k.url}/set/${encodeURIComponent(KEY)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${k.token}` },
      body: value,
      cache: "no-store",
    });
    return res.ok ? { ok: true } : { ok: false, message: `تعذر الحفظ (${res.status})` };
  }
  if (storageMode() === "local") {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, value, "utf8");
    return { ok: true };
  }
  return { ok: false, message: "أضيفي قاعدة Upstash Redis (أو Vercel KV) من إعدادات Vercel ليتم حفظ التعديلات." };
}
