"use client"

import { Check, Coins } from "lucide-react"
import { useTranslations } from "next-intl"
import { CosmicCard } from "@/components/ui/CosmicCard"

const PERK_KEYS = ["perk1", "perk2", "perk3"] as const

export function PricingUnlockSection() {
  const t = useTranslations("pricing")

  return (
    <section className="stars-bg bg-astro-purple px-6 py-16 text-white lg:px-24">
      <div className="mx-auto max-w-5xl">
        <CosmicCard
          variant="default"
          padding="md"
          className="items-stretch text-left md:flex md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="mb-6 flex items-start gap-4 md:mb-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-astro-purple/10">
              <Coins className="h-6 w-6 text-astro-purple" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-astro-purple">{t("unlockTitle")}</h2>
              <p className="mt-1 text-sm text-gray-600">{t("unlockSubtitle")}</p>
            </div>
          </div>
          <ul className="space-y-3">
            {PERK_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-astro-orange" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </CosmicCard>
      </div>
    </section>
  )
}
