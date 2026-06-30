"use client"

import { ArrowRight, CreditCard, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import {
  effectiveCostPerCoinPaise,
  formatInr,
  formatInrPerCoin,
} from "@/lib/coin-plans"
import { cn } from "@/lib/utils"
import type { CoinPlanPublic } from "@/store/api/coinsApi"

export interface PlanCardProps {
  plan: CoinPlanPublic
  isBestValue: boolean
  isAuthenticated: boolean
  isCheckoutLoading: boolean
  coinPurchasesEnabled: boolean
  onBuy: (planId: number) => void
}

export function PlanCard({
  plan,
  isBestValue,
  isAuthenticated,
  isCheckoutLoading,
  coinPurchasesEnabled,
  onBuy,
}: PlanCardProps) {
  const t = useTranslations("pricing")
  const perCoinPaise = effectiveCostPerCoinPaise(plan.pricePaise, plan.coinQuantity)

  return (
    <CosmicCard
      padding="md"
      className={cn(
        "relative items-stretch p-5 text-left sm:p-8",
        isBestValue && "ring-2 ring-astro-orange ring-offset-2"
      )}
    >
      {isBestValue && (
        <span className="mb-3 inline-block rounded-full bg-astro-orange px-3 py-1 text-xs font-bold text-white sm:absolute sm:right-4 sm:top-4 sm:mb-0">
          {t("bestValue")}
        </span>
      )}

      <div className={cn("mb-4", isBestValue && "sm:pr-24")}>
        <h3 className="text-lg font-bold sm:text-xl">{plan.name}</h3>
        {plan.discountLabel && (
          <span className="mt-2 inline-block rounded-full bg-astro-orange/10 px-3 py-0.5 text-xs font-semibold text-astro-orange">
            {plan.discountLabel}
          </span>
        )}
        <p className="mt-2 text-xs text-gray-600">{t("oneTimePurchase")}</p>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-extrabold tabular-nums text-black sm:text-3xl md:text-4xl">
          {formatInr(plan.pricePaise)}
        </p>
        {plan.originalPricePaise != null && plan.originalPricePaise > plan.pricePaise && (
          <p className="mt-1 text-sm text-gray-500 line-through">
            {formatInr(plan.originalPricePaise)}
          </p>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
        <p className="font-bold text-astro-purple">
          {plan.coinQuantity}{" "}
          <span className="font-normal text-gray-600">{t("coins")}</span>
        </p>
        <p className="mt-1 text-xs tabular-nums text-gray-600">
          {perCoinPaise != null ? (
            <>
              ≈ {formatInrPerCoin(perCoinPaise)} {t("perCoin")}
            </>
          ) : (
            <>— {t("perCoin")}</>
          )}
        </p>
      </div>

      <CosmicButton
        variant="primary"
        size="lg"
        className="mt-auto normal-case tracking-normal"
        onClick={() => onBuy(plan.id)}
        disabled={!coinPurchasesEnabled || isCheckoutLoading}
      >
        {isCheckoutLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("openingCheckout")}
          </>
        ) : !coinPurchasesEnabled ? (
          t("unavailable")
        ) : isAuthenticated ? (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {t("buyNow")}
          </>
        ) : (
          <>
            {t("signInToBuy")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </CosmicButton>
    </CosmicCard>
  )
}
