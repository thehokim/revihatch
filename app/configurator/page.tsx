"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ProductConfigurator } from "@/components/product-configurator"
import { useI18n } from "@/components/i18n-provider"
import { PageSkeleton } from "@/components/page-skeleton"

function ConfiguratorContent() {
  const { t } = useI18n() as any
  const searchParams = useSearchParams()
  const modelParam = searchParams.get("model")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getImagesForModel = (model: string) => {
    switch (model) {
      case 'anodos':
        return {
          main: "/ano1.jpg",
          thumbnails: ["/ano1.jpg", "/ano2.jpg", "/ano3.png"],
          titleKey: "cfg.product.anodos.title",
          descriptionKey: "cfg.product.anodos.description",
          detailsKey: "cfg.product.anodos.details"
        }
      case 'napolny':
        return {
          main: "/nap3.jpg",
          thumbnails: ["/nap1.jpg", "/nap2.jpg", "/nap3.jpg"],
          titleKey: "cfg.product.napolny.title",
          descriptionKey: "cfg.product.napolny.description",
          detailsKey: "cfg.product.napolny.details"
        }
      case 'floor':
        return {
          main: "/uni1.png",
          thumbnails: ["/uni1.png", "/uni2.png", "/uni3.png"],
          titleKey: "cfg.product.floor.title",
          descriptionKey: "cfg.product.floor.description",
          detailsKey: "cfg.product.floor.details"
        }
      case 'universal':
        return {
          main: "/uni1.png",
          thumbnails: ["/uni1.png", "/uni2.png", "/uni3.png"],
          titleKey: "cfg.product.universal.title",
          descriptionKey: "cfg.product.universal.description",
          detailsKey: "cfg.product.universal.details"
        }
      case 'transformer':
      default:
        return {
          main: "/tra3.jpg", 
          thumbnails: ["/tra1.jpg", "/tra2.jpg", "/tra3.jpg"],
          titleKey: "cfg.product.transformer.title",
          descriptionKey: "cfg.product.transformer.description",
          detailsKey: "cfg.product.transformer.details"
        }
    }
  }

  const images = getImagesForModel(modelParam || "transformer")

  if (!isMounted) {
    return <PageSkeleton variant="configurator" />
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-white py-8 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2D2D2D_0%,#1B1B1B_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFFFFF08_0.5px,transparent_0.5px),linear-gradient(to_bottom,#FFFFFF08_0.5px,transparent_0.5px)] bg-[size:7px_7px] rotate-[71.13deg] origin-center scale-600" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#1B1B1B] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#1B1B1B] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <Image
                src={images.main}
                alt={t(images.titleKey)}
                width={600}
                height={600}
                className="w-full h-auto object-cover rounded-lg"
                quality={100}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{t(images.titleKey)}</h2>
              
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p>{t(images.descriptionKey)}</p>
                <p>{t(images.detailsKey)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={images.thumbnails[0]}
                alt={`${t(images.titleKey)} - вид 1`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={images.thumbnails[1]}
                alt={`${t(images.titleKey)} - вид 2`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("cfg.page.title")}</h1>
            <p className="text-base sm:text-lg text-muted-foreground">{t("cfg.page.subtitle")}</p>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductConfigurator initialModel={modelParam || "transformer"} />
        </div>
      </section>
    </main>
  )
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="configurator" />}>
      <ConfiguratorContent />
    </Suspense>
  )
}
