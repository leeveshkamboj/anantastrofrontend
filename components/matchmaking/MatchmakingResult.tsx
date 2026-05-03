'use client';

import { useTranslations } from 'next-intl';
import type { MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="mt-12 border-2 border-primary/20">
      <CardContent className="pt-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('title')}</h2>
        <div className="flex flex-col items-center mb-8">
          <div
            className={cn(
              'text-4xl font-bold rounded-full h-24 w-24 flex items-center justify-center',
              result.percentage >= 25
                ? 'bg-green-100 text-green-800'
                : result.percentage >= 18
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800',
            )}
          >
            {result.totalPoints}/{result.maxPoints}
          </div>
          <p className="text-lg text-gray-600 mt-2">{t('percentMatch', { pct: result.percentage })}</p>
          <p className="text-center text-gray-700 mt-4 max-w-xl">{interpretationParagraph}</p>
        </div>
        <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50/70 p-4">
          <h4 className="font-semibold text-violet-900 mb-2">{t('highlightsTitle')}</h4>
          <p className="text-sm text-violet-900">
            <strong>{t('totalScoreLabel')}</strong> {result.totalPoints}/{result.maxPoints} ({result.percentage}%)
          </p>
          {topKoota && (
            <p className="text-sm text-violet-900 mt-1">
              <strong>{t('strongestKoota')}</strong> {kootaTitle(topKoota.name)} ({topKoota.points}/{topKoota.maxPoints})
            </p>
          )}
          {weakKoota && (
            <p className="text-sm text-violet-900 mt-1">
              <strong>{t('needsAttention')}</strong> {kootaTitle(weakKoota.name)} ({weakKoota.points}/{weakKoota.maxPoints})
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{result.partner1Summary.name || tp('partner1')}</h4>
            <p>
              <span className="text-gray-600">{t('nakshatra')}</span> {partnerNak(result.partner1Summary.nakshatra)}
            </p>
            <p>
              <span className="text-gray-600">{t('rashi')}</span> {astro.sign(result.partner1Summary.rashi)}
            </p>
            <p className="text-sm mt-1">
              <span className="text-gray-600">{t('varna')}</span> {astro.varna(result.partner1Summary.varna)} ·{' '}
              <span className="text-gray-600">{t('gana')}</span> {astro.gan(result.partner1Summary.gan)} ·{' '}
              <span className="text-gray-600">{t('nadi')}</span> {astro.nadi(result.partner1Summary.nadi)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{result.partner2Summary.name || tp('partner2')}</h4>
            <p>
              <span className="text-gray-600">{t('nakshatra')}</span> {partnerNak(result.partner2Summary.nakshatra)}
            </p>
            <p>
              <span className="text-gray-600">{t('rashi')}</span> {astro.sign(result.partner2Summary.rashi)}
            </p>
            <p className="text-sm mt-1">
              <span className="text-gray-600">{t('varna')}</span> {astro.varna(result.partner2Summary.varna)} ·{' '}
              <span className="text-gray-600">{t('gana')}</span> {astro.gan(result.partner2Summary.gan)} ·{' '}
              <span className="text-gray-600">{t('nadi')}</span> {astro.nadi(result.partner2Summary.nadi)}
            </p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">{t('matchAshtakootPoints')}</h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left p-3 font-medium text-gray-900">{t('tableAttr')}</th>
                <th className="text-left p-3 font-medium text-gray-900">{t('tableMale')}</th>
                <th className="text-left p-3 font-medium text-gray-900">{t('tableFemale')}</th>
                <th className="text-right p-3 font-medium text-gray-900">{t('tableReceived')}</th>
                <th className="text-right p-3 font-medium text-gray-900">{t('tableOutOf')}</th>
                <th className="text-left p-3 font-medium text-gray-900">{t('tableAreaOfLife')}</th>
                <th className="text-left p-3 font-medium text-gray-900 min-w-[200px]">{t('tableDescription')}</th>
                <th className="text-left p-3 font-medium text-gray-900 min-w-[220px]">{t('tableMeaning')}</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => {
                const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
                const rowHighlight = ratio === 1 ? 'bg-green-50/40' : ratio === 0 ? 'bg-red-50/40' : '';
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
                            ? 'text-green-600 font-medium'
                            : k.points === 0
                              ? 'text-red-600'
                              : 'text-amber-600'
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
              <tr className="bg-gray-50 font-medium border-t-2 border-gray-200">
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

        <p className="text-gray-700 mt-8 max-w-2xl">
          {t('footerScoreSentence', { total: result.totalPoints, max: result.maxPoints })} {footerParagraph}
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">{t('doshaTitle')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{t('doshaAshtakootLabel')}</p>
              <p className="text-xl font-bold text-gray-900">
                {result.totalPoints}/{result.maxPoints}
              </p>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{t('doshaNote')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
