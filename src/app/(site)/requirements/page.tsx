import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DriveNotice from "@/components/DriveNotice";
import Checklist from "@/components/Checklist";
import DocumentGrid from "@/components/DocumentGrid";
import { buildChecklist } from "@/lib/portfolio";
import { loadSection } from "@/lib/section";

export const revalidate = 600;
export const metadata: Metadata = { title: "البنود المطلوبة من المديرة", description: "البنود المطلوبة ووثائقها وحالة اكتمال كل بند." };

export default async function RequirementsPage() {
  const { data, config, folder } = await loadSection("requirements");
  const { items, loose } = buildChecklist(folder);
  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} folderId={folder?.id} />
      <div className="container-lux py-16">
        {!folder ? (
          <DriveNotice status={data.status} />
        ) : items.length ? (
          <>
            <p className="measure mb-8 text-[15px] leading-loose text-navy-500">
              كل بند مجلدٌ في الملف الأصلي، ويُعدّ مكتملًا متى احتوى على وثيقة منشورة واحدة على الأقل.
            </p>
            <Checklist items={items} loose={loose} />
          </>
        ) : folder.files.length ? (
          <DocumentGrid files={folder.files} showPath={false} />
        ) : (
          <DriveNotice status={data.status} />
        )}
      </div>
    </>
  );
}
