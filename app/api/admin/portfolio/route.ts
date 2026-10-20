import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { portfolioSchema } from "@/lib/schemas";

export const GET = adminRoute(async () => ok(await prisma.portfolioItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] })));
export const POST = adminRoute(async (req: Request) => {
  const p = portfolioSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.portfolioItem.create({ data: p.data }));
});
