"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductConfigurator } from "@/components/product-configurator"
import { useI18n } from "@/components/i18n-provider"

function ConfiguratorContent() {
  const { t } = useI18n() as any
  const searchParams = useSearchParams()
  const modelParam = searchParams.get("model")

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t("cfg.page.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("cfg.page.subtitle")}</p>
      </div>
      <ProductConfigurator initialModel={modelParam || "transformer"} />
    </main>
  )
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ConfiguratorContent />
    </Suspense>
  )
}
