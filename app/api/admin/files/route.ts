import { adminRoute, bad, fileKind, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
import { fileSchema } from "@/lib/schemas";

export const GET = adminRoute(async () => ok(await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" }, include: { lesson: { select: { id: true, title: true } } } })));

export const POST = adminRoute(async (req: Request) => {
  const p = fileSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return bad("بيانات الملف غير صالحة");
  return ok(await prisma.mediaFile.create({ data: { ...p.data, lessonId: p.data.lessonId || null, kind: fileKind(p.data.name, p.data.mime) } }));
});
