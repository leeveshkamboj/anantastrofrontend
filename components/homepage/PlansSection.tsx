"use client"

import { useMemo } from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { PlanCard } from "@/components/pricing/PlanCard"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { useCoinPlanCheckout } from "@/hooks/useCoinPlanCheckout"
import { computePlanComparison } from "@/lib/coin-plans"
import { cn } from "@/lib/utils"
import { useGetCoinPlansPublicQuery } from "@/store/api/coinsApi"

export function PlansSection() {
  const t = useTranslations("home.plans")
  const { data, isLoading } = useGetCoinPlansPublicQuery()
  const { isAuthenticated, checkoutPlanId, isCreatingOrder, coinPurchasesEnabled, handleBuy } =
    useCoinPlanCheckout("/")

  const plans = data?.data ?? []
  const { isBestValuePlan } = useMemo(() => computePlanComparison(plans), [plans])

  if (!isLoading && plans.length === 0) return null

  return (
    <AnimatedSection
      id="coin-plans"
      className="stars-bg bg-astro-purple px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-20"
      aria-labelledby="plans-heading"
    >
      <Container>
        <div className="mb-10 text-center sm:mb-16">
          <p className="mb-3 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-astro-yellow ring-1 ring-white/20">
            {t("eyebrow")}
          </p>
          <h2 id="plans-heading" className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl px-2 text-sm text-gray-400 sm:px-0 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-white/10"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <Stagger
            className={cn(
              "grid gap-4 sm:grid-cols-2 sm:gap-6",
              plans.length === 1 && "mx-auto max-w-md",
              plans.length >= 3 && "lg:grid-cols-3",
              plans.length === 4 && "xl:grid-cols-4"
            )}
          >
            {plans.map((plan) => (
              <StaggerItem key={plan.id}>
                <HoverLift className="h-full">
                  <PlanCard
                    plan={plan}
                    isBestValue={isBestValuePlan(plan.id)}
                    isAuthenticated={isAuthenticated}
                    isCheckoutLoading={isCreatingOrder && checkoutPlanId === plan.id}
                    coinPurchasesEnabled={coinPurchasesEnabled}
                    onBuy={handleBuy}
                  />
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div className="mt-10 text-center sm:mt-12">
          <CosmicButton asChild variant="secondary" size="lg">
            <Link href="/pricing">{t("viewAllPricing")}</Link>
          </CosmicButton>
        </div>
      </Container>
    </AnimatedSection>
  )
}
