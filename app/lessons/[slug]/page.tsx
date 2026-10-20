import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/data";
import type { LessonSection } from "@/lib/types";
import { IconDownload } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const l = await getLesson(params.slug);
  return { title: l?.title ?? "درس", description: l?.description ?? undefined };
}

function fileViewer(f: { url: string; mime: string; kind: string; name: string }) {
  const abs = f.url.startsWith("http");
  if (f.kind === "pdf") return <iframe src={f.url} title={f.name} className="h-[70vh] w-full rounded-2xl bg-white" />;
  if (f.kind === "pptx" && abs) return <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(f.url)}`} title={f.name} className="h-[70vh] w-full rounded-2xl bg-white" allowFullScreen />;
  if (f.kind === "image") return <img src={f.url} alt={f.name} className="max-h-[70vh] w-auto rounded-2xl" />;
  if (f.kind === "video") return <video src={f.url} controls className="w-full rounded-2xl" />;
  return null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const l = await getLesson(params.slug);
  if (!l || !l.published) notFound();
  const sections = (Array.isArray(l.sections) ? l.sections : []) as LessonSection[];
  return (
    <article className="container-x py-12">
      <Link href="/lessons" className="text-sm text-white/60 hover:text-white">← مكتبة الدروس</Link>
      <header className="mt-4 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap gap-2 text-sm text-accent">{l.subject && <span>{l.subject}</span>}{l.grade && <span>• {l.grade}</span>}</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-6xl">{l.title}</h1>
          {l.subtitle && <p className="mt-3 text-2xl text-cream/90">{l.subtitle}</p>}
          {l.description && <p className="mt-4 leading-8 text-white/75">{l.description}</p>}
          <p className="mt-4 text-white/60">إعداد: <b className="text-white">د. أفنان الطلحي</b></p>
        </div>
        {l.coverUrl && <div className="relative h-72 overflow-hidden rounded-3xl bg-white"><Image src={l.coverUrl} alt={l.title} fill className="object-cover" unoptimized={l.coverUrl.startsWith("http")} /></div>}
      </header>
      {sections.length > 0 && (
        <div className="mt-12 grid gap-6">
          {sections.map((s, i) => (
            <section key={i} className="glass p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-2xl font-bold"><span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-lg">{i + 1}</span>{s.title}</h2>
              <div className="mt-4 grid gap-3 text-lg leading-9 text-white/85">{s.body.split(/\n+/).map((p, j) => <p key={j}>{p}</p>)}</div>
            </section>
          ))}
        </div>
      )}
      {l.files.length > 0 && (
        <div className="mt-12 grid gap-6">
          <h2 className="text-2xl font-bold">ملفات الدرس</h2>
          {l.files.map((f) => (
            <div key={f.id} className="glass p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold">{f.name}</span>
                <a href={f.url} download className="btn-primary !py-2"><IconDownload /> تحميل</a>
              </div>
              {fileViewer(f)}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
