"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { G, PartHeader, RevealBox, Slide, Countdown } from "./ui";
import { GENETICS_QUIZ } from "@/lib/builtin";
import { sfx } from "@/lib/sound";
import { IconStar, IconTrophy } from "@/components/ui/Icons";

const NAFS = GENETICS_QUIZ.questions.slice(7, 11);
const STAR_QS = GENETICS_QUIZ.questions.slice(0, 7);
const LETTERS = ["أ", "ب", "ج", "د"];

function Nafs() {
  return (
    <Slide id="nafs" kicker="تدريبات نافس" title="تدريبات نافس" note="سؤال بنمط اختبارات نافس: أعطي الطالبات 40 ثانية، ثم أظهري الإطار الأخضر حول الإجابة الصحيحة.">
      <div className="grid gap-5 lg:grid-cols-2">{NAFS.map((q, i) => <NafsQ key={i} n={i + 1} q={q} />)}</div>
    </Slide>
  );
}
function NafsQ({ n, q }: { n: number; q: (typeof NAFS)[number] }) {
  const [pick, setPick] = useState<number | null>(null);
  const [run, setRun] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <p className="text-lg font-bold leading-8">{n}) {q.q}</p>
      <div className="my-3">{run && !show && <Countdown seconds={40} running={run} onDone={() => setShow(true)} />}</div>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((o, i) => {
          const correct = i === q.answer;
          const state = show ? (correct ? "ring-4 ring-[#3BD16F] bg-[#3BD16F]/20" : pick === i ? "bg-rose/30" : "bg-white/5") : pick === i ? "bg-accent text-navy" : "bg-white/10 hover:bg-white/15";
          return <button key={i} onClick={() => { if (!show) { setPick(i); sfx.pop(); } }} className={`rounded-2xl p-3 text-right font-bold transition ${state}`}>{LETTERS[i]}) {o}</button>;
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {!run && !show && <button className="btn-ghost !py-2 text-sm" onClick={() => setRun(true)}>⏳ 40 ثانية</button>}
        {!show ? <button className="btn-primary !py-2 text-sm" onClick={() => { setShow(true); (pick === q.answer ? sfx.correct : sfx.reveal)(); }}>أظهري الإجابة</button>
          : <button className="btn-ghost !py-2 text-sm" onClick={() => { setShow(false); setPick(null); setRun(false); }}>إعادة</button>}
        {show && pick !== null && <span className={`self-center font-bold ${pick === q.answer ? "text-[#3BD16F]" : "text-rose"}`}>{pick === q.answer ? "✔ إجابة صحيحة" : "✘ حاولي مرة أخرى"}</span>}
      </div>
    </div>
  );
}

