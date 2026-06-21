"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { FadeIn } from "@/components/motion/FadeIn"
import { CosmicCard } from "@/components/ui/CosmicCard"

export function PricingBottomSection() {
  const t = useTranslations("pricing")

  return (
    <section className="bg-footer-gradient px-4 py-10 sm:px-6 sm:py-12 lg:px-24">
      <FadeIn preset="fadeUp" className="mx-auto max-w-3xl">
        <CosmicCard variant="glass" padding="md" className="items-stretch p-5 text-center sm:p-8">
          <p className="font-bold text-gray-900">{t("alreadyPurchased")}</p>
          <p className="mt-3 flex flex-col items-center gap-2 text-sm text-gray-700 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/wallet" className="font-semibold text-black underline-offset-4 hover:underline">
              {t("viewWalletHistory")}
            </Link>
            <span className="hidden text-black/30 sm:inline" aria-hidden="true">
              ·
            </span>
            <Link
              href="/services/kundli/generate"
              className="font-semibold text-black underline-offset-4 hover:underline"
            >
              {t("useCoinsOnServices")}
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-600">{t("footerSecure")}</p>
        </CosmicCard>
      </FadeIn>
    </section>
  )
}
