"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"

const reviews = [
  {
    id: "alexey",
    rating: 5,
    image: "/lyuk1.png",
  },
  {
    id: "maria",
    rating: 5,
    image: "/lyuk2.png",
  },
  {
    id: "dmitry",
    rating: 5,
    image: "/lyuk3.png",
  },
]

export function Reviews() {
  const { t } = useI18n() as any
  return (
    <section id="reviews" className="bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-black">{t("reviews.title")}</h2>
          <p className="text-lg text-gray-600">{t("reviews.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="relative overflow-hidden bg-black rounded-[10px] border border-white/50 w-full max-w-[608px] h-auto">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image 
                  src={review.image ?? "/placeholder.jpg"} 
                  alt="Review background" 
                  fill 
                  className="object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>

              {/* Content */}
              <div className="relative z-10 px-6 h-full flex flex-col justify-between">
                {/* Date and Rating */}
                <div>
                  <div className="text-white text-sm mb-1">25 мая 2025 г.</div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="flex-1 flex items-center">
                  <p className="text-white leading-relaxed">{t(`reviews.cards.${review.id}.content`)}</p>
                </div>

                {/* Reviewer Info */}
                <div className="mt-2">
                  <div className="font-bold text-white">{t(`reviews.cards.${review.id}.name`)}</div>
                  <div className="text-sm text-white">{t(`reviews.cards.${review.id}.role`)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
