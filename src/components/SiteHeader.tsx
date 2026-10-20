"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
}

export default function SiteHeader({ items, name }: { items: NavItem[]; name: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !onHome;
  const all = [{ href: "/", label: "الرئيسية" }, ...items];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-gold/20 bg-navy-950/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-lux flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-ivory-100">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 text-lg font-extrabold text-gold-300">أ</span>
          <span className="text-[15px] font-bold tracking-tight">{name}</span>
        </Link>

        <nav aria-label="أقسام الموقع" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {all.map((it) => {
              const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[14px] transition ${
                      active ? "text-gold-300" : "text-ivory-200/80 hover:text-ivory-50"
                    }`}
                  >
                    {it.label}
                    {active && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-ivory-100 lg:hidden"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="القائمة"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gold/15 bg-navy-950 lg:hidden"
          >
            <ul className="container-lux py-3">
              {all.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="block border-b border-white/5 py-3.5 text-[16px] text-ivory-100 last:border-0">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
