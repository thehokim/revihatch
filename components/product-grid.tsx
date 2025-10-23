"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"
import { convertApiProductToLocal } from "@/lib/api"
import { LocalProduct, SupportedLanguage } from "@/lib/types"
import { useProducts } from "@/hooks/use-products"

export function ProductGrid() {
  const { t, lang } = useI18n() as any
  const currentLanguage = lang === 'uz' ? 'uz' : 'ru' as SupportedLanguage
  const { products: apiProducts, loading, error } = useProducts(currentLanguage)
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([])

  useEffect(() => {
    if (apiProducts.length > 0) {
      const convertedProducts = apiProducts.map(product => convertApiProductToLocal(product, currentLanguage))
      setLocalProducts(convertedProducts)
    } else if (!loading && !error) {
      setLocalProducts([
        {
          id: "transformer",
          name: t("products.transformer.name"),
          description: t("products.transformer.desc"),
          image: "/tra3.jpg",
        },
        {
          id: "floor",
          name: t("products.floor.name"),
          description: t("products.floor.desc"),
          image: "/ano1.jpg",
        },
        {
          id: "universal",
          name: t("products.universal.name"),
          description: t("products.universal.desc"),
          image: "/nap1.jpg",
        },
        {
          id: "anodos",
          name: t("products.anodos.name"),
          description: t("products.anodos.desc"),
          image: "/nap3.jpg",
        },
      ])
    }
  }, [apiProducts, loading, error, currentLanguage, t])

  if (loading) {
    return (
      <section id="products" className="bg-white py-16 px-4 sm:px-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-black text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 4vw, 48px)', lineHeight: '100%', letterSpacing: '0%' }}>{t("products.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-6 sm:gap-8 items-stretch">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-[10px] w-full h-[400px]"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="bg-white py-16 px-4 sm:px-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-black text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 4vw, 48px)', lineHeight: '100%', letterSpacing: '0%' }}>{t("products.title")}</h2>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-6 sm:gap-8 items-stretch">
          {localProducts.map((product) => (
            <Link
              key={product.id}
              href={`/configurator?id=${product.id}`}
              className="block h-full"
            >
              <Card className="bg-white rounded-[10px] border border-[#DFDFDF] overflow-hidden w-full h-[450px] flex flex-col p-0">
                <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </div>

                <CardContent className="p-0 flex flex-col flex-1 m-0">
                  <div className="flex-1 px-3 flex flex-col">
                    <div className="h-10 flex items-center justify-center mb-2">
                      <CardTitle className="text-lg font-bold text-black leading-tight text-center">
                        {product.name}
                      </CardTitle>
                    </div>
                    <div className="flex-1 flex items-start">
                      <CardDescription className="text-sm text-black leading-relaxed overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4',
                        maxHeight: 'calc(1.4em * 6)'
                      }}>
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="px-3 pb-3 flex-shrink-0 text-center">
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-black hover:text-blue-700 hover:bg-transparent font-normal"
                      asChild
                    >
                      <span>{t("products.configure")}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
