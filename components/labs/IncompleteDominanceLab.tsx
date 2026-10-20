"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { StepButtons } from "@/components/genetics/ui";

const COL: Record<string, { c: string; n: string }> = { RR: { c: "#E0324F", n: "أحمر" }, RW: { c: "#F59AB3", n: "وردي" }, WW: { c: "#F5F2EA", n: "أبيض" } };

function Flower({ g, delay = 0 }: { g: string; delay?: number }) {
  return (
    <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay, type: "spring" }} className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 100 100" className="h-20 w-20">
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="50" cy="28" rx="16" ry="24" fill={COL[g].c} stroke="#00000022" transform={`rotate(${a} 50 50)`} />)}
        <circle cx="50" cy="50" r="12" fill="#F2C230" />
      </svg>
      <span className="ltr font-bold">{g}</span>
      <span className="text-sm text-white/70">{COL[g].n}</span>
    </motion.div>
  );
}

export default function IncompleteDominanceLab() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <StepButtons steps={["① التلقيح", "② الجيل الأول", "③ الجيل الثاني"]} step={step} setStep={setStep} onReplay={() => setStep(0)} />
      <div className="mt-5 grid gap-4">
        <Row label="الآباء P" show={step >= 1}><Flower g="RR" /><span className="text-4xl text-accent">×</span><Flower g="WW" delay={0.2} /></Row>
        <Row label="الجيل الأول F1" show={step >= 2} note="كلها وردية RW: لا سيادة تامة لأي لون!">{[0, 1, 2, 3].map((i) => <Flower key={i} g="RW" delay={i * 0.15} />)}</Row>
        <Row label="الجيل الثاني F2" show={step >= 3} note="أحمر : وردي : أبيض = 1 : 2 : 1">{["RR", "RW", "RW", "WW"].map((g, i) => <Flower key={i} g={g} delay={i * 0.15} />)}</Row>
      </div>
      <p className="mt-5 rounded-2xl bg-accent-warm p-4 text-center text-lg font-bold">السيادة غير التامة: يظهر الفرد الهجين بصفة وسطية بين الأبوين — وهنا يمكن معرفة الطراز الجيني من اللون مباشرة.</p>
    </div>
  );
}
function Row({ label, show, note, children }: { label: string; show: boolean; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-ink-800/60 p-4 sm:flex-row">
      <span className="ltr w-full shrink-0 rounded-2xl bg-white/10 p-3 text-center font-bold text-accent sm:w-40" dir="rtl">{label}</span>
      <div className="flex min-h-[7.5rem] flex-1 flex-wrap items-center justify-center gap-5">{show ? children : <span className="text-white/30">…</span>}</div>
      {show && note && <p className="font-bold text-cream sm:w-56">{note}</p>}
    </div>
  );
}
