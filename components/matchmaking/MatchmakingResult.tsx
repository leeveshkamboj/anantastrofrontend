'use client';

import { useTranslations } from 'next-intl';
import type { MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import { ResultCard, CardContent } from '@/components/kundli/result';
import { cn } from '@/lib/utils';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import { localizedKootaTableCells } from '@/lib/matchmakingKootaCopy';

interface MatchmakingResultProps {
  result: MatchmakingResultType;
}

/** Backend `matchmaking.service.ts` koota `name` field → `results.matchmaking.result.kootaNames.*` */
const KOOTA_NAME_KEYS = {
  Varna: 'varna',
  Vashya: 'vashya',
  Tara: 'tara',
  Yoni: 'yoni',
  'Graha Maitri': 'grahaMaitri',
  Gana: 'gana',
  Bhakoot: 'bhakoot',
  Nadi: 'nadi',
} as const;

type KootaNameKey = (typeof KOOTA_NAME_KEYS)[keyof typeof KOOTA_NAME_KEYS];

/** Mirrors `MatchmakingService.computeGunMilan` interpretation thresholds. */
function scoreBand(points: number): 'b18' | 'b1824' | 'b2532' | 'b33' {
  if (points < 18) return 'b18';
  if (points <= 24) return 'b1824';
  if (points <= 32) return 'b2532';
  return 'b33';
}

export function MatchmakingResult({ result }: MatchmakingResultProps) {
  const t = useTranslations('results.matchmaking.result');
  const tk = useTranslations('results.matchmaking.kootaCopy');
  const tp = useTranslations('results.matchmaking');
  const astro = useAstroDisplay();

  const kootaAstro = {
    varna: astro.varna,
    vashya: astro.vashya,
    yoni: astro.yoni,
    graha: astro.graha,
    gan: astro.gan,
    nadi: astro.nadi,
  };

  const kootaTitle = (name: string) => {
    const key = KOOTA_NAME_KEYS[name as keyof typeof KOOTA_NAME_KEYS];
    if (!key) return name;
    const labels: Record<KootaNameKey, string> = {
      varna: t('kootaNames.varna'),
      vashya: t('kootaNames.vashya'),
      tara: t('kootaNames.tara'),
      yoni: t('kootaNames.yoni'),
      grahaMaitri: t('kootaNames.grahaMaitri'),
      gana: t('kootaNames.gana'),
      bhakoot: t('kootaNames.bhakoot'),
      nadi: t('kootaNames.nadi'),
    };
    return labels[key];
  };

  /** Table cells: English enum from backend → localized label (see `matchmaking.service.ts`). */
  const formatKootaValue = (kootaName: string, raw: string | undefined) => {
    if (raw == null || raw === '') return '—';
    switch (kootaName) {
      case 'Varna':
        return astro.varna(raw);
      case 'Vashya':
        return astro.vashya(raw);
      case 'Yoni':
        return astro.yoni(raw);
      case 'Graha Maitri':
        return astro.graha(raw);
      case 'Gana':
        return astro.gan(raw);
      case 'Bhakoot':
        return astro.sign(raw);
      case 'Nadi':
        return astro.nadi(raw);
      default:
        return raw;
    }
  };

  /** Backend `partner*.nakshatra` is Moon nakshatra name (`chart.service` avakhada); may include `-charan`. */
  const partnerNak = (raw: string) =>
    raw.includes('-') ? astro.nakshatraCharan(raw) : astro.nakshatra(raw);

  const band = scoreBand(result.totalPoints);
  const interpretationParagraph =
    band === 'b18'
      ? t('interpretBelow18')
      : band === 'b1824'
        ? t('interpret18to24')
        : band === 'b2532'
          ? t('interpret25to32')
          : t('interpret33plus');
  const footerParagraph =
    band === 'b18'
      ? t('footerBelow18')
      : band === 'b1824'
        ? t('footer18to24')
        : band === 'b2532'
          ? t('footer25to32')
          : t('footer33plus');

  const topKoota = result.kootas.reduce((best, k) => {
    const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
    const bestRatio = best.maxPoints > 0 ? best.points / best.maxPoints : 0;
    return ratio > bestRatio ? k : best;
  }, result.kootas[0]);

  const weakKoota = result.kootas.reduce((worst, k) => {
    const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
    const worstRatio = worst.maxPoints > 0 ? worst.points / worst.maxPoints : 0;
    return ratio < worstRatio ? k : worst;
  }, result.kootas[0]);

  return (
    <ResultCard>
      <CardContent className="pt-0">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900">{t('title')}</h2>

        <p className="mx-auto mb-8 max-w-xl text-center text-gray-700">{interpretationParagraph}</p>

        <div className="mb-8 rounded-2xl border border-astro-orange/20 bg-astro-orange/5 p-4">
          <h4 className="mb-2 font-extrabold text-astro-purple">{t('highlightsTitle')}</h4>
          <p className="text-sm text-gray-800">
            <strong>{t('totalScoreLabel')}</strong> {result.totalPoints}/{result.maxPoints} ({result.percentage}%)
          </p>
          {topKoota ? (
            <p className="mt-1 text-sm text-gray-800">
              <strong>{t('strongestKoota')}</strong> {kootaTitle(topKoota.name)} ({topKoota.points}/{topKoota.maxPoints})
            </p>
          ) : null}
          {weakKoota ? (
            <p className="mt-1 text-sm text-gray-800">
              <strong>{t('needsAttention')}</strong> {kootaTitle(weakKoota.name)} ({weakKoota.points}/{weakKoota.maxPoints})
            </p>
          ) : null}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <h4 className="mb-2 font-extrabold text-gray-900">{result.partner1Summary.name || tp('partner1')}</h4>
            <p>
              <span className="text-gray-600">{t('nakshatra')}</span> {partnerNak(result.partner1Summary.nakshatra)}
            </p>
            <p>
              <span className="text-gray-600">{t('rashi')}</span> {astro.sign(result.partner1Summary.rashi)}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-gray-600">{t('varna')}</span> {astro.varna(result.partner1Summary.varna)} ·{' '}
              <span className="text-gray-600">{t('gana')}</span> {astro.gan(result.partner1Summary.gan)} ·{' '}
              <span className="text-gray-600">{t('nadi')}</span> {astro.nadi(result.partner1Summary.nadi)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <h4 className="mb-2 font-extrabold text-gray-900">{result.partner2Summary.name || tp('partner2')}</h4>
            <p>
              <span className="text-gray-600">{t('nakshatra')}</span> {partnerNak(result.partner2Summary.nakshatra)}
            </p>
            <p>
              <span className="text-gray-600">{t('rashi')}</span> {astro.sign(result.partner2Summary.rashi)}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-gray-600">{t('varna')}</span> {astro.varna(result.partner2Summary.varna)} ·{' '}
              <span className="text-gray-600">{t('gana')}</span> {astro.gan(result.partner2Summary.gan)} ·{' '}
              <span className="text-gray-600">{t('nadi')}</span> {astro.nadi(result.partner2Summary.nadi)}
            </p>
          </div>
        </div>

        <h4 className="mb-3 font-extrabold text-gray-900">{t('matchAshtakootPoints')}</h4>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 text-left font-semibold text-gray-900">{t('tableAttr')}</th>
                <th className="p-3 text-left font-semibold text-gray-900">{t('tableMale')}</th>
                <th className="p-3 text-left font-semibold text-gray-900">{t('tableFemale')}</th>
                <th className="p-3 text-right font-semibold text-gray-900">{t('tableReceived')}</th>
                <th className="p-3 text-right font-semibold text-gray-900">{t('tableOutOf')}</th>
                <th className="p-3 text-left font-semibold text-gray-900">{t('tableAreaOfLife')}</th>
                <th className="min-w-[200px] p-3 text-left font-semibold text-gray-900">{t('tableDescription')}</th>
                <th className="min-w-[220px] p-3 text-left font-semibold text-gray-900">{t('tableMeaning')}</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => {
                const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
                const rowHighlight = ratio === 1 ? 'bg-emerald-50/50' : ratio === 0 ? 'bg-red-50/50' : '';
                const cells = localizedKootaTableCells(k, tk, kootaAstro);
                return (
                  <tr key={k.name} className={cn('border-b border-gray-100 hover:bg-gray-50/50', rowHighlight)}>
                    <td className="p-3 font-medium text-gray-900">{kootaTitle(k.name)}</td>
                    <td className="p-3 text-gray-700">{formatKootaValue(k.name, k.maleValue)}</td>
                    <td className="p-3 text-gray-700">{formatKootaValue(k.name, k.femaleValue)}</td>
                    <td className="p-3 text-right">
                      <span
                        className={
                          k.points === k.maxPoints
                            ? 'font-medium text-emerald-600'
                            : k.points === 0
                              ? 'text-red-600'
                              : 'text-astro-orange'
                        }
                      >
                        {k.points}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-600">{k.maxPoints}</td>
                    <td className="p-3 text-gray-600">{cells.areaOfLife}</td>
                    <td className="p-3 text-gray-600">{cells.description}</td>
                    <td className="p-3 text-gray-500">{cells.meaning}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50 font-medium">
                <td className="p-3 text-gray-900">{t('total')}</td>
                <td className="p-3" />
                <td className="p-3" />
                <td className="p-3 text-right text-gray-900">{result.totalPoints}</td>
                <td className="p-3 text-right text-gray-900">{result.maxPoints}</td>
                <td className="p-3" colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-2xl text-gray-700">
          {t('footerScoreSentence', { total: result.totalPoints, max: result.maxPoints })} {footerParagraph}
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
          <h4 className="mb-4 font-extrabold text-gray-900">{t('doshaTitle')}</h4>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">{t('doshaAshtakootLabel')}</p>
              <p className="text-xl font-extrabold text-gray-900">
                {result.totalPoints}/{result.maxPoints}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{t('doshaNote')}</p>
        </div>
      </CardContent>
    </ResultCard>
  );
}
