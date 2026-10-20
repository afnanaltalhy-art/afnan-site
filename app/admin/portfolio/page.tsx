"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/client";
import { Card, Confirm, Field, PageHead, UploadButton, useToast } from "@/components/admin/ui";

type P = { id?: string; title: string; description: string; category: string; imageUrl: string; link: string; order: number };
const EMPTY: P = { title: "", description: "", category: "", imageUrl: "", link: "", order: 0 };

export default function Page() {
  const [list, setList] = useState<P[]>([]);
  const [form, setForm] = useState<P>(EMPTY);
  const toast = useToast();
  const load = () => api<P[]>("/api/admin/portfolio").then((d) => setList(d.map((x) => ({ ...EMPTY, ...Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v ?? ""])) } as P)))).catch((e) => toast(e.message, "err"));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function save() {
    const body = { title: form.title, description: form.description || null, category: form.category || null, imageUrl: form.imageUrl || null, link: form.link || null, order: Number(form.order) || 0 };
    try { await api(form.id ? `/api/admin/portfolio/${form.id}` : "/api/admin/portfolio", form.id ? "PUT" : "POST", body); toast("تم الحفظ ✔"); setForm(EMPTY); load(); } catch (e) { toast((e as Error).message, "err"); }
  }
  return (
    <>
      <PageHead title="معرض الأعمال" sub="عندما تضيفين أعمالًا هنا تحل محل الأعمال الافتراضية في الموقع" />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title={form.id ? "تعديل عمل" : "إضافة عمل"} className="lg:col-span-2">
          <div className="grid gap-3">
            <Field label="العنوان"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="التصنيف"><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="درس تفاعلي، عرض، لعبة…" /></Field>
            <Field label="الوصف"><textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="الرابط (اختياري)"><input className="input" dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/lessons/genetics أو https://…" /></Field>
            <Field label="الترتيب"><input className="input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} /></Field>
            <div>
              {form.imageUrl && <img src={form.imageUrl} alt="" className="mb-2 h-32 w-full rounded-2xl object-cover" />}
              <UploadButton accept="image/*" label={form.imageUrl ? "تغيير الصورة" : "رفع صورة"} onDone={(f) => setForm((x) => ({ ...x, imageUrl: f.url }))} className="btn-dark" />
            </div>
            <div className="flex gap-2"><button className="btn-brand" onClick={save} disabled={form.title.trim().length < 2}>حفظ</button>{form.id && <button className="btn btn-ghost !border-navy/15 !text-navy" onClick={() => setForm(EMPTY)}>إلغاء</button>}</div>
          </div>
        </Card>
        <Card title="الأعمال" className="lg:col-span-3">
          {list.length === 0 ? <p className="text-navy/50">لا توجد أعمال مضافة (تظهر الأعمال الافتراضية في الموقع).</p> : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <li key={p.id} className="overflow-hidden rounded-2xl bg-navy/[.03]">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-28 w-full object-cover" /> : <div className="h-28 bg-gradient-to-br from-violet to-brand-deep" />}
                  <div className="p-3"><p className="font-bold">{p.title}</p><p className="text-sm text-navy/50">{p.category}</p>
                    <div className="mt-2 flex gap-1"><button className="rounded-full px-3 py-1.5 text-sm font-bold text-brand hover:bg-brand/10" onClick={() => setForm(p)}>تعديل</button><Confirm onYes={async () => { try { await api(`/api/admin/portfolio/${p.id}`, "DELETE"); toast("حُذف"); load(); } catch (e) { toast((e as Error).message, "err"); } }} /></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
