'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KundliChart, AstroChartRadix } from '@/components/kundli';
import { Label } from '@/components/ui/label';
import type { KundliGeneration } from '@/store/api/kundliApi';

const INTERPRETATION_SECTIONS = [
  { key: 'description', title: 'Description' },
  { key: 'personality', title: 'Personality' },
  { key: 'physical', title: 'Physical' },
  { key: 'health', title: 'Health' },
  { key: 'career', title: 'Career' },
  { key: 'relationships', title: 'Relationships' },
] as const;

const KUNDLI_TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'kundli', label: 'Kundli' },
  { id: 'report', label: 'Report' },
  { id: 'remedies', label: 'Remedies' },
] as const;

type KundliTabId = (typeof KUNDLI_TABS)[number]['id'];

type ChartType = 'grid' | 'radix';

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
  const [chartType, setChartType] = useState<ChartType>('grid');

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
            Chart type
          </Label>
          <select
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="grid">Grid (North Indian)</option>
            <option value="radix">Radix (wheel)</option>
          </select>
        </div>
      </div>
      {chartType === 'grid' && (
        <div className="flex justify-center">
          <KundliChart chartData={chartData} useSidereal />
        </div>
      )}
      {chartType === 'radix' && (
        <div className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto">
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
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Chart data (sidereal)</h3>
          {lagnaSign && (
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-medium">Lagna (Ascendant):</span>{' '}
              {lagnaSign} {formatDegree(lagnaDegree)}°
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-2 font-semibold text-gray-900 whitespace-nowrap">Planet</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Sign</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Sign Lord</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Nakshatra</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Naksh Lord</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Degree</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">Retro</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">Combust</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Avastha</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900 text-center">House</th>
                  <th className="py-2 pr-2 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-gray-100">
                    <td className="py-2 pr-2 text-gray-900 font-medium">{r.name}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.sign}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.signLord ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.nakshatra ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.nakshatraLord ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-700 tabular-nums">{formatDegree(r.degree)}°</td>
                    <td className="py-2 pr-2 text-center">{r.retro ? 'Retro' : 'Direct'}</td>
                    <td className="py-2 pr-2 text-center">{r.combust ? 'Yes' : 'No'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.avastha ?? '—'}</td>
                    <td className="py-2 pr-2 text-center tabular-nums">{r.house ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-700">{r.status ?? '—'}</td>
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

function InterpretationBlock({ content }: { content: string }) {
  let data: Record<string, string> | null = null;
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object' && ('description' in parsed || 'personality' in parsed || 'physical' in parsed || 'health' in parsed || 'career' in parsed || 'relationships' in parsed)) {
      data = {};
      for (const { key } of INTERPRETATION_SECTIONS) {
        const v = parsed[key];
        if (typeof v === 'string' && v.trim()) data[key] = v;
      }
    }
  } catch {
    // not JSON, show as plain text
  }

  if (data != null && Object.keys(data).length > 0) {
    return (
      <div className="space-y-5">
        {INTERPRETATION_SECTIONS.filter((s) => data![s.key]).map(({ key, title }) => (
          <div key={key}>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{data![key]}</p>
          </div>
        ))}
      </div>
    );
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
  const [activeTab, setActiveTab] = useState<KundliTabId>('basic');

  const chartData = gen.chartData as Record<string, unknown> | null;
  const interpretation = gen.interpretation ?? '';
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
        <nav className="flex gap-1 -mb-px" aria-label="Kundli sections">
          {KUNDLI_TABS.map(({ id, label }) => (
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
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Birth details</h2>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {gen.name && (
                  <>
                    <dt className="font-medium text-gray-500">Name</dt>
                    <dd className="text-gray-900">{gen.name}</dd>
                  </>
                )}
                <dt className="font-medium text-gray-500">Date of birth</dt>
                <dd className="text-gray-900">{gen.dob}</dd>
                <dt className="font-medium text-gray-500">Time of birth</dt>
                <dd className="text-gray-900">{gen.time}</dd>
                {gen.placeOfBirth && (
                  <>
                    <dt className="font-medium text-gray-500">Place of birth</dt>
                    <dd className="text-gray-900">{gen.placeOfBirth}</dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {chartData?.avakhada && typeof chartData.avakhada === 'object' ? (
            <>
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Panchang Details</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[240px]">
                      <tbody>
                        {[
                          { label: 'Tithi', key: 'tithi' },
                          { label: 'Karan', key: 'karan' },
                          { label: 'Yog', key: 'yog' },
                          { label: 'Nakshatra', key: 'nakshatra' },
                        ].map(({ label, key }) => {
                          const val = (chartData.avakhada as Record<string, string>)[key];
                          return (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="py-1.5 pr-4 font-medium text-gray-700 whitespace-nowrap">{label}</td>
                              <td className="py-1.5 text-gray-900">{val ?? '—'}</td>
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Avakhada Details</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse min-w-[320px]">
                      <tbody>
                        {[
                          { label: 'Varna', key: 'varna' },
                          { label: 'Vashya', key: 'vashya' },
                          { label: 'Yoni', key: 'yoni' },
                          { label: 'Gan', key: 'gan' },
                          { label: 'Nadi', key: 'nadi' },
                          { label: 'Sign', key: 'sign' },
                          { label: 'Sign Lord', key: 'signLord' },
                          { label: 'Nakshatra-Charan', key: 'nakshatraCharan' },
                          { label: 'Yog', key: 'yog' },
                          { label: 'Karan', key: 'karan' },
                          { label: 'Tithi', key: 'tithi' },
                          { label: 'Yunja', key: 'yunja' },
                          { label: 'Tatva', key: 'tatva' },
                          { label: 'Name alphabet', key: 'nameAlphabet' },
                          { label: 'Paya', key: 'paya' },
                        ].map(({ label, key }) => {
                          const val = (chartData.avakhada as Record<string, string>)[key];
                          return (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="py-1.5 pr-4 font-medium text-gray-700 whitespace-nowrap">{label}</td>
                              <td className="py-1.5 text-gray-900">{val ?? '—'}</td>
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
                    alt="Kundli chart"
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Birth chart (Rashi)</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Chart data</h2>
                <BirthChartSection chartData={chartData} />
              </CardContent>
            </Card>
          )}

          {!chartImageSrc && !chartSvg && chartData && !hasPlanetsData && (
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Chart data</h2>
                <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {!hasKundliContent && (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-600">
                No chart data available yet.
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Interpretation</h2>
                <InterpretationBlock content={interpretation} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-600">
                No interpretation report available yet.
              </CardContent>
            </Card>
          )}
        </>
      )}

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
        return (
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Remedies</h2>
              {remediesText ? (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{remediesText}</p>
              ) : (
                <p className="text-gray-600 text-sm">No remedies available yet.</p>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </>
  );
}
