import type { Metadata } from "next";
import Link from "next/link";
import { LABS } from "@/lib/labs";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = { title: "المختبرات الافتراضية" };

export default function Page() {
  return (
    <div className="container-x py-12">
      <SectionTitle kicker="المحاكاة والمختبرات" title="المختبرات الافتراضية" lead="كل مختبر يعمل مستقلًا: مناسب للعرض على السبورة الذكية أو لعمل الطالبات على الأجهزة." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LABS.map((l) => (
          <Link key={l.id} href={`/labs/${l.id}`} className="glass group p-6 transition hover:-translate-y-1 hover:ring-2 hover:ring-accent/60">
            <span className="text-5xl">{l.emoji}</span>
            <h2 className="mt-3 text-2xl font-bold">{l.title}</h2>
            <p className="mt-2 leading-7 text-white/70">{l.desc}</p>
            <span className="mt-4 block font-bold text-accent">افتحي المختبر ←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
