"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"

export function Hero() {
  const { t } = useI18n() as any
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-interior.jpg"
          alt="Современный интерьер с чистыми линиями"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">{t("hero.badge")}</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-white md:text-7xl">
            {t("hero.title1")}
            <br />
            <span className="text-white/90">{t("hero.title2")}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-white/90 md:text-xl">{t("hero.subtitle")}</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-white text-black hover:bg-white/90" asChild>
              <Link href="/configurator">
                {t("hero.configurator")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
              <Link href="#products">{t("hero.viewModels")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
    </section>
  )
}
