"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Seal from "./Seal";

interface Props {
  name: string;
  tagline: string;
  degree: string;
  role: string;
  sealText: string;
  primaryHref: string;
  secondaryHref: string;
}

export default function Hero({ name, tagline, degree, role, sealText, primaryHref, secondaryHref }: Props) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  const up = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease, delay } };

  return (
    <section className="grain relative isolate overflow-hidden bg-navy-950 text-ivory-50">
      {/* depth: a faint gold horizon and vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_25%_45%,#1b2d52_0%,#0b1730_45%,#070f21_100%)]" />
      </div>

      <div className="container-lux grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:pb-10">
        <div className="relative z-10 order-2 lg:order-1">
          <motion.p {...up(0.3)} className="mb-6 text-[15px] text-gold-200/90">
            {role}
          </motion.p>

          <h1 className="text-[clamp(44px,8.4vw,96px)] font-extrabold leading-[1.25]">
            {name.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease, delay: 0.45 + i * 0.18 }}
              >
                {word}
                {i < name.split(" ").length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="my-8 h-px w-40 origin-right bg-gradient-to-l from-gold-300 to-transparent"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease, delay: 1 }}
          />

          <motion.p {...up(1.15)} className="measure text-[clamp(19px,2.3vw,26px)] font-light leading-[1.75] text-ivory-200">
            {tagline}
          </motion.p>

          <motion.p {...up(1.3)} className="mt-5 text-[14px] leading-relaxed text-navy-300">
            {degree}
          </motion.p>

          <motion.div {...up(1.45)} className="mt-10 flex flex-wrap gap-3">
            <Link href={primaryHref} className="btn-gold">
              استعراض الإنجازات
            </Link>
            <Link href={secondaryHref} className="btn-ghost">
              الشواهد المهنية
            </Link>
          </motion.div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-start">
          <div className="w-[min(78vw,460px)]">
            <Seal text={sealText} />
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
