import { prisma, safe } from "./db";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  about: string;
  brandColor: string;
  accentColor: string;
  requestIntro: string;
  contact: { email: string; whatsapp: string; x: string; instagram: string; telegram: string; youtube: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "د. أفنان الطلحي",
  tagline: "دكتوراه المناهج وطرق تدريس العلوم",
  heroTitle: "العلوم.. تجربة تعيشها الطالبة",
  heroSubtitle: "دروس تفاعلية، ومختبرات افتراضية ثلاثية الأبعاد، ومسابقات تحوّل الحصة إلى مغامرة علمية.",
  about:
    "معلمة علوم وباحثة في المناهج وطرق تدريس العلوم، أصمّم دروسًا رقمية تفاعلية تجمع بين المحتوى العلمي الدقيق والمحاكاة والألعاب التعليمية، لتتعلّم الطالبة بالاستكشاف والتجربة.",
  brandColor: "#14917F",
  accentColor: "#E7B416",
  requestIntro: "تحتاجين عرضًا تفاعليًا أو موقعًا تعليميًا لدرسك؟ أرسلي التفاصيل وسأتواصل معكِ.",
  contact: { email: "", whatsapp: "", x: "", instagram: "", telegram: "", youtube: "" },
};

export async function getSettings(): Promise<SiteSettings> {
  const row = await safe(() => prisma.setting.findUnique({ where: { key: "site" } }), null);
  const v = (row?.value ?? {}) as Partial<SiteSettings>;
  return { ...DEFAULT_SETTINGS, ...v, contact: { ...DEFAULT_SETTINGS.contact, ...(v.contact ?? {}) } };
}

export function hexToRgbTriplet(hex: string, fallback: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function darken(hex: string, f = 0.55) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "11 79 74";
  const n = parseInt(m[1], 16);
  return `${Math.round(((n >> 16) & 255) * f)} ${Math.round(((n >> 8) & 255) * f)} ${Math.round((n & 255) * f)}`;
}
