'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useMessages } from 'next-intl';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import enMessages from '@/messages/en.json';
import { chunkForTranslate } from '@/lib/translateChunks';
import { applyAstroGlossaryPostTranslate } from '@/lib/astroPostTranslateGlossary';
import type { AstroMessagesShape } from '@/lib/astroPostTranslateGlossary';
import { useTranslateTextMutation } from '@/store/api/translationApi';

export function normalizeTranslateLocale(locale: string): string {
  return locale.split('-')[0]?.toLowerCase() ?? 'en';
}

export function useTranslateSections() {
  const locale = useLocale();
  const messages = useMessages() as { astro?: AstroMessagesShape };
  const tt = useTranslations('results.translate');
  const [translateMutation] = useTranslateTextMutation();
  const [cached, setCached] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const target = normalizeTranslateLocale(locale);
  const needsUi = target !== 'en';
  const enAstro = (enMessages as { astro: AstroMessagesShape }).astro;

  useEffect(() => {
    setCached(null);
  }, [locale]);

  const translateSections = useCallback(
    async (sections: Record<string, string>) => {
      if (target === 'en') return;
      setLoading(true);
      try {
        const out: Record<string, string> = {};
        for (const [key, raw] of Object.entries(sections)) {
          const text = raw?.trim();
          if (!text) continue;
          const chunks = chunkForTranslate(text);
          let acc = '';
          for (const chunk of chunks) {
            const res = await translateMutation({
              text: chunk,
              source: 'en',
              target,
            }).unwrap();
            let translated = res.translatedText;
            if (messages.astro) {
              translated = applyAstroGlossaryPostTranslate(translated, target, enAstro, messages.astro);
            }
            acc += (acc ? '\n\n' : '') + translated;
          }
          out[key] = acc;
        }
        setCached(out);
        toast.success(tt('translateDone'));
      } catch {
        toast.error(tt('translateFailed'));
      } finally {
        setLoading(false);
      }
    },
    [target, translateMutation, tt, messages.astro, enAstro],
  );

  const reset = useCallback(() => {
    setCached(null);
  }, []);

  return {
    target,
    needsUi,
    translatedByKey: cached,
    loading,
    translateSections,
    reset,
  };
}
