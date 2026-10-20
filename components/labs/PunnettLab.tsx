"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TRAITS, cross, describeGenotype, genotypes, isCap, ratioText } from "@/lib/genetics";
import { sfx } from "@/lib/sound";
import { IconReplay } from "@/components/ui/Icons";

const CELL = 128;

export default function PunnettLab({ defaultTrait = "pod", defaultP1 = "Gg", defaultP2 = "Gg" }: { defaultTrait?: string; defaultP1?: string; defaultP2?: string }) {
  const [traitKey, setTraitKey] = useState(defaultTrait);
  const t = TRAITS.find((x) => x.key === traitKey) ?? TRAITS[0];
  const opts = genotypes(t);
  const conv = (g: string) => g.split("").map((ch) => (isCap(ch) ? t.D : t.r)).join("");
  const [p1, setP1] = useState(conv(defaultP1));
  const [p2, setP2] = useState(conv(defaultP2));
  const [stage, setStage] = useState(0); // 0 none, 1 split, 2 fill, 3 results
  const [mode, setMode] = useState<"auto" | "predict">("auto");
  const [guess, setGuess] = useState<(string | null)[]>([null, null, null, null]);
  const [checked, setChecked] = useState(false);
  const [run, setRun] = useState(0);
  const res = useMemo(() => cross(p1, p2), [p1, p2]);

  const reset = () => { setStage(0); setGuess([null, null, null, null]); setChecked(false); setRun((r) => r + 1); };
  const changeTrait = (k: string) => {
    const nt = TRAITS.find((x) => x.key === k)!;
    const map = (g: string) => g.split("").map((ch) => (isCap(ch) ? nt.D : nt.r)).join("");
    setTraitKey(k); setP1(map(p1)); setP2(map(p2)); reset();
  };
  const correctGuesses = guess.filter((g, i) => g === res.cells[i].g).length;

  const ParentPick = ({ label, val, set }: { label: string; val: string; set: (v: string) => void }) => (
    <div>
      <span className="label !text-white/80">{label}</span>
      <div className="flex gap-2">
        {opts.map((g) => (
          <button key={g} onClick={() => { set(g); reset(); sfx.pop(); }} className={`ltr min-w-16 rounded-xl px-3 py-2 text-2xl font-bold transition ${val === g ? "bg-accent text-navy" : "bg-white/10 hover:bg-white/20"}`}>{g}</button>
        ))}
      </div>
      <p className="mt-1 text-sm text-white/60">{describeGenotype(val)} • {isCap(val[0]) ? t.domName : t.recName}</p>
    </div>
  );

  const Phen = ({ g, size = 44 }: { g: string; size?: number }) => {
    const d = isCap(g[0]);
    const img = d ? t.domImg : t.recImg;
    return img ? (
      <span className="grid place-items-center rounded-lg bg-white p-0.5" style={{ width: size, height: size }}><Image src={img} alt={d ? t.domName : t.recName} width={size} height={size} className="h-full w-full object-contain" /></span>
    ) : (
      <span className="rounded-full ring-2 ring-white/60" style={{ width: size * 0.6, height: size * 0.6, background: d ? t.domColor : t.recColor }} />
    );
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-5 rounded-3xl bg-white/5 p-5 lg:grid-cols-4">
        <div>
          <label className="label !text-white/80" htmlFor="trait">الصفة</label>
          <select id="trait" value={traitKey} onChange={(e) => changeTrait(e.target.value)} className="input">
            {TRAITS.map((x) => <option key={x.key} value={x.key}>{x.name} ({x.D}/{x.r})</option>)}
          </select>
          <p className="mt-1 text-sm text-white/60"><span className="ltr font-bold">{t.D}</span> {t.domName} (سائد) • <span className="ltr font-bold">{t.r}</span> {t.recName} (متنحٍ)</p>
        </div>
        <ParentPick label="الأب الأول (أعلى المربع)" val={p1} set={setP1} />
        <ParentPick label="الأب الثاني (جانب المربع)" val={p2} set={setP2} />
        <div>
          <span className="label !text-white/80">طريقة الحل</span>
          <div className="flex gap-2">
            <button onClick={() => { setMode("auto"); reset(); }} className={`rounded-xl px-3 py-2 font-bold ${mode === "auto" ? "bg-brand" : "bg-white/10"}`}>عرض متحرك</button>
            <button onClick={() => { setMode("predict"); reset(); }} className={`rounded-xl px-3 py-2 font-bold ${mode === "predict" ? "bg-brand" : "bg-white/10"}`}>توقّعي أولًا</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={`rounded-full px-4 py-2 font-bold ${stage >= 1 ? "bg-accent text-navy" : "bg-white/10"}`} onClick={() => { setStage(Math.max(1, stage)); sfx.pop(); }}>① افصلي الجينات</button>
        <button className={`rounded-full px-4 py-2 font-bold ${stage >= 2 ? "bg-accent text-navy" : "bg-white/10"} disabled:opacity-40`} disabled={stage < 1} onClick={() => { setStage(2); sfx.reveal(); }}>② املئي المربعات</button>
        <button className={`rounded-full px-4 py-2 font-bold ${stage >= 3 ? "bg-accent text-navy" : "bg-white/10"} disabled:opacity-40`} disabled={stage < 2 || (mode === "predict" && !checked)} onClick={() => { setStage(3); sfx.win(); }}>③ النتائج</button>
        <button className="btn-ghost !py-2" onClick={reset}><IconReplay className="h-4 w-4" /> إعادة</button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="mx-auto" key={run}>
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(2, clamp(96px, 27vw, ${CELL}px))`, gridTemplateRows: `64px repeat(2, clamp(96px, 27vw, ${CELL}px))` }}>
            <div className="grid place-items-center text-xs text-white/50">♂ × ♀</div>
            {[0, 1].map((c) => (
              <div key={c} className="grid place-items-center">
                <AnimatePresence>{stage >= 1 && <motion.span initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: c * 0.2 }} className="ltr text-5xl font-bold text-[#FFD27A]">{p1[c]}</motion.span>}</AnimatePresence>
              </div>
            ))}
            {[0, 1].map((r) => (
              <FragmentRow key={r} r={r} stage={stage} p2={p2}>
                {[0, 1].map((c) => {
                  const i = r * 2 + c;
                  const cell = res.cells[i];
                  const d = isCap(cell.g[0]);
                  const showAuto = mode === "auto" && stage >= 2;
                  const showPredict = mode === "predict" && stage >= 2;
                  return (
                    <div key={c} className="relative grid place-items-center border-2 border-white/70" style={{ background: stage >= 3 || (showAuto) ? (d ? `${t.domColor}55` : `${t.recColor}66`) : "transparent" }}>
                      {showAuto && (
                        <div className="ltr flex items-center gap-1 text-[2rem] font-bold">
                          {[0, 1].map((k) => {
                            const fromTop = k === 0 ? cell.g[0] === cell.top && cell.g[1] === cell.side : !(cell.g[0] === cell.top && cell.g[1] === cell.side);
                            return (
                              <motion.span key={k} initial={fromTop ? { y: -(r + 1) * CELL - 30, x: 0, opacity: 0 } : { x: (c + 1) * CELL + 30, y: 0, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.55 + (fromTop ? 0 : 0.2), duration: 0.6 }} className={fromTop ? "text-[#FFD27A]" : "text-[#BDB0FF]"}>{cell.g[k]}</motion.span>
                            );
                          })}
                        </div>
                      )}
                      {showPredict && (
                        <div className="flex flex-col items-center gap-1">
                          {checked ? (
                            <span className={`ltr text-3xl font-bold ${guess[i] === cell.g ? "text-accent" : "text-rose line-through"}`}>{guess[i] ?? "—"}</span>
                          ) : (
                            <div className="flex flex-wrap justify-center gap-1">
                              {opts.map((g) => (
                                <button key={g} onClick={() => { const n = [...guess]; n[i] = g; setGuess(n); sfx.pop(); }} className={`ltr rounded-lg px-1.5 py-0.5 text-sm font-bold ${guess[i] === g ? "bg-accent text-navy" : "bg-white/15"}`}>{g}</button>
                              ))}
                            </div>
                          )}
                          {checked && guess[i] !== cell.g && <span className="ltr text-xl font-bold text-white">{cell.g}</span>}
                        </div>
                      )}
                      {(stage >= 3 || showAuto) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: mode === "auto" ? i * 0.55 + 0.9 : 0 }} className="absolute right-1 top-1"><Phen g={cell.g} size={28} /></motion.div>}
                      {(stage >= 3 || showAuto) && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: mode === "auto" ? i * 0.55 + 0.9 : 0 }} className="absolute bottom-1 left-1.5 text-xs font-bold text-white/80">25%</motion.span>}
                    </div>
                  );
                })}
              </FragmentRow>
            ))}
          </div>
          {mode === "predict" && stage >= 2 && !checked && (
            <button className="btn-primary mt-4 w-full" disabled={guess.some((g) => !g)} onClick={() => { setChecked(true); (correctGuesses === 4 ? sfx.win : correctGuesses >= 2 ? sfx.correct : sfx.wrong)(); }}>تحقّقي من توقّعاتي</button>
          )}
          {mode === "predict" && checked && <p className="mt-3 text-center text-lg font-bold text-accent">أصبتِ {correctGuesses} من 4 مربعات {correctGuesses === 4 ? "🌟" : ""}</p>}
        </div>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="grid gap-4">
              <div className="card-cream p-5">
                <p className="text-sm text-navy/60">الطرز الجينية</p>
                <p className="ltr mt-1 text-3xl font-bold text-brand-deep">{ratioText(res.counts, t)}</p>
                <div className="mt-3 grid gap-1 text-navy/80">
                  {genotypes(t).filter((g) => res.counts[g]).map((g) => <span key={g}><span className="ltr font-bold">{g}</span>: {res.counts[g]} من 4 = {res.counts[g] * 25}% — {describeGenotype(g)}</span>)}
                </div>
              </div>
              <div className="card-cream p-5">
                <p className="text-sm text-navy/60">الطرز الشكلية</p>
                <p className="mt-1 text-2xl font-bold">{res.dom > 0 && `${res.dom} ${t.domName}`}{res.dom > 0 && res.rec > 0 && " : "}{res.rec > 0 && `${res.rec} ${t.recName}`}</p>
                <div className="mt-3 flex h-12 overflow-hidden rounded-xl text-sm font-bold text-white">
                  {res.dom > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${res.dom * 25}%` }} transition={{ duration: 0.8 }} className="grid place-items-center" style={{ background: t.domColor }}>{res.dom * 25}% {t.domName}</motion.div>}
                  {res.rec > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${res.rec * 25}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="grid place-items-center" style={{ background: t.recColor, color: "#1D2B36" }}>{res.rec * 25}%</motion.div>}
                </div>
              </div>
              <p className="rounded-2xl bg-white/5 p-4 leading-8 text-white/80">كل مربع يأخذ حرفًا من كل أب؛ فتظهر الطرز الجينية المحتملة للأبناء، وكل مربع يمثل احتمال ¼ = 25%.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FragmentRow({ r, stage, p2, children }: { r: number; stage: number; p2: string; children: React.ReactNode }) {
  return (
    <>
      <div className="grid place-items-center">
        <AnimatePresence>{stage >= 1 && <motion.span initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + r * 0.2 }} className="ltr text-5xl font-bold text-[#BDB0FF]">{p2[r]}</motion.span>}</AnimatePresence>
      </div>
      {children}
    </>
  );
}
