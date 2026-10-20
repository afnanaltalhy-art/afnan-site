"use client";
import { motion } from "framer-motion";

export default function Plant({ tall, flower = "#8E73F0", height = 220 }: { tall: boolean; flower?: string; height?: number }) {
  const h = tall ? 300 : 130;
  const n = Math.max(2, Math.floor(h / 65));
  return (
    <svg viewBox="0 0 200 410" style={{ height }} className="overflow-visible" aria-label={tall ? "نبات طويل" : "نبات قصير"}>
      <motion.g key={String(tall)} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} style={{ originY: 1, originX: 0.5, transformBox: "fill-box" }}>
        <path d={`M100 400 Q92 ${400 - h / 2} 100 ${400 - h}`} stroke="#2E8F4C" strokeWidth={10} fill="none" strokeLinecap="round" />
        {Array.from({ length: n }).map((_, i) => {
          const y = 400 - (i + 1) * (h / (n + 1));
          const s = i % 2 ? 1 : -1;
          return <ellipse key={i} cx={100 + s * 34} cy={y} rx={36} ry={15} fill={i % 2 ? "#3BAA5C" : "#2E8F4C"} transform={`rotate(${s * -25} ${100 + s * 34} ${y})`} />;
        })}
        <circle cx={100} cy={400 - h - 14} r={20} fill={flower} />
        <circle cx={100} cy={400 - h - 14} r={8} fill="#FFE7B8" />
      </motion.g>
      <rect x={40} y={398} width={120} height={12} rx={6} fill="#B07A4A" />
    </svg>
  );
}
