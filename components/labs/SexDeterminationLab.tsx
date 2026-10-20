"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { StepButtons } from "@/components/genetics/ui";
import { sfx } from "@/lib/sound";

const Chip = ({ l, c }: { l: string; c: string }) => <span className={`ltr grid h-14 w-14 place-items-center rounded-full text-2xl font-bold text-white shadow-lg ${c}`}>{l}</span>;

export default function SexDeterminationLab() {
  const [step, setStep] = useState(0);
  const [births, setBirths] = useState({ g: 0, b: 0 });
  const total = births.g + births.b;
  const simulate = (n: number) => {
    let g = 0, b = 0;
    for (let i = 0; i < n; i++) { if (Math.random() < 0.5) g++; else b++; }
    setBirths((x) => ({ g: x.g + g, b: x.b + b })); sfx.pop();
  };
  return (
    <div>
      <StepButtons steps={["① الخلايا الجنسية", "② الإخصاب", "③ النتيجة"]} step={step} setStep={setStep} onReplay={() => setStep(0)} />
      <div className="mt-5 grid items-center gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className={`rounded-2xl p-4 transition ${step >= 1 ? "bg-rose/20" : "bg-white/5 opacity-40"}`}><b>الأم: </b><span className="ltr">XX</span> ⟵ بويضاتها كلها تحمل <span className="ltr">X</span></div>
          <div className={`rounded-2xl p-4 transition ${step >= 1 ? "bg-sky/25" : "bg-white/5 opacity-40"}`}><b>الأب: </b><span className="ltr">XY</span> ⟵ نصف حيواناته المنوية <span className="ltr">X</span> ونصفها <span className="ltr">Y</span></div>
        </div>
        <div className="mx-auto grid grid-cols-[70px_110px_110px] grid-rows-[70px_110px_110px] text-center">
          <span className="grid place-items-center text-xs text-white/50">الأب ←<br />الأم ↓</span>
          {["X", "Y"].map((l, i) => <div key={l} className="grid place-items-center">{step >= 1 && <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.2 }}><Chip l={l} c={l === "Y" ? "bg-sky" : "bg-violet"} /></motion.div>}</div>)}
          {[0, 1].map((r) => (
            <Frag key={r}>
              <div className="grid place-items-center">{step >= 1 && <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + r * 0.2 }}><Chip l="X" c="bg-rose" /></motion.div>}</div>
              {["X", "Y"].map((f, c) => (
                <div key={c} className={`grid place-items-center border-2 border-white/70 ${step >= 2 ? (f === "X" ? "bg-rose/30" : "bg-sky/30") : ""}`}>
                  {step >= 2 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (r * 2 + c) * 0.2 }} className="flex flex-col items-center"><span className="ltr text-3xl font-bold">X{f}</span><span className="text-sm">{f === "X" ? "بنت 👧" : "ولد 👦"}</span></motion.div>}
                </div>
              ))}
            </Frag>
          ))}
        </div>
      </div>
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card-cream p-5 text-lg leading-8"><p><span className="ltr font-bold">XX</span> = بنت (50%)</p><p><span className="ltr font-bold">XY</span> = ولد (50%)</p><p className="mt-2 font-bold text-brand-deep">كروموسوم الأب (X أو Y) هو الذي يحدد جنس المولود</p></div>
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="mb-3 font-bold">جرّبي: كم بنتًا وولدًا في عدد كبير من الولادات؟</p>
            <div className="flex flex-wrap gap-2"><button className="btn-primary !py-2" onClick={() => simulate(10)}>10 ولادات</button><button className="btn-ghost !py-2" onClick={() => simulate(100)}>100 ولادة</button><button className="btn-ghost !py-2" onClick={() => setBirths({ g: 0, b: 0 })}>تصفير</button></div>
            <div className="mt-4 flex h-10 overflow-hidden rounded-xl text-sm font-bold">
              <div className="grid place-items-center bg-rose transition-all" style={{ width: total ? `${(births.g / total) * 100}%` : "50%" }}>بنات {births.g}</div>
              <div className="grid place-items-center bg-sky transition-all" style={{ width: total ? `${(births.b / total) * 100}%` : "50%" }}>أولاد {births.b}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
const Frag = ({ children }: { children: React.ReactNode }) => <>{children}</>;
