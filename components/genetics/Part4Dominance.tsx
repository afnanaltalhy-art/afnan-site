"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, Slide } from "./ui";
import Plant from "./Plant";
import { sfx } from "@/lib/sound";

function AlleleMixer() {
  const [a, setA] = useState<"T" | "t">("T");
  const [b, setB] = useState<"T" | "t">("t");
  const geno = a === "T" || b !== "T" ? `${a}${b}` : `${b}${a}`;
  const tall = geno.includes("T");
  const homo = a === b;
  const Btn = ({ v, set, cur }: { v: "T" | "t"; set: (x: "T" | "t") => void; cur: string }) => (
    <button onClick={() => { set(v); sfx.pop(); }} className={`ltr h-16 w-16 rounded-2xl text-3xl font-bold transition ${cur === v ? "bg-accent text-navy ring-4 ring-accent/40" : "bg-white/10 hover:bg-white/20"}`}>{v}</button>
  );
  return (
    <Slide id="mixer" kicker="جرّبي بنفسك" title="اختاري الجينين.. وشاهدي النبات">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="grid gap-5">
          <div className="flex items-center gap-4"><span className="w-28 font-bold">جين من الأب</span><Btn v="T" set={setA} cur={a} /><Btn v="t" set={setA} cur={a} /></div>
          <div className="flex items-center gap-4"><span className="w-28 font-bold">جين من الأم</span><Btn v="T" set={setB} cur={b} /><Btn v="t" set={setB} cur={b} /></div>
          <div className="card-cream p-5">
            <p className="text-navy/60">الطراز الجيني: <G className="text-3xl text-brand-deep">{geno}</G></p>
            <p className="mt-2 text-2xl font-bold">{tall ? "ساق طويلة" : "ساق قصيرة"}</p>
            <p className="mt-2 leading-7">
              {geno === "TT" && "جينان سائدان متشابهان: متماثل الجينات (نقي)."}
              {geno === "Tt" && "الجين السائد T أخفى تأثير الجين المتنحي t: غير متماثل الجينات (هجين)."}
              {geno === "tt" && "اجتمع جينان متنحيان فظهرت الصفة المتنحية: متماثل الجينات (نقي)."}
            </p>
            <p className="mt-2 text-sm text-navy/60">{homo ? "متماثل" : "غير متماثل"} الجينات</p>
          </div>
        </div>
        <div className="flex h-[340px] items-end justify-center rounded-3xl bg-gradient-to-b from-sky/20 to-brand/20 p-6"><Plant tall={tall} height={300} /></div>
      </div>
    </Slide>
  );
}

export default function Part4Dominance() {
  return (
    <div className="grid gap-8">
      <PartHeader n="04" title="الصفات السائدة والمتنحية" lead="لماذا اختفى القِصَر في الجيل الأول؟" />
      <Slide id="dominance" kicker="الوراثة في الحديقة" title="العامل السائد والعامل المتنحي">
        <p className="mb-6 rounded-2xl bg-white/5 p-4 text-lg leading-9"><b className="text-accent">العامل السائد:</b> يظهر ويُخفي الصفة الأخرى. <b className="text-violet-soft">العامل المتنحي:</b> يختفي بوجود السائد.</p>
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            "لقّح مندل نباتًا طويلًا نقيًا مع قصير نقي فكانت كل النباتات طويلة",
            "فاستنتج أن عامل الطول ساد على عامل القصر",
            "تُسمّى هذه العوامل اليوم الجينات السائدة والجينات المتنحية",
            "الصفة المتنحية تظهر فقط إذا اجتمع جينان متنحيان (tt)",
          ].map((t, i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="flex items-center gap-4 rounded-2xl bg-cream p-4 text-lg text-navy">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span>{t}
            </motion.li>
          ))}
        </ol>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-6 rounded-3xl bg-gradient-to-br from-accent-warm to-[#c45f0c] p-6">
            <span className="ltr text-8xl font-bold">T</span>
            <div><h4 className="text-2xl font-bold">الجين السائد</h4><p className="mt-2 text-lg leading-8">حرف كبير، يظهر ويُخفي الآخر. مثال: الساق الطويلة.</p></div>
          </div>
          <div className="flex items-center gap-6 rounded-3xl bg-gradient-to-br from-violet to-[#4b3399] p-6">
            <span className="ltr text-8xl font-bold">t</span>
            <div><h4 className="text-2xl font-bold">الجين المتنحي</h4><p className="mt-2 text-lg leading-8">الحرف نفسه صغيرًا، لا يظهر إلا في <G>tt</G>.</p></div>
          </div>
        </div>
        <p className="mt-6 rounded-2xl bg-brand p-4 text-center text-xl font-bold">الجين المتنحي لا يختفي.. بل يختبئ وقد يظهر في الأجيال التالية.</p>
        <p className="mt-3 text-center text-white/70">قرون البازلاء الخضراء: صفة سائدة</p>
      </Slide>
      <AlleleMixer />
    </div>
  );
}
