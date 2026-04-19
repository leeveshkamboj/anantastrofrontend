'use client';

import { useMemo } from 'react';
import { useGetServiceCoinCostsQuery } from '@/store/api/coinsApi';
import type { ServiceKey } from '@/store/api/coinsApi';

export function formatInrFromPaise(paise: number) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
  }).format(rupees);
}

/** Coin cost per run for a service (from `/coins/service-costs`). No INR — UI shows coins + icon only. */
export function useServiceRunPrice(serviceKey: ServiceKey) {
  const { data: costsData, isLoading: loadingCosts } = useGetServiceCoinCostsQuery();

  return useMemo(() => {
    const coinCost = costsData?.data?.find((c) => c.serviceKey === serviceKey)?.coinCost;
    const loading = loadingCosts;

    if (coinCost == null) {
      return {
        loading,
        coinCost: null,
        /** e.g. "10 coins" — pair with `CoinGlyph` in UI */
        compactLabel: null as string | null,
      };
    }

    const coinsWord = coinCost === 1 ? 'coin' : 'coins';
    return {
      loading,
      coinCost,
      compactLabel: `${coinCost} ${coinsWord}`,
    };
  }, [costsData?.data, loadingCosts, serviceKey]);
}
