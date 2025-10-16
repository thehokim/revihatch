"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"

const products = [
  {
    id: "transformer",
    name: "Transformer",
    description: "",
    image: "/tra3.jpg",
  },
  {
    id: "floor",
    name: "Floor",
    description: "",
    image: "ano1.jpg",
  },
  {
    id: "universal",
    name: "Universal",
    description: "",
    image: "/nap1.jpg",
  },
  {
    id: "anodos",
    name: "Anodos",
    description: "",
    image: "/nap3.jpg",
  },
]

const redirectMap: Record<string, string> = {
  transformer: "/configurator?model=transformer",
  floor: "/configurator?model=anodos",
  universal: "/configurator?model=napolny",
  anodos: "/configurator?model=anodos",
}

export function ProductGrid() {
  const { t } = useI18n() as any

  return (
    <section id="products" className="bg-white py-16 px-4 sm:px-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-black text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 4vw, 48px)', lineHeight: '100%', letterSpacing: '0%' }}>{t("products.title")}</h2>
          <p className="text-lg text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>{t("products.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={redirectMap[product.id] || `/configurator?model=${product.id}`}
              className="block h-full"
            >
              <Card className="bg-white rounded-[10px] border border-[#DFDFDF] overflow-hidden w-full max-w-[474px] h-full flex flex-col p-0">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <CardContent className="p-0 flex flex-col flex-1 m-0 text-center">
                  <div className="flex-1 px-2">
                    <CardTitle className="mb-1 text-lg font-bold text-black">
                      {t(`products.${product.id}.name`)}
                    </CardTitle>
                    <CardDescription className="text-sm text-black leading-relaxed">
                      {t(`products.${product.id}.desc`)}
                    </CardDescription>
                  </div>

                  <div className="my-2 text-center">
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
