import type { Metadata } from "next";
import Link from "next/link";
import { getQuizzes } from "@/lib/data";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = { title: "الألعاب والمسابقات" };

export default async function Page() {
  const quizzes = await getQuizzes();
  return (
    <div className="container-x py-12">
      <SectionTitle kicker="الألعاب والمسابقات" title="مسابقات المجموعات" lead="اختاري مسابقة، وكوّني المجموعات، وابدئي التحدي بالمؤقت والنقاط." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((q) => (
          <Link key={q.id} href={`/games/${q.id}`} className="glass group p-6 transition hover:-translate-y-1 hover:ring-2 hover:ring-accent/60">
            <span className="text-5xl">🏆</span>
            <h2 className="mt-3 text-2xl font-bold">{q.title}</h2>
            {q.description && <p className="mt-2 leading-7 text-white/70">{q.description}</p>}
            <p className="mt-3 text-sm text-white/60">{q.questions.length} سؤالًا • {q.secondsPerQuestion} ثانية لكل سؤال</p>
            <span className="mt-4 block font-bold text-accent">ابدئي ←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
