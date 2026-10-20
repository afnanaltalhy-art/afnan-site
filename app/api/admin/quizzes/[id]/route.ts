import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { quizSchema } from "@/lib/schemas";

type C = { params: { id: string } };
export const GET = adminRoute(async (_r: Request, { params }: C) => {
  const q = await prisma.quiz.findUnique({ where: { id: params.id } });
  return q ? ok(q) : bad("غير موجود", 404);
});
export const PUT = adminRoute(async (req: Request, { params }: C) => {
  const p = quizSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.quiz.update({ where: { id: params.id }, data: p.data }));
});
export const DELETE = adminRoute(async (_r: Request, { params }: C) => { await prisma.quiz.delete({ where: { id: params.id } }); return ok(); });
