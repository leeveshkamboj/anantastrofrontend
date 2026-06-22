'use client';

import { Button } from '@/components/ui/button';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';
import { Languages, Loader2 } from 'lucide-react';

export type ReportLanguageSwitchProps = {
  className?: string;
  visible: boolean;
  isTranslating: boolean;
  priceLabel: string | null;
  hint: string;
  actionLabel: string;
  translatingLabel: string;
  onTranslate: () => void;
};

/** Coin-gated “view in UI language” control (replaces free LibreTranslate bar). */
export function ReportLanguageSwitch({
  className,
  visible,
  isTranslating,
  priceLabel,
  hint,
  actionLabel,
  translatingLabel,
  onTranslate,
}: ReportLanguageSwitchProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg border border-amber-200/80 bg-amber-50/50',
        className,
      )}
    >
      <Languages className="h-4 w-4 text-amber-800 shrink-0" aria-hidden />
      <p className="text-sm text-amber-900 flex-1 min-w-[12rem]">{hint}</p>
      <Button type="button" size="sm" variant="default" disabled={isTranslating} onClick={onTranslate}>
        {isTranslating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" aria-hidden />
            {translatingLabel}
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            {actionLabel}
            {priceLabel && (
              <>
                <span aria-hidden>·</span>
                <CoinGlyph className="h-4 w-4 shrink-0" />
                <span>{priceLabel}</span>
              </>
            )}
          </span>
        )}
      </Button>
    </div>
  );
}
