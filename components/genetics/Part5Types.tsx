"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, RevealBox, Slide, ThinkCard } from "./ui";
import Plant from "./Plant";
import { sfx } from "@/lib/sound";

function Probability() {
  const [flipping, setFlipping] = useState(false);
  const [last, setLast] = useState<"صورة" | "كتابة" | null>(null);
  const [counts, setCounts] = useState({ h: 0, t: 0 });
  const [squares, setSquares] = useState(false);
  const total = counts.h + counts.t;
  const flip = (times = 1) => {
    setFlipping(true); sfx.pop();
    setTimeout(() => {
      let h = 0, t = 0, r: "صورة" | "كتابة" = "صورة";
      for (let i = 0; i < times; i++) { r = Math.random() < 0.5 ? "صورة" : "كتابة"; if (r === "صورة") h++; else t++; }
      setCounts((c) => ({ h: c.h + h, t: c.t + t })); setLast(r); setFlipping(false);
    }, times === 1 ? 900 : 400);
  };
  return (
    <Slide id="probability" kicker="محاكاة تفاعلية" title="دور الاحتمالات في توقّع الصفات"
      note="① تدور قطعة النقد ثم يظهر الاحتمالان: صورة 50% وكتابة 50%. ② كل مربع من مربعات بانيت الأربعة يمثل احتمال 25%. درس مندل آلاف النباتات لكل صفة، فكانت نتائجه دقيقة.">
      <p className="mb-5 rounded-2xl bg-white/5 p-4 text-lg"><b className="text-accent">الاحتمالات:</b> فرع من الرياضيات يساعد على توقّع فرصة حدوث شيء ما.</p>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center gap-5">
          <motion.div animate={flipping ? { rotateY: [0, 900], y: [0, -60, 0] } : { rotateY: 0 }} transition={{ duration: 0.9 }}
            className="grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br from-[#FFE08A] to-[#C99A0C] text-2xl font-bold text-navy shadow-2xl ring-8 ring-accent/30">
            {flipping ? "?" : last ?? "؟"}
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-primary" disabled={flipping} onClick={() => flip(1)}>▶ ارمي القطعة</button>
            <button className="btn-ghost" disabled={flipping} onClick={() => flip(100)}>ارمي 100 مرة</button>
            <button className="btn-ghost" onClick={() => { setCounts({ h: 0, t: 0 }); setLast(null); }}>تصفير</button>
          </div>
          <p className="text-white/70">للقطعة وجهان ⟵ احتمالان متساويان</p>
        </div>
        <div className="grid gap-4">
          {[["صورة", counts.h], ["كتابة", counts.t]].map(([k, v]) => (
            <div key={k as string}>
              <div className="mb-1 flex justify-between font-bold"><span>{k} — النظري ½ = 50%</span><span className="ltr">{v as number} {total ? `(${Math.round(((v as number) / total) * 100)}%)` : ""}</span></div>
              <div className="h-4 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-accent" animate={{ width: total ? `${((v as number) / total) * 100}%` : "0%" }} /></div>
            </div>
          ))}
          <p className="text-sm text-white/60">كلما زاد عدد الرميات اقتربت النتيجة من 50% — لهذا درس مندل آلاف النباتات.</p>
          <button className="btn-brand" onClick={() => { setSquares(true); sfx.reveal(); }}>② مربع بانيت</button>
          <AnimatePresence>
            {squares && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto grid w-56 grid-cols-2 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }} className="grid h-24 place-items-center rounded-xl bg-cream text-lg font-bold text-navy">¼ = 25%</motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {squares && <p className="text-center">في مربع بانيت أربعة مربعات.. فكل مربع يمثل ¼ = 25%</p>}
        </div>
      </div>
    </Slide>
  );
}

function GenoPheno() {
  const rows = [
    { g: "TT", p: "طويل", d: "متماثل الجينات (نقي): جينان سائدان متشابهان", tall: true },
    { g: "Tt", p: "طويل", d: "غير متماثل الجينات (هجين): السائد أخفى المتنحي", tall: true },
    { g: "tt", p: "قصير", d: "متماثل الجينات (نقي): جينان متنحيان فتظهر الصفة المتنحية", tall: false },
  ];
  return (
    <Slide id="genopheno" kicker="انفوجرافيك" title="الطرز الجينية والطرز الشكلية" note="الطرز الجينية: الجينات (الحروف). الطرز الشكلية: الصفة الظاهرة. لاحظي أن TT وTt لهما الشكل نفسه (طويل) رغم اختلاف الحروف.">
      <div className="grid gap-5 md:grid-cols-3">
        {rows.map((r, i) => (
          <motion.div key={r.g} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="card-cream flex flex-col items-center p-5 text-center">
            <div className="flex h-[230px] items-end"><Plant tall={r.tall} height={220} /></div>
            <span className="text-sm text-navy/50">الطراز الجيني (الحروف)</span>
            <G className={`text-6xl ${r.tall ? "text-brand-deep" : "text-violet"}`}>{r.g}</G>
            <span className="mt-2 text-sm text-navy/50">الطراز الشكلي (المظهر)</span>
            <span className="text-2xl font-bold">{r.p}</span>
            <p className="mt-2 leading-7 text-navy/75">{r.d}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 rounded-2xl bg-accent-warm p-4 text-center text-lg font-bold"><G>T</G> حرف كبير = جين سائد (طول الساق) • <G>t</G> حرف صغير = جين متنحٍ (قصر الساق)</p>
    </Slide>
  );
}

export default function Part5Types() {
  return (
    <div className="grid gap-8">
      <PartHeader n="05" title="الطرز الجينية والطرز الشكلية" lead="الاحتمالات تكشف المستقبل" />
      <Probability />
      <GenoPheno />
      <Slide id="phenotype" kicker="مربع بانيت" title="الطرز الشكلية: ما نراه بأعيننا">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="grid gap-4">
            <div className="card-cream p-5 text-lg leading-8"><b className="text-brand-deep">الطرز الشكلية:</b> الصفات المظهرية والسلوك الناتجة عن الطرز الجينية.</div>
            <div className="rounded-2xl bg-white/5 p-4 text-lg"><b className="text-accent">مثال: </b>اللون الأحمر لأزهار نبات فم السمكة</div>
            <div className="rounded-2xl bg-white/5 p-4 text-lg"><b className="text-accent">سؤال الكتاب: </b>هل يمكنك تحديد الطراز الجيني من اللون فقط؟</div>
            <RevealBox><p className="rounded-2xl bg-brand/25 p-4 text-lg leading-8">ليس دائمًا؛ فالصفة السائدة قد تكون متماثلة أو غير متماثلة.</p></RevealBox>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-white">
            <Image src="/lessons/genetics/snapdragon.jpg" alt="نبات فم السمكة بأزهار حمراء" width={746} height={1142} className="mx-auto h-[380px] w-auto object-cover" />
            <figcaption className="bg-cream p-3 text-center text-navy">نبات فم السمكة: طرازه الشكلي للون الأزهار هو الأحمر</figcaption>
          </figure>
        </div>
      </Slide>
      <ThinkCard question="ما الفرق بين المخلوق المتماثل الجينات والمخلوق غير المتماثل الجينات؟" answer={<>المتماثل له جينان متقابلان متشابهان (<G>TT</G> أو <G>tt</G>)، وغير المتماثل له جينان مختلفان (<G>Tt</G>).</>} />
    </div>
  );
}
