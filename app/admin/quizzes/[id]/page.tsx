"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/client";
import { Card, Confirm, Field, PageHead, useToast } from "@/components/admin/ui";
import type { QuizQuestion } from "@/lib/types";

type Quiz = { title: string; description: string; lessonSlug: string; secondsPerQuestion: number; published: boolean; questions: QuizQuestion[] };
const blankQ = (): QuizQuestion => ({ q: "", options: ["", "", "", ""], answer: 0, explain: "" });
const L = ["أ", "ب", "ج", "د", "هـ", "و"];

export default function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const router = useRouter();
  const toast = useToast();
  const [z, setZ] = useState<Quiz>({ title: "", description: "", lessonSlug: "", secondsPerQuestion: 30, published: true, questions: [blankQ()] });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!isNew) api<Quiz>(`/api/admin/quizzes/${params.id}`).then((d) => setZ({ ...d, description: d.description ?? "", lessonSlug: d.lessonSlug ?? "" })).catch((e) => toast(e.message, "err"));
  }, [isNew, params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const setQ = (i: number, q: Partial<QuizQuestion>) => setZ((x) => ({ ...x, questions: x.questions.map((o, j) => (j === i ? { ...o, ...q } : o)) }));
  async function save() {
    setSaving(true);
    try {
      const body = { ...z, description: z.description || null, lessonSlug: z.lessonSlug || null, questions: z.questions.map((q) => ({ ...q, options: q.options.map((o) => o.trim()), explain: q.explain?.trim() || undefined })) };
      const r = await api<{ id: string }>(isNew ? "/api/admin/quizzes" : `/api/admin/quizzes/${params.id}`, isNew ? "POST" : "PUT", body);
      toast("تم الحفظ ✔");
      if (isNew) router.replace(`/admin/quizzes/${r.id}`);
    } catch (e) { toast((e as Error).message, "err"); }
    setSaving(false);
  }
  return (
    <>
      <PageHead title={isNew ? "اختبار جديد" : "تعديل الاختبار"} actions={<div className="flex gap-2">{!isNew && <Link href={`/games/${params.id}`} target="_blank" className="btn btn-ghost !border-navy/15 !bg-white !text-navy">تشغيل المسابقة ↗</Link>}<button className="btn-brand" onClick={save} disabled={saving}>{saving ? "جارٍ الحفظ…" : "حفظ"}</button></div>} />
      <Card title="الإعدادات">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="عنوان الاختبار"><input className="input" value={z.title} onChange={(e) => setZ({ ...z, title: e.target.value })} /></Field>
          <Field label={`الوقت لكل سؤال: ${z.secondsPerQuestion} ثانية`}><input type="range" min={5} max={120} step={5} value={z.secondsPerQuestion} onChange={(e) => setZ({ ...z, secondsPerQuestion: +e.target.value })} className="w-full accent-[rgb(var(--brand))]" /></Field>
          <Field label="الوصف"><input className="input" value={z.description} onChange={(e) => setZ({ ...z, description: e.target.value })} /></Field>
          <Field label="رابط الدرس المرتبط (اختياري)"><input className="input" dir="ltr" value={z.lessonSlug} onChange={(e) => setZ({ ...z, lessonSlug: e.target.value })} placeholder="genetics" /></Field>
        </div>
        <label className="mt-4 flex items-center gap-2 font-bold"><input type="checkbox" className="h-5 w-5 accent-[rgb(var(--brand))]" checked={z.published} onChange={(e) => setZ({ ...z, published: e.target.checked })} /> منشور في صفحة المسابقات</label>
      </Card>
      <div className="mt-6 grid gap-4">
        {z.questions.map((q, i) => (
          <Card key={i} title={`السؤال ${i + 1}`} actions={<Confirm onYes={() => setZ({ ...z, questions: z.questions.filter((_, j) => j !== i) })} />}>
            <textarea className="input" rows={2} placeholder="نص السؤال" value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, k) => (
                <div key={k} className={`flex items-center gap-2 rounded-2xl p-2 ${q.answer === k ? "bg-brand/15 ring-1 ring-brand" : "bg-navy/[.03]"}`}>
                  <input type="radio" name={`ans-${i}`} checked={q.answer === k} onChange={() => setQ(i, { answer: k })} className="h-5 w-5 accent-[rgb(var(--brand))]" aria-label={`الإجابة الصحيحة ${L[k]}`} />
                  <span className="font-bold">{L[k]})</span>
                  <input className="input !py-1.5" value={o} onChange={(e) => setQ(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })} />
                  {q.options.length > 2 && <button className="px-1 text-rose" aria-label="حذف الخيار" onClick={() => setQ(i, { options: q.options.filter((_, j) => j !== k), answer: q.answer >= k && q.answer > 0 ? q.answer - 1 : q.answer })}>✕</button>}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {q.options.length < 6 && <button className="rounded-full bg-navy/5 px-3 py-1.5 text-sm font-bold" onClick={() => setQ(i, { options: [...q.options, ""] })}>+ خيار</button>}
              <input className="input flex-1" placeholder="تفسير الإجابة (اختياري) يظهر بعد الكشف" value={q.explain ?? ""} onChange={(e) => setQ(i, { explain: e.target.value })} />
            </div>
          </Card>
        ))}
        <button className="btn-dark justify-self-start" onClick={() => setZ({ ...z, questions: [...z.questions, blankQ()] })}>+ سؤال جديد</button>
      </div>
    </>
  );
}
