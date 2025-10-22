import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { I18nProvider } from "@/components/i18n-provider"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Revizor - Практично. Эстетично. Надёжно.",
  description: "Невидимые ревизионные люки премиум-класса для идеальной интеграции в интерьер",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-r.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-48x48.svg", sizes: "48x48", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-r.svg",
    apple: [
      { url: "/favicon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <I18nProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Suspense fallback={null}>{children}</Suspense>
            <Footer />
          </div>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
