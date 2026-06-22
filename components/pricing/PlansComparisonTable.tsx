"use client"

import { useTranslations } from "next-intl"
import { CosmicCard } from "@/components/ui/CosmicCard"
import {
  effectiveCostPerCoinPaise,
  formatInr,
  formatInrPerCoin,
} from "@/lib/coin-plans"
import { cn } from "@/lib/utils"
import type { CoinPlanPublic } from "@/store/api/coinsApi"

interface PlansComparisonTableProps {
  plans: CoinPlanPublic[]
  isBestValuePlan: (planId: number) => boolean
}

export function PlansComparisonTable({ plans, isBestValuePlan }: PlansComparisonTableProps) {
  const t = useTranslations("home.plans")
  const tPricing = useTranslations("pricing")

  if (plans.length < 2) return null

  const hasDiscount = plans.some((plan) => plan.discountLabel)

  return (
    <CosmicCard
      padding="md"
      className="mt-10 items-stretch overflow-x-auto p-0 text-left sm:mt-12"
    >
      <table className="w-full min-w-lg border-collapse text-sm">
        <caption className="sr-only">{t("compareCaption")}</caption>
        <thead>
          <tr className="border-b border-gray-200">
            <th scope="col" className="px-4 py-4 text-left font-semibold text-gray-500 sm:px-6">
              {t("compareFeature")}
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={cn(
                  "px-4 py-4 text-center font-bold text-astro-purple sm:px-6",
                  isBestValuePlan(plan.id) && "bg-astro-orange/5"
                )}
              >
                <span className="block">{plan.name}</span>
                {isBestValuePlan(plan.id) && (
                  <span className="mt-1 inline-block rounded-full bg-astro-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {tPricing("bestValue")}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <th scope="row" className="px-4 py-3 font-medium text-gray-600 sm:px-6">
              {tPricing("coins")}
            </th>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={cn(
                  "px-4 py-3 text-center font-semibold tabular-nums sm:px-6",
                  isBestValuePlan(plan.id) && "bg-astro-orange/5"
                )}
              >
                {plan.coinQuantity}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <th scope="row" className="px-4 py-3 font-medium text-gray-600 sm:px-6">
              {t("comparePrice")}
            </th>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={cn(
                  "px-4 py-3 text-center tabular-nums sm:px-6",
                  isBestValuePlan(plan.id) && "bg-astro-orange/5"
                )}
              >
                <span className="font-bold">{formatInr(plan.pricePaise)}</span>
                {plan.originalPricePaise != null && plan.originalPricePaise > plan.pricePaise && (
                  <span className="mt-0.5 block text-xs text-gray-500 line-through">
                    {formatInr(plan.originalPricePaise)}
                  </span>
                )}
              </td>
            ))}
          </tr>
          <tr className={cn(hasDiscount && "border-b border-gray-100")}>
            <th scope="row" className="px-4 py-3 font-medium text-gray-600 sm:px-6">
              {tPricing("perCoin")}
            </th>
            {plans.map((plan) => {
              const perCoin = effectiveCostPerCoinPaise(plan.pricePaise, plan.coinQuantity)
              return (
                <td
                  key={plan.id}
                  className={cn(
                    "px-4 py-3 text-center tabular-nums sm:px-6",
                    isBestValuePlan(plan.id) && "bg-astro-orange/5 font-semibold text-astro-purple"
                  )}
                >
                  {perCoin != null ? formatInrPerCoin(perCoin) : "—"}
                </td>
              )
            })}
          </tr>
          {hasDiscount && (
            <tr>
              <th scope="row" className="px-4 py-3 font-medium text-gray-600 sm:px-6">
                {t("compareOffer")}
              </th>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={cn(
                    "px-4 py-3 text-center text-xs sm:px-6",
                    isBestValuePlan(plan.id) && "bg-astro-orange/5"
                  )}
                >
                  {plan.discountLabel ?? "—"}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </CosmicCard>
  )
}
