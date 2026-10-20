"use client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import type { QuizCard } from "@/lib/types";
import { Countdown } from "@/components/genetics/ui";
import { isMuted, setMuted, sfx } from "@/lib/sound";
import { IconSound, IconTrophy, IconReplay } from "@/components/ui/Icons";

const COLORS = ["#14917F", "#F08A24", "#6D4FC2", "#2E78C7", "#E8618C", "#E7B416"];
const DEFAULT_GROUPS = ["مجموعة الجينات", "مجموعة البازلاء", "مجموعة الكروموسومات", "مجموعة مندل", "مجموعة DNA", "مجموعة الأليلات"];
const L = ["أ", "ب", "ج", "د", "هـ", "و"];

type Group = { name: string; color: string; score: number };

export default function Competition({ quiz }: { quiz: QuizCard }) {
  const [phase, setPhase] = useState<"setup" | "play" | "end">("setup");
  const [count, setCount] = useState(4);
  const [names, setNames] = useState(DEFAULT_GROUPS);
  const [seconds, setSeconds] = useState(quiz.secondsPerQuestion || 30);
  const [shuffle, setShuffle] = useState(false);
  const [mute, setMute] = useState(isMuted());
  const [groups, setGroups] = useState<Group[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [qi, setQi] = useState(0);
  const [turn, setTurn] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [stolen, setStolen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [log, setLog] = useState<string | null>(null);

  const q = quiz.questions[order[qi] ?? 0];
  const total = quiz.questions.length;

  const start = () => {
    const g = Array.from({ length: count }, (_, i) => ({ name: names[i] || `المجموعة ${i + 1}`, color: COLORS[i], score: 0 }));
    const o = quiz.questions.map((_, i) => i);
    if (shuffle) o.sort(() => Math.random() - 0.5);
    setGroups(g); setOrder(o); setQi(0); setTurn(0); setPick(null); setRevealed(false); setStolen(false); setLog(null);
    setPhase("play"); setTimerKey((k) => k + 1); sfx.reveal();
  };

  const award = (gi: number, pts: number) => setGroups((gs) => gs.map((g, i) => (i === gi ? { ...g, score: g.score + pts } : g)));

  const choose = (i: number) => {
    if (revealed || pick !== null) return;
    setPick(i);
    if (i === q.answer) {
      const pts = stolen ? 5 : 10;
      award(turn, pts); setRevealed(true); sfx.correct();
      setLog(`✔ ${groups[turn].name} +${pts}`);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: [groups[turn].color, "#E7B416"] });
    } else {
      sfx.wrong();
      setLog(`✘ ${groups[turn].name}: إجابة غير صحيحة`);
      if (!stolen && groups.length > 1) {
        setTimeout(() => { setStolen(true); setTurn((t) => (t + 1) % groups.length); setPick(null); setTimerKey((k) => k + 1); setLog("↪ تحويل السؤال للمجموعة التالية بنصف النقاط"); }, 1100);
      } else setRevealed(true);
    }
  };

  const timeUp = () => { if (!revealed) { setRevealed(true); setLog("⏰ انتهى الوقت"); } };

  const next = () => {
    if (qi + 1 >= total) { setPhase("end"); sfx.win(); setTimeout(() => { confetti({ particleCount: 220, spread: 120, origin: { y: 0.5 } }); confetti({ particleCount: 120, angle: 60, spread: 80, origin: { x: 0 } }); confetti({ particleCount: 120, angle: 120, spread: 80, origin: { x: 1 } }); }, 200); return; }
    setQi(qi + 1);
    setTurn((t) => (stolen ? t : (t + 1) % groups.length));
    setPick(null); setRevealed(false); setStolen(false); setLog(null); setTimerKey((k) => k + 1); sfx.pop();
  };

  const ranked = useMemo(() => groups.map((g, i) => ({ ...g, i })).sort((a, b) => b.score - a.score), [groups]);

  if (phase === "setup")
    return (
      <div className="glass mx-auto max-w-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold">{quiz.title}</h2>
        {quiz.description && <p className="mt-2 text-white/70">{quiz.description}</p>}
        <p className="mt-1 text-white/60">{total} سؤالًا</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <span className="label !text-white/80">عدد المجموعات</span>
            <div className="flex gap-2">{[2, 3, 4, 5, 6].map((n) => <button key={n} onClick={() => setCount(n)} className={`h-11 w-11 rounded-xl font-bold ${count === n ? "bg-accent text-navy" : "bg-white/10"}`}>{n}</button>)}</div>
          </div>
          <div>
            <label className="label !text-white/80" htmlFor="sec">الوقت لكل سؤال: {seconds} ثانية</label>
            <input id="sec" type="range" min={10} max={90} step={5} value={seconds} onChange={(e) => setSeconds(+e.target.value)} className="w-full accent-[rgb(var(--accent))]" />
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-8 w-8 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
              <input aria-label={`اسم المجموعة ${i + 1}`} className="input" value={names[i]} onChange={(e) => { const n = [...names]; n[i] = e.target.value; setNames(n); }} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--accent))]" /> ترتيب عشوائي للأسئلة</label>
          <button onClick={() => { setMuted(!mute); setMute(!mute); }} className="btn-ghost !py-2"><IconSound off={mute} /> {mute ? "الصوت مكتوم" : "المؤثرات الصوتية مفعّلة"}</button>
        </div>
        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-white/70">
          طريقة اللعب: تجيب المجموعات بالتناوب. الإجابة الصحيحة = 10 نقاط. إذا أخطأت المجموعة يتحوّل السؤال للمجموعة التالية بنصف النقاط (5). ينتهي الوقت ⟵ تظهر الإجابة.
        </div>
        <button className="btn-primary mt-6 w-full text-lg" onClick={start} disabled={total === 0}>ابدئي المسابقة 🚀</button>
      </div>
    );

  if (phase === "end") {
    const top = ranked[0];
    return (
      <div className="mx-auto max-w-3xl text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="glass p-8">
          <IconTrophy className="mx-auto h-20 w-20 text-accent" />
          <p className="mt-4 text-xl text-white/70">الفائزة بالمسابقة</p>
          <h2 className="mt-2 text-5xl font-bold" style={{ color: top?.color }}>{top?.name} 🎉</h2>
          <p className="ltr mt-2 text-3xl font-bold">{top?.score} نقطة</p>
          <div className="mt-8 flex items-end justify-center gap-3">
            {[1, 0, 2].filter((i) => ranked[i]).map((i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: [140, 190, 110][i] }} transition={{ delay: 0.3 + i * 0.2 }} className="flex w-28 flex-col justify-end rounded-t-2xl p-2 text-sm font-bold" style={{ background: ranked[i].color }}>
                <span>{ranked[i].name}</span><span className="ltr text-xl">{ranked[i].score}</span><span className="text-2xl">{["🥇", "🥈", "🥉"][i]}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <button className="btn-primary" onClick={start}><IconReplay /> العبي مرة أخرى</button>
            <button className="btn-ghost" onClick={() => setPhase("setup")}>إعدادات جديدة</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="glass p-5 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="chip">السؤال {qi + 1} من {total}</span>
          <span className="rounded-full px-4 py-1.5 font-bold" style={{ background: groups[turn]?.color }}>دور: {groups[turn]?.name}{stolen ? " (نصف النقاط)" : ""}</span>
        </div>
        <Countdown key={timerKey} seconds={seconds} running={!revealed} onDone={timeUp} />
        <AnimatePresence mode="wait">
          <motion.div key={qi} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
            <h2 className="mt-6 text-2xl font-bold leading-10 sm:text-4xl sm:leading-[1.5]">{q.q}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options.map((o, i) => {
                const st = revealed ? (i === q.answer ? "bg-[#3BD16F] text-navy ring-4 ring-[#3BD16F]/40" : pick === i ? "bg-rose" : "bg-white/5 opacity-60") : pick === i ? "bg-rose" : "bg-white/10 hover:bg-white/20";
                return <button key={i} onClick={() => choose(i)} className={`rounded-2xl p-4 text-right text-xl font-bold transition sm:p-5 ${st}`}>{L[i]}) {o}</button>;
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 min-h-[3rem]">
          {log && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold text-accent">{log}</motion.p>}
          {revealed && q.explain && <p className="mt-2 rounded-2xl bg-white/5 p-3 leading-7 text-white/80">💡 {q.explain}</p>}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {revealed ? <button className="btn-primary" onClick={next}>{qi + 1 >= total ? "النتيجة النهائية 🏆" : "السؤال التالي ←"}</button>
            : <button className="btn-ghost" onClick={() => { setRevealed(true); sfx.reveal(); }}>إظهار الإجابة</button>}
          <button className="btn-ghost" onClick={() => setPhase("setup")}>إنهاء</button>
        </div>
      </div>
      <aside className="glass h-fit p-5">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><IconTrophy className="text-accent" /> لوحة الترتيب</h3>
        <LayoutGroup>
          <ol className="grid gap-2">
            {ranked.map((g, r) => (
              <motion.li layout key={g.i} className={`flex items-center gap-3 rounded-2xl p-3 ${g.i === turn ? "ring-2 ring-white" : ""}`} style={{ background: `${g.color}cc` }}>
                <span className="text-lg font-bold">{r + 1}</span>
                <span className="flex-1 font-bold">{g.name}</span>
                <span className="ltr text-xl font-bold">{g.score}</span>
              </motion.li>
            ))}
          </ol>
        </LayoutGroup>
        <p className="mt-4 text-xs text-white/50">يمكن للمعلمة منح نقطة إضافية:</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{groups.map((g, i) => <button key={i} onClick={() => { award(i, 1); sfx.pop(); }} className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: g.color }}>+1 {g.name.split(" ").slice(-1)}</button>)}</div>
      </aside>
    </div>
  );
}
