import Link from "next/link";
import Hero from "@/components/Hero";
import DriveNotice from "@/components/DriveNotice";
import { flattenFiles } from "@/lib/drive";
import { buildChecklist, getPublicPortfolio, sectionHref } from "@/lib/portfolio";
import { profile } from "@/content/profile";
import { ar } from "@/lib/fileTypes";
import { ExternalLink } from "lucide-react";

export const revalidate = 600;

export default async function Home() {
  const data = await getPublicPortfolio();
  const visible = data.settings.sections.filter((s) => s.visible);
  const achievements = data.settings.achievements.filter((a) => a.visible);
  const firstHref = visible[0] ? sectionHref(visible[0].key) : "/library";

  const meta = (key: string) => {
    const folder = data.sectionFolders[key as keyof typeof data.sectionFolders];
    if (key === "evidence") return data.files.length ? `${ar(data.files.length)} وثيقة في المكتبة` : "";
    if (!folder) return "";
    if (key === "requirements") {
      const { items } = buildChecklist(folder);
      return items.length ? `${ar(items.filter((i) => i.complete).length)} من ${ar(items.length)} بندًا مكتمل` : "";
    }
    const n = flattenFiles(folder).length;
    return n ? `${ar(n)} ${n === 1 ? "وثيقة" : "وثائق"}` : "";
  };

  return (
    <>
      <Hero
        name={profile.name}
        tagline={profile.tagline}
        degree={profile.degree}
        role={profile.role}
        sealText={profile.sealText}
        primaryHref={firstHref}
        secondaryHref="/library"
      />

      <section className="container-lux py-20 sm:py-28" aria-labelledby="contents-title">
        <div className="mb-12 grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
          <h2 id="contents-title" className="text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.3] text-navy">
            محتويات الملف
          </h2>
          <p className="measure text-[16px] leading-loose text-navy-500">
            تُعرض الأقسام من وثائق الملف الأصلية مباشرة، وتتحدّث تلقائيًا كلما أُضيفت وثيقة جديدة إلى المجلد.
          </p>
        </div>

        <ol className="border-t border-navy/15">
          {visible.map((s, i) => (
            <li key={s.key} className="border-b border-navy/15">
              <Link
                href={sectionHref(s.key)}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-8 transition sm:grid-cols-[auto_1fr_auto] sm:py-10"
              >
                <span className="row-span-2 text-[clamp(28px,4vw,44px)] font-light leading-none text-gold-500 sm:row-span-1">
                  {(i + 1).toLocaleString("ar-SA")}
                </span>
                <span>
                  <span className="block text-[clamp(22px,3vw,32px)] font-extrabold leading-snug text-navy transition group-hover:text-gold-700">{s.title}</span>
                  <span className="mt-1 block text-[15px] text-navy-500">{s.subtitle}</span>
                </span>
                <span className="col-start-2 text-[14px] text-gold-700 sm:col-start-3">{meta(s.key)}</span>
              </Link>
            </li>
          ))}
        </ol>

        {!data.status.ok && (
          <div className="mt-14">
            <DriveNotice status={data.status} />
          </div>
        )}
      </section>

      {achievements.length > 0 && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="ach-title">
          <div className="container-lux">
            <h2 id="ach-title" className="mb-12 text-[clamp(28px,4vw,42px)] font-extrabold text-navy">
              أبرز الإنجازات
            </h2>
            <ul className="relative space-y-10 border-r border-gold/40 pr-8">
              {achievements.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -right-[37px] top-2 h-3 w-3 rounded-full border-2 border-white bg-gold-500 ring-1 ring-gold/40" />
                  <p className="text-[13px] text-gold-700">
                    {[a.date, a.category].filter(Boolean).join("، ")}
                  </p>
                  <h3 className="mt-1 text-[20px] font-extrabold leading-relaxed text-navy">{a.title}</h3>
                  {a.description && <p className="measure mt-2 whitespace-pre-line text-[15px] leading-loose text-navy-600">{a.description}</p>}
                  {a.url && (
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-navy underline decoration-gold/50 underline-offset-4 hover:text-gold-700">
                      <ExternalLink size={14} /> عرض الشاهد
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
