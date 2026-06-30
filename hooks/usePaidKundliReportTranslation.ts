'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { parseFetchBaseError } from '@/lib/api-errors';
import { normalizeReportLocale, resolveReportJsonContent } from '@/lib/report-locale';
import { useServiceRunPrice } from '@/hooks/useServiceRunPrice';
import {
  useTranslateKundliHoroscopeAddonMutation,
  useTranslateKundliInterpretationMutation,
} from '@/store/api/kundliApi';

type ReportLocaleFields = {
  reportLocale?: string | null;
  interpretationsByLocale?: Record<string, string> | null;
};

export function usePaidKundliInterpretationTranslation(
  uuid: string,
  primaryContent: string | null | undefined,
  fields: ReportLocaleFields,
) {
  const uiLocale = useLocale();
  const tt = useTranslations('results.translate');
  const router = useRouter();
  const { compactLabel: priceLabel, coinCost: priceCoinCost, isFree: priceIsFree } =
    useServiceRunPrice('kundli_translate');
  const [translate, { isLoading }] = useTranslateKundliInterpretationMutation();
  const [translatedOverride, setTranslatedOverride] = useState<string | null>(null);

  const uiKey = normalizeReportLocale(uiLocale);
  const mergedByLocale =
    translatedOverride != null
      ? { ...(fields.interpretationsByLocale ?? {}), [uiKey]: translatedOverride }
      : fields.interpretationsByLocale;

  const resolved = resolveReportJsonContent({
    primaryContent,
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
      if (res.data?.interpretation) {
        setTranslatedOverride(res.data.interpretation);
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
    content: resolved.content,
    needsPaidTranslate: resolved.needsPaidTranslate,
    priceLabel,
    priceCoinCost,
    priceIsFree,
    isTranslating: isLoading,
    handleTranslate,
    hint: tt('paidHint'),
    actionLabel: tt('viewInLanguage'),
    translatingLabel: tt('translating'),
  };
}

export function usePaidKundliAddonTranslation(
  uuid: string,
  primaryContent: string | null | undefined,
  fields: ReportLocaleFields,
) {
  const uiLocale = useLocale();
  const tt = useTranslations('results.translate');
  const router = useRouter();
  const { compactLabel: priceLabel, coinCost: priceCoinCost, isFree: priceIsFree } =
    useServiceRunPrice('kundli_horoscope_addon_translate');
  const [translate, { isLoading }] = useTranslateKundliHoroscopeAddonMutation();
  const [translatedOverride, setTranslatedOverride] = useState<string | null>(null);

  const uiKey = normalizeReportLocale(uiLocale);
  const mergedByLocale =
    translatedOverride != null
      ? { ...(fields.interpretationsByLocale ?? {}), [uiKey]: translatedOverride }
      : fields.interpretationsByLocale;

  const resolved = resolveReportJsonContent({
    primaryContent,
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
      if (res.data?.content) {
        setTranslatedOverride(res.data.content);
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
    content: resolved.content,
    needsPaidTranslate: resolved.needsPaidTranslate,
    priceLabel,
    priceCoinCost,
    priceIsFree,
    isTranslating: isLoading,
    handleTranslate,
    hint: tt('paidHint'),
    actionLabel: tt('viewInLanguage'),
    translatingLabel: tt('translating'),
  };
}
