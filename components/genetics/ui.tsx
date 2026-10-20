"use client";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { IconCheck, IconClock, IconReplay } from "@/components/ui/Icons";
import { sfx } from "@/lib/sound";

export const NotesCtx = createContext(false);

/** Allele / genotype letters always rendered LTR. */
export function G({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`ltr font-bold tracking-wide ${className}`}>{children}</span>;
}

export function Slide({ id, kicker, title, children, note, tone = "glass", className = "" }: {
  id?: string; kicker?: string; title?: string; children: React.ReactNode; note?: string; tone?: "glass" | "cream"; className?: string;
}) {
  const showNotes = useContext(NotesCtx);
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`${tone === "glass" ? "glass" : "card-cream"} scroll-mt-36 p-5 sm:p-8 ${className}`}
    >
      {(kicker || title) && (
        <header className="mb-6 flex flex-wrap items-center gap-3">
          {kicker && <span className="chip">{kicker}</span>}
          {title && <h3 className={`text-2xl font-bold sm:text-3xl ${tone === "cream" ? "text-navy" : ""}`}>{title}</h3>}
        </header>
      )}
      {children}
      {note && showNotes && (
        <aside className="mt-6 rounded-2xl border border-dashed border-accent/60 bg-accent/10 p-4 text-sm leading-7 text-accent">
          <b>ملاحظة للمعلمة: </b>{note}
        </aside>
      )}
    </motion.article>
  );
}

export function RevealBox({ label = "اكشفي الإجابة", children, onReveal, className = "" }: { label?: string; children: React.ReactNode; onReveal?: () => void; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {children}
            <button className="mt-3 text-sm text-white/60 underline underline-offset-4 hover:text-white" onClick={() => setOpen(false)}>إخفاء</button>
          </motion.div>
        ) : (
          <motion.button key="b" className="btn-primary" onClick={() => { setOpen(true); sfx.reveal(); onReveal?.(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {label}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Countdown({ seconds, running, onDone, onTick }: { seconds: number; running: boolean; onDone?: () => void; onTick?: (left: number) => void }) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(false);
  useEffect(() => { setLeft(seconds); done.current = false; }, [seconds]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    onTick?.(left);
    if (running && left <= 5 && left > 0) sfx.tick();
    if (running && left === 0 && !done.current) { done.current = true; sfx.timeUp(); onDone?.(); }
  }, [left, running]); // eslint-disable-line react-hooks/exhaustive-deps
  const pct = (left / seconds) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className={`flex items-center gap-1.5 font-bold ${left <= 5 ? "text-rose" : "text-accent"}`}><IconClock /> <span className="ltr w-8 text-center text-xl">{left}</span></span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${left <= 5 ? "bg-rose" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** "ماذا قرأت؟" — think 30 seconds then reveal. */
export function ThinkCard({ question, answer, kicker = "تقويم تكويني" }: { question: string; answer: React.ReactNode; kicker?: string }) {
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(false);
  return (
    <Slide kicker={kicker} title="ماذا قرأت؟">
      <p className="text-xl leading-9 sm:text-2xl">{question}</p>
      <div className="mt-5 max-w-xl">
        {running || shown ? <Countdown seconds={30} running={running && !shown} onDone={() => setRunning(false)} /> : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {!running && !shown && <button className="btn-ghost" onClick={() => { setRunning(true); sfx.pop(); }}><IconClock /> فكّري ثلاثين ثانية ⏳</button>}
        {!shown && <button className="btn-primary" onClick={() => { setShown(true); setRunning(false); sfx.reveal(); }}>اكشفي الإجابة</button>}
        {shown && <button className="btn-ghost" onClick={() => { setShown(false); setRunning(false); }}><IconReplay /> إعادة</button>}
      </div>
      <AnimatePresence>
        {shown && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex gap-3 rounded-2xl bg-brand/20 p-5 text-lg leading-8 ring-1 ring-brand/50">
            <IconCheck className="mt-1 h-6 w-6 shrink-0 text-accent" /> <div>{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Slide>
  );
}

export function StepButtons({ steps, step, setStep, onReplay }: { steps: string[]; step: number; setStep: (n: number) => void; onReplay: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <button key={s} onClick={() => { setStep(i + 1); sfx.pop(); }} disabled={i + 1 > step + 1}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${step >= i + 1 ? "bg-accent text-navy" : "bg-white/10 text-white hover:bg-white/20"} disabled:opacity-40`}>
          {s}
        </button>
      ))}
      <button onClick={onReplay} className="btn-ghost !px-3 !py-2 text-sm"><IconReplay className="h-4 w-4" /> إعادة المحاكاة</button>
    </div>
  );
}

export function PartHeader({ n, title, lead }: { n: string; title: string; lead?: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-brand-deep via-brand/70 to-brand-deep p-8 sm:p-12">
      <span className="pointer-events-none absolute -left-6 -top-10 select-none text-[11rem] font-bold leading-none text-white/10 sm:text-[14rem]">{n}</span>
      <span className="chip">{`الجزء ${n}`}</span>
      <h2 className="relative mt-3 text-3xl font-bold sm:text-5xl">{title}</h2>
      {lead && <p className="relative mt-3 text-lg text-white/80 sm:text-xl">{lead}</p>}
    </motion.div>
  );
}
