import { adminRoute, ok } from "@/lib/api";
import { prisma } from "@/lib/db";
export const GET = adminRoute(async () => ok(await prisma.clientRequest.findMany({ orderBy: { createdAt: "desc" } })));
