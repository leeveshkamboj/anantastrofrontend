"use client"

import { CreditCard, Loader2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { CoinGlyph } from "@/components/coins/CoinGlyph"
import { Container } from "@/components/layout/Container"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { cn } from "@/lib/utils"
import {
  getBalanceLabelKey,
  getBalanceMessageKey,
  getBalanceTone,
  LOW_BALANCE_THRESHOLD,
} from "@/components/wallet/wallet-utils"

type WalletHeroSectionProps = {
  balance: number
  isLoading: boolean
  isFetching: boolean
  onRefresh: () => void
}

export function WalletHeroSection({
  balance,
  isLoading,
  isFetching,
  onRefresh,
}: WalletHeroSectionProps) {
  const t = useTranslations("wallet")
  const isLowBalance = !isLoading && balance < LOW_BALANCE_THRESHOLD
  const balanceTone = getBalanceTone(balance)
  const balanceLabelKey = getBalanceLabelKey(balance)
  const balanceMessageKey = getBalanceMessageKey(balance)

  const messageToneClass =
    balanceTone === "empty"
      ? "text-purple-200"
      : balanceTone === "low"
        ? "text-amber-200"
        : balanceTone === "moderate"
          ? "text-purple-200"
          : "text-emerald-200"

  return (
    <CelestialBackground className="px-4 pb-9 pt-8 sm:px-6 lg:px-16 lg:pb-20 lg:pt-10">
      <Container>
        <div className="celestial-surface-light mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 text-gray-900 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md sm:rounded-[2rem]">
          <div
            className="h-1.5 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-8 lg:p-10">
            <div className="w-full text-center lg:flex-1 lg:text-left">
              <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-astro-purple/10 px-4 py-1.5 text-xs font-semibold text-astro-purple">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("badge")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-astro-purple/20 bg-astro-yellow/30 shadow-sm">
                  <CoinGlyph className="h-6 w-6 text-astro-orange" />
                </span>
              </div>

              <h1 className="mb-3 font-serif text-4xl font-extrabold leading-[1.08] text-gray-900 md:text-5xl">
                {t("title")}
              </h1>
              <p className="mx-auto mb-5 max-w-md text-base font-medium leading-relaxed text-gray-600 md:text-lg lg:mx-0">
                {t("subtitleLong")}
              </p>

              <div className="mb-5 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("razorpaySecure")}
                </span>
                {isLowBalance ? (
                  <span className="rounded-full bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-900 ring-1 ring-amber-500/25">
                    {t("lowBalanceChip")}
                  </span>
                ) : null}
              </div>

              <CosmicButton asChild size="lg" className="w-full sm:w-auto normal-case tracking-normal">
                <Link href="/pricing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("buyCoins")}
                </Link>
              </CosmicButton>
            </div>

            <div className="celestial-surface-dark relative w-full shrink-0 overflow-hidden rounded-[1.5rem] bg-linear-to-br from-astro-purple via-[#3d1578] to-astro-dark p-6 text-white shadow-[0_20px_48px_-12px_rgba(46,10,94,0.45)] sm:p-8 lg:w-[42%] xl:w-[38%]">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-astro-yellow/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-astro-orange/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-purple-100">
                    <CoinGlyph className="h-5 w-5 text-astro-yellow" />
                    {isLoading ? t("availableBalance") : t(balanceLabelKey)}
                  </p>

                  {isLoading ? (
                    <div className="h-16 w-48 animate-pulse rounded-xl bg-white/15" />
                  ) : (
                    <p className="text-6xl font-extrabold tabular-nums tracking-tight text-white sm:text-7xl">
                      {balance}
                    </p>
                  )}

                  {!isLoading ? (
                    <p className={cn("text-sm", messageToneClass)}>
                      {t(balanceMessageKey, { n: balance })}
                    </p>
                  ) : (
                    <p className="text-sm text-purple-200">{t("coinsReady")}</p>
                  )}
                </div>

                <CosmicButton
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isFetching}
                  onClick={onRefresh}
                  className={cn(
                    "w-full border-white/30 bg-white/10 !text-white hover:bg-white/20 hover:!text-white normal-case tracking-normal [&_svg]:text-white",
                    isFetching && "opacity-80",
                  )}
                >
                  {isFetching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {t("refresh")}
                </CosmicButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </CelestialBackground>
  )
}
