"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastProvider } from "./ui";
import { getConfig } from "./client";

const NAV = [
  { href: "/admin", label: "لوحة التحكم", e: "📊" },
  { href: "/admin/lessons", label: "الدروس", e: "📚" },
  { href: "/admin/library", label: "مكتبة الملفات", e: "🗂️" },
  { href: "/admin/quizzes", label: "الاختبارات والمسابقات", e: "🏆" },
  { href: "/admin/portfolio", label: "معرض الأعمال", e: "🖼️" },
  { href: "/admin/requests", label: "طلبات العملاء", e: "📨" },
  { href: "/admin/settings", label: "الإعدادات والألوان", e: "🎨" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [db, setDb] = useState(true);
  useEffect(() => setOpen(false), [path]);
  const isLogin = path === "/admin/login";
  useEffect(() => { if (!isLogin) getConfig().then((c) => setDb(c.db)).catch(() => {}); }, [isLogin]);
  if (isLogin) return <div className="min-h-screen bg-ink">{children}</div>;
  const active = (h: string) => (h === "/admin" ? path === "/admin" : path.startsWith(h));
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F3F6F5] text-navy">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-navy px-4 text-white lg:hidden">
          <span className="font-bold">لوحة تحكم د. أفنان</span>
          <button className="rounded-xl bg-white/10 px-3 py-1.5" onClick={() => setOpen(!open)} aria-expanded={open}>القائمة</button>
        </header>
        <div className="flex">
          <aside className={`${open ? "block" : "hidden"} fixed inset-y-0 right-0 z-50 w-72 bg-navy p-5 text-white lg:sticky lg:top-0 lg:block lg:h-screen`}>
            <Link href="/admin" className="block text-xl font-bold">لوحة تحكم<br /><span className="text-accent">د. أفنان الطلحي</span></Link>
            <nav className="mt-8 grid gap-1" aria-label="قائمة الإدارة">
              {NAV.map((n) => <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${active(n.href) ? "bg-white/15 text-accent" : "text-white/80 hover:bg-white/5"}`}><span>{n.e}</span>{n.label}</Link>)}
            </nav>
            <div className="absolute inset-x-5 bottom-5 grid gap-2">
              <Link href="/" target="_blank" className="rounded-2xl bg-white/10 px-4 py-2.5 text-center font-bold">عرض الموقع ↗</Link>
              <button className="rounded-2xl px-4 py-2.5 font-bold text-rose hover:bg-white/5" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); }}>تسجيل الخروج</button>
            </div>
          </aside>
          {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />}
          <div className="min-w-0 flex-1 p-4 sm:p-8">
            {!db && <div className="mb-6 rounded-2xl bg-accent/20 p-4 font-bold text-navy ring-1 ring-accent">⚠ قاعدة البيانات غير مهيأة. أضيفي متغير DATABASE_URL (راجعي ملف README) حتى تعمل الإضافة والتعديل.</div>}
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
