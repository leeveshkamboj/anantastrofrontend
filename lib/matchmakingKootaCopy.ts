/**
 * Localized koota row text for Gun Milan tables.
 * English copy mirrors `backend/src/matchmaking/matchmaking.service.ts` `computeGunMilan`.
 */

import type { MatchmakingKootaResult } from '@/store/api/kundliApi';

export type KootaTranslator = (key: string, values?: Record<string, string | number>) => string;

export type KootaAstroFormat = {
  varna: (raw: string) => string;
  vashya: (raw: string) => string;
  yoni: (raw: string) => string;
  graha: (raw: string) => string;
  gan: (raw: string) => string;
  nadi: (raw: string) => string;
};

/** Parses Tara unfavourable line: `Tara (Dina) count ${n} is considered...` */
export function parseTaraCountFromBackendDescription(description: string): number | undefined {
  const m = /\bcount (\d+)\b/i.exec(description);
  return m ? Number(m[1]) : undefined;
}

/** Parses Bhakoot unfavourable line: `... in ${n}th from...` */
export function parseBhakootHouseFromBackendDescription(description: string): number | undefined {
  const m = /(\d+)th from/i.exec(description);
  return m ? Number(m[1]) : undefined;
}

export function localizedKootaTableCells(
  k: MatchmakingKootaResult,
  t: KootaTranslator,
  astro: KootaAstroFormat,
): { areaOfLife: string; description: string; meaning: string } {
  const mv = k.maleValue ?? '';
  const fv = k.femaleValue ?? '';
  const full = k.maxPoints > 0 && k.points === k.maxPoints;

  switch (k.name) {
    case 'Varna':
      return {
        description: full ? t('varna.descOk') : t('varna.descBad'),
        areaOfLife: t('varna.area'),
        meaning: t('varna.meaning'),
      };
    case 'Vashya':
      return {
        description: t('vashya.desc', { v1: astro.vashya(mv), v2: astro.vashya(fv) }),
        areaOfLife: t('vashya.area'),
        meaning: t('vashya.meaning'),
      };
    case 'Tara': {
      const count = parseTaraCountFromBackendDescription(k.description);
      return {
        description: full
          ? t('tara.descOk')
          : count != null
            ? t('tara.descBad', { count })
            : k.description,
        areaOfLife: t('tara.area'),
        meaning: t('tara.meaning'),
      };
    }
    case 'Yoni':
      return {
        description: t('yoni.desc', { y1: astro.yoni(mv), y2: astro.yoni(fv) }),
        areaOfLife: t('yoni.area'),
        meaning: t('yoni.meaning'),
      };
    case 'Graha Maitri':
      return {
        description: t('grahaMaitri.desc', { l1: astro.graha(mv), l2: astro.graha(fv) }),
        areaOfLife: t('grahaMaitri.area'),
        meaning: t('grahaMaitri.meaning'),
      };
    case 'Gana':
      return {
        description: full ? t('gana.descOk', { g1: astro.gan(mv), g2: astro.gan(fv) }) : t('gana.descBad'),
        areaOfLife: t('gana.area'),
        meaning: t('gana.meaning'),
      };
    case 'Bhakoot': {
      const house = parseBhakootHouseFromBackendDescription(k.description);
      return {
        description: full
          ? t('bhakoot.descOk')
          : house != null
            ? t('bhakoot.descBad', { house })
            : k.description,
        areaOfLife: t('bhakoot.area'),
        meaning: t('bhakoot.meaning'),
      };
    }
    case 'Nadi':
      return {
        description: full ? t('nadi.descOk', { n1: astro.nadi(mv), n2: astro.nadi(fv) }) : t('nadi.descBad'),
        areaOfLife: t('nadi.area'),
        meaning: t('nadi.meaning'),
      };
    default:
      return {
        areaOfLife: k.areaOfLife ?? '—',
        description: k.description,
        meaning: k.meaning ?? '—',
      };
  }
}
