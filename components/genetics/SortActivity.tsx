"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";

export type SortItem = { id: string; text: string; bucket: string };
export type Bucket = { id: string; title: string; className?: string };

export default function SortActivity({ items, buckets, layout = "grid" }: { items: SortItem[]; buckets: Bucket[]; layout?: "grid" | "map" }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [order, setOrder] = useState(items);
  useEffect(() => { setOrder([...items].sort(() => Math.random() - 0.5)); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const pool = order.filter((i) => !placed[i.id]);
  const score = items.filter((i) => placed[i.id] === i.bucket).length;
  const drop = (b: string) => {
    if (!sel) return;
    setPlaced({ ...placed, [sel]: b }); setSel(null); setChecked(false); sfx.pop();
  };
  return (
    <div className="grid gap-5">
      <p className="text-white/75">اضغطي على العبارة ثم على المكان المناسب لها. اضغطي على عبارة موضوعة لإرجاعها.</p>
      <div className="flex min-h-[3.5rem] flex-wrap gap-2 rounded-2xl bg-white/5 p-3">
        {pool.length === 0 && <span className="text-white/40">وُضعت كل العبارات ✔</span>}
        {pool.map((i) => (
          <button key={i.id} onClick={() => setSel(sel === i.id ? null : i.id)} className={`rounded-full px-4 py-2 font-bold transition ${sel === i.id ? "bg-accent text-navy ring-4 ring-accent/40" : "bg-cream text-navy hover:brightness-95"}`}>{i.text}</button>
        ))}
      </div>
      <div className={layout === "map" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4 md:grid-cols-3"}>
        {buckets.map((b) => (
          <button key={b.id} onClick={() => drop(b.id)} className={`min-h-[8rem] rounded-3xl border-2 border-dashed p-4 text-right transition ${sel ? "border-accent bg-accent/10" : "border-white/20 bg-white/5"} ${b.className ?? ""}`}>
            <span className="mb-3 block text-lg font-bold text-accent">{b.title}</span>
            <span className="flex flex-wrap gap-2">
              {items.filter((i) => placed[i.id] === b.id).map((i) => (
                <motion.span layout key={i.id} onClick={(e) => { e.stopPropagation(); const n = { ...placed }; delete n[i.id]; setPlaced(n); setChecked(false); }}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-bold ${checked ? (i.bucket === b.id ? "bg-brand text-white" : "bg-rose text-white") : "bg-cream text-navy"}`}>{i.text}</motion.span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={pool.length > 0} onClick={() => { setChecked(true); (score === items.length ? sfx.win : sfx.correct)(); }}>تحقّقي</button>
        <button className="btn-ghost" onClick={() => { setPlaced({}); setChecked(false); }}>إعادة</button>
        {checked && <span className="rounded-full bg-accent px-4 py-2 font-bold text-navy">{score} / {items.length} {score === items.length ? "🌟 ممتاز!" : ""}</span>}
      </div>
    </div>
  );
}
