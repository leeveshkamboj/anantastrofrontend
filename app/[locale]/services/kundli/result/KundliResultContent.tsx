'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { KundliChart, AstroChartRadix, NorthIndianDiamondChart } from '@/components/kundli';
import { Label } from '@/components/ui/label';
import {
  useGetKundliHoroscopeAddonQuery,
  useUnlockKundliHoroscopeAddonMutation,
  type KundliGeneration,
  type KpChartData,
} from '@/store/api/kundliApi';
import { useServiceRunPrice } from '@/hooks/useServiceRunPrice';
import { AiTranslateBar } from '@/components/reports/AiTranslateBar';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { Button } from '@/components/ui/button';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import { useTranslateSections } from '@/hooks/useTranslateSections';

const INTERPRETATION_KEYS = [
  'description',
  'personality',
  'physical',
  'health',
  'career',
  'relationships',
] as const;

const ADDON_KEYS = ['overview', 'career', 'relationships', 'health', 'finance', 'guidance'] as const;

const PANCHANG_KEYS = ['tithi', 'karan', 'yog', 'nakshatra'] as const;
const AVAKHADA_KEYS = [
  'varna',
  'vashya',
  'yoni',
  'gan',
  'nadi',
  'sign',
  'signLord',
  'nakshatraCharan',
  'yog',
  'karan',
  'tithi',
  'yunja',
  'tatva',
  'nameAlphabet',
  'paya',
] as const;

