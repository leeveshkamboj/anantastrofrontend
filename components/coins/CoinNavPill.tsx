'use client';

import Link from 'next/link';
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import { CoinGlyph } from './CoinGlyph';
import { cn } from '@/lib/utils';

export function CoinNavPill({ className }: { className?: string }) {
  const { data, isFetching } = useGetMyWalletQuery();
  const balance = data?.data?.balance;

  return (
    <Link
      href="/wallet"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-sm font-semibold text-amber-950 shadow-sm hover:bg-amber-100 transition-colors',
        className,
      )}
    >
      <CoinGlyph className="h-4 w-4 text-amber-600" />
      <span className="tabular-nums">{isFetching && balance == null ? '…' : (balance ?? '—')}</span>
    </Link>
  );
}
