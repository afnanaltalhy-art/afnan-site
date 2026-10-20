"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { NotesCtx } from "./ui";
import { DnaHelix3D } from "@/components/three";
import Part1Intro from "./Part1Intro";
import Part2Heredity from "./Part2Heredity";
import Part3Mendel from "./Part3Mendel";
import Part4Dominance from "./Part4Dominance";
import Part5Types from "./Part5Types";
import Part6Punnett from "./Part6Punnett";
import Part7Enrich from "./Part7Enrich";
import Part8Final from "./Part8Final";
import { isMuted, setMuted } from "@/lib/sound";
import { IconSound } from "@/components/ui/Icons";

const PARTS = [
  { id: "p1", t: "التهيئة", C: Part1Intro },
  { id: "p2", t: "الوراثة والأليلات", C: Part2Heredity },
  { id: "p3", t: "تجارب مندل", C: Part3Mendel },
  { id: "p4", t: "السائد والمتنحي", C: Part4Dominance },
  { id: "p5", t: "الطرز", C: Part5Types },
  { id: "p6", t: "مربع بانيت", C: Part6Punnett },
  { id: "p7", t: "المحاكاة والأنشطة", C: Part7Enrich },
  { id: "p8", t: "التقويم النهائي", C: Part8Final },
];

export default function GeneticsLesson() {
  const [notes, setNotes] = useState(false);
  const [mute, setMute] = useState(false);
  const [active, setActive] = useState("p1");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    try { setNotes(localStorage.getItem("afnan.notes") === "1"); } catch {}
    setMute(isMuted());
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    PARTS.forEach((p) => { const el = document.getElementById(p.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <NotesCtx.Provider value={notes}>
      <motion.div className="fixed inset-x-0 top-0 z-[55] h-1 origin-right bg-gradient-to-l from-accent to-accent-warm" style={{ scaleX: progress }} />
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="chip">الوحدة الثانية: أسس الحياة • الفصل الرابع: الوراثة</span>
            <p className="mt-5 text-xl font-bold text-accent">الدرس الثاني • العلوم • ثالث متوسط</p>
            <h1 className="mt-2 text-6xl font-bold leading-tight sm:text-8xl">علم الوراثة</h1>
            <p className="mt-4 text-2xl text-cream/90">كيف تنتقل الصفات من الآباء إلى الأبناء؟</p>
            <p className="mt-6 text-white/65">إعداد: <b className="text-white">د. أفنان الطلحي</b></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#p1" className="btn-primary">ابدئي الدرس</a>
              <a href="#p6" className="btn-ghost">مربع بانيت التفاعلي</a>
              <a href="#p8" className="btn-ghost">المسابقة</a>
            </div>
          </motion.div>
          <div className="h-[340px] sm:h-[460px]"><DnaHelix3D interactive autoRotate /></div>
        </div>
      </section>

      <div className="sticky top-16 z-40 border-y border-white/10 bg-ink/90 backdrop-blur-lg">
        <div className="container-x flex items-center gap-3 py-2">
          <nav className="flex flex-1 gap-1.5 overflow-x-auto py-1 [scrollbar-width:none]" aria-label="أجزاء الدرس">
            {PARTS.map((p, i) => (
              <a key={p.id} href={`#${p.id}`} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${active === p.id ? "bg-accent text-navy" : "bg-white/5 text-white/75 hover:bg-white/10"}`}>
                <span className="ltr ml-1 opacity-60">{i + 1}</span> {p.t}
              </a>
            ))}
          </nav>
          <button onClick={() => { const n = !notes; setNotes(n); try { localStorage.setItem("afnan.notes", n ? "1" : "0"); } catch {} }}
            className={`hidden shrink-0 rounded-full px-3 py-1.5 text-sm font-bold sm:block ${notes ? "bg-accent text-navy" : "bg-white/10"}`} aria-pressed={notes}>ملاحظات المعلمة</button>
          <button onClick={() => { setMuted(!mute); setMute(!mute); }} className="shrink-0 rounded-full bg-white/10 p-2" aria-label={mute ? "تشغيل الصوت" : "كتم الصوت"}><IconSound off={mute} /></button>
        </div>
      </div>

      <div className="container-x grid gap-16 py-10">
        {PARTS.map(({ id, C }) => (
          <section key={id} id={id} className="scroll-mt-32"><C /></section>
        ))}
      </div>
    </NotesCtx.Provider>
  );
}
