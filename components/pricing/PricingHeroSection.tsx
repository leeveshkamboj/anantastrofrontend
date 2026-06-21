"use client"

import { ShieldCheck, Sparkles, Wallet } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { CoinGlyph } from "@/components/coins/CoinGlyph"
import { FadeIn } from "@/components/motion/FadeIn"

export function PricingHeroSection() {
  const t = useTranslations("pricing")

  return (
    <CelestialBackground className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-24 lg:pb-16 lg:pt-12">
      <FadeIn preset="fadeUp" className="mx-auto max-w-3xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-astro-dark/10 bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-1.5">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t("badge")}
        </div>

        <div className="mb-3 flex justify-center sm:mb-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-white sm:h-14 sm:w-14">
            <CoinGlyph className="h-7 w-7 text-astro-orange sm:h-8 sm:w-8" />
          </span>
        </div>

        <h1 className="mb-3 text-2xl font-extrabold sm:mb-4 sm:text-4xl md:text-5xl">{t("title")}</h1>
        <p className="mx-auto mb-5 max-w-xl px-2 text-sm sm:mb-6 sm:px-0 md:text-base">{t("subtitle")}</p>

        <div className="flex flex-col items-center justify-center gap-2 text-xs font-medium sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 md:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("razorpay")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="h-4 w-4" aria-hidden="true" />
            <Link href="/wallet" className="font-semibold underline-offset-4 hover:underline">
              {t("walletLink")}
            </Link>
          </span>
        </div>
      </FadeIn>
    </CelestialBackground>
  )
}
