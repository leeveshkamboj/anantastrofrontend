"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { HoverLift } from "@/components/motion/HoverLift"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { cn } from "@/lib/utils"
import type { CoinPlanPublic } from "@/store/api/coinsApi"
import { PlanCard } from "./PlanCard"

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
    <section className="relative overflow-hidden bg-white px-4 py-12 text-astro-purple sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <DecorativePlanets variant="pricing" />
      <Container className="relative z-10">
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                    onBuy={onBuy}
                  />
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  )
}
