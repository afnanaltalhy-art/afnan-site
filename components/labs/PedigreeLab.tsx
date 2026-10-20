"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { StepButtons } from "@/components/genetics/ui";

function Person({ x, y, female, affected, g, show }: { x: number; y: number; female?: boolean; affected?: boolean; g?: string; show: boolean }) {
  return (
    <motion.g initial={false} animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {female ? <circle cx={x} cy={y} r={34} fill={affected ? "#6D4FC2" : "#FFF9EF"} stroke="#fff" strokeWidth={4} /> : <rect x={x - 32} y={y - 32} width={64} height={64} rx={6} fill={affected ? "#6D4FC2" : "#FFF9EF"} stroke="#fff" strokeWidth={4} />}
      {g && <text x={x} y={y + 64} textAnchor="middle" fontSize="24" fontWeight="700" fill="#F2C230" direction="ltr">{g}</text>}
    </motion.g>
  );
}

export default function PedigreeLab() {
  const [step, setStep] = useState(0);
  const genes = step >= 3;
  return (
    <div>
      <StepButtons steps={["① الأبوان", "② الأبناء", "③ اكشفي الجينات"]} step={step} setStep={setStep} onReplay={() => setStep(0)} />
      <div className="mt-5 grid items-center gap-6 lg:grid-cols-3">
        <svg viewBox="0 0 640 420" className="w-full rounded-3xl bg-ink-800/60 lg:col-span-2" role="img" aria-label="مخطط السلالة">
          <text x="620" y="95" textAnchor="start" fontSize="20" fill="#9CCFC6">الجيل I</text>
          <text x="620" y="300" textAnchor="start" fontSize="20" fill="#9CCFC6">الجيل II</text>
          <motion.path d="M252 90 H386 M320 90 V200 M130 200 H510 M130 200 V266 M320 200 V266 M510 200 V266" stroke="#CFEDE7" strokeWidth={4} fill="none" initial={false} animate={{ pathLength: step >= 2 ? 1 : step >= 1 ? 0.15 : 0, opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 1 }} />
          <Person x={220} y={90} show={step >= 1} g={genes ? "Aa حامل" : undefined} />
          <Person x={420} y={90} female show={step >= 1} g={genes ? "Aa حاملة" : undefined} />
          <Person x={130} y={300} show={step >= 2} g={genes ? "AA أو Aa" : undefined} />
          <Person x={320} y={300} female affected show={step >= 2} g={genes ? "aa" : undefined} />
          <Person x={510} y={300} show={step >= 2} g={genes ? "AA أو Aa" : undefined} />
        </svg>
        <div className="grid gap-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="mb-2 font-bold text-accent">مفتاح المخطط</p>
            <p className="flex items-center gap-2"><span className="inline-block h-5 w-5 rounded bg-cream" /> ذكر</p>
            <p className="flex items-center gap-2"><span className="inline-block h-5 w-5 rounded-full bg-cream" /> أنثى</p>
            <p className="flex items-center gap-2"><span className="inline-block h-5 w-5 rounded-full bg-violet" /> تظهر عليه الصفة المتنحية</p>
          </div>
          {genes && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cream p-4 text-lg leading-8">ورثت الابنة جينًا متنحيًا من كل أب فظهرت عليها الصفة، مع أن أبويها لا يظهرانها! <b className="text-brand-deep">وهذا حل لغز بداية الدرس.</b></motion.p>}
        </div>
      </div>
    </div>
  );
}
