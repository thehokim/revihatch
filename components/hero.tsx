"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/hooks/use-products"
import { SupportedLanguage } from "@/lib/types"

export function Hero() {
  const { t, lang } = useI18n() as any
  const router = useRouter()
  const [hoveredHatch, setHoveredHatch] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [clickedHatch, setClickedHatch] = useState<number | null>(null)
  
  // Get current language and products
  const currentLanguage = lang === 'uz' ? 'uz' : 'ru' as SupportedLanguage
  const { products, getProductByCategory } = useProducts(currentLanguage)

  // Map hatch IDs to categories according to requirements
  const hatchCategoryMap: Record<number, string> = {
    1: "transformer",      // Первый сверху плюс
    2: "anodos", // Следующие 2 плюса
    3: "anodos", // Следующие 2 плюса
    4: "napolny"      // Самый нижний
  }
  
  const handleHatchClick = (hatchId: number) => {
    const category = hatchCategoryMap[hatchId]
    if (category) {
      // Get the first product of this category
      const product = getProductByCategory(category)
      if (product) {
        router.push(`/configurator?id=${product._id}`)
      } else {
        // Fallback to category-based URL if product not found
        router.push(`/configurator?model=${category}`)
      }
    }
  }
  
  const handleMobileClick = (hatchId: number) => {
    if (clickedHatch === hatchId) {
      setClickedHatch(null)
      setHoveredHatch(null)
    } else {
      setClickedHatch(hatchId)
      setHoveredHatch(hatchId)
    }
  }
  
  const hatches = [
    {
      id: 1,
      name: t("hero.hatches.paint"),
      image: "/5.png",
      position: "top-[25%] left-[20%]"
    },
    {
      id: 2,
      name: t("hero.hatches.wall"),
      image: "/4.png", 
      position: "top-[42%] left-[20%]"
    },
    {
      id: 3,
      name: t("hero.hatches.tile"),
      image: "/3.png",
      position: "top-[60%] left-[20%]"
    },
    {
      id: 4,
      name: t("hero.hatches.floor"),
      image: "/2.png",
      position: "top-[75%] left-[20%]"
    }
  ]

  return (
    <section className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[848px] justify-center items-center flex py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2D2D2D_0%,#1B1B1B_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFFFFF08_0.5px,transparent_0.5px),linear-gradient(to_bottom,#FFFFFF08_0.5px,transparent_0.5px)] bg-[size:7px_7px] rotate-[71.13deg] origin-center scale-600" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#1B1B1B] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#1B1B1B] via-transparent to-transparent" />
        </div>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex lg:flex-row flex-col justify-between items-center gap-8 sm:gap-10 md:gap-12">
          <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full lg:w-auto">
            <div className="inline-block rounded-full bg-[#ffffff]/10 border border-white/50 px-3 py-1">
              <span className="text-xs sm:text-sm font-medium text-white">{t("hero.badge")}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
              <br />
              {t("hero.title3")}
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="group bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
                <Link href="/configurator">
                  {t("hero.configurator")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
                <Link href="#products">{t("hero.viewModels")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center items-center w-full lg:w-auto">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <Image
                src="/Herolyuk.png"
                alt="3D модель угла комнаты с люком"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
              
              {hoveredHatch && (
                <Image
                  src={hatches.find(h => h.id === hoveredHatch)?.image || "/Herolyuk.png"}
                  alt="3D модель угла комнаты с люком"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-auto object-contain animate-fade-in image-overlay"
                />
              )}
              
              {hatches.map((hatch) => (
                <div
                  key={hatch.id}
                  className={`absolute ${hatch.position} z-10`}
                  onMouseEnter={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setHoveredHatch(hatch.id)
                        setIsTransitioning(false)
                      }, 50)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setHoveredHatch(null)
                        setIsTransitioning(false)
                      }, 50)
                    }
                  }}
                  onClick={() => handleHatchClick(hatch.id)}
                >
                  <div className="relative group cursor-pointer">
                    <div className={`w-8 h-8 bg-white/10 border border-white/50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ${
                      clickedHatch === hatch.id ? 'bg-white/20 border-white/70' : ''
                    }`}>
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className={`absolute right-16 top-1/2 -translate-y-1/2 bg-[#2D2D2D] border border-white/50 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block ${
                      hoveredHatch === hatch.id ? 'opacity-100' : ''
                    }`}>
                      {hatch.name}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[7px] w-3 h-3 bg-[#2D2D2D] border-t border-r border-white/50 rotate-45"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

