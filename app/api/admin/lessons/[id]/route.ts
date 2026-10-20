import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { lessonSchema } from "@/lib/schemas";

type C = { params: { id: string } };

export const GET = adminRoute(async (_r: Request, { params }: C) => {
  const l = await prisma.lesson.findUnique({ where: { id: params.id }, include: { files: { orderBy: { createdAt: "asc" } } } });
  return l ? ok(l) : bad("الدرس غير موجود", 404);
});
export const PUT = adminRoute(async (req: Request, { params }: C) => {
  const p = lessonSchema.partial().safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.lesson.update({ where: { id: params.id }, data: p.data }));
});
export const DELETE = adminRoute(async (_r: Request, { params }: C) => {
  await prisma.lesson.delete({ where: { id: params.id } });
  return ok();
});
