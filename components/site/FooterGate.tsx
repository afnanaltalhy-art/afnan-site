"use client";
import { usePathname } from "next/navigation";
export default function FooterGate({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  if (p.startsWith("/admin")) return null;
  return <>{children}</>;
}
