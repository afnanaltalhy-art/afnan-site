import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/schemas";

export const GET = adminRoute(async () => ok(await getSettings()), false);
export const PUT = adminRoute(async (req: Request) => {
  const p = settingsSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  await prisma.setting.upsert({ where: { key: "site" }, create: { key: "site", value: p.data }, update: { value: p.data } });
  return ok(p.data);
});
