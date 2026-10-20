import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DriveNotice from "@/components/DriveNotice";
import Library from "@/components/Library";
import { loadSection } from "@/lib/section";

export const revalidate = 600;
export const metadata: Metadata = { title: "الشواهد والوثائق", description: "مكتبة رقمية لشواهد الأداء المهني مع البحث والتصنيف والمعاينة." };

export default async function LibraryPage() {
  const { data, config } = await loadSection("evidence");
  const domains = data.topFolders.filter((f) => data.files.some((x) => x.topFolderId === f.id)).map((f) => ({ id: f.id, name: f.name }));
  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} folderId={data.root?.id} />
      <div className="container-lux pb-16">
        {data.files.length ? <Library files={data.files} domains={domains} /> : <div className="pt-16"><DriveNotice status={data.status} /></div>}
      </div>
    </>
  );
}
