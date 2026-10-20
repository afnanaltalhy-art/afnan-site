"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconDna } from "@/components/ui/Icons";

function Form() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form className="card-cream w-full max-w-sm p-8" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr("");
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const j = await r.json().catch(() => ({}));
      setBusy(false);
      if (r.ok) { const next = sp.get("next"); router.replace(next && next.startsWith("/admin") ? next : "/admin"); router.refresh(); } else setErr(j.error ?? "تعذّر الدخول");
    }}>
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white"><IconDna className="h-8 w-8" /></span>
      <h1 className="mt-4 text-center text-2xl font-bold">لوحة تحكم د. أفنان</h1>
      <label className="label mt-6" htmlFor="pw">كلمة المرور</label>
      <input id="pw" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
      {err && <p className="mt-3 rounded-xl bg-rose/15 p-2.5 text-sm font-bold text-rose">{err}</p>}
      <button className="btn-brand mt-5 w-full" disabled={busy}>{busy ? "جارٍ الدخول…" : "دخول"}</button>
    </form>
  );
}
export default function Page() {
  return <div className="grid min-h-screen place-items-center p-4"><Suspense><Form /></Suspense></div>;
}
