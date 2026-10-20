"use client";
import { useMemo, useState } from "react";
import type { LessonCard } from "@/lib/types";
import LessonCardView from "./LessonCardView";

export default function LessonsBrowser({ lessons }: { lessons: LessonCard[] }) {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("الكل");
  const grades = useMemo(() => ["الكل", ...Array.from(new Set(lessons.map((l) => l.grade).filter(Boolean) as string[]))], [lessons]);
  const list = lessons.filter((l) => (grade === "الكل" || l.grade === grade) && (!q || `${l.title} ${l.subtitle ?? ""} ${l.description ?? ""}`.includes(q)));
  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input className="input sm:max-w-sm" placeholder="ابحثي عن درس…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" />
        <div className="flex flex-wrap gap-2">{grades.map((g) => <button key={g} onClick={() => setGrade(g)} className={`rounded-full px-4 py-2 font-bold ${grade === g ? "bg-accent text-navy" : "bg-white/10"}`}>{g}</button>)}</div>
      </div>
      {list.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((l) => <LessonCardView key={l.id} l={l} />)}</div> : <p className="text-white/60">لا توجد دروس مطابقة.</p>}
    </>
  );
}
