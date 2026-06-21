"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { CoinGlyph } from "@/components/coins/CoinGlyph"
import { FadeIn } from "@/components/motion/FadeIn"
import { CosmicCard } from "@/components/ui/CosmicCard"

const PERK_KEYS = ["perk1", "perk2", "perk3"] as const

export function PricingUnlockSection() {
  const t = useTranslations("pricing")

  return (
    <section className="stars-bg bg-astro-purple px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-24 lg:py-16">
      <FadeIn preset="slideInLeft" className="mx-auto max-w-5xl">
        <CosmicCard
          variant="default"
          padding="md"
          className="items-stretch p-5 text-left sm:p-8 md:flex md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:gap-4 md:mb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-astro-purple/10 sm:h-12 sm:w-12">
              <CoinGlyph className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-astro-purple sm:text-xl">{t("unlockTitle")}</h2>
              <p className="mt-1 text-sm text-gray-600">{t("unlockSubtitle")}</p>
            </div>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            {PERK_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-astro-orange" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </CosmicCard>
      </FadeIn>
    </section>
  )
}
