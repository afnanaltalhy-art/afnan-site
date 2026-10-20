import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSettings, hexToRgbTriplet, darken } from "@/lib/settings";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const almarai = localFont({
  src: [
    { path: "./fonts/Almarai-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Almarai-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-almarai",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: `${s.siteName} | دروس العلوم التفاعلية`, template: `%s | ${s.siteName}` },
    description: s.heroSubtitle,
    openGraph: { title: s.siteName, description: s.heroSubtitle, locale: "ar_SA", type: "website" },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#06201E", width: "device-width", initialScale: 1 };

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const vars = {
    "--brand": hexToRgbTriplet(s.brandColor, "20 145 127"),
    "--brand-deep": darken(s.brandColor),
    "--accent": hexToRgbTriplet(s.accentColor, "231 180 22"),
  } as React.CSSProperties;
  return (
    <html lang="ar" dir="rtl" className={almarai.variable} style={vars}>
      <body className="min-h-screen font-sans">
        <Header siteName={s.siteName} />
        <main id="main">{children}</main>
        <Footer settings={s} />
      </body>
    </html>
  );
}
