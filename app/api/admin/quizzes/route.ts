import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { quizSchema } from "@/lib/schemas";

export const GET = adminRoute(async () => ok(await prisma.quiz.findMany({ orderBy: { createdAt: "desc" } })));
export const POST = adminRoute(async (req: Request) => {
  const p = quizSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.quiz.create({ data: p.data }));
});
