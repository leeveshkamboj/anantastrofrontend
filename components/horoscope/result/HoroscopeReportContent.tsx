'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { HoroscopeResult } from '@/store/api/kundliApi';
import { ResultCard, CardContent } from '@/components/kundli/result';

export const HOROSCOPE_SECTION_KEYS: {
  key: keyof HoroscopeResult;
  labelKey: 'sectionOverview' | 'sectionCareer' | 'sectionHealth' | 'sectionRelationships' | 'sectionFinance' | 'sectionRemedies';
}[] = [
  { key: 'overview', labelKey: 'sectionOverview' },
  { key: 'career', labelKey: 'sectionCareer' },
  { key: 'health', labelKey: 'sectionHealth' },
  { key: 'relationships', labelKey: 'sectionRelationships' },
  { key: 'finance', labelKey: 'sectionFinance' },
  { key: 'remedies', labelKey: 'sectionRemedies' },
];

export function parseHoroscopeSections(
  result: HoroscopeResult | Record<string, unknown> | null,
): Record<string, string> | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const { key } of HOROSCOPE_SECTION_KEYS) {
    const raw = r[key as string] ?? r[String(key).charAt(0).toUpperCase() + String(key).slice(1)];
    if (typeof raw === 'string' && raw.trim()) out[key as string] = raw;
  }
  return Object.keys(out).length ? out : null;
}

function renderBoldMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

type HoroscopeReportContentProps = {
  result: HoroscopeResult | Record<string, unknown> | null;
  translatedByKey?: Record<string, string> | null;
};

export function HoroscopeReportContent({ result, translatedByKey }: HoroscopeReportContentProps) {
  const t = useTranslations('results.horoscope');

  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, string | undefined>;

  return (
    <div className="space-y-6">
      {HOROSCOPE_SECTION_KEYS.map(({ key, labelKey }) => {
        const raw = r[key] ?? r[key.charAt(0).toUpperCase() + key.slice(1)];
        const base = typeof raw === 'string' ? raw : '';
        const text = translatedByKey?.[key as string] ?? base;
        if (!text?.trim()) return null;
        return (
          <ResultCard key={key}>
            <CardContent className="pt-0">
              <h3 className="mb-3 text-lg font-extrabold text-gray-900">{t(labelKey)}</h3>
              <p className="text-justify leading-relaxed whitespace-pre-wrap text-gray-700">
                {renderBoldMarkdown(text)}
              </p>
            </CardContent>
          </ResultCard>
        );
      })}
    </div>
  );
}
