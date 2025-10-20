"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useI18n } from "@/components/i18n-provider"
import { useProducts } from "@/hooks/use-products"
import { SupportedLanguage } from "@/lib/types"

export function Header() {
  const { t, lang, setLang } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  
  // Get current language and products
  const currentLanguage = lang === 'uz' ? 'uz' : 'ru' as SupportedLanguage
  const { products, getProductByCategory } = useProducts(currentLanguage)

  // Function to handle order button click
  const handleOrderClick = () => {
    // Try to get the first available product from transformer category (most common)
    const transformerProduct = getProductByCategory('transformer')
    if (transformerProduct) {
      router.push(`/configurator?id=${transformerProduct._id}`)
      return
    }
    
    // Fallback to first available product
    if (products.length > 0) {
      router.push(`/configurator?id=${products[0]._id}`)
      return
    }
    
    // Last fallback to products page
    router.push('/#products')
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/HeaderLogo.svg"
            alt="Revizor"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#products"
            className="text-sm font-medium transition-colors hover:text-foreground text-black"
          >
            {t("nav.products")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-foreground text-black"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/#reviews"
            className="text-sm font-medium transition-colors hover:text-foreground text-black"
          >
            {t("nav.reviews")}
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium transition-colors hover:text-foreground text-black"
          >
            {t("nav.faq")}
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm" className="border border-gray-100/50 bg-white/25 rounded-lg text-foreground hover:bg-transparent" onClick={() => setLang(lang === "ru" ? "uz" : "ru")}>{lang === "ru" ? "RU" : "UZ"}</Button>
          
          <Button onClick={handleOrderClick}>
            {t("action.order")}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="sm" className="bg-transparent border-transparent text-foreground hover:bg-transparent" onClick={() => setLang(lang === "ru" ? "uz" : "ru")}>{lang === "ru" ? "RU" : "UZ"}</Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] max-w-[90vw]">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">{t("nav.menu")}</h2>
                <p className="text-sm text-muted-foreground">{t("nav.menuDesc")}</p>
              </div>
              <div className="flex flex-col space-y-4">
                <Link
                  href="/#products"
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.products")}
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.about")}
                </Link>
                <Link
                  href="/#reviews"
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.reviews")}
                </Link>
                <Link
                  href="/#faq"
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.faq")}
                </Link>
                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleOrderClick()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {t("action.order")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}
