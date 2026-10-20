"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, fmtDate } from "@/components/admin/client";
import { Card, Confirm, PageHead, useToast } from "@/components/admin/ui";

type Q = { id: string; title: string; questions: unknown[]; published: boolean; createdAt: string };

export default function Page() {
  const [list, setList] = useState<Q[] | null>(null);
  const toast = useToast();
  const load = () => api<Q[]>("/api/admin/quizzes").then(setList).catch((e) => { toast(e.message, "err"); setList([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <PageHead title="الاختبارات والمسابقات" sub="كل اختبار يتحوّل تلقائيًا إلى مسابقة مجموعات بالمؤقت والنقاط" actions={<Link href="/admin/quizzes/new" className="btn-brand">+ اختبار جديد</Link>} />
      <Card>
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-accent/15 p-3"><span><b>مسابقة نجمات العلوم: علم الوراثة</b> • مدمجة</span><Link href="/games/genetics-stars" target="_blank" className="text-sm font-bold text-brand">تشغيل ↗</Link></div>
        {list === null ? <p className="text-navy/50">جارٍ التحميل…</p> : list.length === 0 ? <p className="text-navy/50">لم تُنشأ اختبارات بعد.</p> : (
          <ul className="grid gap-2">
            {list.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-navy/[.03] p-3">
                <Link href={`/admin/quizzes/${q.id}`} className="font-bold hover:text-brand">{q.title}</Link>
                <span className="text-sm text-navy/50">{q.questions.length} سؤالًا • {q.published ? "منشور" : "مسودة"} • {fmtDate(q.createdAt)}</span>
                <span className="flex gap-1">
                  <Link href={`/games/${q.id}`} target="_blank" className="rounded-full px-3 py-1.5 text-sm font-bold text-brand hover:bg-brand/10">تشغيل</Link>
                  <Link href={`/admin/quizzes/${q.id}`} className="rounded-full px-3 py-1.5 text-sm font-bold hover:bg-navy/5">تعديل</Link>
                  <Confirm onYes={async () => { try { await api(`/api/admin/quizzes/${q.id}`, "DELETE"); toast("حُذف"); load(); } catch (e) { toast((e as Error).message, "err"); } }} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
