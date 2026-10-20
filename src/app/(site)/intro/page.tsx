import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DriveNotice from "@/components/DriveNotice";
import DocText from "@/components/DocText";
import DocumentGrid from "@/components/DocumentGrid";
import FolderView from "@/components/FolderView";
import { exportDocText, flattenFiles } from "@/lib/drive";
import { loadSection } from "@/lib/section";
import { displayName, openUrl } from "@/lib/fileTypes";

export const revalidate = 600;
export const metadata: Metadata = { title: "مقدمة ملف الإنجاز", description: "التعريف المهني والرؤية والرسالة والأهداف." };

const GDOC = "application/vnd.google-apps.document";

export default async function IntroPage() {
  const { data, config, folder } = await loadSection("intro");
  const docs = folder ? folder.files.filter((f) => f.mimeType === GDOC) : [];
  const texts = await Promise.all(docs.map(async (d) => ({ doc: d, text: await exportDocText(d.id) })));
  const readable = texts.filter((t) => t.text && t.text.trim().length > 0);
  const rest = folder ? { ...folder, files: folder.files.filter((f) => !readable.some((r) => r.doc.id === f.id)) } : null;

  return (
    <>
      <PageHeader title={config.title} subtitle={config.subtitle} folderId={folder?.id} />
      <div className="container-lux py-16">
        {!folder || flattenFiles(folder).length === 0 ? (
          <DriveNotice status={data.status} />
        ) : (
          <div className="space-y-20">
            {readable.map(({ doc, text }) => (
              <article key={doc.id} className="grid gap-8 lg:grid-cols-[260px_1fr]">
                <header className="lg:sticky lg:top-24 lg:self-start">
                  <h2 className="text-[24px] font-extrabold leading-snug text-navy">{displayName(doc.name)}</h2>
                  <div className="my-4 h-px w-16 bg-gold-400" />
                  <a href={openUrl(doc)} target="_blank" rel="noopener noreferrer" className="text-[14px] text-gold-700 underline underline-offset-4">
                    المستند الأصلي
                  </a>
                </header>
                <DocText text={text!} />
              </article>
            ))}
            {rest && (rest.files.length > 0 || rest.folders.length > 0) && (
              <section>
                {readable.length > 0 && <h2 className="mb-8 text-[24px] font-extrabold text-navy">وثائق المقدمة</h2>}
                {rest.folders.length ? <FolderView folder={rest} /> : <DocumentGrid files={rest.files} showPath={false} />}
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
