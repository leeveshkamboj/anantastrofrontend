'use client';

import { useMemo } from 'react';
import { useGetCoinPlansPublicQuery } from '@/store/api/coinsApi';
import { computePlanComparison } from '@/lib/coin-plans';
import { useCoinPlanCheckout } from '@/hooks/useCoinPlanCheckout';
import { PricingHeroSection } from '@/components/pricing/PricingHeroSection';
import { PricingUnlockSection } from '@/components/pricing/PricingUnlockSection';
import { PricingPlansSection } from '@/components/pricing/PricingPlansSection';
import { PricingBottomSection } from '@/components/pricing/PricingBottomSection';

export default function PricingPage() {
  const { data, isLoading } = useGetCoinPlansPublicQuery();
  const { isAuthenticated, checkoutPlanId, isCreatingOrder, coinPurchasesEnabled, handleBuy } =
    useCoinPlanCheckout('/pricing');

  const plans = data?.data ?? [];
  const { isBestValuePlan } = useMemo(() => computePlanComparison(plans), [plans]);

  return (
    <div className="overflow-x-hidden bg-white text-gray-900">
      <PricingHeroSection />
      <PricingUnlockSection />
      <PricingPlansSection
        plans={plans}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        checkoutPlanId={checkoutPlanId}
        isCreatingOrder={isCreatingOrder}
        coinPurchasesEnabled={coinPurchasesEnabled}
        isBestValuePlan={isBestValuePlan}
        onBuy={handleBuy}
      />
      <PricingBottomSection />
    </div>
  );
}
