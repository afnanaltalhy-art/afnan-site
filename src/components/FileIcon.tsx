import { FileArchive, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo, Link2, Presentation, ClipboardList, File } from "lucide-react";
import type { FileKind } from "@/lib/types";

const MAP = {
  pdf: FileText,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  doc: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
  form: ClipboardList,
  archive: FileArchive,
  link: Link2,
  other: File,
} as const;

export const KIND_TINT: Record<FileKind, string> = {
  pdf: "bg-[#f6e9e4] text-[#9a3f2b]",
  image: "bg-[#e8eef7] text-[#2e4f86]",
  video: "bg-[#ece8f6] text-[#5b4596]",
  audio: "bg-[#e9f2ee] text-[#2f6e52]",
  doc: "bg-[#e6edf8] text-[#2a5298]",
  sheet: "bg-[#e7f3ea] text-[#2e7a45]",
  slides: "bg-[#f8eedc] text-[#9a6a17]",
  form: "bg-[#efe9f7] text-[#6a3fa0]",
  archive: "bg-[#efece6] text-[#6b6150]",
  link: "bg-[#eef0f3] text-[#4b5566]",
  other: "bg-[#eef0f3] text-[#4b5566]",
};

export default function FileIcon({ kind, size = 18 }: { kind: FileKind; size?: number }) {
  const Icon = MAP[kind] ?? File;
  return <Icon size={size} aria-hidden="true" />;
}
