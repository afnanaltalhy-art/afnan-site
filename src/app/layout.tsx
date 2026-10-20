import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";

const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], variable: "--font-almarai", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: profile.siteTitle, template: `%s | ${profile.name}` },
  description: `${profile.tagline} ملف الإنجاز والأداء الوظيفي لـ${profile.name}، ${profile.degree}.`,
  keywords: ["ملف الإنجاز", "ملف الأداء الوظيفي", "أفنان الطلحي", "معلمة علوم", "شواهد الأداء", "المناهج وطرق تدريس العلوم"],
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "ar_SA",
    url: siteUrl,
    siteName: profile.siteTitle,
    title: profile.siteTitle,
    description: profile.tagline,
  },
  twitter: { card: "summary_large_image", title: profile.siteTitle, description: profile.tagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0f1e3a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.degree,
    url: siteUrl,
  };
  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <body className="min-h-screen font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
          تخطي إلى المحتوى
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
