import { adminRoute, bad, ok } from "@/lib/api";
import { prisma } from "@/lib/db";

type C = { params: { id: string } };
const STATUSES = ["new", "in_progress", "done", "archived"];
export const PATCH = adminRoute(async (req: Request, { params }: C) => {
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!status || !STATUSES.includes(status)) return bad("حالة غير صالحة");
  return ok(await prisma.clientRequest.update({ where: { id: params.id }, data: { status } }));
});
export const DELETE = adminRoute(async (_r: Request, { params }: C) => { await prisma.clientRequest.delete({ where: { id: params.id } }); return ok(); });
