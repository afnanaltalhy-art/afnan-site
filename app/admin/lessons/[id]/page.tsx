"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, fmtSize } from "@/components/admin/client";
import { Card, Confirm, Field, PageHead, UploadButton, useToast } from "@/components/admin/ui";

type Sec = { title: string; body: string };
type F = { id: string; name: string; url: string; kind: string; size: number };
type Lesson = { id?: string; slug: string; title: string; subtitle: string; subject: string; grade: string; description: string; coverUrl: string; published: boolean; order: number; sections: Sec[]; files?: F[] };

const EMPTY: Lesson = { slug: "", title: "", subtitle: "", subject: "العلوم", grade: "", description: "", coverUrl: "", published: true, order: 0, sections: [{ title: "", body: "" }] };

export default function Page({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const router = useRouter();
  const toast = useToast();
  const [l, setL] = useState<Lesson>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api<Lesson>(`/api/admin/lessons/${params.id}`).then((d) => setL({ ...EMPTY, ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v ?? ""])) as Lesson, sections: (d.sections as Sec[]) ?? [], files: d.files })).catch((e) => toast(e.message, "err")).finally(() => setLoading(false));
  }, [isNew, params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Lesson>(k: K, v: Lesson[K]) => setL((x) => ({ ...x, [k]: v }));
  const setSec = (i: number, k: keyof Sec, v: string) => set("sections", l.sections.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  const move = (i: number, d: number) => { const s = [...l.sections]; const j = i + d; if (j < 0 || j >= s.length) return; [s[i], s[j]] = [s[j], s[i]]; set("sections", s); };

  async function save() {
    setSaving(true);
    const body = { slug: l.slug, title: l.title, subtitle: l.subtitle || null, subject: l.subject || null, grade: l.grade || null, description: l.description || null, coverUrl: l.coverUrl || null, published: l.published, order: Number(l.order) || 0, sections: l.sections.filter((s) => s.title || s.body) };
    try {
      const r = await api<{ id: string }>(isNew ? "/api/admin/lessons" : `/api/admin/lessons/${params.id}`, isNew ? "POST" : "PUT", body);
      toast("تم الحفظ ✔");
      if (isNew) router.replace(`/admin/lessons/${r.id}`);
    } catch (e) { toast((e as Error).message, "err"); }
    setSaving(false);
  }

  if (loading) return <p>جارٍ التحميل…</p>;
  return (
    <>
      <PageHead title={isNew ? "درس جديد" : `تعديل: ${l.title}`} actions={<div className="flex gap-2">{!isNew && <Link href={`/lessons/${l.slug}`} target="_blank" className="btn btn-ghost !border-navy/15 !bg-white !text-navy">معاينة ↗</Link>}<button className="btn-brand" onClick={save} disabled={saving}>{saving ? "جارٍ الحفظ…" : "حفظ"}</button></div>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid gap-6 xl:col-span-2">
          <Card title="بيانات الدرس">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="العنوان"><input className="input" value={l.title} onChange={(e) => set("title", e.target.value)} /></Field>
              <Field label="رابط الدرس" hint="بالإنجليزية، مثل: atomic-models"><input className="input" dir="ltr" value={l.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></Field>
              <Field label="العنوان الفرعي"><input className="input" value={l.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
              <Field label="المادة"><input className="input" value={l.subject} onChange={(e) => set("subject", e.target.value)} /></Field>
              <Field label="الصف"><input className="input" value={l.grade} onChange={(e) => set("grade", e.target.value)} placeholder="ثالث متوسط" /></Field>
              <Field label="الترتيب"><input className="input" type="number" value={l.order} onChange={(e) => set("order", Number(e.target.value))} /></Field>
            </div>
            <div className="mt-4"><Field label="الوصف"><textarea className="input" rows={3} value={l.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
            <label className="mt-4 flex items-center gap-2 font-bold"><input type="checkbox" className="h-5 w-5 accent-[rgb(var(--brand))]" checked={l.published} onChange={(e) => set("published", e.target.checked)} /> منشور للزوار</label>
          </Card>
          <Card title="أقسام الدرس" actions={<button className="btn-dark !py-2 text-sm" onClick={() => set("sections", [...l.sections, { title: "", body: "" }])}>+ قسم</button>}>
            <div className="grid gap-4">
              {l.sections.map((s, i) => (
                <div key={i} className="rounded-2xl bg-navy/[.03] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
                    <input className="input" placeholder="عنوان القسم" value={s.title} onChange={(e) => setSec(i, "title", e.target.value)} />
                    <button className="rounded-lg px-2 py-1 hover:bg-navy/10" onClick={() => move(i, -1)} aria-label="أعلى">↑</button>
                    <button className="rounded-lg px-2 py-1 hover:bg-navy/10" onClick={() => move(i, 1)} aria-label="أسفل">↓</button>
                    <Confirm onYes={() => set("sections", l.sections.filter((_, j) => j !== i))} />
                  </div>
                  <textarea className="input" rows={5} placeholder="المحتوى (كل سطر فقرة)" value={s.body} onChange={(e) => setSec(i, "body", e.target.value)} />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="grid content-start gap-6">
          <Card title="صورة الغلاف">
            {l.coverUrl && <img src={l.coverUrl} alt="" className="mb-3 h-40 w-full rounded-2xl object-cover" />}
            <div className="flex flex-wrap gap-2">
              <UploadButton accept="image/*" label="رفع صورة" onDone={(f) => set("coverUrl", f.url)} />
              {l.coverUrl && <button className="rounded-full px-3 py-1.5 text-sm font-bold text-rose" onClick={() => set("coverUrl", "")}>إزالة</button>}
            </div>
            <p className="mt-2 text-xs text-navy/50">احفظي الدرس بعد تغيير الصورة.</p>
          </Card>
          <Card title="ملفات الدرس (PowerPoint / PDF)">
            {isNew ? <p className="text-navy/50">احفظي الدرس أولًا ثم أرفقي الملفات.</p> : (
              <>
                <UploadButton multiple accept=".pdf,.ppt,.pptx,.doc,.docx,image/*,video/*" lessonId={params.id} label="رفع ملفات" onDone={(f) => setL((x) => ({ ...x, files: [...(x.files ?? []), { ...f, size: 0 }] }))} />
                <ul className="mt-4 grid gap-2">
                  {(l.files ?? []).map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-2 rounded-2xl bg-navy/[.03] p-3 text-sm">
                      <a href={f.url} target="_blank" rel="noreferrer" className="truncate font-bold hover:text-brand">{f.name}</a>
                      <span className="shrink-0 text-navy/40">{f.kind}{f.size ? ` • ${fmtSize(f.size)}` : ""}</span>
                      <Confirm label="إزالة" onYes={async () => { try { await api(`/api/admin/files/${f.id}`, "PATCH", { lessonId: null }); setL((x) => ({ ...x, files: (x.files ?? []).filter((y) => y.id !== f.id) })); toast("أُزيل الملف من الدرس (بقي في المكتبة)"); } catch (e) { toast((e as Error).message, "err"); } }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