function parseMainInterpretationSections(interpretation: string): Record<string, string> | null {
  if (!interpretation.trim()) return null;
  try {
    const parsed = JSON.parse(interpretation) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!('description' in parsed || 'personality' in parsed || 'physical' in parsed)) return null;
    const out: Record<string, string> = {};
    for (const key of [...INTERPRETATION_KEYS, 'remedies']) {
      const v = parsed[key];
      if (typeof v === 'string' && v.trim()) out[key] = v;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function parseAddonSections(content: string): Record<string, string> | null {
  if (!content.trim()) return null;
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    if ('description' in parsed && !('overview' in parsed)) return null;
    const out: Record<string, string> = {};
    for (const key of ADDON_KEYS) {
      const v = parsed[key];
      if (typeof v === 'string' && v.trim()) out[key] = v;
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

const KUNDLI_TAB_IDS = ['basic', 'kundli', 'kp', 'report', 'horoscope', 'remedies'] as const;

type KundliTabId = (typeof KUNDLI_TAB_IDS)[number];

type ChartType = 'north-indian' | 'south-indian' | 'radix';

function renderBoldMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

interface PlanetRow {
  name: string;
  sign: string;
  degree: number;
  signLord?: string;
  nakshatra?: string;
  nakshatraLord?: string;
  retro?: boolean;
  combust?: boolean;
  avastha?: string;
  house?: number;
  status?: string;
}

interface RawPlanet {
  name?: string;
  sign?: string;
  signSidereal?: string;
  degreeInSign?: number;
  degreeInSignSidereal?: number;
  signLord?: string;
  nakshatra?: string;
  nakshatraLord?: string;
  retro?: boolean;
  combust?: boolean;
  avastha?: string;
  house?: number;
  status?: string;
}

function BirthChartSection({
  chartData,
}: {
  chartData: Record<string, unknown> | null;
}) {
  const tk = useTranslations('results.kundli');
  const astro = useAstroDisplay();
  const [chartType, setChartType] = useState<ChartType>('north-indian');

  const planets = (chartData?.planets as RawPlanet[] | undefined) ?? [];
  const useSidereal = true;
  const lagnaSign = (chartData?.lagnaSign as string | undefined) ?? '';
  const lagnaDegree = typeof chartData?.lagnaDegreeInSign === 'number' ? chartData.lagnaDegreeInSign : 0;
  const formatDegree = (d: number) => Number.isFinite(d) ? d.toFixed(2) : '0.00';

  const rows: PlanetRow[] = planets
    .filter((p): p is RawPlanet => p != null && typeof p.name === 'string')
    .map((p) => ({
      name: p.name!,
      sign: (useSidereal && p.signSidereal) ? String(p.signSidereal) : String(p.sign ?? ''),
      degree: useSidereal && typeof p.degreeInSignSidereal === 'number'
        ? p.degreeInSignSidereal
        : Number(p.degreeInSign ?? 0),
      signLord: p.signLord,
      nakshatra: p.nakshatra,
      nakshatraLord: p.nakshatraLord,
      retro: p.retro,
      combust: p.combust,
      avastha: p.avastha,
      house: p.house,
      status: p.status,
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="chart-type" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {tk('chartType')}
          </Label>
          <select
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="north-indian">{tk('chartNorth')}</option>
            <option value="south-indian">{tk('chartSouth')}</option>
            <option value="radix">{tk('chartRadix')}</option>
          </select>
        </div>
      </div>
      {chartType === 'north-indian' && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full max-w-full overflow-x-auto">
          <div className="flex justify-center shrink-0">
            <NorthIndianDiamondChart chartData={chartData} title={tk('lagnaD1')} />
          </div>
          {chartData?.navamsa && typeof chartData.navamsa === 'object' && Array.isArray((chartData.navamsa as { planets?: unknown }).planets) ? (
            <div className="flex justify-center shrink-0">
              <NorthIndianDiamondChart
                chartData={chartData.navamsa as Record<string, unknown>}
                title={tk('navamsaD9')}
              />
            </div>
          ) : null}
        </div>
      )}
      {chartType === 'south-indian' && (
        <div className="flex justify-center w-full max-w-full overflow-x-auto">
          <KundliChart chartData={chartData} useSidereal />
        </div>
      )}
      {chartType === 'radix' && (
        <div className="flex justify-center w-full max-w-full min-w-0 [&_svg]:max-w-full [&_svg]:h-auto">
          <AstroChartRadix
            chartData={chartData}
            useSidereal
            size={520}
            className="rounded-lg overflow-hidden border border-amber-200 bg-white"
          />
        </div>
      )}

      {(rows.length > 0 || lagnaSign) && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('chartDataSidereal')}</h3>
          {lagnaSign && (
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-medium">{tk('lagnaAscendant')}</span>{' '}
              {astro.sign(lagnaSign)} {formatDegree(lagnaDegree)}°
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-2 font-semibold text-gray-900 whitespace-nowrap">{tk('planet')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('sign')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('signLord')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('nakshatra')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('nakshLord')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('degree')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">{tk('retro')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">{tk('combust')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('avastha')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">{tk('house')}</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">{tk('status')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-gray-100">
                    <td className="py-2 pr-2 text-gray-900 font-medium">{astro.planetName(r.name)}</td>
                    <td className="py-2 pr-2 text-gray-700">{astro.sign(r.sign)}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.signLord != null ? astro.graha(r.signLord) : '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.nakshatra != null ? astro.nakshatra(r.nakshatra) : '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.nakshatraLord != null ? astro.nakshatraLord(r.nakshatraLord) : '—'}</td>
                    <td className="py-2 pr-2 text-gray-700 tabular-nums">{formatDegree(r.degree)}°</td>
                    <td className="py-2 pr-2 text-center">{r.retro ? tk('retroYes') : tk('retroDirect')}</td>
                    <td className="py-2 pr-2 text-center">{r.combust ? tk('yes') : tk('no')}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.avastha != null ? astro.avastha(r.avastha) : '—'}</td>
                    <td className="py-2 pr-2 text-center tabular-nums">{r.house ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.status != null ? astro.status(r.status) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InterpretationBlock({
  content,
  variant,
  translatedByKey,
}: {
  content: string;
  variant: 'main' | 'addon';
  translatedByKey?: Record<string, string> | null;
}) {
  const tMain = useTranslations('results.kundli.interp');
  const tAddon = useTranslations('results.kundli.addon');
  const keys = variant === 'main' ? INTERPRETATION_KEYS : ADDON_KEYS;

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    parsed = null;
  }

  if (parsed && typeof parsed === 'object') {
    const hasContent = keys.some((k) => {
      const v = parsed![k];
      return typeof v === 'string' && (v as string).trim();
    });
    if (hasContent) {
      return (
        <div className="space-y-5">
          {keys.map((key) => {
            const raw = parsed![key];
            const base = typeof raw === 'string' ? raw : '';
            const text = translatedByKey?.[key] ?? base;
            if (!text?.trim()) return null;
            const title = variant === 'main' ? tMain(key) : tAddon(key);
            return (
              <div key={key}>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{renderBoldMarkdown(text)}</p>
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap text-sm">
      {content}
    </div>
  );
}

export interface KundliResultContentProps {
  gen: KundliGeneration;
}

export function KundliResultContent({ gen }: KundliResultContentProps) {
  const tk = useTranslations('results.kundli');
  const astro = useAstroDisplay();
  const interpretTranslate = useTranslateSections();
  const addonTranslate = useTranslateSections();
  const [activeTab, setActiveTab] = useState<KundliTabId>('basic');
  const [shouldPollAddon, setShouldPollAddon] = useState(false);
  const { compactLabel: addonPrice } = useServiceRunPrice('kundli_horoscope_addon');
  const {
    data: addonData,
    isFetching: addonLoading,
  } = useGetKundliHoroscopeAddonQuery(gen.uuid, {
    pollingInterval: activeTab === 'horoscope' && shouldPollAddon ? 2500 : 0,
  });
  const [unlockAddon, { isLoading: unlockingAddon }] = useUnlockKundliHoroscopeAddonMutation();

  const interpretation = gen.interpretation ?? '';

  useEffect(() => {
    const status = addonData?.data?.status;
    if (status === 'PENDING' || status === 'PROCESSING') {
      setShouldPollAddon(true);
      return;
    }
    setShouldPollAddon(false);
  }, [addonData?.data?.status]);

  useEffect(() => {
    interpretTranslate.reset();
    addonTranslate.reset();
  }, [gen.uuid, interpretTranslate.reset, addonTranslate.reset]);

  const panchangDisplay = (key: (typeof PANCHANG_KEYS)[number], val: string | undefined) => {
    const v = val ?? '';
    if (key === 'tithi') return astro.tithi(v);
    if (key === 'karan') return astro.karan(v);
    if (key === 'yog') return astro.yoga(v);
    if (key === 'nakshatra') return astro.nakshatra(v);
    return v;
  };

  const avakhadaDisplay = (key: (typeof AVAKHADA_KEYS)[number], val: string | undefined) => {
    const v = val ?? '';
    switch (key) {
      case 'varna':
        return astro.varna(v);
      case 'vashya':
        return astro.vashya(v);
      case 'yoni':
        return astro.yoni(v);
      case 'gan':
        return astro.gan(v);
      case 'nadi':
        return astro.nadi(v);
      case 'sign':
        return astro.sign(v);
      case 'signLord':
        return astro.graha(v);
      case 'nakshatraCharan':
        return astro.nakshatraCharan(v);
      case 'yog':
        return astro.yoga(v);
      case 'karan':
        return astro.karan(v);
      case 'tithi':
        return astro.tithi(v);
      case 'yunja':
        return astro.nadi(v);
      case 'tatva':
        return astro.tatva(v);
      case 'nameAlphabet':
        return astro.nameAlphabet(v);
      case 'paya':
        return astro.paya(v);
      default:
        return v;
    }
  };

  const chartData = gen.chartData as Record<string, unknown> | null;
  const hasPlanetsData = chartData && Array.isArray((chartData as { planets?: unknown }).planets) && (chartData as { planets: unknown[] }).planets.length > 0;

  const chartImageSrc =
    chartData && typeof (chartData as { imageUrl?: string }).imageUrl === 'string'
      ? (chartData as { imageUrl: string }).imageUrl
      : chartData && typeof (chartData as { dataUrl?: string }).dataUrl === 'string'
        ? (chartData as { dataUrl: string }).dataUrl
        : chartData && typeof (chartData as { image?: string }).image === 'string'
          ? (chartData as { image: string }).image
          : null;
  const chartSvg =
    chartData && typeof (chartData as { svg?: string }).svg === 'string' ? (chartData as { svg: string }).svg : null;

  const hasKundliContent = !!(chartImageSrc || chartSvg || hasPlanetsData || (chartData && !hasPlanetsData));

  return (
    <>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px" aria-label={tk('tabsNavAriaLabel')}>
          {KUNDLI_TAB_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`
                cursor-pointer px-4 py-2.5 text-sm font-medium rounded-t-md border-b-2 transition-colors
                ${activeTab === id
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {{
                basic: tk('tabs.basic'),
                kundli: tk('tabs.kundli'),
                kp: tk('tabs.kp'),
                report: tk('tabs.report'),
                horoscope: tk('tabs.horoscope'),
                remedies: tk('tabs.remedies'),
              }[id]}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{tk('basicBirthHeading')}</h2>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {gen.name && (
                  <>
                    <dt className="font-medium text-gray-500">{tk('labelName')}</dt>
                    <dd className="text-gray-900">{gen.name}</dd>
                  </>
                )}
                <dt className="font-medium text-gray-500">{tk('labelDob')}</dt>
                <dd className="text-gray-900">{gen.dob}</dd>
                <dt className="font-medium text-gray-500">{tk('labelTime')}</dt>
                <dd className="text-gray-900">{gen.time}</dd>
                {gen.placeOfBirth && (
                  <>
                    <dt className="font-medium text-gray-500">{tk('labelPlace')}</dt>
                    <dd className="text-gray-900">{gen.placeOfBirth}</dd>
                  </>
                )}
                {((gen.timezoneOffsetHours != null && !Number.isNaN(Number(gen.timezoneOffsetHours))) || (chartData && typeof (chartData as { timezoneOffsetHours?: number }).timezoneOffsetHours === 'number')) && (
                  <>
                    <dt className="font-medium text-gray-500">{tk('labelTimezone')}</dt>
                    <dd className="text-gray-900">
                      {(() => {
                        const tz = gen.timezoneOffsetHours != null && !Number.isNaN(Number(gen.timezoneOffsetHours))
                          ? Number(gen.timezoneOffsetHours)
                          : (chartData as { timezoneOffsetHours?: number })?.timezoneOffsetHours;
                        if (tz == null || Number.isNaN(tz)) return '—';
                        const h = Number(tz);
                        const sign = h >= 0 ? '+' : '-';
                        const abs = Math.abs(h);
                        const hrs = Math.floor(abs);
                        const mins = Math.round((abs - hrs) * 60);
                        return mins ? `GMT${sign}${hrs}:${mins.toString().padStart(2, '0')}` : `GMT${sign}${hrs}:00`;
                      })()}
                    </dd>
                  </>
                )}
                {gen.latitude != null && gen.longitude != null && (
                  <>
                    <dt className="font-medium text-gray-500">{tk('labelCoordinates')}</dt>
                    <dd className="text-gray-900 tabular-nums">
                      {Number(gen.latitude).toFixed(4)}°N, {Number(gen.longitude).toFixed(4)}°E
                    </dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {chartData?.avakhada && typeof chartData.avakhada === 'object' ? (
            <>
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{tk('panchangTitle')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[240px]">
                      <tbody>
                        {PANCHANG_KEYS.map((key) => {
                          const val = (chartData.avakhada as Record<string, string>)[key];
                          return (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="py-1.5 pr-4 font-medium text-gray-700 whitespace-nowrap">
                                {tk(`panchang.${key}`)}
                              </td>
                              <td className="py-1.5 text-gray-900">{panchangDisplay(key, val)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{tk('avakhadaTitle')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[320px]">
                      <tbody>
                        {AVAKHADA_KEYS.map((key) => {
                          const val = (chartData.avakhada as Record<string, string>)[key];
                          return (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="py-1.5 pr-4 font-medium text-gray-700 whitespace-nowrap">
                                {tk(`avakhada.${key}`)}
                              </td>
                              <td className="py-1.5 text-gray-900">{avakhadaDisplay(key, val)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {activeTab === 'kundli' && (
        <div className="space-y-6">
          {chartImageSrc && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square max-w-lg mx-auto bg-white">
                  <img
                    src={chartImageSrc}
                    alt={tk('kundliChartAlt')}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {chartSvg && !chartImageSrc && (
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div
                  className="max-w-lg mx-auto bg-white [&_svg]:max-w-full [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: chartSvg }}
                />
              </CardContent>
            </Card>
          )}

          {hasPlanetsData && (!chartImageSrc && !chartSvg) && (
            <Card className="overflow-hidden">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">{tk('birthChartRashiTitle')}</h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {gen.name && <span className="font-medium">{gen.name}</span>}
                  {gen.name && (gen.placeOfBirth || gen.dob) && ' · '}
                  {gen.dob} {gen.time}
                  {gen.placeOfBirth && ` · ${gen.placeOfBirth}`}
                </p>
                <BirthChartSection chartData={chartData} />
              </CardContent>
            </Card>
          )}

          {chartImageSrc && hasPlanetsData && (
            <Card className="overflow-hidden">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{tk('chartDataHeading')}</h2>
                <BirthChartSection chartData={chartData} />
              </CardContent>
            </Card>
          )}

          {!chartImageSrc && !chartSvg && chartData && !hasPlanetsData && (
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{tk('chartDataHeading')}</h2>
                <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {!hasKundliContent && (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-600">
                {tk('noChartDataYet')}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'kp' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">{tk('kpBhavChalitTitle')}</h2>
          {(gen.kpChartData as KpChartData | null)?.rulingPlanets?.length ? (
            <>
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('kpRulingPlanets')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[320px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpColPoint')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('signLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpStarLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpSubLord')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(gen.kpChartData as KpChartData).rulingPlanets!.map((row) => (
                          <tr key={row.point} className="border-b border-gray-100">
                            <td className="py-2 pr-2 font-medium text-gray-900">{astro.kpPoint(row.point)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.signLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.starLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.subLord)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('kpPlanetsSection')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpTablePlanets')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpCusp')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('sign')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('signLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpStarLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpSubLord')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(gen.kpChartData as KpChartData).planets?.map((row) => (
                          <tr key={row.planet} className="border-b border-gray-100">
                            <td className="py-2 pr-2 font-medium text-gray-900">{astro.planetName(row.planet)}</td>
                            <td className="py-2 pr-2 text-gray-700 tabular-nums">{row.cusp}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.sign(row.sign)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.signLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.starLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.subLord)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('kpCuspsSection')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[520px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpCusp')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('degree')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('sign')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('signLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpStarLord')}</th>
                          <th className="py-2 pr-2 font-semibold text-gray-900">{tk('kpSubLord')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(gen.kpChartData as KpChartData).cusps?.map((row) => (
                          <tr key={row.cusp} className="border-b border-gray-100">
                            <td className="py-2 pr-2 font-medium text-gray-900 tabular-nums">{row.cusp}</td>
                            <td className="py-2 pr-2 text-gray-700 tabular-nums">{row.degree.toFixed(2)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.sign(row.sign)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.signLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.starLord)}</td>
                            <td className="py-2 pr-2 text-gray-700">{astro.graha(row.subLord)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-600">
                {tk('kpNoData')}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <>
          {interpretation ? (
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{tk('reportHeading')}</h2>
                <AiTranslateBar
                  visible={
                    interpretTranslate.needsUi &&
                    interpretTranslate.translatedByKey == null
                  }
                  isTranslating={interpretTranslate.loading}
                  onTranslate={() => {
                    const s = parseMainInterpretationSections(interpretation);
                    if (s) void interpretTranslate.translateSections(s);
                  }}
                />
                <InterpretationBlock
                  variant="main"
                  content={interpretation}
                  translatedByKey={interpretTranslate.translatedByKey}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-600">
                {tk('noInterpretationYet')}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === 'horoscope' && (() => {
        const addon = addonData?.data;
        const status = addon?.status ?? null;
        const isReady = status === 'COMPLETED' && !!addon?.content;
        const isWorking = status === 'PENDING' || status === 'PROCESSING';

        return (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{tk('horoscopeAddonTitle')}</h2>
              {isReady ? (
                <>
                  <AiTranslateBar
                    visible={
                      addonTranslate.needsUi && addonTranslate.translatedByKey == null
                    }
                    isTranslating={addonTranslate.loading}
                    onTranslate={() => {
                      const s = parseAddonSections(addon!.content!);
                      if (s) void addonTranslate.translateSections(s);
                    }}
                  />
                  <InterpretationBlock
                    variant="addon"
                    content={addon!.content!}
                    translatedByKey={addonTranslate.translatedByKey}
                  />
                </>
              ) : isWorking || addonLoading ? (
                <p className="text-sm text-gray-600">{tk('horoscopeAddonGenerating')}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{tk('horoscopeAddonUnlockHint')}</p>
                  {status === 'FAILED' && addon?.errorMessage && (
                    <p className="text-sm text-red-600">{addon.errorMessage}</p>
                  )}
                  <Button
                    type="button"
                    disabled={unlockingAddon}
                    onClick={() => {
                      setShouldPollAddon(true);
                      unlockAddon(gen.uuid);
                    }}
                    className="h-auto"
                  >
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      {unlockingAddon ? tk('unlockingHoroscope') : tk('unlockHoroscope')}
                      {addonPrice && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <CoinGlyph className="h-4 w-4 shrink-0" />
                            {addonPrice}
                          </span>
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {activeTab === 'remedies' && (() => {
        let remediesText = '';
        try {
          const parsed = JSON.parse(interpretation || '{}') as Record<string, unknown>;
          if (parsed && typeof parsed.remedies === 'string' && parsed.remedies.trim()) {
            remediesText = parsed.remedies.trim();
          }
        } catch {
          // ignore
        }
        const remediesDisplay =
          interpretTranslate.translatedByKey?.remedies ?? remediesText;
        return (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{tk('interp.remedies')}</h2>
              {remediesText ? (
                <>
                  <AiTranslateBar
                    visible={
                      interpretTranslate.needsUi &&
                      interpretTranslate.translatedByKey == null
                    }
                    isTranslating={interpretTranslate.loading}
                    onTranslate={() => {
                      const s = parseMainInterpretationSections(interpretation);
                      if (s) void interpretTranslate.translateSections(s);
                    }}
                  />
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {renderBoldMarkdown(remediesDisplay)}
                  </p>
                </>
              ) : (
                <p className="text-gray-600 text-sm">{tk('noRemediesYet')}</p>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </>
  );
}
