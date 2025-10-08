"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"

export default function AboutPage() {
  const { t } = useI18n() as any
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0">
          <Image
            src="/reviews-bg.jpg"
            alt="Производство ревизионных люков"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="mb-4 text-balance text-5xl font-bold tracking-tight md:text-6xl">{t("about.hero.title")}</h1>
          <p className="mx-auto max-w-3xl text-white/90 text-lg md:text-xl leading-relaxed">{t("about.hero.subtitle")}</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild className="bg-white text-black hover:bg-white/90">
              <Link href="#values">{t("about.hero.valuesBtn")}</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link href="/configurator">{t("about.hero.configuratorBtn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="border-b border-border/40 bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{t("about.values.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("about.values.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="relative overflow-hidden rounded-xl border shadow-sm">
              <div className="absolute inset-0">
                <Image src="/minimalist-invisible-wall-hatch-aluminum.jpg" alt="Премиальные материалы" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              <div className="relative z-10 p-6 text-white">
                <h3 className="mb-2 text-xl font-semibold">{t("about.values.card1.title")}</h3>
                <p className="text-sm text-white/90">{t("about.values.card1.desc")}</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="relative overflow-hidden rounded-xl border shadow-sm">
              <div className="absolute inset-0">
                <Image src="/industrial-wall-access-panel-white.jpg" alt="Инженерная точность" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              <div className="relative z-10 p-6 text-white">
                <h3 className="mb-2 text-xl font-semibold">{t("about.values.card2.title")}</h3>
                <p className="text-sm text-white/90">{t("about.values.card2.desc")}</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative overflow-hidden rounded-xl border shadow-sm">
              <div className="absolute inset-0">
                <Image src="/premium-anodized-aluminum-hatch.jpg" alt="Эстетичная интеграция" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              <div className="relative z-10 p-6 text-white">
                <h3 className="mb-2 text-xl font-semibold">{t("about.values.card3.title")}</h3>
                <p className="text-sm text-white/90">{t("about.values.card3.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Location & Contacts */}
      <section className="border-b border-border/40 bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border bg-background shadow-lg">
              <iframe
                title={t("about.map.title")}
                src="https://yandex.ru/map-widget/v1/?ll=69.284%2C41.233&z=18&l=map,sat&pt=69.284,41.233,pm2rdl"
                className="h-[460px] w-full saturate-125 contrast-110 brightness-105"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Soft gradient vignette for premium feel */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,#0000000d_0%,transparent_60%)]" />
            </div>

            {/* Company Info */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold leading-tight mb-4">{t("about.contact.address")}</h3>

              <div className="mb-6">
                <div className="text-muted-foreground mb-2 text-lg font-medium">{t("about.contact.hours.title")}</div>
                <div className="space-y-1 text-base">
                  <div>{t("about.contact.hours.weekdays")}</div>
                  <div>{t("about.contact.hours.friday")}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-muted-foreground mb-2 text-lg font-medium">{t("about.contact.phone.title")}</div>
                <a href="tel:+998990968180" className="text-2xl font-semibold">+9989 906 8180</a>
              </div>

              <div>
                <a href="tel:+998990968180" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:opacity-90">
                  {t("about.contact.callBtn")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


