'use client';

import Link from 'next/link';
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import { useAuth } from '@/store/hooks/useAuth';
import type { ServiceKey } from '@/store/api/coinsApi';
import { useServiceRunPrice } from '@/hooks/useServiceRunPrice';
import { CoinGlyph } from './CoinGlyph';
import { cn } from '@/lib/utils';

const LABELS: Record<ServiceKey, string> = {
  kundli: 'Kundli generation',
  matchmaking: 'Matchmaking report',
  horoscope: 'Horoscope report',
  horoscope_detailed: 'Detailed horoscope report',
  kundli_horoscope_addon: 'Kundli horoscope add-on',
};

export function ServiceCostBanner({
  serviceKey,
  className,
}: {
  serviceKey: ServiceKey;
  className?: string;
}) {
  const { isAuthenticated } = useAuth();
  const { coinCost: cost } = useServiceRunPrice(serviceKey);
  const { data: walletData } = useGetMyWalletQuery(undefined, { skip: !isAuthenticated });

  const balance = walletData?.data?.balance;

  if (cost == null) return null;

  const short = LABELS[serviceKey] ?? serviceKey;
  const low = isAuthenticated && balance != null && balance < cost;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border border-violet-200 bg-violet-50/90 px-4 py-3 text-sm text-violet-950',
        low && 'border-amber-300 bg-amber-50/90 text-amber-950',
        className,
      )}
    >
      <div className="flex items-center gap-2 font-medium">
        <CoinGlyph className="h-5 w-5 shrink-0 text-amber-600" />
        <span>
          {short} uses <span className="tabular-nums font-semibold">{cost}</span> coins per run.
        </span>
      </div>
      {isAuthenticated && balance != null && (
        <span className={cn(!low && 'text-violet-800/90', low && 'text-amber-900/80')}>
          Your balance:{' '}
          <span className="font-semibold tabular-nums">{balance}</span> coins
        </span>
      )}
      {low && (
        <Link
          href="/pricing"
          className="ml-auto font-semibold text-amber-900 underline-offset-2 hover:underline"
        >
          Get coins
        </Link>
      )}
    </div>
  );
}
