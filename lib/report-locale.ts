/** Mirrors backend `src/common/report-locale.ts` — keep in sync. */
export const REPORT_UI_LOCALES = [
  'en',
  'hi',
  'bn',
  'ta',
  'te',
  'mr',
  'gu',
  'kn',
  'ml',
  'pa',
  'or',
  'as',
  'ur',
] as const;

export const REPORT_EXTRA_LOCALES = ['hinglish'] as const;

export const REPORT_LOCALES = [...REPORT_UI_LOCALES, ...REPORT_EXTRA_LOCALES] as const;

export type ReportUiLocale = (typeof REPORT_UI_LOCALES)[number];
export type ReportLocale = (typeof REPORT_LOCALES)[number];
export type ReportLanguageStyle = 'simple' | 'hinglish';

export function normalizeReportLocale(locale: string): string {
  return locale.split('-')[0]?.toLowerCase() ?? 'en';
}

export function localesMatch(a: string, b: string): boolean {
  return normalizeReportLocale(a) === normalizeReportLocale(b);
}

export function resolveReportJsonContent(params: {
  primaryContent: string | null | undefined;
  reportLocale?: string | null;
  interpretationsByLocale?: Record<string, string> | null;
  uiLocale: string;
}): { content: string; needsPaidTranslate: boolean; usingCachedTranslation: boolean } {
  const primary = params.primaryContent?.trim() ?? '';
  const ui = normalizeReportLocale(params.uiLocale);
  const source = normalizeReportLocale(params.reportLocale ?? 'en');

  if (!primary) {
    return { content: '', needsPaidTranslate: false, usingCachedTranslation: false };
  }

  const cached = params.interpretationsByLocale?.[ui];
  if (cached?.trim()) {
    return { content: cached, needsPaidTranslate: false, usingCachedTranslation: true };
  }

  if (localesMatch(ui, source)) {
    return { content: primary, needsPaidTranslate: false, usingCachedTranslation: false };
  }

  return { content: primary, needsPaidTranslate: true, usingCachedTranslation: false };
}

/** Locale resolution for structured report objects stored as JSON strings per locale. */
export function resolveReportJsonObject<T extends Record<string, unknown>>(params: {
  primary: T | null | undefined;
  reportLocale?: string | null;
  interpretationsByLocale?: Record<string, string> | null;
  uiLocale: string;
}): { data: T | null; needsPaidTranslate: boolean; usingCachedTranslation: boolean } {
  if (!params.primary || Object.keys(params.primary).length === 0) {
    return {
      data: params.primary ?? null,
      needsPaidTranslate: false,
      usingCachedTranslation: false,
    };
  }

  const resolved = resolveReportJsonContent({
    primaryContent: JSON.stringify(params.primary),
    reportLocale: params.reportLocale,
    interpretationsByLocale: params.interpretationsByLocale,
    uiLocale: params.uiLocale,
  });

  try {
    return {
      data: JSON.parse(resolved.content) as T,
      needsPaidTranslate: resolved.needsPaidTranslate,
      usingCachedTranslation: resolved.usingCachedTranslation,
    };
  } catch {
    return {
      data: params.primary,
      needsPaidTranslate: resolved.needsPaidTranslate,
      usingCachedTranslation: false,
    };
  }
}
