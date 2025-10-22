"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ProductConfigurator } from "@/components/product-configurator"
import { useI18n } from "@/components/i18n-provider"
import { PageSkeleton } from "@/components/page-skeleton"
import { useProducts } from "@/hooks/use-products"
import { getDiverseImageUrl, PRODUCT_IMAGE_MAP, getLocalizedProduct } from "@/lib/api"
import { SupportedLanguage } from "@/lib/types"

function ConfiguratorContent() {
  const { t, lang } = useI18n() as any
  const searchParams = useSearchParams()
  const productIdParam = searchParams.get("id")
  const [isMounted, setIsMounted] = useState(false)
  
  const currentLanguage = lang === 'uz' ? 'uz' : 'ru' as SupportedLanguage
  
  const { products, loading: productsLoading, getProductById } = useProducts(currentLanguage)
  const product = productIdParam ? getProductById(productIdParam) : null
  const localizedProduct = product ? getLocalizedProduct(product, currentLanguage) : null

  useEffect(() => {
    setIsMounted(true)
  }, [currentLanguage])

  if (!isMounted) {
    return <PageSkeleton variant="configurator" />
  }

  if (!productIdParam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Неверный URL</h2>
          <p className="text-gray-600 mb-4">Не указан ID продукта</p>
        </div>
      </div>
    )
  }

  if (productsLoading) {
    return <PageSkeleton variant="configurator" />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Продукт не найден</h2>
          <p className="text-gray-600 mb-4">Продукт с ID "{productIdParam}" не найден в API</p>
        </div>
      </div>
    )
  }

  const mainImage = getDiverseImageUrl(product.mainImage || product.images[0], product.category, 0)
  const thumbnails = product.images.length > 0 
    ? product.images.slice(0, 3).map((img, index) => getDiverseImageUrl(img, product.category, index + 1))
    : [mainImage, mainImage, mainImage]

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
              <img
                src={mainImage}
                alt={localizedProduct?.name || 'Product'}
                className="w-full h-auto object-cover rounded-lg"
                style={{ maxWidth: '600px', maxHeight: '600px' }}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = PRODUCT_IMAGE_MAP[product.category] || '/placeholder.svg'
                }}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{localizedProduct?.name || 'Loading...'}</h2>
              
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p>{localizedProduct?.description || 'Loading...'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
            {thumbnails.map((thumbnail, index) => (
              <div key={index} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={thumbnail}
                  alt={`${localizedProduct?.name || 'Product'} - вид ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = PRODUCT_IMAGE_MAP[product.category] || '/placeholder.svg'
                  }}
                />
              </div>
            ))}
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
          <ProductConfigurator productId={productIdParam} />
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
