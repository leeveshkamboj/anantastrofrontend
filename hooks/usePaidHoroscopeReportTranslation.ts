'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { parseFetchBaseError } from '@/lib/api-errors';
import { normalizeReportLocale, resolveReportJsonObject } from '@/lib/report-locale';
import { useServiceRunPrice } from '@/hooks/useServiceRunPrice';
import {
  useTranslateHoroscopeReportMutation,
  type HoroscopeResult,
} from '@/store/api/kundliApi';

type ReportLocaleFields = {
  reportLocale?: string | null;
  interpretationsByLocale?: Record<string, string> | null;
};

export function usePaidHoroscopeReportTranslation(
  uuid: string,
  primaryResult: HoroscopeResult | Record<string, unknown> | null | undefined,
  fields: ReportLocaleFields,
) {
  const uiLocale = useLocale();
  const tt = useTranslations('results.translate');
  const router = useRouter();
  const { compactLabel: priceLabel } = useServiceRunPrice('horoscope_translate');
  const [translate, { isLoading }] = useTranslateHoroscopeReportMutation();
  const [translatedOverride, setTranslatedOverride] = useState<Record<string, unknown> | null>(
    null,
  );

  const uiKey = normalizeReportLocale(uiLocale);
  const mergedByLocale =
    translatedOverride != null
      ? {
          ...(fields.interpretationsByLocale ?? {}),
          [uiKey]: JSON.stringify(translatedOverride),
        }
      : fields.interpretationsByLocale;

  const resolved = resolveReportJsonObject({
    primary: primaryResult as Record<string, unknown> | null | undefined,
    reportLocale: fields.reportLocale,
    interpretationsByLocale: mergedByLocale,
    uiLocale,
  });

  const handleTranslate = async () => {
    try {
      const res = await translate({
        uuid,
        body: { targetLocale: uiKey },
      }).unwrap();
      if (res.data?.result) {
        setTranslatedOverride(res.data.result);
      }
      toast.success(tt('translateDone'));
    } catch (e) {
      const err = parseFetchBaseError(e);
      if (err.status === 402 || err.code === 'INSUFFICIENT_COINS') {
        toast.error(err.message ?? tt('insufficientCoins'));
        router.push('/pricing');
        return;
      }
      toast.error(tt('translateFailed'));
    }
  };

  return {
    result: resolved.data,
    needsPaidTranslate: resolved.needsPaidTranslate,
    priceLabel,
    isTranslating: isLoading,
    handleTranslate,
    hint: tt('paidHint'),
    actionLabel: tt('viewInLanguage'),
    translatingLabel: tt('translating'),
  };
}
