"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Hero() {
  const { t, lang } = useI18n() as any
  const router = useRouter()
  const [hoveredHatch, setHoveredHatch] = useState<number | null>(null)
  const [clickedHatch, setClickedHatch] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hatchConfig: Record<number, { productId: string; nameUz: string; nameRu: string }> = {
    1: {
      productId: "69006228bafc5fb7b6d2a888",
      nameUz: "Bo'yoq ostidagi alyumin lyuk",
      nameRu: "Люк алюминиевый под малярку"
    },
    2: {
      productId: "68ff560a5c85e742c1891de5",
      nameUz: "Devor lyuki \"Transformer\"",
      nameRu: "Люк настенный \"Трансформер\""
    },
    3: {
      productId: "68f36177f6edd352f8920e1d",
      nameUz: "Devor lyuki «Universal»",
      nameRu: "Люк настенный «Универсал»"
    },
    4: {
      productId: "68f36177f6edd352f8920e1f",
      nameUz: "Pol lyuki",
      nameRu: "Напольный люк"
    }
  }
  
  const handleHatchClick = (hatchId: number) => {
    const config = hatchConfig[hatchId]
    if (config) {
      router.push(`/configurator?id=${config.productId}`)
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
      name: mounted ? (lang === "uz" ? hatchConfig[1].nameUz : hatchConfig[1].nameRu) : hatchConfig[1].nameRu,
      image: "/5.png",
      position: "top-[25%] left-[20%]"
    },
    {
      id: 2,
      name: mounted ? (lang === "uz" ? hatchConfig[2].nameUz : hatchConfig[2].nameRu) : hatchConfig[2].nameRu,
      image: "/4.png", 
      position: "top-[42%] left-[20%]"
    },
    {
      id: 3,
      name: mounted ? (lang === "uz" ? hatchConfig[3].nameUz : hatchConfig[3].nameRu) : hatchConfig[3].nameRu,
      image: "/3.png",
      position: "top-[60%] left-[20%]"
    },
    {
      id: 4,
      name: mounted ? (lang === "uz" ? hatchConfig[4].nameUz : hatchConfig[4].nameRu) : hatchConfig[4].nameRu,
      image: "/2.png",
      position: "top-[75%] left-[20%]"
    }
  ]

  return (
    <section className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[848px] justify-center items-center flex py-2 sm:py-4 md:py-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2D2D2D_0%,#1B1B1B_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFFFFF08_0.5px,transparent_0.5px),linear-gradient(to_bottom,#FFFFFF08_0.5px,transparent_0.5px)] bg-[size:7px_7px] rotate-[71.13deg] origin-center scale-600" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#1B1B1B] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#1B1B1B] via-transparent to-transparent" />
        </div>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 w-full lg:w-auto lg:flex-1 lg:max-w-2xl">

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }} suppressHydrationWarning>
              <span className="block">{t("hero.title1")}</span>
              <span className="block">{t("hero.title2")}</span>
              <span className="block">{t("hero.title3")}</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" suppressHydrationWarning>
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

          <div className="relative flex justify-end items-center w-full lg:w-auto lg:flex-shrink-0">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Base image */}
              <Image
                src="/Herolyuk.png"
                alt="3D модель угла комнаты с люком"
                width={1200}
                height={1200}
                className="w-full h-auto object-contain"
                priority
              />
              
              {/* Overlay images - pre-rendered for instant switching */}
              {hatches.map((hatch) => (
                <Image
                  key={hatch.id}
                  src={hatch.image}
                  alt="3D модель угла комнаты с люком"
                  width={1200}
                  height={1200}
                  className={`absolute inset-0 w-full h-auto object-contain transition-opacity duration-200 ${
                    hoveredHatch === hatch.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  loading="eager"
                />
              ))}
              
              {hatches.map((hatch) => (
                <div
                  key={hatch.id}
                  className={`absolute ${hatch.position} z-10`}
                  onMouseEnter={() => setHoveredHatch(hatch.id)}
                  onMouseLeave={() => setHoveredHatch(null)}
                  onClick={() => handleHatchClick(hatch.id)}
                >
                  <div className="relative group cursor-pointer">
                    <div className={`w-8 h-8 bg-white/10 border border-white/50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ${
                      clickedHatch === hatch.id ? 'bg-white/20 border-white/70' : ''
                    }`}>
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className={`absolute right-16 top-1/2 -translate-y-1/2 bg-[#2D2D2D] border border-white/50 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden md:block ${
                      hoveredHatch === hatch.id ? 'opacity-100' : ''
                    }`} suppressHydrationWarning>
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

