import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { folderUrl } from "@/lib/fileTypes";

export default function PageHeader({
  title,
  subtitle,
  folderId,
  folderName,
  children,
}: {
  title: string;
  subtitle?: string;
  folderId?: string;
  folderName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-navy-950 pb-14 pt-32 text-ivory-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full border border-gold/10" />
      <div className="container-lux relative">
        <nav aria-label="مسار التنقل" className="mb-6 text-[13px] text-navy-300">
          <Link href="/" className="hover:text-gold-300">الرئيسية</Link>
          <span className="mx-2 text-gold/50">/</span>
          <span className="text-ivory-200">{title}</span>
        </nav>
        <h1 className="text-[clamp(32px,5.5vw,56px)] font-extrabold leading-[1.25]">{title}</h1>
        {subtitle && <p className="measure mt-4 text-[17px] leading-relaxed text-ivory-200/80">{subtitle}</p>}
        {(folderId || children) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {folderId && (
              <a href={folderUrl(folderId)} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2 !text-[13px]">
                <ExternalLink size={14} />
                فتح المجلد الأصلي{folderName ? `: ${folderName}` : ""}
              </a>
            )}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
