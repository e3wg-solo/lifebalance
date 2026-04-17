import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
  themeColor: "#FAF8F5",
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
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
