"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * The hero's signature element: an engraved gold academic seal floating in 3D.
 * Layers sit at different depths (translateZ) and tilt with the pointer.
 */
export default function Seal({ text, monogram = "أ" }: { text: string; monogram?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 90, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 90, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 1.2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2))));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <div ref={ref} className="relative aspect-square w-full max-w-[460px]" style={{ perspective: 1100 }} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        initial={reduce ? false : { opacity: 0, scale: 0.86, rotateZ: -12 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* soft halo */}
        <div
          className="absolute inset-[6%] rounded-full"
          style={{ transform: "translateZ(-60px)", background: "radial-gradient(circle, rgba(184,151,90,.28), rgba(184,151,90,0) 68%)", filter: "blur(10px)" }}
        />

        {/* outer engraved ring with rotating inscription */}
        <motion.svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          style={{ transform: "translateZ(0px)" }}
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 140, ease: "linear", repeat: Infinity }}
        >
          <defs>
            <linearGradient id="gold-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0dfb8" />
              <stop offset=".45" stopColor="#c6a66a" />
              <stop offset="1" stopColor="#8a6c38" />
            </linearGradient>
            <path id="seal-circle" d="M200,200 m-158,0 a158,158 0 1,1 316,0 a158,158 0 1,1 -316,0" />
          </defs>
          <circle cx="200" cy="200" r="190" fill="none" stroke="url(#gold-a)" strokeWidth="1.4" />
          <circle cx="200" cy="200" r="182" fill="none" stroke="url(#gold-a)" strokeWidth=".6" opacity=".7" />
          {ticks.map((i) => (
            <line
              key={i}
              x1="200"
              y1="12"
              x2="200"
              y2={i % 6 === 0 ? 24 : 18}
              stroke="#c6a66a"
              strokeWidth={i % 6 === 0 ? 1.2 : 0.6}
              opacity={i % 6 === 0 ? 0.9 : 0.5}
              transform={`rotate(${i * 5} 200 200)`}
            />
          ))}
          <text fill="#e3cf9f" fontSize="15.5" fontWeight={700} fontFamily="var(--font-almarai), sans-serif">
            <textPath href="#seal-circle" startOffset="50%" textAnchor="middle">
              {text}
            </textPath>
          </text>
          <circle cx="200" cy="200" r="136" fill="none" stroke="url(#gold-a)" strokeWidth="1" />
        </motion.svg>

        {/* raised medallion */}
        <div className="absolute inset-[27%]" style={{ transform: "translateZ(70px)", transformStyle: "preserve-3d" }}>
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #213459, #0f1e3a 55%, #070f21)",
              boxShadow: "0 0 0 1px rgba(214,190,140,.55), 0 0 0 7px rgba(15,30,58,.9), 0 0 0 8px rgba(214,190,140,.35), 0 30px 60px -20px rgba(0,0,0,.6)",
            }}
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-60">
              {Array.from({ length: 24 }, (_, i) => (
                <ellipse key={i} cx="100" cy="100" rx="88" ry="30" fill="none" stroke="#b8975a" strokeWidth=".35" transform={`rotate(${i * 7.5} 100 100)`} />
              ))}
            </svg>
            <span
              className="relative pt-[0.18em] text-[clamp(64px,10vw,120px)] font-extrabold leading-none"
              style={{
                background: "linear-gradient(170deg, #f6e9c8, #c6a66a 55%, #8a6c38)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                transform: "translateZ(30px)",
                filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))",
              }}
            >
              {monogram}
            </span>
          </div>
        </div>

        {/* floating orbit dot (depth cue) */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2" style={{ transform: "translateZ(120px) translate(150px,-150px)" }}>
          <div className="h-3 w-3 rounded-full bg-gold-300 shadow-[0_0_24px_6px_rgba(214,190,140,.5)]" />
        </div>
      </motion.div>
    </div>
  );
}
