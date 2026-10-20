"use client";

import { useCallback, useState } from "react";
import { ExternalLink } from "lucide-react";
import FileIcon, { KIND_TINT } from "./FileIcon";
import PreviewModal from "./PreviewModal";
import { displayName, formatDate, KIND_LABEL, openUrl, thumbnailUrl } from "@/lib/fileTypes";
import type { DriveFile } from "@/lib/types";

function Thumb({ file }: { file: DriveFile }) {
  const [failed, setFailed] = useState(false);
  const canThumb = ["image", "pdf", "slides", "doc", "video"].includes(file.kind);
  if (!canThumb || failed) {
    return (
      <div className={`grid h-full w-full place-items-center ${KIND_TINT[file.kind]}`}>
        <FileIcon kind={file.kind} size={34} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumbnailUrl(file.id, 480)}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
    />
  );
}

export function FileCard({ file, onOpen, showPath = true }: { file: DriveFile; onOpen: () => void; showPath?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/[.08] bg-white transition hover:border-gold/50 hover:shadow-glow">
      <button type="button" onClick={onOpen} className="block text-right" aria-label={`معاينة ${displayName(file.name)}`}>
        <div className="aspect-[4/3] overflow-hidden border-b border-navy/[.06] bg-ivory-200">
          <Thumb file={file} />
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-relaxed text-navy">{displayName(file.name)}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[12px] text-navy-500">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${KIND_TINT[file.kind]}`}>
              <FileIcon kind={file.kind} size={12} />
              {KIND_LABEL[file.kind]}
            </span>
            {file.modifiedTime && <span>{formatDate(file.modifiedTime)}</span>}
          </p>
          {showPath && file.path.length > 0 && <p className="mt-2 truncate text-[12px] text-navy-300">{file.path.join(" / ")}</p>}
        </div>
      </button>
      <a
        href={openUrl(file)}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-navy opacity-0 shadow transition focus:opacity-100 group-hover:opacity-100"
        aria-label="فتح الملف الأصلي في Drive"
        title="فتح الملف الأصلي في Drive"
      >
        <ExternalLink size={14} />
      </a>
    </article>
  );
}

export function FileRow({ file, onOpen }: { file: DriveFile; onOpen: () => void }) {
  return (
    <li className="group flex items-center gap-3 border-b border-navy/[.06] py-3 last:border-0">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${KIND_TINT[file.kind]}`}>
        <FileIcon kind={file.kind} />
      </span>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-right">
        <span className="block truncate text-[15px] font-bold text-navy group-hover:text-gold-700">{displayName(file.name)}</span>
        <span className="block truncate text-[12px] text-navy-500">
          {KIND_LABEL[file.kind]}
          {file.path.length > 0 && ` في ${file.path.join(" / ")}`}
        </span>
      </button>
      <a href={openUrl(file)} target="_blank" rel="noopener noreferrer" className="btn-line !px-3" aria-label="فتح الملف الأصلي في Drive">
        <ExternalLink size={14} />
      </a>
    </li>
  );
}

export default function DocumentGrid({ files, showPath = true, layout = "grid" }: { files: DriveFile[]; showPath?: boolean; layout?: "grid" | "list" }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  return (
    <>
      {layout === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((f, i) => (
            <FileCard key={f.id + i} file={f} onOpen={() => setIndex(i)} showPath={showPath} />
          ))}
        </div>
      ) : (
        <ul className="rounded-2xl border border-navy/[.08] bg-white px-4">
          {files.map((f, i) => (
            <FileRow key={f.id + i} file={f} onOpen={() => setIndex(i)} />
          ))}
        </ul>
      )}
      <PreviewModal files={files} index={index} onClose={close} onIndex={setIndex} />
    </>
  );
}
