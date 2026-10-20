"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { G, RevealBox, Slide, PartHeader } from "./ui";
import { sfx } from "@/lib/sound";
import { IconCheck, IconX } from "@/components/ui/Icons";

const RULES = [
  { t: "أرفع يدي قبل الإجابة", e: "✋" },
  { t: "أُنصت لزميلتي حتى تُنهي", e: "👂" },
  { t: "أتعاون مع مجموعتي بهدوء", e: "🤝" },
  { t: "لا يوجد سؤال سخيف.. أسأل بثقة", e: "💡" },
  { t: "ألتزم بوقت كل نشاط", e: "⏱️" },
  { t: "أنافس بروح رياضية", e: "⭐" },
];

const OBJECTIVES = [
  "تفسّر كيف تُورَث الصفات من الآباء إلى الأبناء",
  "تتعرّف دور العالم مندل في علم الوراثة",
  "تميّز بين الجين السائد والجين المتنحي",
  "تستعمل مربع بانيت لتوقّع نتائج التزاوج",
  "تميّز بين الطرز الجينية والطرز الشكلية",
  "تفرّق بين الجينات المتماثلة وغير المتماثلة",
];

const VOCAB: { term: string; def: string; review?: boolean }[] = [
  { term: "الانقسام المنصّف", def: "ينتج أربع خلايا أحادية المجموعة الكروموسومية من خلية ثنائية.", review: true },
  { term: "الوراثة", def: "انتقال الصفات الوراثية من الآباء إلى الأبناء." },
  { term: "علم الوراثة", def: "دراسة انتقال الصفات الوراثية وتفاعل الجينات." },
  { term: "الجينات المتقابلة (الأليل)", def: "زوج الجينات المسؤول عن صفة محددة." },
  { term: "العامل السائد", def: "الجين الذي يُخفي تأثير الجين الآخر ويظهر." },
  { term: "العامل المتنحي", def: "الجين الذي يختفي تأثيره بوجود السائد." },
  { term: "مربع بانيت", def: "أداة لتوقّع نتائج التزاوج المحتملة." },
  { term: "الطرز الجينية", def: "الجينات التي يحملها المخلوق (بالحروف: Tt)." },
  { term: "الطرز الشكلية", def: "الصفات المظهرية الناتجة عن الطرز الجينية." },
];

const PRE: { s: string; a: boolean }[] = [
  { s: "يرث الابن من كل أب جينًا واحدًا لكل صفة وراثية.", a: true },
  { s: "الصفة التي لا تظهر في الأبوين لا يمكن أن تظهر في الأبناء.", a: false },
  { s: "أجرى مندل تجاربه الشهيرة على نبات البازلاء.", a: true },
  { s: "يُرمز للجين السائد بحرف صغير وللمتنحي بحرف كبير.", a: false },
  { s: "يمكن توقّع صفات الأبناء باستعمال الاحتمالات.", a: true },
];

function FlipCard({ term, def, review }: { term: string; def: string; review?: boolean }) {
  const [f, setF] = useState(false);
  return (
    <button onClick={() => { setF((v) => !v); sfx.pop(); }} className="group h-40 [perspective:1000px]" aria-label={`${term}: اضغطي لإظهار التعريف`}>
      <motion.div animate={{ rotateY: f ? 180 : 0 }} transition={{ duration: 0.55 }} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep p-4 text-center [backface-visibility:hidden]">
          {review && <span className="mb-2 rounded-full bg-white/15 px-2.5 py-0.5 text-xs">مراجعة</span>}
          <span className="text-xl font-bold">{term}</span>
          <span className="mt-2 text-xs text-white/60">خمّني المعنى ثم اضغطي</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cream p-4 text-center text-lg leading-8 text-navy [backface-visibility:hidden] [transform:rotateY(180deg)]">{def}</div>
      </motion.div>
    </button>
  );
}

