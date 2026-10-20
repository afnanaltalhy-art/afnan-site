"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, Slide, StepButtons, ThinkCard } from "./ui";
import { sfx } from "@/lib/sound";

const STATIONS = [
  { k: "منذ طفولته", t: "أحبّ النبات في بستان والده" },
  { k: "عام 1857م", t: "بدأ تجاربه على البازلاء بطريقة علمية دقيقة" },
  { k: "8 سنوات", t: "درس آلاف نباتات البازلاء ثم قدّم نتائجه" },
  { k: "أول عالِم", t: "يتتبّع صفة واحدة عبر أجيال ويستعمل الاحتمالات" },
  { k: "عام 1900م", t: "ثلاثة علماء يصلون لنتائجه نفسها فيُلقّب مؤسس علم الوراثة" },
];

const TRAITS: { name: string; dom: string; rec: string; di?: string; ri?: string }[] = [
  { name: "شكل البذور", dom: "أملس", rec: "مجعّد", di: "seed-green-round", ri: "seed-wrinkled" },
  { name: "لون البذور", dom: "أصفر", rec: "أخضر", di: "seed-yellow", ri: "seed-green-round" },
  { name: "لون القرن", dom: "أخضر", rec: "أصفر", di: "pod-green", ri: "pod-yellow" },
  { name: "شكل القرن", dom: "منتفخ", rec: "مسطّح" },
  { name: "طول الساق", dom: "طويل", rec: "قصير" },
  { name: "موقع الأزهار", dom: "محوري", rec: "طرفي" },
  { name: "لون الأزهار", dom: "أرجواني", rec: "أبيض", di: "flower-purple", ri: "flower-white" },
];

