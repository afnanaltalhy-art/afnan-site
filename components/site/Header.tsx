"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconDna, IconMenu, IconX } from "@/components/ui/Icons";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/lessons", label: "الدروس" },
  { href: "/labs", label: "المختبرات" },
  { href: "/games", label: "المسابقات" },
  { href: "/portfolio", label: "معرض الأعمال" },
  { href: "/request", label: "اطلبي تصميمك" },
];

export default function Header({ siteName }: { siteName: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (path.startsWith("/admin")) return null;
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header className={`sticky top-0 z-50 transition ${scrolled ? "bg-ink/85 shadow-lg backdrop-blur-lg" : "bg-transparent"}`}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={siteName}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-lg ring-1 ring-white/20 transition group-hover:rotate-6">
            <IconDna className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold">{siteName}</span>
            <span className="block text-[11px] text-white/60">دروس العلوم التفاعلية</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${active(n.href) ? "bg-white/10 text-accent" : "text-white/80 hover:bg-white/5 hover:text-white"}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn-primary mr-2 !py-2 text-sm">تواصلي معي</Link>
        </nav>
        <button className="btn-ghost !p-2.5 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="القائمة">
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>
      {open && (
        <nav className="container-x grid gap-1 pb-4 lg:hidden" aria-label="قائمة الجوال">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`rounded-2xl px-4 py-3 font-bold ${active(n.href) ? "bg-white/10 text-accent" : "bg-white/5"}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn-primary mt-1">تواصلي معي</Link>
        </nav>
      )}
    </header>
  );
}
