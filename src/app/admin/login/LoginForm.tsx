"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      const next = params.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } else {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "تعذر تسجيل الدخول");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-bold text-navy">كلمة المرور</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" autoFocus />
      </label>
      {error && <p role="alert" className="rounded-xl bg-[#f8e9e5] px-3 py-2 text-[13px] text-[#9a3f2b]">{error}</p>}
      <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
        تسجيل الدخول
      </button>
    </form>
  );
}