const DEFAULT_NAMES = ["الطالبة 1", "الطالبة 2", "الطالبة 3", "الطالبة 4", "الطالبة 5", "الطالبة 6", "الطالبة 7"];
function useStoredNames(key: string, def: string[]) {
  const [names, setNames] = useState(def);
  useEffect(() => { try { const v = localStorage.getItem(key); if (v) setNames(JSON.parse(v)); } catch {} }, [key]);
  const save = (n: string[]) => { setNames(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {} };
  return [names, save] as const;
}

function StarBoard() {
  const [names, setNames] = useStoredNames("afnan.stars.names", DEFAULT_NAMES);
  const [stars, setStars] = useState<number[]>(DEFAULT_NAMES.map(() => 0));
  const [open, setOpen] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [edit, setEdit] = useState(false);
  const q = open !== null ? STAR_QS[open] : null;
  const answer = (i: number) => {
    if (open === null || pick !== null) return;
    setPick(i);
    if (i === STAR_QS[open].answer) {
      sfx.correct(); const s = [...stars]; s[open] += 1; setStars(s);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#E7B416", "#14917F", "#F08A24"] });
    } else sfx.wrong();
  };
  return (
    <Slide id="stars" kicker="المسابقة" title="مسابقة نجمات العلوم 👑" note="اضغطي على بطاقة الطالبة لعرض سؤالها. الإجابة الصحيحة = نجمة في لوحة النجوم. إذا أخطأت يمكن تحويل السؤال لزميلة بنصف النقاط. أسماء الطالبات تُحفظ على هذا الجهاز فقط.">
      <p className="mb-4 text-white/80">الجولة الثالثة (الموسم الثاني): علم الوراثة • كل طالبة تختار بطاقتها وتجيب عن سؤالها، والإجابة الصحيحة = نجمة في لوحة النجوم ⭐</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="btn-ghost !py-2 text-sm" onClick={() => setEdit(!edit)}>{edit ? "حفظ الأسماء" : "تعديل أسماء الطالبات"}</button>
        <button className="btn-ghost !py-2 text-sm" onClick={() => setStars(DEFAULT_NAMES.map(() => 0))}>تصفير النجوم</button>
        <Link href="/games/genetics-stars" className="btn-primary !py-2 text-sm"><IconTrophy className="h-4 w-4" /> مسابقة المجموعات الكاملة</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {names.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-b from-violet/60 to-brand-deep p-4 text-center ring-1 ring-white/15">
            {edit ? <input aria-label={`اسم الطالبة ${i + 1}`} className="input !px-2 !py-1 text-center text-sm" value={n} onChange={(e) => { const c = [...names]; c[i] = e.target.value; setNames(c); }} />
              : <button onClick={() => { setOpen(i); setPick(null); sfx.pop(); }} className="text-lg font-bold hover:text-accent">{n}</button>}
            <span className="text-xs text-white/60">10 نقاط</span>
            <span className="flex flex-wrap justify-center gap-0.5 text-accent">{Array.from({ length: Math.max(1, stars[i]) }).map((_, k) => <IconStar key={k} filled={stars[i] > 0} className="h-5 w-5" />)}</span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {q && open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-3xl bg-ink-800 p-6 ring-1 ring-white/15" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-accent">سؤال النجمة {names[open]} • 10 نقاط</p>
              <p className="mt-2 text-2xl font-bold leading-10">{q.q}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.options.map((o, i) => (
                  <button key={i} onClick={() => answer(i)} className={`rounded-2xl p-4 text-right text-lg font-bold transition ${pick === null ? "bg-white/10 hover:bg-white/20" : i === q.answer ? "bg-[#3BD16F] text-navy" : pick === i ? "bg-rose" : "bg-white/5 opacity-60"}`}>{LETTERS[i]}) {o}</button>
                ))}
              </div>
              {pick !== null && <p className={`mt-4 text-xl font-bold ${pick === q.answer ? "text-[#3BD16F]" : "text-rose"}`}>{pick === q.answer ? "✔ صحيح! لكِ نجمة في اللوحة 🌟" : "✘ إجابة غير صحيحة"}</p>}
              <button className="btn-ghost mt-5" onClick={() => setOpen(null)}>↩ العودة للوحة</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Slide>
  );
}

const REVIEW = [
  ["1. قارني بين الجينات المتقابلة السائدة والمتنحية.", "السائد يظهر ويخفي الآخر حتى لو وُجد جين واحد منه، والمتنحي لا يظهر إلا إذا اجتمع جينان متنحيان."],
  ["2. صفي كيف تُمثَّل الجينات السائدة والمتنحية في مربع بانيت.", "السائد بحرف كبير (T)، والمتنحي بالحرف نفسه صغيرًا (t)."],
  ["3. وضّحي الفرق بين الطرز الجينية والطرز الشكلية مع أمثلة.", "الجينية: الجينات بالحروف مثل Tt. الشكلية: الصفة الظاهرة مثل الساق الطويلة أو اللون الأحمر لزهرة فم السمكة."],
  ["4. لماذا لُقّب مندل بمؤسس علم الوراثة؟", "لأنه أول من تتبع صفة واحدة عبر أجيال واستعمل الاحتمالات، ووضعت نتائجه مبادئ علم الوراثة."],
  ["5. التفكير الناقد: إذا عرفتِ الطراز الشكلي لصفة متنحية، فهل تعرفين طرازها الجيني؟", "نعم؛ فالصفة المتنحية لا تظهر إلا متماثلة الجينات، مثل نبات قصير الساق = tt."],
  ["6. ذبابة طويلة الجناح غير نقية × قصيرة الجناح نقية. ما نسبة الأبناء قصار الجناح؟", "Ll × ll ⟵ 2 Ll : 2 ll، أي 50% قصيرة الجناح (النسبة 1 : 1)."],
];
const FINAL = [
  ["أبوان شعرهما أملس (سائد) أنجبا طفلًا شعره متعرج. كيف حدث ذلك؟", "كلاهما غير متماثل الجينات (Ss) يحمل جينًا متنحيًا، فورث الطفل الجينين المتنحيين (ss)."],
  ["ما احتمال ظهور نبات قصير (tt) من تزاوج Tt × Tt؟", "¼ = 25% (TT : Tt : tt = 1 : 2 : 1)."],
  ["ماذا يحدث للجينات المتقابلة في الانقسام المنصّف؟ ولماذا يهم ذلك؟", "تنفصل فتأخذ كل خلية جنسية جينًا واحدًا، فيحصل الابن على جين من كل أب."],
];
const SUMMARY = [
  ["الوراثة", "انتقال الصفات من الآباء إلى الأبناء بالجينات"],
  ["الجينات المتقابلة", "زوج لكل صفة: جين من الأب وجين من الأم"],
  ["مندل", "مؤسس علم الوراثة بتجارب البازلاء"],
  ["سائد ومتنحٍ", "السائد يظهر، والمتنحي يظهر في tt فقط"],
  ["الطرز", "الجينية = الحروف، الشكلية = المظهر"],
  ["مربع بانيت", "يتوقع نتائج التزاوج: Tt × Tt = 3 : 1"],
];
const BADGES = [["نجمة الدرس", "🌟"], ["قائدة الفريق", "🧭"], ["عالمة المستقبل", "🔬"], ["سريعة البديهة", "⚡"], ["مبدعة الصف", "🎨"], ["ذكية الصف", "🧠"]];

function Badges() {
  const [names, setNames] = useStoredNames("afnan.badges.names", BADGES.map(() => ""));
  return (
    <Slide id="badges" kicker="تكريم" title="أوسمة الدرس" note="اكتبي اسم الطالبة تحت كل وسام ثم اطبعي الصفحة، أو امنحي الأوسمة شفهيًا. الأسماء تُحفظ على هذا الجهاز فقط.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map(([b, e], i) => (
          <div key={b} className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-b from-[#FFE7A8] to-[#F2B83A] p-6 text-navy shadow-card">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white/70 text-4xl ring-4 ring-white">{e}</span>
            <span className="text-2xl font-bold">{b}</span>
            <input aria-label={`اسم الطالبة لوسام ${b}`} placeholder="الطالبة: ............" value={names[i]} onChange={(ev) => { const n = [...names]; n[i] = ev.target.value; setNames(n); }} className="w-full rounded-xl border border-navy/20 bg-white/70 px-3 py-2 text-center font-bold outline-none focus:ring-2 focus:ring-brand" />
          </div>
        ))}
      </div>
      <button className="btn-primary mt-5" onClick={() => window.print()}>طباعة الأوسمة</button>
    </Slide>
  );
}

