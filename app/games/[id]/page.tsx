import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/data";
import Competition from "@/components/games/Competition";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const q = await getQuiz(params.id);
  return { title: q?.title ?? "مسابقة" };
}

export default async function Page({ params }: { params: { id: string } }) {
  const quiz = await getQuiz(params.id);
  if (!quiz) notFound();
  return (
    <div className="container-x py-10">
      <Link href="/games" className="text-sm text-white/60 hover:text-white">← المسابقات</Link>
      <div className="mt-6"><Competition quiz={quiz} /></div>
    </div>
  );
}
