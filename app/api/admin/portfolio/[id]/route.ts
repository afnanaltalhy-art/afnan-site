import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { portfolioSchema } from "@/lib/schemas";

type C = { params: { id: string } };
export const PUT = adminRoute(async (req: Request, { params }: C) => {
  const p = portfolioSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.portfolioItem.update({ where: { id: params.id }, data: p.data }));
});
export const DELETE = adminRoute(async (_r: Request, { params }: C) => { await prisma.portfolioItem.delete({ where: { id: params.id } }); return ok(); });
