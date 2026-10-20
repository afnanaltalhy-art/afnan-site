import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import SectionTitle from "@/components/ui/SectionTitle";
import RequestForm from "@/components/site/RequestForm";

export const metadata: Metadata = { title: "اطلبي تصميم عرض أو موقع تعليمي" };

export default async function Page() {
  const s = await getSettings();
  return (
    <div className="container-x max-w-3xl py-12">
      <SectionTitle kicker="طلب تصميم" title="اطلبي تصميم عرض أو موقع تعليمي" lead={s.requestIntro} />
      <RequestForm />
    </div>
  );
}
