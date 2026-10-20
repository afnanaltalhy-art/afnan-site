"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { uploadAndRecord } from "./client";

type Toast = { id: number; msg: string; kind: "ok" | "err" };
const ToastCtx = createContext<(msg: string, kind?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, msg, kind }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 left-4 z-[80] grid gap-2" role="status" aria-live="polite">
        {list.map((t) => <div key={t.id} className={`rounded-2xl px-4 py-3 font-bold text-white shadow-xl ${t.kind === "ok" ? "bg-brand" : "bg-rose"}`}>{t.msg}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

export function Card({ title, actions, children, className = "" }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 sm:p-6 ${className}`}>
      {(title || actions) && <div className="mb-4 flex flex-wrap items-center justify-between gap-3">{title && <h2 className="text-xl font-bold">{title}</h2>}{actions}</div>}
      {children}
    </section>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-3xl font-bold">{title}</h1>{sub && <p className="mt-1 text-navy/60">{sub}</p>}</div>
      {actions}
    </div>
  );
}

export function UploadButton({ accept, lessonId, onDone, label = "رفع ملف", multiple = false, className = "btn-brand" }: { accept?: string; lessonId?: string | null; onDone: (f: { id: string; url: string; name: string; kind: string }) => void; label?: string; multiple?: boolean; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const toast = useToast();
  return (
    <>
      <input ref={ref} type="file" hidden accept={accept} multiple={multiple} onChange={async (e) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        for (const f of files) {
          try { setPct(0); const r = await uploadAndRecord(f, lessonId, setPct); onDone(r); toast(`تم رفع «${f.name}»`); }
          catch (err) { toast((err as Error).message, "err"); }
        }
        setPct(null);
      }} />
      <button type="button" className={className} disabled={pct !== null} onClick={() => ref.current?.click()}>{pct !== null ? `جارٍ الرفع ${Math.round(pct)}%` : label}</button>
    </>
  );
}

export function Confirm({ onYes, children, className = "rounded-full px-3 py-1.5 text-sm font-bold text-rose hover:bg-rose/10", label = "حذف" }: { onYes: () => void; children?: React.ReactNode; className?: string; label?: string }) {
  const [ask, setAsk] = useState(false);
  if (ask) return <span className="inline-flex items-center gap-2 text-sm">{children ?? "متأكدة؟"} <button type="button" className="rounded-full bg-rose px-3 py-1 font-bold text-white" onClick={() => { setAsk(false); onYes(); }}>نعم</button><button type="button" className="rounded-full bg-navy/10 px-3 py-1 font-bold" onClick={() => setAsk(false)}>لا</button></span>;
  return <button type="button" className={className} onClick={() => setAsk(true)}>{label}</button>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="block"><span className="label">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-navy/50">{hint}</span>}</label>;
}
