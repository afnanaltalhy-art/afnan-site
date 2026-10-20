import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDb, prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(120),
  type: z.string().trim().min(2).max(80),
  details: z.string().trim().min(10).max(3000),
  website: z.string().optional(),
});

const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "طلبات كثيرة، حاولي بعد دقيقة." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "تأكدي من تعبئة الحقول بشكل صحيح." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot
  if (!hasDb) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة بعد." }, { status: 503 });
  const { website: _w, ...data } = parsed.data;
  void _w;
  await prisma.clientRequest.create({ data });
  return NextResponse.json({ ok: true });
}
