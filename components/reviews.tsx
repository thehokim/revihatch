"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"

const reviews = [
  {
    id: "alexey",
    rating: 5,
    image: "/minimalist-invisible-wall-hatch-aluminum.jpg",
  },
  {
    id: "maria",
    rating: 5,
    image: "/industrial-wall-access-panel-white.jpg",
  },
  {
    id: "dmitry",
    rating: 5,
    image: "/floor-access-hatch-industrial-design.jpg",
  },
]

export function Reviews() {
  const { t } = useI18n() as any
  return (
    <section id="reviews" className="border-b border-border/40 bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">{t("reviews.title")}</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{t("reviews.subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            {reviews.map((review, index) => (
            <Card key={index} className="relative overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image src={review.image ?? "/placeholder.jpg"} alt="Review background" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-white/90">{t(`reviews.cards.${review.id}.content`)}</p>
                <div>
                  <div className="font-semibold text-white">{t(`reviews.cards.${review.id}.name`)}</div>
                  <div className="text-sm text-white/80">{t(`reviews.cards.${review.id}.role`)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
