"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { TRAITS, genotypes, isCap, norm } from "@/lib/genetics";
import { sfx } from "@/lib/sound";

type Gen = { label: string; p1: string; p2: string; kids: string[] };

function breed(p1: string, p2: string, n: number) {
  return Array.from({ length: n }, () => norm(p1[Math.random() < 0.5 ? 0 : 1], p2[Math.random() < 0.5 ? 0 : 1]));
}

export default function GenerationsLab() {
  const t = TRAITS[0];
  const [p1, setP1] = useState("GG");
  const [p2, setP2] = useState("gg");
  const [n, setN] = useState(8);
  const [gens, setGens] = useState<Gen[]>([]);
  const start = () => { setGens([{ label: "الجيل الأول F1", p1, p2, kids: breed(p1, p2, n) }]); sfx.reveal(); };
  const next = () => {
    const last = gens[gens.length - 1];
    const a = last.kids[Math.floor(Math.random() * last.kids.length)];
    const b = last.kids[Math.floor(Math.random() * last.kids.length)];
    setGens([...gens, { label: `الجيل ${["الأول", "الثاني", "الثالث", "الرابع", "الخامس"][gens.length] ?? gens.length + 1} F${gens.length + 1}`, p1: a, p2: b, kids: breed(a, b, n) }]);
    sfx.reveal();
  };
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-3xl bg-white/5 p-5 md:grid-cols-4">
        {[["الأب الأول", p1, setP1], ["الأب الثاني", p2, setP2]].map(([l, v, set]) => (
          <div key={l as string}>
            <span className="label !text-white/80">{l as string}</span>
            <div className="flex gap-2">{genotypes(t).map((g) => <button key={g} onClick={() => { (set as (x: string) => void)(g); setGens([]); }} className={`ltr rounded-xl px-3 py-2 text-xl font-bold ${v === g ? "bg-accent text-navy" : "bg-white/10"}`}>{g}</button>)}</div>
          </div>
        ))}
        <div>
          <label className="label !text-white/80" htmlFor="kids">عدد الأبناء في كل جيل: {n}</label>
          <input id="kids" type="range" min={4} max={40} step={4} value={n} onChange={(e) => { setN(+e.target.value); setGens([]); }} className="w-full accent-[rgb(var(--accent))]" />
        </div>
        <div className="flex items-end gap-2">
          <button className="btn-primary" onClick={start}>ابدئي التزاوج</button>
          <button className="btn-ghost" onClick={() => setGens([])}>إعادة</button>
        </div>
      </div>
      {gens.map((g, gi) => {
        const dom = g.kids.filter((k) => isCap(k[0])).length;
        return (
          <motion.div key={gi} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-ink-800/60 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-xl font-bold text-accent">{g.label}</h4>
              <span className="text-white/75">الأبوان: <span className="ltr font-bold">{g.p1} × {g.p2}</span></span>
              <span className="rounded-full bg-white/10 px-3 py-1">خضراء {dom} : صفراء {g.kids.length - dom}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.kids.map((k, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.03 }} className="flex flex-col items-center">
                  <span className="grid h-14 w-12 place-items-center rounded-lg bg-white p-0.5"><Image src={isCap(k[0]) ? t.domImg! : t.recImg!} alt="" width={40} height={52} className="h-12 w-auto object-contain" /></span>
                  <span className="ltr text-xs font-bold">{k}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
      {gens.length > 0 && gens.length < 5 && <button className="btn-brand justify-self-start" onClick={next}>زاوجي فردين من هذا الجيل ⟵ الجيل التالي</button>}
      <p className="text-sm text-white/60">تُختار الجينات عشوائيًا كما يحدث في الطبيعة؛ لذا قد تختلف النسب قليلًا عن مربع بانيت، وتقترب منه كلما زاد عدد الأبناء.</p>
    </div>
  );
}
