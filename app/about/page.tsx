"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"
import { PageSkeleton } from "@/components/page-skeleton"

function AboutPageContent() {
  const { t } = useI18n() as any
  return (
    <main>
      <section className="relative overflow-hidden min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] justify-center items-center flex py-6 sm:py-8 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2D2D2D_0%,#1B1B1B_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFFFFF08_0.5px,transparent_0.5px),linear-gradient(to_bottom,#FFFFFF08_0.5px,transparent_0.5px)] bg-[size:7px_7px] rotate-[71.13deg] origin-center scale-600" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#1B1B1B] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#1B1B1B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-3 sm:mb-4 inline-block rounded-full border border-white/50 bg-white/10 px-3 py-1">
            <span className="text-xs sm:text-sm font-medium text-white">{t("hero.badge")}</span>
          </div>

          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.hero.title")}</h1>
          <p className="mx-auto mb-4 sm:mb-6 max-w-3xl text-sm sm:text-base lg:text-lg text-white leading-relaxed px-4">
            {t("about.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
              <Link href="#values">{t("about.hero.aboutBtn")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="border border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
              <Link href="#advantages">{t("about.hero.advantagesBtn")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="border border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base" asChild>
              <Link href="#mission">{t("about.hero.missionBtn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="values" className="bg-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            <div className="relative order-2 lg:order-1">
              <Image
                src="/man.png"
                alt="Команда Revizor за работой"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                quality={100}
              />
            </div>

            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.content.title")}</h2>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>{t("about.content.paragraph1")}</p>
                <p>{t("about.content.paragraph2")}</p>
                <p>{t("about.content.paragraph3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" className="bg-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-black text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 'clamp(20px, 4vw, 48px)', lineHeight: '100%', letterSpacing: '0%' }}>{t("about.advantages.title")}</h2>
          </div>
          
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-[10px] border border-white/50 p-3 sm:p-4 lg:p-6 text-center max-w-[463px] h-[150px] sm:h-[180px] lg:h-[197px] flex flex-col justify-center">
              <div className="absolute inset-0">
                <Image
                  src="/lyuk1.png"
                  alt="Люк под покраску"
                  fill
                  className="object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/80" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.advantages.card1.title")}</h3>
                <p className="text-xs sm:text-sm text-white">{t("about.advantages.card1.desc")}</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-[10px] border border-white/50 p-3 sm:p-4 lg:p-6 text-center max-w-[463px] h-[150px] sm:h-[180px] lg:h-[197px] flex flex-col justify-center">
              <div className="absolute inset-0">
                <Image
                  src="/lyuk2.png"
                  alt="Напольный люк"
                  fill
                  className="object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/80" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.advantages.card2.title")}</h3>
                <p className="text-xs sm:text-sm text-white">{t("about.advantages.card2.desc")}</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-[10px] border border-white/50 p-3 sm:p-4 lg:p-6 text-center max-w-[463px] h-[150px] sm:h-[180px] lg:h-[197px] flex flex-col justify-center">
              <div className="absolute inset-0">
                <Image
                  src="/lyuk4.png"
                  alt="Люк Трансформер"
                  fill
                  className="object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/80" />
              </div>
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.advantages.card4.title")}</h3>
                <p className="text-xs sm:text-sm text-white">{t("about.advantages.card4.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="relative overflow-hidden py-12">
        <div className="absolute inset-0">
          <Image
            src="/sklad.jpg"
            alt="Склад с полками и коробками"
            fill
            className="object-cover"
            quality={100}
            style={{
              objectFit: 'cover',
              objectPosition: 'center 35%',
            }}
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.mission.title")}</h2>
          <p className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-4">
            {t("about.mission.text")}
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-2">
            <div className="relative rounded-lg overflow-hidden order-2 lg:order-1">
              <iframe
                title={t("about.map.title")}
                src="https://yandex.ru/map-widget/v1/?ll=69.294262%2C41.255892&z=18&l=map,sat&pt=69.294262,41.255892,pm2rdl"
                className="h-[300px] sm:h-[400px] lg:h-[460px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-center space-y-6 sm:space-y-8 order-1 lg:order-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.contact.addressTitle")}</h3>
                <p className="text-sm sm:text-base text-black">{t("about.contact.address")}</p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.contact.hours.title")}</h3>
                <div className="space-y-1 text-sm sm:text-base text-black">
                  <div>{t("about.contact.hours.weekdays")}</div>
                  <div>{t("about.contact.hours.friday")}</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-black" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{t("about.contact.contactsTitle")}</h3>
                <p className="text-sm sm:text-base text-black">+998 90 906 81 80</p>
              </div>

              <div>
                <a href="tel:+998909068180" className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-red-700">
                  {t("about.contact.callBtn")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="about" />}>
      <AboutPageContent />
    </Suspense>
  )
}
