"use client";
import { DnaHelix3D } from "@/components/three";
export default function HeroScene() {
  return <div className="h-[360px] sm:h-[520px]"><DnaHelix3D autoRotate interactive={false} pairs={20} /></div>;
}
