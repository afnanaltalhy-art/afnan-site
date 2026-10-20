import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSettings, saveSettings, SETTINGS_TAG } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSettings());
}

function clean(s: string, max = 2000) {
  return String(s ?? "").slice(0, max);
}

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as SiteSettings | null;
  if (!body || !Array.isArray(body.sections)) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const next: SiteSettings = {
    sections: body.sections.map((s, i) => ({
      key: s.key,
      title: clean(s.title, 120),
      subtitle: clean(s.subtitle, 240),
      folderId: clean(s.folderId, 100),
      visible: Boolean(s.visible),
      order: Number.isFinite(s.order) ? s.order : i,
    })),
    achievements: (body.achievements ?? []).slice(0, 300).map((a, i) => ({
      id: clean(a.id, 60) || crypto.randomUUID(),
      title: clean(a.title, 200),
      date: clean(a.date, 40),
      category: clean(a.category, 80),
      description: clean(a.description, 2000),
      url: /^https?:\/\//.test(a.url ?? "") ? clean(a.url, 600) : "",
      order: i,
      visible: a.visible !== false,
    })),
    hiddenFileIds: (body.hiddenFileIds ?? []).map((x) => clean(x, 100)).slice(0, 5000),
    hiddenFolderIds: (body.hiddenFolderIds ?? []).map((x) => clean(x, 100)).slice(0, 2000),
  };
  const result = await saveSettings(next);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 });
  revalidateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, settings: await getSettings() });
}
