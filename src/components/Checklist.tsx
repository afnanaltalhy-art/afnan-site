"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Circle } from "lucide-react";
import DocumentGrid from "./DocumentGrid";
import { ar, cleanFolderName } from "@/lib/fileTypes";
import type { ChecklistItem } from "@/lib/types";

function Progress({ done, total }: { done: number; total: number }) {
  const pct = total ? done / total : 0;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90" role="img" aria-label={`اكتمل ${ar(done)} من ${ar(total)} بندًا`}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e7dfcc" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#b8975a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div>
        <p className="text-[40px] font-extrabold leading-none text-navy">
          {ar(done)}
          <span className="text-[22px] font-bold text-navy-300"> / {ar(total)}</span>
        </p>
        <p className="mt-2 text-[15px] text-navy-500">بندًا مكتملًا بوثائقه</p>
      </div>
    </div>
  );
}

export default function Checklist({ items, loose }: { items: ChecklistItem[]; loose: ChecklistItem | null }) {
  const [open, setOpen] = useState<string | null>(null);
  const done = items.filter((i) => i.complete).length;
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");
  const shown = items.filter((i) => filter === "all" || (filter === "done" ? i.complete : !i.complete));

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-navy/[.08] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <Progress done={done} total={items.length} />
        <div className="flex rounded-full border border-navy/15 p-1" role="group" aria-label="تصفية البنود">
          {(
            [
              ["all", `الكل (${ar(items.length)})`],
              ["done", `مكتمل (${ar(done)})`],
              ["todo", `بلا وثائق (${ar(items.length - done)})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full px-4 py-2 text-[13px] transition ${filter === k ? "bg-navy text-ivory-50" : "text-navy-600"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ol className="overflow-hidden rounded-3xl border border-navy/[.08] bg-white">
        {shown.map((item) => {
          const idx = items.indexOf(item) + 1;
          const isOpen = open === item.id;
          return (
            <li key={item.id} className="border-b border-navy/[.06] last:border-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                disabled={!item.complete}
                className="flex w-full items-center gap-4 px-5 py-5 text-right transition enabled:hover:bg-ivory-100 sm:px-7"
              >
                <span className="w-7 shrink-0 text-[15px] font-bold text-gold-600">{idx.toLocaleString("ar-SA")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold leading-relaxed text-navy">{cleanFolderName(item.title)}</span>
                  <span className="text-[13px] text-navy-500">{item.files.length ? `${ar(item.files.length)} ${item.files.length === 1 ? "وثيقة" : "وثائق"}` : "لا توجد وثائق منشورة بعد"}</span>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
                    item.complete ? "bg-[#e8f2ea] text-[#2c6e43]" : "bg-ivory-200 text-navy-500"
                  }`}
                >
                  {item.complete ? <Check size={13} /> : <Circle size={11} />}
                  {item.complete ? "مكتمل" : "قيد الاستكمال"}
                </span>
                {item.complete && <ChevronDown size={18} className={`shrink-0 text-navy-300 transition ${isOpen ? "rotate-180" : ""}`} />}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="bg-ivory-100 px-5 py-6 sm:px-7">
                      <DocumentGrid files={item.files} layout="list" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      {loose && (
        <section className="mt-12">
          <h2 className="mb-5 text-[20px] font-extrabold text-navy">{loose.title}</h2>
          <DocumentGrid files={loose.files} showPath={false} />
        </section>
      )}
    </div>
  );
}
