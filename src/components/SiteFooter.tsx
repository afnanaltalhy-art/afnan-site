import Link from "next/link";
import type { NavItem } from "./SiteHeader";

export default function SiteFooter({ items, name, degree }: { items: NavItem[]; name: string; degree: string }) {
  return (
    <footer className="mt-24 bg-navy-950 text-ivory-200">
      <div className="h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent" />
      <div className="container-lux grid gap-10 py-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[22px] font-extrabold text-ivory-50">{name}</p>
          <p className="mt-2 text-[14px] text-navy-300">{degree}</p>
        </div>
        <nav aria-label="روابط التذييل">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
            {items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="hover:text-gold-300">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="container-lux flex flex-wrap items-center justify-between gap-3 py-5 text-[12px] text-navy-300">
          <span>© {new Date().getFullYear()} {name}. جميع الحقوق محفوظة.</span>
          <Link href="/admin" className="hover:text-gold-300" rel="nofollow">
            دخول الإدارة
          </Link>
        </div>
      </div>
    </footer>
  );
}
