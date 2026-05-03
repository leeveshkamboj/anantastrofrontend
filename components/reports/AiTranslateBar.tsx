'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Languages, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type AiTranslateBarProps = {
  className?: string;
  isTranslating: boolean;
  onTranslate: () => void;
  /** Hide when English locale, after translation is done, or when nothing to show. */
  visible: boolean;
};

export function AiTranslateBar({
  className,
  isTranslating,
  onTranslate,
  visible,
}: AiTranslateBarProps) {
  const t = useTranslations('results.translate');
  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg border border-amber-200/80 bg-amber-50/50',
        className,
      )}
    >
      <Languages className="h-4 w-4 text-amber-800 shrink-0" aria-hidden />
      <p className="text-sm text-amber-900 flex-1 min-w-[12rem]">{t('hint')}</p>
      <Button type="button" size="sm" variant="default" disabled={isTranslating} onClick={onTranslate}>
        {isTranslating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" aria-hidden />
            {t('translating')}
          </>
        ) : (
          t('translate')
        )}
      </Button>
    </div>
  );
}