function Timeline() {
  const [n, setN] = useState(0);
  return (
    <Slide id="mendel" kicker="انفوجرافيك" title="مندل مؤسس علم الوراثة" note="كل نقرة تكشف محطة من حياة مندل (العالم النمساوي). أُهملت تجاربه فترة طويلة حتى عام 1900م.">
      <div className="grid items-start gap-6 lg:grid-cols-4">
        <div className="relative lg:col-span-3">
          <div className="absolute bottom-0 right-6 top-0 w-1 rounded bg-white/10" />
          <motion.div className="absolute right-6 top-0 w-1 rounded bg-accent" animate={{ height: `${(n / STATIONS.length) * 100}%` }} />
          <ol className="grid gap-4">
            {STATIONS.map((s, i) => (
              <li key={s.k} className="relative pr-16">
                <span className={`absolute right-2 top-3 grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition ${i < n ? "bg-accent text-navy" : "bg-white/10"}`}>{i + 1}</span>
                <motion.div animate={i < n ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 12 }} className="rounded-2xl bg-white/5 p-4">
                  <b className="text-xl text-accent">{s.k}</b>
                  <p className="mt-1 text-lg">{i < n ? s.t : "؟"}</p>
                </motion.div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex gap-3">
            <button className="btn-primary" disabled={n >= STATIONS.length} onClick={() => { setN((v) => v + 1); sfx.reveal(); }}>اكشفي المحطة التالية</button>
            <button className="btn-ghost" onClick={() => setN(0)}>إعادة</button>
          </div>
        </div>
        <figure className="overflow-hidden rounded-3xl bg-white">
          <Image src="/lessons/genetics/pea-illustration.jpg" alt="نبات البازلاء" width={628} height={913} className="h-auto w-full" />
        </figure>
      </div>
      <AnimatePresence>
        {n >= STATIONS.length && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-accent-warm p-5 text-center text-lg font-bold leading-8">
            قبله كان العلماء يصفون ويدرسون عدة صفات معًا.. أما مندل فاختار صفة واحدة وعدّ النتائج
          </motion.p>
        )}
      </AnimatePresence>
    </Slide>
  );
}

function SevenTraits() {
  const [stage, setStage] = useState(0);
  return (
    <Slide id="traits" kicker="انفوجرافيك" title="الصفات السبع التي درسها مندل" note="من جدول 1 في الكتاب. اكشفي الصفات السائدة ثم المتنحية، واسألي: أي الشكلين تتوقعين أنه سيظهر أكثر؟">
      <div className="mb-5 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => { setStage(Math.max(stage, 1)); sfx.reveal(); }}>▶ الصفات السائدة</button>
        <button className="btn-brand" disabled={stage < 1} onClick={() => { setStage(2); sfx.reveal(); }}>② الصفات المتنحية</button>
        <button className="btn-ghost" onClick={() => setStage(0)}>إعادة</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-center">
          <thead>
            <tr className="text-white/70"><th className="p-2 text-right">الصفة</th><th className="p-2">الصفة السائدة</th><th className="p-2">الصفة المتنحية</th></tr>
          </thead>
          <tbody>
            {TRAITS.map((t) => (
              <tr key={t.name}>
                <td className="rounded-r-2xl bg-white/10 p-3 text-right font-bold">{t.name}</td>
                {(["dom", "rec"] as const).map((k, j) => {
                  const shown = stage > j;
                  const img = k === "dom" ? t.di : t.ri;
                  return (
                    <td key={k} className={`p-2 ${j === 1 ? "rounded-l-2xl" : ""} ${k === "dom" ? "bg-accent-warm/20" : "bg-violet/20"}`}>
                      <motion.div animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0.1, scale: 0.9 }} className="flex items-center justify-center gap-3">
                        {img && <span className="grid h-14 w-14 place-items-center rounded-xl bg-white p-1"><Image src={`/lessons/genetics/${img}.jpg`} alt="" width={56} height={56} className="h-12 w-12 object-contain" /></span>}
                        <span className="text-lg font-bold">{shown ? t[k] : "؟"}</span>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-lg text-accent">لكل صفة شكلان متضادان فقط</p>
    </Slide>
  );
}

function Pod({ g, delay = 0, glow = false }: { g: string; delay?: number; glow?: boolean }) {
  const yellow = g === "gg";
  return (
    <motion.div initial={{ opacity: 0, scale: 0.4, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 140 }} className="flex flex-col items-center gap-1.5">
      <span className={`grid h-24 w-20 place-items-center rounded-2xl bg-white p-1.5 ${glow ? "ring-4 ring-accent" : ""}`}>
        <Image src={`/lessons/genetics/${yellow ? "pod-yellow" : "pod-green"}.jpg`} alt={yellow ? "قرن أصفر" : "قرن أخضر"} width={80} height={96} className="h-20 w-auto object-contain" />
      </span>
      <G className={`text-xl ${glow ? "text-accent" : ""}`}>{g}</G>
    </motion.div>
  );
}

function CrossSim() {
  const [step, setStep] = useState(0);
  return (
    <Slide id="cross" kicker="محاكاة تفاعلية" title="تجربة مندل عبر ثلاثة أجيال"
      note="شكل 9 في الكتاب (لون القرن). ① تلقيح خلطي بين أبوين نقيين: أخضر × أصفر. ② جميع أفراد الجيل الأول خضراء (هجينة Gg) لأن الأخضر سائد. ③ زرع مندل بذور الجيل الأول فظهرت الصفتان بنسبة 3 خضراء : 1 صفراء؛ أي عادت الصفة المتنحية.">
      <p className="mb-4 text-white/80">تلقيح خلطي بين نبات قرونه خضراء ونبات قرونه صفراء</p>
      <StepButtons steps={["① التلقيح الخلطي", "② الجيل الأول", "③ الجيل الثاني"]} step={step} setStep={setStep} onReplay={() => setStep(0)} />
      <div className="mt-6 grid gap-4">
        {[
          { lab: "الآباء P (نقية)", show: step >= 1, note: "خضراء نقية GG × صفراء نقية gg", pods: ["GG", "×", "gg"] },
          { lab: "الجيل الأول F1", show: step >= 2, note: "جميعها خضراء Gg (هجينة).. أين اختفى الأصفر؟ الأخضر سائد أخفى الأصفر المتنحي", pods: ["Gg", "Gg", "Gg", "Gg"] },
          { lab: "الجيل الثاني F2", show: step >= 3, note: "عادت الصفة المتنحية! (3 خضراء : 1 صفراء)", pods: ["GG", "Gg", "Gg", "gg"] },
        ].map((row, ri) => (
          <div key={row.lab} className="flex flex-col gap-4 rounded-3xl bg-ink-800/60 p-4 sm:flex-row sm:items-center">
            <div className="w-full shrink-0 rounded-2xl bg-white/10 p-3 text-center font-bold text-accent sm:w-40">{row.lab}</div>
            <div className="flex min-h-[8rem] flex-1 flex-wrap items-center justify-center gap-4">
              {row.show && row.pods.map((p, i) => p === "×" ? <span key={i} className="text-4xl font-bold text-accent">×</span> : <Pod key={`${ri}-${i}`} g={p} delay={i * 0.18} glow={ri === 2 && p === "gg"} />)}
              {!row.show && <span className="text-white/30">…</span>}
            </div>
            {row.show && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center font-bold text-cream sm:w-64 sm:text-right">{row.note}</motion.p>}
          </div>
        ))}
      </div>
      {step >= 3 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mt-5 grid h-32 w-32 place-items-center rounded-full bg-accent text-center font-bold text-navy shadow-2xl"><span><G className="text-4xl">3 : 1</G><br />خضراء : صفراء</span></motion.div>}
    </Slide>
  );
}

export default function Part3Mendel() {
  return (
    <div className="grid gap-8">
      <PartHeader n="03" title="تجارب مندل ونبات البازلاء" lead="مؤسس علم الوراثة.. في حديقة" />
      <Timeline />
      <SevenTraits />
      <Slide id="pure" kicker="الوراثة في الحديقة" title="الصفة النقية والنبات الهجين" note="يزرع الفلاحون البذور النقية لأنهم يضمنون ظهور الصفة المرغوبة نفسها في كل جيل.">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { h: "الصفة النقية", g: "TT أو tt", d: "تظهر الصفة نفسها جيلًا بعد جيل.", ex: "مثال: نبات بازلاء طويل الساق ينتج دائمًا نباتات طويلة", c: "from-brand to-brand-deep" },
            { h: "النبات الهجين", g: "Tt", d: "حصل على جينين مختلفين للصفة من أبويه.", ex: "مثال: تلقيح نبات طويل نقي مع قصير نقي ينتج نباتات هجينة", c: "from-violet to-[#4b3399]" },
          ].map((c) => (
            <div key={c.h} className={`rounded-3xl bg-gradient-to-br ${c.c} p-6`}>
              <h4 className="text-2xl font-bold">{c.h}</h4>
              <p className="my-3 text-5xl font-bold text-accent"><G>{c.g}</G></p>
              <p className="text-lg">{c.d}</p>
              <p className="mt-3 rounded-2xl bg-black/20 p-3 leading-7">{c.ex}</p>
            </div>
          ))}
        </div>
      </Slide>
      <CrossSim />
      <ThinkCard question="لماذا يزرع الفلاحون البذور التي تحمل الصفة النقية؟" answer="لأن الصفة النقية تظهر نفسها جيلًا بعد جيل؛ فيضمنون الحصول على الصفة المرغوبة في المحصول." />
    </div>
  );
}
