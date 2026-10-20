import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSettings } from "@/lib/settings";
import { sectionHref } from "@/lib/portfolio";
import { profile } from "@/content/profile";

const SHORT: Record<string, string> = {
  intro: "المقدمة",
  performance: "الأداء الوظيفي",
  requirements: "بنود المديرة",
  evidence: "الشواهد والوثائق",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const items = settings.sections.filter((s) => s.visible).map((s) => ({ href: sectionHref(s.key), label: SHORT[s.key] ?? s.title }));
  return (
    <>
      <SiteHeader items={items} name={profile.name} />
      <main id="main">{children}</main>
      <SiteFooter items={items} name={profile.name} degree={profile.degree} />
    </>
  );
}
