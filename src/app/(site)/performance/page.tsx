import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DriveNotice from "@/components/DriveNotice";
import FolderView from "@/components/FolderView";
import { flattenFiles } from "@/lib/drive";
import { loadSection } from "@/lib/section";

export const revalidate = 600;
export const metadata: Metadata = { title: "ملف الأداء الوظيفي", description: "عناصر الأداء الوظيفي وشواهدها." };

export default async function PerformancePage() {
  const { data, config, folder } = await loadSection("performance");
  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} folderId={folder?.id} />
      <div className="container-lux py-16">
        {folder && flattenFiles(folder).length ? <FolderView folder={folder} /> : <DriveNotice status={data.status} />}
      </div>
    </>
  );
}
