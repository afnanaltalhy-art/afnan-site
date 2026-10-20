"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ar, displayName, formatDate, KIND_LABEL, openUrl, previewUrl } from "@/lib/fileTypes";
import type { DriveFile } from "@/lib/types";

interface Props {
  files: DriveFile[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

/** View a document without leaving the site (Google Drive's embeddable viewer) */
export default function PreviewModal({ files, index, onClose, onIndex }: Props) {
  const file = index === null ? null : files[index];
  const [loading, setLoading] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setLoading(true), [file?.id]);

  useEffect(() => {
    if (!file) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // RTL: right arrow goes to the previous item
      if (e.key === "ArrowLeft" && index !== null && index < files.length - 1) onIndex(index + 1);
      if (e.key === "ArrowRight" && index !== null && index > 0) onIndex(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [file, index, files.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {file && index !== null && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-stretch justify-center bg-navy-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={displayName(file.name)}
            className="flex h-full w-full max-w-5xl flex-col overflow-hidden bg-ivory-50 shadow-2xl sm:h-[88vh] sm:rounded-3xl"
            initial={{ y: 30, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-navy/10 bg-white px-4 py-3 sm:px-5">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-bold text-navy">{displayName(file.name)}</h2>
                <p className="truncate text-[12px] text-navy-500">
                  {KIND_LABEL[file.kind]}
                  {file.path.length > 0 && ` في ${file.path[file.path.length - 1]}`}
                  {file.modifiedTime && `، آخر تحديث ${formatDate(file.modifiedTime)}`}
                </p>
              </div>
              <span className="hidden text-[12px] text-navy-500 sm:inline">
                {ar(index + 1)} من {ar(files.length)}
              </span>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-navy/10 text-navy disabled:opacity-30"
                onClick={() => onIndex(index - 1)}
                disabled={index === 0}
                aria-label="الوثيقة السابقة"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-navy/10 text-navy disabled:opacity-30"
                onClick={() => onIndex(index + 1)}
                disabled={index === files.length - 1}
                aria-label="الوثيقة التالية"
              >
                <ChevronLeft size={18} />
              </button>
              <a href={openUrl(file)} target="_blank" rel="noopener noreferrer" className="btn-line hidden sm:inline-flex">
                <ExternalLink size={14} />
                فتح في Drive
              </a>
              <button
                ref={closeRef}
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full bg-navy text-ivory-50"
                onClick={onClose}
                aria-label="إغلاق المعاينة"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex-1 bg-[#eceae4]">
              {loading && (
                <div className="absolute inset-0 grid place-items-center text-navy-500">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              <iframe
                key={file.id}
                src={previewUrl(file)}
                title={displayName(file.name)}
                className="h-full w-full"
                allow="autoplay; fullscreen"
                onLoad={() => setLoading(false)}
              />
            </div>

            {file.description && <p className="border-t border-navy/10 bg-white px-5 py-3 text-[14px] text-navy-600">{file.description}</p>}
            <a href={openUrl(file)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-t border-navy/10 bg-white py-3 text-[14px] font-bold text-navy sm:hidden">
              <ExternalLink size={14} /> فتح الملف الأصلي في Drive
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
