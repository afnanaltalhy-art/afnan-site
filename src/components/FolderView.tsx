import DocumentGrid from "./DocumentGrid";
import { flattenFiles } from "@/lib/drive";
import { ar, cleanFolderName } from "@/lib/fileTypes";
import type { DriveFolder } from "@/lib/types";

function anchor(id: string) {
  return `f-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function FolderBlock({ folder, depth }: { folder: DriveFolder; depth: number }) {
  const count = flattenFiles(folder).length;
  const H = depth === 0 ? "h2" : "h3";
  return (
    <section id={anchor(folder.id)} className="scroll-mt-24">
      <header className={`mb-5 flex items-end justify-between gap-4 ${depth === 0 ? "border-b border-gold/30 pb-4" : ""}`}>
        <H className={depth === 0 ? "text-[24px] font-extrabold text-navy" : "text-[18px] font-bold text-navy-600"}>{cleanFolderName(folder.name)}</H>
        <span className="shrink-0 text-[13px] text-navy-500">{ar(count)} {count === 1 ? "وثيقة" : "وثائق"}</span>
      </header>
      {folder.description && <p className="measure -mt-2 mb-5 text-[15px] leading-relaxed text-navy-500">{folder.description}</p>}
      {folder.files.length > 0 && <DocumentGrid files={folder.files} showPath={false} />}
      {folder.folders.length > 0 && (
        <div className={`space-y-10 ${folder.files.length ? "mt-10" : ""} ${depth === 0 ? "" : "border-r-2 border-gold/20 pr-5"}`}>
          {folder.folders.map((f) => (
            <FolderBlock key={f.id} folder={f} depth={depth + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

/** A folder's sub-folders as an indexed set of sections (side index on large screens) */
export default function FolderView({ folder }: { folder: DriveFolder }) {
  const groups = folder.folders.filter((f) => flattenFiles(f).length > 0);
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      {groups.length > 1 && (
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="محتويات القسم" className="rounded-2xl border border-navy/[.08] bg-white p-3">
            <ul className="scrollbar-thin flex gap-2 overflow-x-auto lg:block lg:max-h-[70vh] lg:space-y-0.5 lg:overflow-y-auto">
              {groups.map((g) => (
                <li key={g.id} className="shrink-0">
                  <a href={`#${anchor(g.id)}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[14px] text-navy-600 transition hover:bg-ivory-200 hover:text-navy">
                    <span className="truncate">{cleanFolderName(g.name)}</span>
                    <span className="text-[12px] text-gold-700">{ar(flattenFiles(g).length)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
      <div className={`min-w-0 space-y-16 ${groups.length > 1 ? "" : "lg:col-span-2"}`}>
        {folder.files.length > 0 && <DocumentGrid files={folder.files} showPath={false} />}
        {groups.map((g) => (
          <FolderBlock key={g.id} folder={g} depth={0} />
        ))}
      </div>
    </div>
  );
}
