import type { DriveStatus } from "@/lib/types";
import { FolderLock } from "lucide-react";

/** Shown in place of content when Drive is not readable; never replaced by invented content */
export default function DriveNotice({ status, empty }: { status?: DriveStatus; empty?: string }) {
  const message =
    status && !status.ok
      ? status.reason === "not-configured"
        ? "يُعرض هذا القسم مباشرة من مجلد ملف الإنجاز في Google Drive، وسيظهر محتواه فور ربط المجلد."
        : status.message
      : empty ?? "لا توجد وثائق منشورة في هذا القسم حتى الآن.";
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-gold/40 bg-white/60 px-8 py-14 text-center">
      <span className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-gold-50 text-gold-600">
        <FolderLock size={24} />
      </span>
      <p className="text-[16px] leading-loose text-navy-600">{message}</p>
    </div>
  );
}
