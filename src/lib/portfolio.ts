import "server-only";
import { cache } from "react";
import { flattenFiles, loadDriveTree } from "./drive";
import { getSettings } from "./settings";
import type { ChecklistItem, DriveFolder, PortfolioData, SectionKey, SiteSettings } from "./types";

const KEYWORDS: Record<SectionKey, RegExp> = {
  intro: /مقدم|تعريف|السيرة|الرؤية/,
  performance: /الأداء|اداء|أداء/,
  requirements: /المدير|البنود|بنود|المطلوب/,
  evidence: /الشواهد|شواهد|الوثائق|وثائق/,
};
const SECTION_KEYS: SectionKey[] = ["intro", "performance", "requirements", "evidence"];

/** Map the four top-level Drive folders to the four sections (explicit admin choice first, then names, then order) */
function mapSections(top: DriveFolder[], settings: SiteSettings): Record<SectionKey, DriveFolder | null> {
  const out = { intro: null, performance: null, requirements: null, evidence: null } as Record<SectionKey, DriveFolder | null>;
  const used = new Set<string>();
  for (const s of settings.sections) {
    const f = s.folderId && top.find((t) => t.id === s.folderId);
    if (f) {
      out[s.key] = f;
      used.add(f.id);
    }
  }
  for (const key of SECTION_KEYS) {
    if (out[key]) continue;
    const f = top.find((t) => !used.has(t.id) && KEYWORDS[key].test(t.name));
    if (f) {
      out[key] = f;
      used.add(f.id);
    }
  }
  const rest = top.filter((t) => !used.has(t.id));
  for (const key of SECTION_KEYS) if (!out[key] && rest.length) out[key] = rest.shift()!;
  return out;
}

/** Remove hidden / non-public items for the visitor view */
function filterTree(folder: DriveFolder, settings: SiteSettings, publicOnly: boolean): DriveFolder | null {
  if (settings.hiddenFolderIds.includes(folder.id) && publicOnly) return null;
  const files = folder.files.filter((f) => !publicOnly || (f.isPublic && !settings.hiddenFileIds.includes(f.id)));
  const folders = folder.folders.map((c) => filterTree(c, settings, publicOnly)).filter(Boolean) as DriveFolder[];
  return { ...folder, files, folders };
}

async function build(publicOnly: boolean): Promise<PortfolioData> {
  const [snap, settings] = await Promise.all([loadDriveTree(), getSettings()]);
  if (!snap.root) {
    return {
      status: snap.status,
      root: null,
      topFolders: [],
      sectionFolders: { intro: null, performance: null, requirements: null, evidence: null },
      files: [],
      settings,
    };
  }
  const root = filterTree(snap.root, settings, publicOnly) ?? { ...snap.root, folders: [], files: [] };
  const sectionFolders = mapSections(snap.root.folders, settings);
  // swap mapped folders for their filtered version
  for (const key of SECTION_KEYS) {
    const f = sectionFolders[key];
    sectionFolders[key] = f ? root.folders.find((x) => x.id === f.id) ?? (publicOnly ? null : f) : null;
  }
  return {
    status: snap.status,
    root,
    topFolders: root.folders,
    sectionFolders,
    files: flattenFiles(root),
    settings,
  };
}

export const getPublicPortfolio = cache(() => build(true));
export const getAdminPortfolio = () => build(false);

/** Each sub-folder of the requirements folder is one required item; complete when it holds at least one document */
export function buildChecklist(folder: DriveFolder | null): { items: ChecklistItem[]; loose: ChecklistItem | null } {
  if (!folder) return { items: [], loose: null };
  const items = folder.folders.map((f) => {
    const files = flattenFiles(f);
    return { id: f.id, title: f.name, files, complete: files.length > 0, subfolders: f.folders.length };
  });
  const loose = folder.files.length
    ? { id: folder.id + ":loose", title: "وثائق عامة", files: folder.files, complete: true, subfolders: 0 }
    : null;
  return { items, loose };
}

export function sectionHref(key: SectionKey) {
  return { intro: "/intro", performance: "/performance", requirements: "/requirements", evidence: "/library" }[key];
}
