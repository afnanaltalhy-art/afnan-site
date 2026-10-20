"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Arm({ color, rot, glow }: { color: string; rot: number; glow: boolean }) {
  return (
    <group rotation={[0, 0, rot]}>
      <mesh position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.32, 1.5, 12, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.345, 0.345, 0.26, 32]} />
        <meshStandardMaterial color={glow ? "#F5C530" : "#ffffff"} emissive={glow ? "#F5C530" : "#000"} emissiveIntensity={glow ? 1.1 : 0} transparent opacity={glow ? 1 : 0.35} />
      </mesh>
    </group>
  );
}

function Chromosome({ x, color, allele, label, onToggle, glow }: { x: number; color: string; allele: string; label: string; onToggle?: () => void; glow: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => { if (g.current) g.current.position.y = Math.sin(s.clock.elapsedTime * 1.2 + x) * 0.08; });
  return (
    <group ref={g} position={[x, 0, 0]} onClick={(e) => { e.stopPropagation(); onToggle?.(); }}>
      <Arm color={color} rot={0.28} glow={glow} />
      <Arm color={color} rot={-0.28} glow={glow} />
      <group rotation={[0, 0, Math.PI]}>
        <Arm color={color} rot={0.28} glow={false} />
        <Arm color={color} rot={-0.28} glow={false} />
      </group>
      <mesh><sphereGeometry args={[0.34, 24, 24]} /><meshStandardMaterial color="#ffffff" roughness={0.4} /></mesh>
      <Html position={[0, 2.75, 0]} center distanceFactor={9}>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-full bg-black/55 px-3 py-1 text-sm font-bold text-white">{label}</div>
      </Html>
      <Html position={[0.95, 1.3, 0]} center distanceFactor={9}>
        <button onClick={onToggle} className="ltr rounded-xl bg-accent px-3 py-1 text-2xl font-bold text-navy shadow-lg">{allele}</button>
      </Html>
    </group>
  );
}

export default function Chromosomes({ fatherAllele, motherAllele, onToggleFather, onToggleMother, glow = true, className = "h-full w-full" }: {
  fatherAllele: string; motherAllele: string; onToggleFather?: () => void; onToggleMother?: () => void; glow?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0.4, 8], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <pointLight position={[-4, 2, 3]} intensity={25} color="#ffd9a0" />
        <Chromosome x={-1.6} color="#4C8FE0" allele={fatherAllele} label="من الأب" onToggle={onToggleFather} glow={glow} />
        <Chromosome x={1.6} color="#EE7AA0" allele={motherAllele} label="من الأم" onToggle={onToggleMother} glow={glow} />
        <Sparkles count={40} scale={[8, 6, 4]} size={2} speed={0.3} color="#F5D27A" />
        <OrbitControls enablePan={false} minDistance={4.5} maxDistance={14} />
      </Canvas>
    </div>
  );
}
