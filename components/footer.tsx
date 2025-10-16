"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/components/i18n-provider";

export function Footer() {
  const { t } = useI18n() as any;
  return (
    <footer className="relative overflow-hidden bg-[#313131]">
      {/* Background Grid Pattern - same as Hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#9ca3af15_1px,transparent_1px),linear-gradient(to_bottom,#9ca3af15_1px,transparent_1px)] bg-[size:20px_20px] rotate-[20deg] origin-center scale-230" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#313131] via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#313131] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 text-white">
        <div className="grid gap-4 md:gap-8 grid-cols-2 md:grid-cols-4">
          {/* Logo and Description */}
          <div>
            <div className="mb-2 md:mb-4">
              <Image
                src="/FuterLogo.svg"
                alt="Revizor"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-white">{t("footer.tagline")}</p>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-2 md:mb-4 font-bold text-white">{t("footer.products")}</h3>
            <ul className="space-y-1 md:space-y-2 text-sm text-white">
              <li>
                <Link
                  href="/configurator?model=transformer"
                  className="hover:text-gray-300"
                >
                  {t("products.transformer.name")}
                </Link>
              </li>
              <li>
                <Link
                  href="/configurator?model=universal"
                  className="hover:text-gray-300"
                >
                  {t("products.universal.name")}
                </Link>
              </li>
              <li>
                <Link
                  href="/configurator?model=floor"
                  className="hover:text-gray-300"
                >
                  {t("products.floor.name")}
                </Link>
              </li>
              <li>
                <Link
                  href="/configurator?model=anodos"
                  className="hover:text-gray-300"
                >
                  {t("products.anodos.name")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="mb-2 md:mb-4 font-bold text-white">{t("about.hero.aboutBtn")}</h3>
            <ul className="space-y-1 md:space-y-2 text-sm text-white">
              <li>
                <Link href="/about" className="hover:text-gray-300">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-gray-300">
                  {t("nav.reviews")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-gray-300">
                  {t("nav.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-2 md:mb-4 font-bold text-white">{t("footer.contacts")}</h3>
            <ul className="space-y-1 md:space-y-2 text-sm text-white">
              <li>+998 90 906 81 80</li>
              <li>info@revizor.uz</li>
              <li>{t("footer.address")}</li>
            </ul>
          </div>
        </div>

        {/* Separator and Copyright */}
        <div className="mt-6 md:mt-12 border-t border-gray-400 pt-4 md:pt-8 text-center text-sm text-white">
          <p>{t("footer.copyright")}</p>
        </div>
        <div className="flex justify-center items-center gap-2 text-gray-500 hover:text-gray-200">
          <p className="text-center text-sm mt-2">Made by <a href="https://github.com/thehokim" className="underline hover:text-gray-300">Hokimxo'ja</a></p>
          <span className="flex items-center justify-center mt-2">&</span>
          <p className="text-center text-sm mt-2"><a href="https://github.com/ilxomkh" className="underline hover:text-gray-300">Ilxomkh</a></p>
        </div>
      </div>
    </footer>
  );
}
