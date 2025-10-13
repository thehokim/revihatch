"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ProductConfigurator } from "@/components/product-configurator"
import { useI18n } from "@/components/i18n-provider"

function ConfiguratorContent() {
  const { t } = useI18n() as any
  const searchParams = useSearchParams()
  const modelParam = searchParams.get("model")

  // Get images based on model
  const getImagesForModel = (model: string) => {
    switch (model) {
      case 'anodos':
        return {
          main: "/lyuk4.png",
          thumbnails: ["/ano1.jpg", "/ano2.jpg"],
          titleKey: "cfg.product.anodos.title",
          descriptionKey: "cfg.product.anodos.description",
          detailsKey: "cfg.product.anodos.details"
        }
      case 'napolny':
        return {
          main: "/lyuk1.png",
          thumbnails: ["/lyuk1.png", "/lyuk2.png", "/lyuk3.png"],
          titleKey: "cfg.product.napolny.title",
          descriptionKey: "cfg.product.napolny.description",
          detailsKey: "cfg.product.napolny.details"
        }
      case 'floor':
        return {
          main: "/lyuk3.png",
          thumbnails: ["/floor-access-hatch-industrial-design.jpg", "/lyuk3.png"],
          titleKey: "cfg.product.floor.title",
          descriptionKey: "cfg.product.floor.description",
          detailsKey: "cfg.product.floor.details"
        }
      case 'transformer':
      default:
        return {
          main: "/lyuk1.png", 
          thumbnails: ["/lyuk1.png", "/lyuk2.png", "/lyuk3.png"],
          titleKey: "cfg.product.transformer.title",
          descriptionKey: "cfg.product.transformer.description",
          detailsKey: "cfg.product.transformer.details"
        }
    }
  }

  const images = getImagesForModel(modelParam || "transformer")

  return (
    <main>
      {/* Product Detail Section */}
      <section className="bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            {/* Left Column - Main Image */}
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

            {/* Right Column - Text Content */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">{t(images.titleKey)}</h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{t(images.descriptionKey)}</p>
                <p>{t(images.detailsKey)}</p>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
            {/* Image Thumbnails */}
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

      {/* Configurator Section */}
      <section className="bg-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("cfg.page.title")}</h1>
            <p className="text-base sm:text-lg text-muted-foreground">{t("cfg.page.subtitle")}</p>
          </div>
          <ProductConfigurator initialModel={modelParam || "transformer"} />
        </div>
      </section>
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
