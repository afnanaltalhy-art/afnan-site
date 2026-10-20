"use client";
import { useState } from "react";
import { IconCheck, IconSend } from "@/components/ui/Icons";

const TYPES = ["عرض تقديمي تفاعلي", "موقع تعليمي", "درس رقمي بمحاكاة", "لعبة أو مسابقة تعليمية", "أوراق عمل واختبارات", "أخرى"];

export default function RequestForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending"); setErr("");
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) }).catch(() => null);
    if (res?.ok) { setState("done"); (e.target as HTMLFormElement).reset(); }
    else { setState("error"); const j = await res?.json().catch(() => null); setErr(j?.error ?? "تعذّر الإرسال، حاولي مرة أخرى."); }
  }
  if (state === "done")
    return (
      <div className="card-cream grid place-items-center gap-3 p-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white"><IconCheck className="h-8 w-8" /></span>
        <h2 className="text-2xl font-bold">وصل طلبكِ بنجاح</h2>
        <p className="text-navy/70">سأتواصل معكِ قريبًا بإذن الله.</p>
        <button className="btn-dark mt-2" onClick={() => setState("idle")}>إرسال طلب آخر</button>
      </div>
    );
  return (
    <form onSubmit={submit} className="card-cream grid gap-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">الاسم</label><input id="name" name="name" required minLength={2} maxLength={80} className="input" /></div>
        <div><label className="label" htmlFor="contact">البريد أو رقم الجوال</label><input id="contact" name="contact" required minLength={5} maxLength={120} className="input" dir="ltr" /></div>
      </div>
      <div><label className="label" htmlFor="type">نوع الطلب</label><select id="type" name="type" className="input" defaultValue={TYPES[0]}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
      <div><label className="label" htmlFor="details">التفاصيل (المادة، الصف، الدرس، الموعد المطلوب…)</label><textarea id="details" name="details" required minLength={10} maxLength={3000} rows={6} className="input" /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && <p className="rounded-xl bg-rose/15 p-3 font-bold text-rose">{err}</p>}
      <button className="btn-brand justify-self-start text-lg" disabled={state === "sending"}><IconSend /> {state === "sending" ? "جارٍ الإرسال…" : "إرسال الطلب"}</button>
    </form>
  );
}
