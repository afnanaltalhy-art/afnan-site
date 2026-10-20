import "server-only";
import { notFound } from "next/navigation";
import { getPublicPortfolio } from "./portfolio";
import type { SectionKey } from "./types";

export async function loadSection(key: SectionKey) {
  const data = await getPublicPortfolio();
  const config = data.settings.sections.find((s) => s.key === key)!;
  if (!config.visible) notFound();
  return { data, config, folder: data.sectionFolders[key] };
}
