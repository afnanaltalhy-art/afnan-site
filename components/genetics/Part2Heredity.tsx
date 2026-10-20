"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, Slide, StepButtons, ThinkCard } from "./ui";
import { Chromosomes3D } from "@/components/three";
import { sfx } from "@/lib/sound";

function Cell({ letters, color, size = 120, label }: { letters: string; color: string; size?: number; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid place-items-center rounded-full font-bold text-white shadow-2xl ring-8 ring-white/10" style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}>
        <span className="ltr tracking-[.2em]">{letters}</span>
      </div>
      {label && <span className="max-w-[12rem] text-center text-sm font-bold text-white/85">{label}</span>}
    </div>
  );
}

const TEAL = "radial-gradient(circle at 35% 30%, #3FD1B7, #0E7F70)";
const BLUE = "radial-gradient(circle at 35% 30%, #7FB8F5, #2E78C7)";
const PINK = "radial-gradient(circle at 35% 30%, #F7A9C2, #D94C7B)";
const GOLD = "radial-gradient(circle at 35% 30%, #FFE08A, #D9A40E)";

function MeiosisSim() {
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<"D" | "d">("D");
  const zyg = pick === "D" ? "Dd" : "dd";
  return (
    <Slide id="meiosis" kicker="محاكاة تفاعلية" title="الجينات المتقابلة تنفصل.. ثم تلتقي"
      note="① أثناء الانقسام المنصّف ينفصل الكروموسومان فينتقل الجين D إلى خلية جنسية والجين d إلى أخرى؛ كل خلية جنسية تأخذ جينًا واحدًا. ② عند الإخصاب يلتقي جين من الأب وجين من الأم فيتكون عند الفرد الجديد زوج من الجينات المتقابلة.">
      <p className="mb-4 text-white/80">مثال الكتاب: صفة الغمّازات • <G className="text-accent">D</G> جين وجود الغمازات (سائد) • <G className="text-accent">d</G> جين عدم وجودها (متنحٍ)</p>
      <StepButtons steps={["① الانقسام المنصّف", "② الإخصاب"]} step={step} setStep={setStep} onReplay={() => setStep(0)} />
      <div className="relative mt-6 grid min-h-[360px] items-center gap-6 rounded-3xl bg-ink-800/60 p-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="p" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                <Cell letters="Dd" color={TEAL} size={150} label="خلية من أحد الأبوين (Dd)" />
              </motion.div>
            ) : (
              <motion.div key="g" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {(["D", "d"] as const).map((l, i) => (
                  <motion.button key={l} initial={{ y: 0, scale: 0.6 }} animate={{ y: 0, scale: 1 }} transition={{ delay: i * 0.15, type: "spring" }}
                    onClick={() => { if (step === 1) { setPick(l); sfx.pop(); } }}
                    className={`rounded-full transition ${step === 1 ? "cursor-pointer hover:scale-105" : ""} ${pick === l ? "ring-4 ring-accent" : "opacity-60"}`}>
                    <Cell letters={l} color={BLUE} size={100} label={`خلية جنسية تحمل ${l}`} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {step === 1 && <p className="text-center text-sm text-accent">اختاري الخلية الجنسية التي ستلتقي بالبويضة، ثم اضغطي ② الإخصاب</p>}
        </div>
        <div className="flex flex-col items-center">
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                <Cell letters={zyg} color={GOLD} size={170} />
                <p className="mt-3 text-center text-xl font-bold text-accent">الفرد الجديد: <G>{zyg}</G> ⟵ {zyg === "Dd" ? "لديه غمّازات 😊" : "ليس لديه غمّازات"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center">
          <motion.div animate={step >= 2 ? { x: -40, opacity: 0.5 } : { x: 0, opacity: 1 }}>
            <Cell letters="d" color={PINK} size={130} label="بويضة من الأب الآخر (d)" />
          </motion.div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className={`rounded-2xl p-4 transition ${step >= 1 ? "bg-cream text-navy" : "bg-white/5 text-white/40"}`}><b className="text-accent-warm">① الانقسام المنصّف: </b>تنفصل الجينات المتقابلة: جين واحد لكل خلية جنسية.</div>
        <div className={`rounded-2xl p-4 transition ${step >= 2 ? "bg-cream text-navy" : "bg-white/5 text-white/40"}`}><b className="text-accent-warm">② الإخصاب: </b>يلتقي جين من الأب وجين من الأم فيتكوّن زوج جديد من الجينات المتقابلة.</div>
      </div>
    </Slide>
  );
}

function ChromosomeLab() {
  const [f, setF] = useState("D");
  const [m, setM] = useState("d");
  const geno = [f, m].sort((a, b) => (a === a.toUpperCase() ? -1 : 1) - (b === b.toUpperCase() ? -1 : 1)).join("");
  const dimples = geno.includes("D");
  const homo = f === m;
  return (
    <Slide id="lab3d" kicker="مختبر ثلاثي الأبعاد" title="الكروموسومات والجينات المتقابلة">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="h-[380px] overflow-hidden rounded-3xl bg-gradient-to-b from-ink-700 to-ink-900 ring-1 ring-white/10 lg:col-span-3 lg:h-[460px]">
          <Chromosomes3D fatherAllele={f} motherAllele={m} onToggleFather={() => { setF((x) => (x === "D" ? "d" : "D")); sfx.pop(); }} onToggleMother={() => { setM((x) => (x === "D" ? "d" : "D")); sfx.pop(); }} />
        </div>
        <div className="flex flex-col justify-center gap-4 lg:col-span-2">
          <p className="leading-8 text-white/80">اسحبي لتدوير النموذج، واستعملي عجلة الفأرة أو إصبعين للتكبير. اضغطي على الحرف فوق كل كروموسوم لتغيير الجين.</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-ghost" onClick={() => { setF((x) => (x === "D" ? "d" : "D")); sfx.pop(); }}>جين الأب: <G className="text-accent">{f}</G></button>
            <button className="btn-ghost" onClick={() => { setM((x) => (x === "D" ? "d" : "D")); sfx.pop(); }}>جين الأم: <G className="text-accent">{m}</G></button>
          </div>
          <div className="card-cream p-5">
            <p className="text-sm text-navy/60">الطراز الجيني</p>
            <p className="text-5xl font-bold text-brand-deep"><G>{geno}</G></p>
            <p className="mt-3 text-sm text-navy/60">الطراز الشكلي</p>
            <p className="text-2xl font-bold">{dimples ? "لديه غمّازات 😊" : "ليس لديه غمّازات"}</p>
            <p className="mt-3 rounded-xl bg-navy/5 p-3 leading-7">{homo ? "متماثل الجينات (نقي): جينان متشابهان" : "غير متماثل الجينات (هجين): جينان مختلفان"}</p>
          </div>
        </div>
      </div>
    </Slide>
  );
}

export default function Part2Heredity() {
  return (
    <div className="grid gap-8">
      <PartHeader n="02" title="الوراثة والجينات المتقابلة" lead="من أين جاءت غمّازاتك؟" />
      <Slide id="heredity" kicker="الصفات الوراثية" title="الوراثة وعلم الوراثة">
        <div className="grid items-center gap-6 lg:grid-cols-5">
          <div className="grid gap-4 lg:col-span-3">
            <div className="card-cream p-5 text-lg leading-9"><b className="text-brand-deep">الوراثة:</b> انتقال الصفات الوراثية من الآباء إلى الأبناء؛ مثل لون العيون وشكل الأنف.</div>
            {[
              "تتحكم الجينات المحمولة على الكروموسومات في شكل المخلوق ووظائفه",
              "الجينات المتقابلة (الأليل): زوج الجينات المسؤول عن صفة محددة",
              "علم الوراثة: دراسة كيفية انتقال الصفات وتفاعل الجينات المتقابلة",
            ].map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 * i }}
                className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-lg"><span className="h-3 w-3 shrink-0 rounded-full bg-accent" />{t}</motion.div>
            ))}
            <div className="rounded-2xl bg-accent-warm p-4 text-center text-xl font-bold">لكل صفة جينان: واحد من الأب وواحد من الأم.</div>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-white lg:col-span-2">
            <Image src="/lessons/genetics/family.jpg" alt="الشبه بين أجيال العائلة" width={1367} height={980} className="h-auto w-full" />
            <figcaption className="bg-cream p-3 text-center text-navy">الشبه بين أجيال العائلة</figcaption>
          </figure>
        </div>
      </Slide>
      <ChromosomeLab />
      <MeiosisSim />
      <ThinkCard question="ماذا يحدث للجينات المتقابلة أثناء الانقسام المنصّف؟" answer="تنفصل بعضها عن بعض مع انفصال الكروموسومات، فتحصل كل خلية جنسية على جين واحد فقط من الزوج." />
    </div>
  );
}
