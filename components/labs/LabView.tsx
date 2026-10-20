"use client";
import { useState } from "react";
import PunnettLab from "./PunnettLab";
import GenerationsLab from "./GenerationsLab";
import SexDeterminationLab from "./SexDeterminationLab";
import IncompleteDominanceLab from "./IncompleteDominanceLab";
import PedigreeLab from "./PedigreeLab";
import { Chromosomes3D, DnaHelix3D } from "@/components/three";
import { sfx } from "@/lib/sound";

function ChromoLab() {
  const [f, setF] = useState("T");
  const [m, setM] = useState("t");
  const g = f === "T" || m !== "T" ? f + m : m + f;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="h-[460px] overflow-hidden rounded-3xl bg-gradient-to-b from-ink-700 to-ink-900 lg:col-span-2">
        <Chromosomes3D fatherAllele={f} motherAllele={m} onToggleFather={() => { setF(f === "T" ? "t" : "T"); sfx.pop(); }} onToggleMother={() => { setM(m === "T" ? "t" : "T"); sfx.pop(); }} />
      </div>
      <div className="card-cream h-fit p-6">
        <p className="text-sm text-navy/60">الطراز الجيني لطول الساق</p>
        <p className="ltr text-6xl font-bold text-brand-deep">{g}</p>
        <p className="mt-3 text-2xl font-bold">{g.includes("T") ? "ساق طويلة" : "ساق قصيرة"}</p>
        <p className="mt-2">{f === m ? "متماثل الجينات (نقي)" : "غير متماثل الجينات (هجين)"}</p>
        <p className="mt-4 text-sm text-navy/60">اضغطي الحرف الأصفر فوق كل كروموسوم لتغيير الجين، واسحبي لتدوير النموذج.</p>
      </div>
    </div>
  );
}
function DnaLab() {
  const [hl, setHl] = useState<number | null>(null);
  return (
    <div className="grid gap-4">
      <div className="h-[520px] overflow-hidden rounded-3xl bg-gradient-to-b from-ink-700 to-ink-900"><DnaHelix3D interactive highlight={hl} pairs={26} /></div>
      <div className="flex gap-3"><button className="btn-primary" onClick={() => setHl(Math.floor(Math.random() * 22) + 2)}>ظلّلي جينًا</button><button className="btn-ghost" onClick={() => setHl(null)}>إزالة التظليل</button></div>
    </div>
  );
}

export default function LabView({ id }: { id: string }) {
  switch (id) {
    case "punnett": return <PunnettLab />;
    case "generations": return <GenerationsLab />;
    case "chromosomes": return <ChromoLab />;
    case "dna": return <DnaLab />;
    case "sex": return <SexDeterminationLab />;
    case "incomplete": return <IncompleteDominanceLab />;
    case "pedigree": return <PedigreeLab />;
    default: return null;
  }
}
