"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"

const reviews = [
  {
    id: "alexey",
    rating: 5,
    image: "/card1.png",
  },
  {
    id: "maria",
    rating: 5,
    image: "/card2.png",
  },
  {
    id: "dmitry",
    rating: 5,
    image: "/card3.png",
  },
]

export function Reviews() {
  const { t } = useI18n() as any
  return (
    <section id="reviews" className="bg-white py-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-black text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 4vw, 48px)', lineHeight: '100%', letterSpacing: '0%' }}>{t("reviews.title")}</h2>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>{t("reviews.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="relative overflow-hidden bg-black/90 rounded-[10px] border border-white/80 w-full max-w-[608px] h-[200px] sm:h-[250px] md:h-[271.32px]">
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

              <div className="relative z-10 px-4 sm:px-5 md:px-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[#B2B2B2] text-sm sm:text-base md:text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>{t(`reviews.cards.${review.id}.date`)}</div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center">
                  <p className="text-white leading-relaxed text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>{t(`reviews.cards.${review.id}.content`)}</p>
                </div>

                <div className="mt-2">
                  <div className="text-white text-lg sm:text-xl md:text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(18px, 4vw, 25px)' }}>{t(`reviews.cards.${review.id}.name`)}</div>
                  <div className="text-[#B2B2B2] text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 'clamp(12px, 2vw, 15px)' }}>{t(`reviews.cards.${review.id}.role`)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
