import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import { SupabaseAuthProvider } from "@/components/providers/SupabaseAuthProvider";

export const metadata: Metadata = {
  title: {
    default: "LifeBalance — Колесо жизни",
    template: "%s | LifeBalance",
  },
  description:
    "Визуализируй и отслеживай баланс 8 ключевых сфер жизни. Интерактивное колесо, 30-дневные циклы, умные инсайты.",
  keywords: ["колесо жизни", "баланс", "саморазвитие", "self-care", "трекер"],
  authors: [{ name: "LifeBalance" }],
  manifest: "/manifest.json",
  formatDetection: { telephone: false },
  openGraph: {
    title: "LifeBalance — Колесо жизни",
    description: "Визуализируй баланс 8 сфер жизни и расти каждые 30 дней",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        {/* iOS apple-touch-icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <SupabaseAuthProvider>
          <ThemeProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </ThemeProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
