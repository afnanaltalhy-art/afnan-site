import { lessonSchema } from "@/lib/schemas";
import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";


export const GET = adminRoute(async () => ok(await prisma.lesson.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }], include: { _count: { select: { files: true } } } })));

export const POST = adminRoute(async (req: Request) => {
  const p = lessonSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad(p.error.issues[0]?.message ?? "بيانات غير صالحة");
  return ok(await prisma.lesson.create({ data: { ...p.data, sections: p.data.sections ?? [] } }));
});
