'use client';

import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';

type ServicePriceDisplayProps = {
  coinCost: number;
  isFree: boolean;
  compactLabel: string;
  className?: string;
  glyphClassName?: string;
};

export function ServicePriceDisplay({
  coinCost,
  isFree,
  compactLabel,
  className,
  glyphClassName,
}: ServicePriceDisplayProps) {
  if (isFree) {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <CoinGlyph className={cn('h-3.5 w-3.5 text-astro-orange', glyphClassName)} />
        <span className="line-through tabular-nums text-gray-500">{coinCost}</span>
        <span className="font-semibold text-emerald-700">{compactLabel}</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <CoinGlyph className={cn('h-3.5 w-3.5 text-astro-orange', glyphClassName)} />
      <span className="tabular-nums font-semibold">{compactLabel}</span>
    </span>
  );
}
