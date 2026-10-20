"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/client";
import { Card, Confirm, PageHead, useToast } from "@/components/admin/ui";

type L = { id: string; slug: string; title: string; grade: string | null; published: boolean; order: number; _count: { files: number } };

export default function Page() {
  const [list, setList] = useState<L[] | null>(null);
  const toast = useToast();
  const load = () => api<L[]>("/api/admin/lessons").then(setList).catch((e) => { toast(e.message, "err"); setList([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <PageHead title="الدروس" sub="أضيفي الدروس وعدّليها، وأرفقي ملفات PowerPoint وPDF" actions={<Link href="/admin/lessons/new" className="btn-brand">+ درس جديد</Link>} />
      <Card>
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-accent/15 p-3"><span><b>علم الوراثة</b> • درس تفاعلي مدمج في الموقع</span><Link href="/lessons/genetics" target="_blank" className="text-sm font-bold text-brand">عرض ↗</Link></div>
        {list === null ? <p className="text-navy/50">جارٍ التحميل…</p> : list.length === 0 ? <p className="text-navy/50">لا توجد دروس مضافة بعد.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-right">
              <thead className="text-sm text-navy/50"><tr><th className="p-2">العنوان</th><th className="p-2">الصف</th><th className="p-2">الملفات</th><th className="p-2">الحالة</th><th className="p-2" /></tr></thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id} className="border-t border-navy/5">
                    <td className="p-2 font-bold"><Link href={`/admin/lessons/${l.id}`} className="hover:text-brand">{l.title}</Link><span className="ltr block text-xs text-navy/40">/lessons/{l.slug}</span></td>
                    <td className="p-2">{l.grade ?? "—"}</td>
                    <td className="p-2">{l._count.files}</td>
                    <td className="p-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${l.published ? "bg-brand/15 text-brand-deep" : "bg-navy/10"}`}>{l.published ? "منشور" : "مسودة"}</span></td>
                    <td className="p-2 text-left">
                      <Link href={`/admin/lessons/${l.id}`} className="rounded-full px-3 py-1.5 text-sm font-bold text-brand hover:bg-brand/10">تعديل</Link>
                      <Link href={`/lessons/${l.slug}`} target="_blank" className="rounded-full px-3 py-1.5 text-sm font-bold hover:bg-navy/5">عرض</Link>
                      <Confirm onYes={async () => { try { await api(`/api/admin/lessons/${l.id}`, "DELETE"); toast("حُذف الدرس"); load(); } catch (e) { toast((e as Error).message, "err"); } }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
