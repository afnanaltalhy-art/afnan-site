"use client";
import { useEffect, useState } from "react";
import { api, fmtDate, fmtSize } from "@/components/admin/client";
import { Card, Confirm, PageHead, UploadButton, useToast } from "@/components/admin/ui";

type F = { id: string; name: string; url: string; kind: string; size: number; createdAt: string; lessonId: string | null; lesson: { id: string; title: string } | null };
const KIND: Record<string, string> = { pdf: "PDF", pptx: "PowerPoint", doc: "Word", sheet: "جدول", image: "صورة", video: "فيديو", other: "ملف" };

export default function Page() {
  const [files, setFiles] = useState<F[] | null>(null);
  const [lessons, setLessons] = useState<{ id: string; title: string }[]>([]);
  const [filter, setFilter] = useState("all");
  const toast = useToast();
  const load = () => api<F[]>("/api/admin/files").then(setFiles).catch((e) => { toast(e.message, "err"); setFiles([]); });
  useEffect(() => { load(); api<{ id: string; title: string }[]>("/api/admin/lessons").then(setLessons).catch(() => {}); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = (files ?? []).filter((f) => filter === "all" || f.kind === filter);
  return (
    <>
      <PageHead title="مكتبة الملفات" sub="ارفعي ملفات PowerPoint وPDF والصور، واربطيها بالدروس" actions={<UploadButton multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.xlsx,image/*,video/*" label="+ رفع ملفات" onDone={() => load()} />} />
      <div className="mb-4 flex flex-wrap gap-2">{["all", "pptx", "pdf", "image", "video", "doc", "other"].map((k) => <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${filter === k ? "bg-navy text-white" : "bg-white"}`}>{k === "all" ? "الكل" : KIND[k]}</button>)}</div>
      <Card>
        {files === null ? <p className="text-navy/50">جارٍ التحميل…</p> : shown.length === 0 ? <p className="text-navy/50">لا توجد ملفات.</p> : (
          <ul className="grid gap-3">
            {shown.map((f) => (
              <li key={f.id} className="flex flex-col gap-3 rounded-2xl bg-navy/[.03] p-3 md:flex-row md:items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-xs font-bold">{f.kind === "image" ? <img src={f.url} alt="" className="h-full w-full object-cover" /> : KIND[f.kind]}</span>
                <div className="min-w-0 flex-1"><a href={f.url} target="_blank" rel="noreferrer" className="block truncate font-bold hover:text-brand">{f.name}</a><span className="text-xs text-navy/50">{KIND[f.kind]} • {fmtSize(f.size)} • {fmtDate(f.createdAt)}</span></div>
                <select aria-label="ربط بدرس" className="input md:w-56" value={f.lessonId ?? ""} onChange={async (e) => { try { await api(`/api/admin/files/${f.id}`, "PATCH", { lessonId: e.target.value || null }); toast("تم الربط"); load(); } catch (er) { toast((er as Error).message, "err"); } }}>
                  <option value="">— غير مرتبط بدرس —</option>
                  {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
                <button className="rounded-full px-3 py-1.5 text-sm font-bold text-brand hover:bg-brand/10" onClick={() => { navigator.clipboard?.writeText(new URL(f.url, location.origin).href); toast("نُسخ الرابط"); }}>نسخ الرابط</button>
                <Confirm onYes={async () => { try { await api(`/api/admin/files/${f.id}`, "DELETE"); toast("حُذف الملف"); load(); } catch (e) { toast((e as Error).message, "err"); } }} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
