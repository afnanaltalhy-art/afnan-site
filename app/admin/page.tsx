"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, fmtDate } from "@/components/admin/client";
import { Card, PageHead } from "@/components/admin/ui";

type Req = { id: string; name: string; type: string; status: string; createdAt: string };

export default function Dashboard() {
  const [c, setC] = useState({ lessons: 0, files: 0, quizzes: 0, portfolio: 0, requests: 0, newReq: 0 });
  const [latest, setLatest] = useState<Req[]>([]);
  useEffect(() => {
    Promise.all([api<unknown[]>("/api/admin/lessons"), api<unknown[]>("/api/admin/files"), api<unknown[]>("/api/admin/quizzes"), api<unknown[]>("/api/admin/portfolio"), api<Req[]>("/api/admin/requests")])
      .then(([l, f, q, p, r]) => { setC({ lessons: l.length, files: f.length, quizzes: q.length, portfolio: p.length, requests: r.length, newReq: r.filter((x) => x.status === "new").length }); setLatest(r.slice(0, 5)); })
      .catch(() => {});
  }, []);
  const tiles = [
    { l: "الدروس", n: c.lessons, h: "/admin/lessons", e: "📚" },
    { l: "الملفات", n: c.files, h: "/admin/library", e: "🗂️" },
    { l: "الاختبارات", n: c.quizzes, h: "/admin/quizzes", e: "🏆" },
    { l: "الأعمال", n: c.portfolio, h: "/admin/portfolio", e: "🖼️" },
    { l: "طلبات جديدة", n: c.newReq, h: "/admin/requests", e: "📨" },
  ];
  return (
    <>
      <PageHead title="أهلًا د. أفنان 👋" sub="إدارة محتوى موقعكِ التعليمي" actions={<Link href="/admin/lessons/new" className="btn-brand">+ درس جديد</Link>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {tiles.map((t) => <Link key={t.l} href={t.h} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 transition hover:ring-brand"><span className="text-3xl">{t.e}</span><p className="ltr mt-2 text-3xl font-bold">{t.n}</p><p className="text-navy/60">{t.l}</p></Link>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="أحدث الطلبات" actions={<Link href="/admin/requests" className="text-sm font-bold text-brand">عرض الكل</Link>}>
          {latest.length ? <ul className="grid gap-2">{latest.map((r) => <li key={r.id} className="flex items-center justify-between rounded-2xl bg-navy/[.03] p-3"><span><b>{r.name}</b> • {r.type}</span><span className="text-sm text-navy/50">{fmtDate(r.createdAt)}</span></li>)}</ul> : <p className="text-navy/50">لا توجد طلبات بعد.</p>}
        </Card>
        <Card title="اختصارات">
          <div className="grid grid-cols-2 gap-3">
            <Link className="btn-dark" href="/admin/lessons/new">إضافة درس</Link>
            <Link className="btn-dark" href="/admin/library">رفع PowerPoint أو PDF</Link>
            <Link className="btn-dark" href="/admin/quizzes/new">إنشاء اختبار أو لعبة</Link>
            <Link className="btn-dark" href="/admin/settings">تعديل النصوص والألوان</Link>
          </div>
          <p className="mt-4 text-sm leading-7 text-navy/60">درس «علم الوراثة» التفاعلي ومسابقته مبنيّان داخل الموقع، ويظهران دائمًا في المكتبة.</p>
        </Card>
      </div>
    </>
  );
}
