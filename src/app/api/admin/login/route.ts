import { NextResponse } from "next/server";
import { authConfigured, checkPassword, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "لم تُضبط كلمة المرور بعد. أضيفي ADMIN_PASSWORD و ADMIN_SESSION_SECRET في إعدادات الاستضافة." },
      { status: 503 },
    );
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rec = attempts.get(ip);
  if (rec && rec.until > Date.now()) {
    return NextResponse.json({ error: "محاولات كثيرة، حاولي بعد دقائق." }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !(await checkPassword(password))) {
    const n = (rec?.n ?? 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 10 * 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }
  attempts.delete(ip);
  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
