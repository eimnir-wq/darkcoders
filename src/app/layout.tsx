import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/provider";
import { getServerLocale } from "@/i18n/server";
import { dirOf } from "@/i18n/config";
import { ToastProvider } from "@/components/ui/Toast";
import { AppModalsProvider } from "@/components/providers/AppModals";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-tech",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5555";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dark Coders — Cybersecurity Operations Platform",
    template: "%s · Dark Coders",
  },
  description:
    "AI-powered cybersecurity, threat intelligence, compliance and security operations for modern enterprises.",
  applicationName: "Dark Coders",
  keywords: [
    "cybersecurity",
    "threat intelligence",
    "SOC",
    "SIEM",
    "SOAR",
    "GRC",
    "compliance",
    "zero trust",
    "incident response",
    "AI security",
  ],
  authors: [{ name: "Dark Coders" }],
  creator: "Dark Coders",
  publisher: "Dark Coders",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/",
      ar: "/",
      es: "/",
      de: "/",
      pt: "/",
      it: "/",
      nl: "/",
      tr: "/",
      zh: "/",
      ja: "/",
      ko: "/",
      ru: "/",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Dark Coders",
    title: "Dark Coders — Cybersecurity Operations Platform",
    description:
      "AI-powered cybersecurity, threat intelligence, compliance and security operations for modern enterprises.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Coders — Cybersecurity Operations Platform",
    description:
      "AI-powered cyber defense, threat intelligence and compliance for a safer, more resilient world.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050807",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  const dir = dirOf(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${mono.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-dc-black font-sans antialiased">
        <ToastProvider>
          <I18nProvider initialLocale={locale}>
            <AppModalsProvider>
              <SkipLink />
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </AppModalsProvider>
          </I18nProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
