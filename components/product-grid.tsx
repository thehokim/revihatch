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
    image: "/minimalist-invisible-wall-hatch-aluminum.jpg",
  },
  {
    id: "universal",
    name: "Universal",
    description: "",
    features: [],
    image: "/industrial-wall-access-panel-white.jpg",
  },
  {
    id: "floor",
    name: "Floor",
    description: "",
    features: [],
    image: "/floor-access-hatch-industrial-design.jpg",
  },
  {
    id: "anodos",
    name: "Anodos",
    description: "",
    features: [],
    image: "/premium-anodized-aluminum-hatch.jpg",
  },
]

export function ProductGrid() {
  const { t } = useI18n() as any
  return (
    <section id="products" className="border-b border-border/40 bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">{t("products.title")}</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{t("products.subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group relative h-[500px] overflow-hidden transition-all hover:shadow-lg">
              {/* Image - full card background */}
              <div className="absolute inset-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              
              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                <div>
                  <CardTitle className="mb-2 text-xl text-white">{t(`products.${product.id}.name`)}</CardTitle>
                  <CardDescription className="mb-4 text-sm leading-relaxed text-white/90">{t(`products.${product.id}.desc`)}</CardDescription>
                  <ul className="space-y-2">
                    {[0,1,2].map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <div className="h-1 w-1 rounded-full bg-white" />
                        {t(`products.${product.id}.f${i+1}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Button - always at bottom */}
                <Button variant="ghost" className="group/btn w-full bg-white/10 text-white hover:bg-white/20" asChild>
                  <Link href={`/configurator?model=${product.id}`}>
                    {t("products.configure")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
