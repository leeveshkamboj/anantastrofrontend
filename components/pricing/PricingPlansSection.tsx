"use client"

import { ArrowRight, CreditCard, Loader2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { cn } from "@/lib/utils"
import type { CoinPlanPublic } from "@/store/api/coinsApi"

function formatInr(paise: number | undefined) {
  const n = Number(paise)
  if (!Number.isFinite(n)) return "—"
  const rupees = n / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees)
}

function formatInrPerCoin(paise: number) {
  if (!Number.isFinite(paise) || paise < 0) return "—"
  const rupees = paise / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: rupees < 100 ? 2 : 0,
  }).format(rupees)
}

function effectiveCostPerCoinPaise(pricePaise: number, coinQuantity: number) {
  if (!Number.isFinite(pricePaise) || !Number.isFinite(coinQuantity) || coinQuantity < 1) {
    return null
  }
  return Math.round(pricePaise / coinQuantity)
}

interface PlanCardProps {
  plan: CoinPlanPublic
  isBestValue: boolean
  isAuthenticated: boolean
  isCheckoutLoading: boolean
  onBuy: (planId: number) => void
}

function PlanCard({
  plan,
  isBestValue,
  isAuthenticated,
  isCheckoutLoading,
  onBuy,
}: PlanCardProps) {
  const t = useTranslations("pricing")
  const perCoinPaise = effectiveCostPerCoinPaise(plan.pricePaise, plan.coinQuantity)

  return (
    <CosmicCard
      padding="md"
      className={cn(
        "relative items-stretch text-left",
        isBestValue && "ring-2 ring-astro-orange ring-offset-2"
      )}
    >
      {isBestValue && (
        <span className="absolute right-4 top-4 rounded-full bg-astro-orange px-3 py-1 text-xs font-bold text-white">
          {t("bestValue")}
        </span>
      )}

      <div className={cn("mb-4", isBestValue && "pr-24")}>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.discountLabel && (
          <span className="mt-2 inline-block rounded-full bg-astro-orange/10 px-3 py-0.5 text-xs font-semibold text-astro-orange">
            {plan.discountLabel}
          </span>
        )}
        <p className="mt-2 text-xs text-gray-600">{t("oneTimePurchase")}</p>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-extrabold tabular-nums text-black md:text-4xl">
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
        disabled={isCheckoutLoading}
      >
        {isCheckoutLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("openingCheckout")}
          </>
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

interface PricingPlansSectionProps {
  plans: CoinPlanPublic[]
  isLoading: boolean
  isAuthenticated: boolean
  checkoutPlanId: number | null
  isCreatingOrder: boolean
  isBestValuePlan: (planId: number) => boolean
  onBuy: (planId: number) => void
}

export function PricingPlansSection({
  plans,
  isLoading,
  isAuthenticated,
  checkoutPlanId,
  isCreatingOrder,
  isBestValuePlan,
  onBuy,
}: PricingPlansSectionProps) {
  const t = useTranslations("pricing")

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 text-astro-purple lg:px-24">
      <DecorativePlanets variant="pricing" />
      <Container className="relative z-10">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-white/10"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {!isLoading && plans.length === 0 && (
          <CosmicCard padding="md" className="mx-auto max-w-md items-stretch text-center">
            <p className="text-lg font-bold text-astro-purple">{t("noPacksLive")}</p>
            <p className="mt-2 text-sm text-gray-600">{t("noPacksAdmin")}</p>
            <CosmicButton asChild variant="outline" size="sm" className="mt-6">
              <Link href="/wallet">{t("goToWallet")}</Link>
            </CosmicButton>
          </CosmicCard>
        )}

        {!isLoading && plans.length > 0 && (
          <div
            className={cn(
              "grid gap-6",
              plans.length === 1 ? "mx-auto max-w-md" : "sm:grid-cols-2",
              plans.length >= 3 && "lg:grid-cols-3"
            )}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isBestValue={isBestValuePlan(plan.id)}
                isAuthenticated={isAuthenticated}
                isCheckoutLoading={isCreatingOrder && checkoutPlanId === plan.id}
                onBuy={onBuy}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