function PreAssessment() {
  const [ans, setAns] = useState<(boolean | null)[]>(PRE.map(() => null));
  const score = ans.filter((a, i) => a === PRE[i].a).length;
  const done = ans.every((a) => a !== null);
  return (
    <Slide id="pre" kicker="ماذا أعرف؟" title="تقويم قبلي: صح أم خطأ؟" note="اطلبي من الطالبات الإجابة قبل الشرح، وسنعود لهذه العبارات في نهاية الدرس.">
      <ol className="grid gap-3">
        {PRE.map((p, i) => {
          const a = ans[i];
          const ok = a !== null && a === p.a;
          return (
            <li key={i} className={`flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center ${a === null ? "bg-white/5" : ok ? "bg-brand/25 ring-1 ring-brand" : "bg-rose/20 ring-1 ring-rose"}`}>
              <span className="flex-1 text-lg leading-8"><b className="text-accent">{i + 1}. </b>{p.s}</span>
              <div className="flex items-center gap-2">
                {[true, false].map((v) => (
                  <button key={String(v)} disabled={a !== null}
                    onClick={() => { const n = [...ans]; n[i] = v; setAns(n); (v === p.a ? sfx.correct : sfx.wrong)(); }}
                    className={`rounded-full px-4 py-2 font-bold transition ${a === v ? (ok ? "bg-brand text-white" : "bg-rose text-white") : "bg-white/10 hover:bg-white/20"} disabled:cursor-default`}>
                    {v ? "✔ صح" : "✘ خطأ"}
                  </button>
                ))}
                {a !== null && (ok ? <IconCheck className="h-6 w-6 text-accent" /> : <span className="flex items-center gap-1 text-sm text-rose"><IconX className="h-5 w-5" /> الصحيح: {p.a ? "صح" : "خطأ"}</span>)}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {done && <span className="rounded-full bg-accent px-4 py-2 font-bold text-navy">نتيجتكِ: {score} / {PRE.length}</span>}
        <button className="btn-ghost" onClick={() => setAns(PRE.map(() => null))}>إعادة المحاولة</button>
      </div>
    </Slide>
  );
}

export default function Part1Intro() {
  const [facts, setFacts] = useState(false);
  return (
    <div className="grid gap-8">
      <PartHeader n="01" title="التهيئة والتقويم القبلي" lead="قوانين صفّنا، وأهداف الدرس، ومفرداته، ولغز يفتح باب الدرس." />

      <Slide id="rules" kicker="الدرس الثاني" title="قوانين صفّنا العلمي" note="اقرئي القوانين مع الطالبات واطلبي من إحداهن اختيار القانون الأهم اليوم. الالتزام بالقوانين يمنح المجموعة نقطة إضافية في المسابقة.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map((r, i) => (
            <motion.div key={r.t} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/20 text-3xl">{r.e}</span>
              <span className="text-lg font-bold">{r.t}</span>
            </motion.div>
          ))}
        </div>
      </Slide>

      <Slide id="objectives" kicker="في هذا الدرس" title="أهداف الدرس" note="الأهداف من «في هذا الدرس» بالكتاب. استعرضيها في البداية وارجعي إليها في الختام.">
        <ol className="grid gap-3 md:grid-cols-2">
          {OBJECTIVES.map((o, i) => (
            <li key={o} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold">{i + 1}</span>
              <span className="text-lg leading-8">{o}</span>
            </li>
          ))}
        </ol>
      </Slide>

      <Slide id="vocab" kicker="المفردات" title="مفردات الدرس" note="اطلبي من الطالبات تخمين معنى كل مفردة قبل الضغط لإظهار تعريفها.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VOCAB.map((v) => <FlipCard key={v.term} {...v} />)}
        </div>
      </Slide>

      <Slide id="hook" kicker="ربط وتهيئة" title="صفة تختفي.. ثم تعود!" note="اسألي: هل تشبهين أمك أم جدتك؟ استمعي لتوقعات الطالبات، ثم اكشفي الحقائق. سنعود لهذا اللغز في مخطط السلالة.">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xl leading-10 sm:text-2xl">أبوان لا يظهر عليهما لون عيون معيّن، فيُولد لهما طفل يشبه <b className="text-accent">جدّه</b> في لون عينيه! كيف «قفزت» الصفة فوق جيل كامل؟</p>
            <button className="btn-primary mt-6" onClick={() => { setFacts(true); sfx.reveal(); }}>▶ اكشفي الحقائق</button>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-white">
            <Image src="/lessons/genetics/family.jpg" alt="ثلاثة أجيال في عائلة واحدة" width={1367} height={980} className="h-auto w-full" />
            <figcaption className="bg-cream p-3 text-center text-navy">ثلاثة أجيال في عائلة واحدة: لاحظي الشبه</figcaption>
          </figure>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["سرّها في البازلاء", "اكتشف مندل القاعدة بتجارب على نبات البازلاء"],
            ["صفة «مختبئة»", "الجين المتنحي يختفي في جيل ويعود في جيل لاحق"],
            ["قبل اكتشاف DNA", "فسّرها مندل دون أن يعرف الكروموسومات أو الجينات"],
          ].map(([h, t], i) => (
            <motion.div key={h} initial={false} animate={facts ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 10 }} transition={{ delay: facts ? i * 0.25 : 0 }}
              className="rounded-2xl bg-cream p-5 text-navy">
              <h4 className="text-xl font-bold text-brand-deep">{h}</h4>
              <p className="mt-2 leading-7">{facts ? t : "؟"}</p>
            </motion.div>
          ))}
        </div>
      </Slide>

      <PreAssessment />

      <Slide kicker="ابدئي هنا" title="سؤال الدرس">
        <p className="text-2xl leading-10">كيف تنتقل الصفات من الآباء إلى الأبناء؟</p>
        <RevealBox label="ما توقّعكِ؟" className="mt-4">
          <p className="rounded-2xl bg-brand/20 p-4 text-lg leading-8">سنكتشف معًا أن لكل صفة <b>جينين</b>: واحد من الأب وواحد من الأم، وأن أحدهما قد يكون <b>سائدًا</b> يُخفي الآخر <b>المتنحي</b> — كما في <G>Tt</G>.</p>
        </RevealBox>
      </Slide>
    </div>
  );
}
