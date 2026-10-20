import { adminRoute, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { deleteStored } from "@/lib/storage";

type C = { params: { id: string } };
export const PATCH = adminRoute(async (req: Request, { params }: C) => {
  const b = (await req.json().catch(() => ({}))) as { lessonId?: string | null; name?: string };
  return ok(await prisma.mediaFile.update({ where: { id: params.id }, data: { ...(b.lessonId !== undefined ? { lessonId: b.lessonId || null } : {}), ...(b.name ? { name: b.name.slice(0, 300) } : {}) } }));
});
export const DELETE = adminRoute(async (_r: Request, { params }: C) => {
  const f = await prisma.mediaFile.delete({ where: { id: params.id } });
  await deleteStored(f.url);
  return ok();
});
