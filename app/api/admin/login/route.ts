import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSession, safeEqual } from "@/lib/auth";

const attempts = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 8) return NextResponse.json({ error: "محاولات كثيرة، انتظري عشر دقائق." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: "لم تُضبط كلمة مرور الإدارة (ADMIN_PASSWORD)." }, { status: 500 });
  if (!password || !safeEqual(password, expected)) {
    attempts.set(ip, [...recent, now]);
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSession(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
