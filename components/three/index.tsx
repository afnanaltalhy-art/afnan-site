"use client";
import dynamic from "next/dynamic";

const Loading = () => <div className="grid h-full w-full place-items-center text-white/50">جارٍ تحميل النموذج ثلاثي الأبعاد…</div>;
export const DnaHelix3D = dynamic(() => import("./DnaHelix"), { ssr: false, loading: Loading });
export const Chromosomes3D = dynamic(() => import("./Chromosomes"), { ssr: false, loading: Loading });
