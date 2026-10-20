import type { Metadata } from "next";
import Image from "next/image";
import { getPortfolio } from "@/lib/data";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = { title: "معرض الأعمال" };

export default async function Page() {
  const items = await getPortfolio();
  return (
    <div className="container-x py-12">
      <SectionTitle kicker="معرض الأعمال" title="العروض والدروس التفاعلية" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const Inner = (
            <>
              <div className="relative h-52 bg-white">{p.imageUrl ? <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition group-hover:scale-105" unoptimized={p.imageUrl.startsWith("http")} /> : <div className="h-full bg-gradient-to-br from-violet to-brand-deep" />}</div>
              <div className="p-5">{p.category && <span className="text-sm text-accent">{p.category}</span>}<h2 className="mt-1 text-xl font-bold">{p.title}</h2>{p.description && <p className="mt-2 leading-7 text-white/70">{p.description}</p>}</div>
            </>
          );
          return p.link ? <a key={p.id} href={p.link} className="glass group block overflow-hidden">{Inner}</a> : <div key={p.id} className="glass group overflow-hidden">{Inner}</div>;
        })}
      </div>
    </div>
  );
}
