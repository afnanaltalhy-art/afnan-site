"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, Slide } from "./ui";
import PunnettLab from "@/components/labs/PunnettLab";
import { sfx } from "@/lib/sound";

const STEPS = [
  { h: "الحروف", t: "حرف كبير للجين السائد، وحرف صغير للمتنحي." },
  { h: "الصف العلوي", t: "اكتبي جينَي الأب الأول في الصف العلوي: حرف في كل مربع." },
  { h: "العمود الجانبي", t: "اكتبي جينَي الأب الثاني في العمود الجانبي." },
  { h: "املئي المربعات", t: "كل مربع يأخذ حرفًا من كل أب؛ فتظهر الطرز الجينية المحتملة للأبناء." },
];

function CatsExample() {
  const [n, setN] = useState(0);
  const steps = [
    <>المعطيات: الجين السائد (أسود) <G>B</G>، والمتنحي (أشقر) <G>b</G></>,
    <>طريقة الحل: أكملي مربع بانيت ⟵ 4 نواتج محتملة (أعلى: القط <G>Bb</G> • جانب: القطة <G>bb</G>)</>,
    <>الطرز الجينية: 2 <G>Bb</G> و 2 <G>bb</G></>,
    <>النسبة = عدد مرات الأسود ÷ المجموع = 2 ÷ 4 = ½</>,
    <>التحقق: نصف الأربعة = 2 وهو عدد القطط السوداء ✔</>,
  ];
  return (
    <Slide id="cats" kicker="حل التمارين" title="حل تمرين: لون شعر القطط (تطبيق الرياضيات)" note="مثال «تطبيق الرياضيات» من الكتاب. كل نقرة تكشف خطوة، ثم مربعات بانيت، ثم الإجابة، ثم المسائل التدريبية.">
      <p className="mb-5 text-xl leading-9">تزاوج قط لون شعره أسود غير متماثل الجينات (<G>Bb</G>) وقطة شعرها أشقر (<G>bb</G>). ما احتمال ولادة قط شعره أسود؟</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <ol className="grid gap-3">
          {steps.map((s, i) => (
            <motion.li key={i} animate={i < n ? { opacity: 1, x: 0 } : { opacity: 0.15, x: 10 }} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 text-lg leading-8">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-bold">{i + 1}</span><span>{i < n ? s : "…"}</span>
            </motion.li>
          ))}
        </ol>
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-[60px_100px_100px] grid-rows-[60px_100px_100px] text-center">
            <span />
            {["B", "b"].map((x) => <span key={x} className="ltr grid place-items-center text-4xl font-bold text-[#FFD27A]">{x}</span>)}
            {["b", "b"].map((side, r) => (
              <Row key={r} side={side}>
                {["Bb", "bb"].map((g, c) => (
                  <motion.div key={c} animate={n >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }} transition={{ delay: (r * 2 + c) * 0.15 }}
                    className={`grid place-items-center border-2 border-white/70 ${g === "Bb" ? "bg-[#2B2B33]" : "bg-[#E3B65A] text-navy"}`}>
                    <span className="ltr text-3xl font-bold">{g}</span><span className="text-sm">{g === "Bb" ? "أسود" : "أشقر"}</span>
                  </motion.div>
                ))}
              </Row>
            ))}
          </div>
          <AnimatePresence>{n >= 5 && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-accent px-6 py-3 text-2xl font-bold text-navy">الإجابة: ½ = 50%</motion.p>}</AnimatePresence>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <button className="btn-primary" disabled={n >= 5} onClick={() => { setN(n + 1); sfx.reveal(); }}>الخطوة التالية</button>
        <button className="btn-ghost" onClick={() => setN(0)}>إعادة</button>
      </div>
      <div className="mt-6 rounded-2xl bg-accent-warm/20 p-4 text-lg leading-8 ring-1 ring-accent-warm/50">
        <b>تدرّبي:</b> <G>Yy × Yy</G> (الأصفر سائد).. احتمال البذور الصفراء = ؟
        <details className="mt-2"><summary className="cursor-pointer font-bold text-accent">اكشفي الحل</summary>¾ = 75% واحتمال <G>yy</G> = ¼ = 25%</details>
      </div>
    </Slide>
  );
}
function Row({ side, children }: { side: string; children: React.ReactNode }) {
  return (<><span className="ltr grid place-items-center text-4xl font-bold text-[#BDB0FF]">{side}</span>{children}</>);
}

export default function Part6Punnett() {
  return (
    <div className="grid gap-8">
      <PartHeader n="06" title="مربع بانيت" lead="التنبؤ بالصفات: الحروف تجد مكانها" />
      <Slide id="steps" kicker="الدرس الثاني" title="خطوات رسم مربع بانيت">
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li key={s.h} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="card-cream p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-xl font-bold text-white">{i + 1}</span>
              <h4 className="mt-3 text-xl font-bold text-brand-deep">{s.h}</h4>
              <p className="mt-2 leading-7">{s.t}</p>
            </motion.li>
          ))}
        </ol>
      </Slide>
      <Slide id="punnett" kicker="محاكاة تفاعلية" title="مربع بانيت التفاعلي: الحروف تجد مكانها"
        note="ابدئي بمثال الكتاب: تزاوج نباتين هجينين Gg × Gg (مثل الجيل الأول عند مندل). ثم غيّري الصفة والأليلات، وجرّبي وضع «توقّعي أولًا» لتكتشف الطالبات الإجابة بالتدريج.">
        <PunnettLab />
      </Slide>
      <CatsExample />
      <Slide id="principles" kicker="جدول 2" title="مبادئ علم الوراثة">
        <p className="mb-5 text-lg leading-8 text-white/80">رغم أن مندل لم يعرف DNA ولا الجينات ولا الكروموسومات، فسّر انتقال الصفات ومثّلها رياضيًا:</p>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            "تتحكم الجينات المتقابلة المحمولة على الكروموسومات في الصفات الوراثية.",
            "يكون تأثير الجينات المتقابلة سائدًا أو متنحيًا.",
            "في الانقسام المنصّف تنفصل الجينات المتقابلة، فيذهب واحد منها لكل خلية جنسية.",
          ].map((p, i) => (
            <motion.div key={p} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="card-cream p-6">
              <span className={`grid h-14 w-14 place-items-center rounded-full text-2xl font-bold text-white ${["bg-brand", "bg-accent-warm", "bg-violet"][i]}`}>{i + 1}</span>
              <h4 className="mt-3 text-xl font-bold text-accent-warm">المبدأ {["الأول", "الثاني", "الثالث"][i]}</h4>
              <p className="mt-2 text-lg leading-8">{p}</p>
            </motion.div>
          ))}
        </div>
      </Slide>
    </div>
  );
}
