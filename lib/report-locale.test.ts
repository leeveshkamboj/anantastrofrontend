import { describe, it, expect } from 'vitest';
import { resolveReportJsonContent, resolveReportJsonObject } from './report-locale';

describe('resolveReportJsonContent', () => {
  const primary = '{"description":"English report"}';

  it('returns primary when UI locale matches report locale', () => {
    const result = resolveReportJsonContent({
      primaryContent: primary,
      reportLocale: 'ta',
      uiLocale: 'ta',
    });
    expect(result.content).toBe(primary);
    expect(result.needsPaidTranslate).toBe(false);
  });

  it('returns cached translation when available', () => {
    const cached = '{"description":"Tamil report"}';
    const result = resolveReportJsonContent({
      primaryContent: primary,
      reportLocale: 'en',
      interpretationsByLocale: { ta: cached },
      uiLocale: 'ta',
    });
    expect(result.content).toBe(cached);
    expect(result.usingCachedTranslation).toBe(true);
    expect(result.needsPaidTranslate).toBe(false);
  });

  it('flags paid translate when UI locale differs and no cache', () => {
    const result = resolveReportJsonContent({
      primaryContent: primary,
      reportLocale: 'en',
      uiLocale: 'ta',
    });
    expect(result.needsPaidTranslate).toBe(true);
  });
});

describe('resolveReportJsonObject', () => {
  const primary = { overview: 'English overview', career: 'English career' };

  it('parses cached JSON object for UI locale', () => {
    const cached = { overview: 'Tamil overview', career: 'Tamil career' };
    const result = resolveReportJsonObject({
      primary,
      reportLocale: 'en',
      interpretationsByLocale: { ta: JSON.stringify(cached) },
      uiLocale: 'ta',
    });
    expect(result.data).toEqual(cached);
    expect(result.needsPaidTranslate).toBe(false);
  });
});
