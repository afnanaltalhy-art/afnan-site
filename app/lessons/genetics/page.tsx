import type { Metadata } from "next";
import GeneticsLesson from "@/components/genetics/GeneticsLesson";

export const metadata: Metadata = {
  title: "درس علم الوراثة التفاعلي",
  description: "درس علم الوراثة لثالث متوسط: محاكاة الانقسام المنصّف، تجارب مندل، مربع بانيت التفاعلي، مختبر ثلاثي الأبعاد، ومسابقة نجمات العلوم.",
};

export default function Page() {
  return <GeneticsLesson />;
}
