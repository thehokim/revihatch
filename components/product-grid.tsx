"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"

const products = [
  {
    id: "transformer",
    name: "Transformer",
    description: "",
    features: [],
    image: "/lyuk1.png",
  },
  {
    id: "universal",
    name: "Universal",
    description: "",
    features: [],
    image: "/lyuk2.png",
  },
  {
    id: "floor",
    name: "Floor",
    description: "",
    features: [],
    image: "/lyuk3.png",
  },
  {
    id: "anodos",
    name: "Anodos",
    description: "",
    features: [],
    image: "/lyuk4.png",
  },
]

export function ProductGrid() {
  const { t } = useI18n() as any
  return (
    <section id="products" className="bg-white py-16">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-4xl font-bold text-black">{t("products.title")}</h2>
          <p className="text-lg text-black">{t("products.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="bg-white rounded-[10px] border border-[#DFDFDF] overflow-hidden w-full max-w-[474px] h-auto flex flex-col p-0">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Content */}
              <CardContent className="p-0 flex flex-col flex-1 m-0 text-center">
                <div className="flex-1 px-2">
                  <CardTitle className="mb-1 text-lg font-bold text-black">{t(`products.${product.id}.name`)}</CardTitle>
                  <CardDescription className="text-sm text-black leading-relaxed">{t(`products.${product.id}.desc`)}</CardDescription>
                </div>
                
                {/* Button - always at bottom */}
                <div className="my-2 text-center">
                  <Button variant="ghost" className="p-0 h-auto text-black hover:text-blue-700 hover:bg-transparent font-normal" asChild>
                    <Link href={`/configurator?model=${product.id}`}>
                      {t("products.configure")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
