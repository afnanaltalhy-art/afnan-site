"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = { pairs?: number; interactive?: boolean; autoRotate?: boolean; highlight?: number | null; className?: string };

function Helix({ pairs = 22, highlight = null }: { pairs?: number; highlight?: number | null }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const arr: { a: THREE.Vector3; b: THREE.Vector3; i: number }[] = [];
    const h = 0.42, r = 1.15;
    for (let i = 0; i < pairs; i++) {
      const ang = i * 0.55;
      const y = (i - pairs / 2) * h;
      arr.push({ a: new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r), b: new THREE.Vector3(-Math.cos(ang) * r, y, -Math.sin(ang) * r), i });
    }
    return arr;
  }, [pairs]);
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.35; });
  const teal = new THREE.Color("#18C2A6"), orange = new THREE.Color("#F39A2E"), gold = new THREE.Color("#F2C230");
  return (
    <group ref={group} rotation={[0, 0, 0.35]}>
      {items.map(({ a, b, i }) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const len = a.distanceTo(b);
        const dir = b.clone().sub(a).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const hi = highlight === i;
        return (
          <group key={i}>
            <mesh position={a}><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color={hi ? gold : teal} emissive={hi ? gold : teal} emissiveIntensity={hi ? 0.9 : 0.25} roughness={0.25} metalness={0.2} /></mesh>
            <mesh position={b}><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color={hi ? gold : orange} emissive={hi ? gold : orange} emissiveIntensity={hi ? 0.9 : 0.25} roughness={0.25} metalness={0.2} /></mesh>
            <mesh position={mid} quaternion={q}><cylinderGeometry args={[0.05, 0.05, len, 10]} /><meshStandardMaterial color={hi ? gold : "#E9F7F3"} transparent opacity={hi ? 1 : 0.7} emissive={hi ? gold : "#000"} emissiveIntensity={hi ? 0.6 : 0} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function DnaHelix({ pairs, interactive = false, autoRotate = false, highlight = null, className = "h-full w-full" }: Props) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 11], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} />
        <pointLight position={[-4, -3, 3]} intensity={30} color="#F0A93A" />
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Helix pairs={pairs} highlight={highlight} />
        </Float>
        <Sparkles count={70} scale={[9, 9, 5]} size={2.6} speed={0.35} color="#F5D27A" />
        <OrbitControls enableZoom={interactive} enablePan={false} enableRotate autoRotate={autoRotate} autoRotateSpeed={0.6} minDistance={5} maxDistance={16} />
      </Canvas>
    </div>
  );
}
