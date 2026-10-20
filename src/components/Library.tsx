"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import DocumentGrid from "./DocumentGrid";
import FileIcon from "./FileIcon";
import { ar, arCollator, cleanFolderName, KIND_LABEL, KIND_ORDER } from "@/lib/fileTypes";
import type { DriveFile, FileKind } from "@/lib/types";

/** Arabic-aware normalisation so "الأهداف" matches "الاهداف" etc. */
function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

interface Domain {
  id: string;
  name: string;
}

export default function Library({ files, domains }: { files: DriveFile[]; domains: Domain[] }) {
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query);
  const [kinds, setKinds] = useState<FileKind[]>([]);
  const [domain, setDomain] = useState("");
  const [sub, setSub] = useState("");
  const [sort, setSort] = useState<"name" | "new">("name");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const index = useMemo(() => files.map((f) => ({ f, text: norm([f.name, f.description ?? "", ...f.path].join(" ")) })), [files]);

  const subfolders = useMemo(() => {
    if (!domain) return [];
    const set = new Set<string>();
    files.forEach((f) => f.topFolderId === domain && f.path[1] && set.add(f.path[1]));
    return [...set].sort(arCollator.compare);
  }, [files, domain]);

  const baseFiltered = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    return index
      .filter(({ f, text }) => (!domain || f.topFolderId === domain) && (!sub || f.path[1] === sub) && terms.every((t) => text.includes(t)))
      .map(({ f }) => f);
  }, [index, q, domain, sub]);

  const kindCounts = useMemo(() => {
    const c = new Map<FileKind, number>();
    baseFiltered.forEach((f) => c.set(f.kind, (c.get(f.kind) ?? 0) + 1));
    return c;
  }, [baseFiltered]);

  const results = useMemo(() => {
    const r = kinds.length ? baseFiltered.filter((f) => kinds.includes(f.kind)) : baseFiltered.slice();
    return sort === "new"
      ? r.sort((a, b) => (b.modifiedTime ?? "").localeCompare(a.modifiedTime ?? ""))
      : r.sort((a, b) => arCollator.compare(a.name, b.name));
  }, [baseFiltered, kinds, sort]);

  const toggleKind = (k: FileKind) => setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));
  const filtersOn = Boolean(query || kinds.length || domain);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 border-b border-navy/[.08] bg-ivory-50/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">ابحثي في الشواهد</span>
            <Search size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحثي باسم الوثيقة أو المجال…"
              className="field !rounded-full !py-3 !pr-11"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="المجال"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setSub("");
              }}
              className="field !w-auto !rounded-full !py-2.5"
            >
              <option value="">كل المجالات</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {cleanFolderName(d.name)}
                </option>
              ))}
            </select>
            {subfolders.length > 0 && (
              <select aria-label="التصنيف الفرعي" value={sub} onChange={(e) => setSub(e.target.value)} className="field !w-auto !rounded-full !py-2.5">
                <option value="">كل التصنيفات</option>
                {subfolders.map((s) => (
                  <option key={s} value={s}>
                    {cleanFolderName(s)}
                  </option>
                ))}
              </select>
            )}
            <select aria-label="الترتيب" value={sort} onChange={(e) => setSort(e.target.value as "name" | "new")} className="field !w-auto !rounded-full !py-2.5">
              <option value="name">ترتيب أبجدي</option>
              <option value="new">الأحدث أولًا</option>
            </select>
            <div className="flex rounded-full border border-navy/15 bg-white p-1" role="group" aria-label="طريقة العرض">
              {(["grid", "list"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  aria-pressed={layout === l}
                  aria-label={l === "grid" ? "عرض شبكي" : "عرض قائمة"}
                  className={`grid h-8 w-9 place-items-center rounded-full transition ${layout === l ? "bg-navy text-ivory-50" : "text-navy-500"}`}
                >
                  {l === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="نوع الملف">
          {KIND_ORDER.filter((k) => kindCounts.has(k) || kinds.includes(k)).map((k) => {
            const on = kinds.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggleKind(k)}
                aria-pressed={on}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition ${
                  on ? "border-navy bg-navy text-ivory-50" : "border-navy/15 bg-white text-navy-600 hover:border-gold"
                }`}
              >
                <FileIcon kind={k} size={13} />
                {KIND_LABEL[k]}
                <span className={on ? "text-gold-200" : "text-navy-300"}>{ar(kindCounts.get(k) ?? 0)}</span>
              </button>
            );
          })}
          {filtersOn && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setKinds([]);
                setDomain("");
                setSub("");
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-gold-700 hover:underline"
            >
              <X size={13} /> مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      <p className="my-6 text-[14px] text-navy-500" aria-live="polite">
        {results.length === files.length ? `${ar(files.length)} وثيقة` : `${ar(results.length)} من ${ar(files.length)} وثيقة`}
      </p>

      {results.length ? (
        <DocumentGrid files={results} layout={layout} />
      ) : (
        <p className="rounded-2xl border border-dashed border-navy/15 py-16 text-center text-navy-500">لا توجد وثائق تطابق البحث. جرّبي كلمة أخرى أو امسحي الفلاتر.</p>
      )}
    </div>
  );
}