export default function Part8Final() {
  return (
    <div className="grid gap-8">
      <PartHeader n="08" title="التقويم النهائي" lead="نافس، ونجمات العلوم، وحل التمارين، والخلاصة" />
      <Nafs />
      <StarBoard />
      <Slide id="review" kicker="حل التمارين" title="حل تمارين: مراجعة الدرس">
        <div className="grid gap-4 md:grid-cols-2">{REVIEW.map(([q, a]) => (<div key={q} className="rounded-3xl bg-white/5 p-5"><p className="mb-3 text-lg font-bold leading-8">{q}</p><RevealBox><p className="rounded-2xl bg-brand/25 p-4 leading-8">{a}</p></RevealBox></div>))}</div>
      </Slide>
      <Slide id="final" kicker="تقويم ختامي" title="التقويم الختامي">
        <div className="grid gap-4">{FINAL.map(([q, a], i) => (<div key={q} className="rounded-3xl bg-cream p-5 text-navy"><p className="mb-3 text-xl font-bold leading-9">{i + 1}. {q}</p><RevealBox className="[&_button.btn-primary]:!bg-navy [&_button.btn-primary]:!text-white"><p className="rounded-2xl bg-brand/15 p-4 text-lg leading-8">{a}</p></RevealBox></div>))}</div>
      </Slide>
      <Slide id="summary" kicker="الخلاصة" title="الخلاصة في انفوجرافيك">
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full mx-auto rounded-full bg-gradient-to-br from-accent to-accent-warm px-10 py-4 text-3xl font-bold text-navy shadow-2xl">علم الوراثة</div>
          {SUMMARY.map(([h, t], i) => (
            <motion.div key={h} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <h4 className="text-xl font-bold text-accent">{h}</h4><p className="mt-2 text-lg leading-8">{t}</p>
            </motion.div>
          ))}
        </div>
      </Slide>
      <Badges />
      <Slide id="closing" kicker="خِتامها مِسك 🌼" title="انتهى درس «علم الوراثة»">
        <p className="text-2xl">ونلتقي في الدرس القادم: <b className="text-accent">نماذج الذرة</b></p>
        <p className="mt-5 rounded-2xl bg-accent-warm/20 p-5 text-lg leading-8 ring-1 ring-accent-warm/50">📌 ارسمي مربع بانيت لتزاوج نباتين قرونهما منتفخة غير نقية، واحسبي نسب الأبناء (سؤال 18 ص143).</p>
        <RevealBox label="تحقّقي من الواجب" className="mt-4"><p className="rounded-2xl bg-brand/25 p-4 text-lg">مثال للحل: نرمز للقرن المنتفخ (سائد) بالحرف <G>I</G> وللمسطّح بالحرف <G>i</G>: <G>Ii × Ii</G> ⟵ <G>II : Ii : ii = 1 : 2 : 1</G>، أي 75% منتفخة و25% مسطّحة.</p></RevealBox>
      </Slide>
    </div>
  );
}
