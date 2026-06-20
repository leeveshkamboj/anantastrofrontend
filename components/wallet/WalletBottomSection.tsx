"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CosmicCard } from "@/components/ui/CosmicCard"

export function WalletBottomSection() {
  const t = useTranslations("wallet")
  const tPricing = useTranslations("pricing")

  return (
    <section className="bg-footer-gradient px-4 py-12 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <CosmicCard variant="glass" padding="md" className="items-stretch text-center">
          <p className="font-bold text-gray-900">{t("needHelp")}</p>
          <p className="mt-3 flex flex-col items-center gap-2 text-sm text-gray-700 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/pricing" className="font-semibold text-black underline-offset-4 hover:underline">
              {t("viewPricing")}
            </Link>
            <span className="hidden text-black/30 sm:inline" aria-hidden="true">
              ·
            </span>
            <Link
              href="/services/kundli/generate"
              className="font-semibold text-black underline-offset-4 hover:underline"
            >
              {tPricing("useCoinsOnServices")}
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-600">{tPricing("footerSecure")}</p>
        </CosmicCard>
      </div>
    </section>
  )
}
