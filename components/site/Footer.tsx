import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import FooterGate from "./FooterGate";
import { IconDna } from "@/components/ui/Icons";

export default function Footer({ settings: s }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <FooterGate>
      <footer className="mt-24 border-t border-white/10 bg-ink-900/80">
        <div className="container-x grid gap-10 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep"><IconDna className="h-6 w-6" /></span>
              <span className="text-xl font-bold">{s.siteName}</span>
            </div>
            <p className="mt-4 max-w-sm leading-7 text-white/65">{s.tagline}</p>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-accent">روابط</h3>
            <ul className="grid grid-cols-2 gap-2 text-white/75">
              <li><Link className="hover:text-white" href="/lessons">مكتبة الدروس</Link></li>
              <li><Link className="hover:text-white" href="/labs">المختبرات الافتراضية</Link></li>
              <li><Link className="hover:text-white" href="/games">المسابقات</Link></li>
              <li><Link className="hover:text-white" href="/portfolio">معرض الأعمال</Link></li>
              <li><Link className="hover:text-white" href="/request">اطلبي تصميمك</Link></li>
              <li><Link className="hover:text-white" href="/lessons/genetics">درس علم الوراثة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-accent">تواصل</h3>
            <p className="leading-7 text-white/65">للتعاون وطلبات تصميم العروض والمواقع التعليمية، يسعدني تواصلكِ عبر نموذج الطلب.</p>
            <Link href="/request" className="btn-brand mt-4">أرسلي طلبك</Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-sm text-white/55">
          جميع الحقوق محفوظة © {year} — {s.siteName}
        </div>
      </footer>
    </FooterGate>
  );
}
