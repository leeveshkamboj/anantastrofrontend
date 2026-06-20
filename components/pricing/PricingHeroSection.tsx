"use client"

import { ShieldCheck, Sparkles, Wallet } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { CoinGlyph } from "@/components/coins/CoinGlyph"

export function PricingHeroSection() {
  const t = useTranslations("pricing")

  return (
    <CelestialBackground className="px-6 pb-16 pt-12 lg:px-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-astro-dark/10 bg-white/80 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t("badge")}
        </div>

        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-white">
            <CoinGlyph className="h-8 w-8 text-astro-orange" />
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">{t("title")}</h1>
        <p className="mx-auto mb-6 max-w-xl text-sm md:text-base">{t("subtitle")}</p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium md:text-sm">
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
      </div>
    </CelestialBackground>
  )
}
