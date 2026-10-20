"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/client";
import { Card, Field, PageHead, useToast } from "@/components/admin/ui";
import type { SiteSettings } from "@/lib/settings";

export default function Page() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { api<SiteSettings>("/api/admin/settings").then(setS).catch((e) => toast(e.message, "err")); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!s) return <p>جارٍ التحميل…</p>;
  const set = (k: keyof SiteSettings, v: string) => setS({ ...s, [k]: v });
  const setC = (k: keyof SiteSettings["contact"], v: string) => setS({ ...s, contact: { ...s.contact, [k]: v } });
  return (
    <>
      <PageHead title="الإعدادات" sub="النصوص والألوان ووسائل التواصل" actions={<button className="btn-brand" disabled={saving} onClick={async () => { setSaving(true); try { await api("/api/admin/settings", "PUT", s); toast("تم الحفظ ✔ — حدّثي الموقع لرؤية التغيير"); } catch (e) { toast((e as Error).message, "err"); } setSaving(false); }}>{saving ? "جارٍ الحفظ…" : "حفظ"}</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="النصوص">
          <div className="grid gap-3">
            <Field label="اسم الموقع"><input className="input" value={s.siteName} onChange={(e) => set("siteName", e.target.value)} /></Field>
            <Field label="السطر التعريفي"><input className="input" value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
            <Field label="عنوان الواجهة"><input className="input" value={s.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></Field>
            <Field label="وصف الواجهة"><textarea className="input" rows={3} value={s.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} /></Field>
            <Field label="نبذة عنكِ"><textarea className="input" rows={4} value={s.about} onChange={(e) => set("about", e.target.value)} /></Field>
            <Field label="نص صفحة الطلبات"><textarea className="input" rows={2} value={s.requestIntro} onChange={(e) => set("requestIntro", e.target.value)} /></Field>
          </div>
        </Card>
        <div className="grid content-start gap-6">
          <Card title="الألوان">
            <div className="grid grid-cols-2 gap-4">
              <Field label="اللون الأساسي"><div className="flex items-center gap-2"><input type="color" value={s.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg" /><input className="input" dir="ltr" value={s.brandColor} onChange={(e) => set("brandColor", e.target.value)} /></div></Field>
              <Field label="اللون المميّز"><div className="flex items-center gap-2"><input type="color" value={s.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg" /><input className="input" dir="ltr" value={s.accentColor} onChange={(e) => set("accentColor", e.target.value)} /></div></Field>
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl bg-[#06201E] p-4"><span className="rounded-full px-4 py-2 font-bold text-white" style={{ background: s.brandColor }}>زر أساسي</span><span className="rounded-full px-4 py-2 font-bold" style={{ background: s.accentColor }}>زر مميّز</span></div>
            <button className="mt-3 text-sm font-bold text-brand" onClick={() => setS({ ...s, brandColor: "#14917F", accentColor: "#E7B416" })}>استعادة الألوان الأصلية</button>
          </Card>
          <Card title="وسائل التواصل">
            <div className="grid gap-3">
              <Field label="البريد الإلكتروني"><input className="input" dir="ltr" value={s.contact.email} onChange={(e) => setC("email", e.target.value)} /></Field>
              <Field label="رقم واتساب (بالمفتاح الدولي)"><input className="input" dir="ltr" value={s.contact.whatsapp} onChange={(e) => setC("whatsapp", e.target.value)} placeholder="9665xxxxxxxx" /></Field>
              <Field label="رابط X"><input className="input" dir="ltr" value={s.contact.x} onChange={(e) => setC("x", e.target.value)} /></Field>
              <Field label="رابط إنستغرام"><input className="input" dir="ltr" value={s.contact.instagram} onChange={(e) => setC("instagram", e.target.value)} /></Field>
              <Field label="رابط تيليجرام"><input className="input" dir="ltr" value={s.contact.telegram} onChange={(e) => setC("telegram", e.target.value)} /></Field>
              <Field label="رابط يوتيوب"><input className="input" dir="ltr" value={s.contact.youtube} onChange={(e) => setC("youtube", e.target.value)} /></Field>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
