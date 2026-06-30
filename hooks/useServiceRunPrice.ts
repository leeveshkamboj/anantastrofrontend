'use client';

import { useMemo } from 'react';
import { useGetPublicCoinPricingReferenceQuery, useGetServiceCoinCostsQuery } from '@/store/api/coinsApi';
import type { ServiceKey } from '@/store/api/coinsApi';
import { buildServicePriceLabel } from '@/lib/service-price-label';

export function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
  }).format(rupees);
}

/** Coin cost per run for a service (from `/coins/service-costs`). */
export function useServiceRunPrice(serviceKey: ServiceKey) {
  const { data: costsData, isLoading: loadingCosts } = useGetServiceCoinCostsQuery();
  const { data: pricingRef } = useGetPublicCoinPricingReferenceQuery();

  return useMemo(() => {
    const row = costsData?.data?.find((c) => c.serviceKey === serviceKey);
    const freeServicesEnabled =
      costsData?.meta?.freeServicesEnabled ?? pricingRef?.data?.freeServicesEnabled ?? false;

    if (row?.coinCost == null) {
      return {
        loading: loadingCosts,
        coinCost: null as number | null,
        effectiveCoinCost: null as number | null,
        isFree: false,
        compactLabel: null as string | null,
      };
    }

    const effectiveCoinCost = row.effectiveCoinCost ?? row.coinCost;
    const label = buildServicePriceLabel({
      coinCost: row.coinCost,
      effectiveCoinCost,
      freeServicesEnabled,
    });

    return {
      loading: loadingCosts,
      coinCost: label.coinCost,
      effectiveCoinCost: label.effectiveCoinCost,
      isFree: label.isFree,
      compactLabel: label.compactLabel,
    };
  }, [costsData?.data, costsData?.meta?.freeServicesEnabled, loadingCosts, pricingRef?.data?.freeServicesEnabled, serviceKey]);
}

export function useCoinLaunchFlags() {
  const { data, isLoading } = useGetPublicCoinPricingReferenceQuery();
  return {
    loading: isLoading,
    freeServicesEnabled: data?.data?.freeServicesEnabled ?? false,
    coinPurchasesEnabled: data?.data?.coinPurchasesEnabled ?? true,
  };
}
