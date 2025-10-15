"use client"

import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"

export function Statistics() {
  const { t } = useI18n() as any
  const stats = [
    { value: "100+", label: t("stats.years") },
    { value: "30+", label: t("stats.installed") },
    { value: "57+", label: t("stats.clients") },
    { value: "1000+", label: t("stats.support") },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/sklad.jpg"
          alt="Склад с полками и коробками"
          fill
          className="object-cover"
          quality={100}
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 35%',
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/75" />
      </div>
      
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500 md:text-4xl">{stat.value}</div>
                <div className="text-sm text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
