'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGetCoinPlansPublicQuery, useCreateCoinCheckoutOrderMutation } from '@/store/api/coinsApi';
import { useAuth } from '@/store/hooks/useAuth';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay-checkout';
import { toast } from 'sonner';
import { PricingHeroSection } from '@/components/pricing/PricingHeroSection';
import { PricingUnlockSection } from '@/components/pricing/PricingUnlockSection';
import { PricingPlansSection } from '@/components/pricing/PricingPlansSection';
import { PricingBottomSection } from '@/components/pricing/PricingBottomSection';

function effectiveCostPerCoinPaise(pricePaise: number, coinQuantity: number) {
  if (!Number.isFinite(pricePaise) || !Number.isFinite(coinQuantity) || coinQuantity < 1) {
    return null;
  }
  return Math.round(pricePaise / coinQuantity);
}

export default function PricingPage() {
  const t = useTranslations('pricing');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data, isLoading } = useGetCoinPlansPublicQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateCoinCheckoutOrderMutation();
  const [checkoutPlanId, setCheckoutPlanId] = useState<number | null>(null);

  const plans = data?.data ?? [];

  const { perCoinByPlanId, minCostPerCoinPaise } = useMemo(() => {
    const map = new Map<number, number>();
    const cpps: number[] = [];
    for (const p of plans) {
      const cpp = effectiveCostPerCoinPaise(p.pricePaise, p.coinQuantity);
      if (cpp != null) {
        map.set(p.id, cpp);
        cpps.push(cpp);
      }
    }
    const min = cpps.length ? Math.min(...cpps) : null;
    return { perCoinByPlanId: map, minCostPerCoinPaise: min };
  }, [plans]);

  const isBestValuePlan = (planId: number) => {
    if (plans.length < 2 || minCostPerCoinPaise == null) return false;
    const cpp = perCoinByPlanId.get(planId);
    return cpp != null && cpp === minCostPerCoinPaise;
  };

  const handleBuy = async (planId: number) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=${encodeURIComponent('/pricing')}`);
      return;
    }
    setCheckoutPlanId(planId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error(t('toastWidgetError'));
        return;
      }
      const res = await createOrder({ planId }).unwrap();
      const d = res.data;
      openRazorpayCheckout({
        keyId: d.keyId,
        orderId: d.orderId,
        currency: d.currency,
        name: tNav('brand'),
        description: t('checkoutDescription', {
          name: d.plan.name,
          quantity: d.plan.coinQuantity,
        }),
        userEmail: user?.email,
        userName: user?.name,
        onSuccess: () => {
          toast.success(t('toastPaymentSuccess'));
        },
      });
    } catch {
      toast.error(t('toastCheckoutError'));
    } finally {
      setCheckoutPlanId(null);
    }
  };

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
        isBestValuePlan={isBestValuePlan}
        onBuy={handleBuy}
      />
      <PricingBottomSection />
    </div>
  );
}
