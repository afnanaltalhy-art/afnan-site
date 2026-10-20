import Image from "next/image";
import Link from "next/link";
import type { LessonCard } from "@/lib/types";

export default function LessonCardView({ l }: { l: LessonCard }) {
  return (
    <Link href={`/lessons/${l.slug}`} className="group glass flex flex-col overflow-hidden transition hover:-translate-y-1 hover:ring-2 hover:ring-accent/60">
      <div className="relative h-48 overflow-hidden bg-white">
        {l.coverUrl ? (
          <Image src={l.coverUrl} alt={l.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={l.coverUrl.startsWith("http")} />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-brand to-brand-deep text-6xl">🔬</div>
        )}
        {l.interactive && <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-navy">تفاعلي ✨</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2 text-xs text-white/60">{l.subject && <span>{l.subject}</span>}{l.grade && <span>• {l.grade}</span>}</div>
        <h3 className="mt-1 text-2xl font-bold">{l.title}</h3>
        {l.subtitle && <p className="mt-1 text-accent">{l.subtitle}</p>}
        {l.description && <p className="mt-2 line-clamp-3 leading-7 text-white/70">{l.description}</p>}
        <span className="mt-auto pt-4 font-bold text-accent">ادخلي الدرس ←</span>
      </div>
    </Link>
  );
}
