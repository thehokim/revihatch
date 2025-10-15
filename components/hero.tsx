"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"
import { useState } from "react"

export function Hero() {
  const { t } = useI18n() as any
  const [hoveredHatch, setHoveredHatch] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [clickedHatch, setClickedHatch] = useState<number | null>(null)
  
  // Handle mobile click
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
      name: "Люк под покраску",
      image: "/5.png",
      position: "top-[25%] left-[20%]"
    },
    {
      id: 2,
      name: "Люк в стене",
      image: "/4.png", 
      position: "top-[42%] left-[20%]"
    },
    {
      id: 3,
      name: "Люк в плитке",
      image: "/3.png",
      position: "top-[60%] left-[20%]"
    },
    {
      id: 4,
      name: "Люк в полу",
      image: "/2.png",
      position: "top-[75%] left-[20%]"
    }
  ]

  return (
    <section className="relative overflow-hidden bg-[#313131] py-4 lg:py-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#9ca3af15_1px,transparent_1px),linear-gradient(to_bottom,#9ca3af15_1px,transparent_1px)] bg-[size:25px_25px] rotate-[30deg] origin-center scale-180" />
          {/* Gradient masks for sides */}
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#313131] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#313131] via-transparent to-transparent" />
        </div>
      
      {/* Blue line at bottom */}
      
      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text and Buttons */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-block rounded-full bg-[#ffffff]/10 border border-white/50 px-3 py-1">
              <span className="text-sm font-medium text-white">{t("hero.badge")}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
              <br />
              {t("hero.title3")}
            </h1>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-lg px-6 py-3" asChild>
                <Link href="/configurator">
                  {t("hero.configurator")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-lg px-6 py-3" asChild>
                <Link href="#products">{t("hero.viewModels")}</Link>
              </Button>
            </div>
          </div>

          {/* Right Section - Interactive Image */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              {/* Background Image (always visible) */}
              <Image
                src="/Herolyuk.png"
                alt="3D модель угла комнаты с люком"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
              
              {/* Overlay Image (appears on hover or click) */}
              {hoveredHatch && (
                <Image
                  src={hatches.find(h => h.id === hoveredHatch)?.image || "/Herolyuk.png"}
                  alt="3D модель угла комнаты с люком"
                  width={600}
                  height={600}
                  className="absolute inset-0 w-full h-auto object-contain animate-fade-in image-overlay"
                />
              )}
              
              {/* Interactive Plus Icons */}
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
                  onClick={() => handleMobileClick(hatch.id)}
                >
                  {/* Plus Icon */}
                  <div className="relative group cursor-pointer">
                    <div className={`w-8 h-8 bg-white/10 border border-white/50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ${
                      clickedHatch === hatch.id ? 'bg-white/20 border-white/70' : ''
                    }`}>
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Hatch Name Label - Hidden on mobile */}
                    <div className={`absolute right-10 top-1/2 -translate-y-1/2 bg-white/10 border border-white/50 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block ${
                      hoveredHatch === hatch.id ? 'opacity-100' : ''
                    }`}>
                      {hatch.name}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-[#313131] border-t border-r border-white/50 rotate-45"></div>
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
