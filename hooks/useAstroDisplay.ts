'use client';

import { useMessages } from 'next-intl';
import { astroSlug } from '@/lib/astroSlug';

type AstroBundle = Record<string, Record<string, string> | undefined> | undefined;

function pick(
  astro: AstroBundle,
  group: keyof NonNullable<AstroBundle>,
  raw: string | undefined | null,
): string {
  if (raw == null || raw === '') return '—';
  if (raw === '—') return '—';
  const slug = astroSlug(raw);
  const block = astro?.[group as string];
  const translated = block?.[slug];
  return translated ?? raw;
}

/** Parses "Ashwini-2" style nakshatra–charan from avakhada. */
export function splitNakshatraCharan(value: string): { name: string; charan: string } | null {
  const m = /^(.+)-(\d)$/.exec(value.trim());
  if (!m) return null;
  return { name: m[1], charan: m[2] };
}

export function useAstroDisplay() {
  const messages = useMessages() as { astro?: AstroBundle };
  const astro = messages.astro;

  const planetLike = (raw: string | undefined | null) =>
    pick(astro, 'planets', raw) || pick(astro, 'nakshatra_lords', raw);

  const kpPointLabel = (raw: string | undefined | null): string => {
    if (raw == null || raw === '') return '—';
    const map: Record<string, string> = {
      Mo: 'mo',
      Asc: 'asc',
      'Day Lord': 'day_lord',
    };
    const key = map[raw] ?? astroSlug(raw);
    const out = astro?.kpPoints?.[key];
    return out ?? raw;
  };

  return {
    /** Zodiac sign name (e.g. Aries → मेष). */
    sign: (raw: string | undefined | null) => pick(astro, 'signs', raw),
    /** Graha / ruling planet name. */
    planet: planetLike,
    nakshatraLord: (raw: string | undefined | null) => pick(astro, 'nakshatra_lords', raw),
    nakshatra: (raw: string | undefined | null) => pick(astro, 'nakshatras', raw),
    /** Full nakshatra–charan cell; translates nakshatra portion only. */
    nakshatraCharan: (raw: string | undefined | null) => {
      if (raw == null || raw === '') return '—';
      const parts = splitNakshatraCharan(raw);
      if (!parts) return pick(astro, 'nakshatras', raw);
      return `${pick(astro, 'nakshatras', parts.name)}-${parts.charan}`;
    },
    varna: (raw: string | undefined | null) => pick(astro, 'varna', raw),
    vashya: (raw: string | undefined | null) => pick(astro, 'vashya', raw),
    yoni: (raw: string | undefined | null) => pick(astro, 'yoni', raw),
    gan: (raw: string | undefined | null) => pick(astro, 'gan', raw),
    nadi: (raw: string | undefined | null) => pick(astro, 'nadi', raw),
    paya: (raw: string | undefined | null) => pick(astro, 'paya', raw),
    tatva: (raw: string | undefined | null) => pick(astro, 'tatva', raw),
    yoga: (raw: string | undefined | null) => pick(astro, 'yoga', raw),
    karan: (raw: string | undefined | null) => pick(astro, 'karan', raw),
    tithi: (raw: string | undefined | null) => pick(astro, 'tithi', raw),
    avastha: (raw: string | undefined | null) => pick(astro, 'avastha', raw),
    status: (raw: string | undefined | null) => pick(astro, 'status', raw),
    /** Naming syllable from nakshatra (backend NAME_ALPHABET_BY_NAKSHATRA). */
    nameAlphabet: (raw: string | undefined | null) => pick(astro, 'name_alphabet', raw),
    kpPoint: kpPointLabel,
    /** KP / chart uses same graha names for sign lord, star lord, sub lord columns. */
    graha: planetLike,
    /** Planet row name (Sun, Moon, …). */
    planetName: (raw: string | undefined | null) =>
      raw == null || raw === '' ? '—' : pick(astro, 'planets', raw),
  };
}
