import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LABS } from "@/lib/labs";
import LabView from "@/components/labs/LabView";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const l = LABS.find((x) => x.id === params.id);
  return { title: l?.title ?? "مختبر", description: l?.desc };
}

export default function Page({ params }: { params: { id: string } }) {
  const lab = LABS.find((l) => l.id === params.id);
  if (!lab) notFound();
  return (
    <div className="container-x py-10">
      <Link href="/labs" className="text-sm text-white/60 hover:text-white">← المختبرات</Link>
      <h1 className="mt-3 flex items-center gap-3 text-4xl font-bold"><span>{lab.emoji}</span>{lab.title}</h1>
      <p className="mt-2 text-white/70">{lab.desc}</p>
      <div className="glass mt-8 p-5 sm:p-8"><LabView id={lab.id} /></div>
    </div>
  );
}
