import type { Metadata } from "next";
import { getLessons } from "@/lib/data";
import SectionTitle from "@/components/ui/SectionTitle";
import LessonsBrowser from "@/components/site/LessonsBrowser";

export const metadata: Metadata = { title: "مكتبة الدروس" };

export default async function Page() {
  const lessons = await getLessons();
  return (
    <div className="container-x py-12">
      <SectionTitle kicker="مكتبة الدروس" title="الدروس التعليمية" lead="دروس تفاعلية وعروض وملفات للتحميل." />
      <LessonsBrowser lessons={lessons} />
    </div>
  );
}
