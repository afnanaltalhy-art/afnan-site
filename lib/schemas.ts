import { z } from "zod";

const opt = (n: number) => z.string().trim().max(n).nullish();

export const lessonSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "رابط الدرس بأحرف إنجليزية صغيرة وأرقام وشرطات فقط"),
  title: z.string().trim().min(2, "العنوان قصير").max(160),
  subtitle: opt(240),
  subject: opt(80),
  grade: opt(80),
  description: opt(2000),
  coverUrl: opt(1000),
  interactive: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
  sections: z.array(z.object({ title: z.string().max(200), body: z.string().max(20000) })).max(100).optional(),
});

export const quizSchema = z.object({
  title: z.string().trim().min(2, "العنوان قصير").max(160),
  description: opt(1000),
  lessonSlug: opt(80),
  secondsPerQuestion: z.number().int().min(5).max(300),
  published: z.boolean().optional(),
  questions: z
    .array(z.object({ q: z.string().trim().min(2, "نص السؤال قصير").max(500), options: z.array(z.string().trim().min(1, "خيار فارغ").max(200)).min(2).max(6), answer: z.number().int().min(0), explain: z.string().trim().max(500).optional() }))
    .min(1, "أضيفي سؤالًا واحدًا على الأقل")
    .max(200)
    .refine((qs) => qs.every((q) => q.answer < q.options.length), "الإجابة الصحيحة خارج الخيارات"),
});

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: opt(1000),
  category: opt(80),
  imageUrl: opt(1000),
  link: opt(1000),
  order: z.number().int().optional(),
});

export const fileSchema = z.object({
  name: z.string().trim().min(1).max(300),
  url: z.string().trim().min(1).max(1500),
  mime: z.string().max(200).default("application/octet-stream"),
  size: z.number().int().min(0),
  lessonId: z.string().nullish(),
});

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "اللون بصيغة ‎#RRGGBB");
export const settingsSchema = z.object({
  siteName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().max(160),
  heroTitle: z.string().trim().max(200),
  heroSubtitle: z.string().trim().max(600),
  about: z.string().trim().max(3000),
  brandColor: hex,
  accentColor: hex,
  requestIntro: z.string().trim().max(600),
  contact: z.object({ email: z.string().max(200), whatsapp: z.string().max(40), x: z.string().max(300), instagram: z.string().max(300), telegram: z.string().max(300), youtube: z.string().max(300) }),
});
