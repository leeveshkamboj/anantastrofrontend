'use client';

import { useTranslations } from 'next-intl';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { useCoinLaunchFlags } from '@/hooks/useServiceRunPrice';
import { cn } from '@/lib/utils';

type ChatPerMinutePriceProps = {
  coinsPerMinute: number;
  className?: string;
  coinClassName?: string;
  glyphClassName?: string;
  suffix?: string;
  suffixClassName?: string;
  /** Renders "{n} coins/min" (or free variant) instead of coin count only. */
  labeled?: boolean;
};

export function ChatPerMinutePrice({
  coinsPerMinute,
  className,
  coinClassName,
  glyphClassName = 'h-3.5 w-3.5 text-astro-orange',
  suffix,
  suffixClassName,
  labeled = false,
}: ChatPerMinutePriceProps) {
  const t = useTranslations('astrologersPage');
  const { freeServicesEnabled } = useCoinLaunchFlags();

  if (!coinsPerMinute) return null;

  if (labeled) {
    if (freeServicesEnabled) {
      return (
        <span className={cn('inline-flex items-center gap-1', className)}>
          <CoinGlyph className={glyphClassName} />
          <span className={cn('line-through tabular-nums text-gray-500', coinClassName)}>{coinsPerMinute}</span>
          <span className={cn('font-semibold text-emerald-700', coinClassName)}>Free/min</span>
        </span>
      );
    }

    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <CoinGlyph className={glyphClassName} />
        <span className={coinClassName}>{t('coinsPerMin', { n: coinsPerMinute })}</span>
      </span>
    );
  }

  if (freeServicesEnabled) {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        <CoinGlyph className={glyphClassName} />
        <span className={cn('line-through tabular-nums text-gray-500', coinClassName)}>{coinsPerMinute}</span>
        <span className={cn('font-semibold text-emerald-700', coinClassName)}>Free</span>
        {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1 tabular-nums', className)}>
      <span className={coinClassName}>{coinsPerMinute}</span>
      <CoinGlyph className={glyphClassName} />
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </span>
  );
}
