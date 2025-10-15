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
  title: "Revizor - Премиальные ревизионные люки",
  description: "Невидимые ревизионные люки премиум-класса для идеальной интеграции в интерьер",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-r.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-r.svg",
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
