"use client"

import { AlertTriangle } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { LOW_BALANCE_THRESHOLD } from "@/components/wallet/wallet-utils"

type WalletLowBalanceBannerProps = {
  balance: number
  isLoading: boolean
}

export function WalletLowBalanceBanner({ balance, isLoading }: WalletLowBalanceBannerProps) {
  const t = useTranslations("wallet")

  if (isLoading || balance >= LOW_BALANCE_THRESHOLD) {
    return null
  }

  return (
    <section className="bg-white px-4 pb-2 sm:px-6 lg:px-16">
      <Container>
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-extrabold text-amber-950">{t("lowBalanceTitle")}</p>
              <p className="mt-0.5 text-sm text-amber-900/80">{t("lowBalanceBanner")}</p>
            </div>
          </div>
          <CosmicButton asChild size="sm" className="shrink-0 normal-case tracking-normal">
            <Link href="/pricing">{t("addCoins")}</Link>
          </CosmicButton>
        </div>
      </Container>
    </section>
  )
}
