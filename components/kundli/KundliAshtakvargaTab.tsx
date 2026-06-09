'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import type { AshtakvargaData, AshtakvargaPlanet } from '@/store/api/kundliApi';

const ASHTAKVARGA_PLANETS: AshtakvargaPlanet[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
];

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;

function isHouseScores(v: unknown): v is Record<string, number> {
  if (!v || typeof v !== 'object') return false;
  return Object.values(v as Record<string, unknown>).every((n) => typeof n === 'number');
}

export function parseAshtakvarga(chartData: Record<string, unknown> | null): AshtakvargaData | null {
  const raw = chartData?.ashtakvarga;
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!o.bav || typeof o.bav !== 'object' || !isHouseScores(o.sav)) return null;

  const bavRaw = o.bav as Record<string, unknown>;
  const bav = {} as AshtakvargaData['bav'];
  for (const planet of ASHTAKVARGA_PLANETS) {
    const row = bavRaw[planet];
    if (!isHouseScores(row)) return null;
    bav[planet] = row;
  }

  return {
    bav,
    asc: isHouseScores(o.asc) ? o.asc : {},
    sav: o.sav,
  };
}

function houseScore(scores: Record<string, number>, house: string): number {
  const v = scores[house];
  return typeof v === 'number' ? v : 0;
}

function savTotal(sav: Record<string, number>): number {
  return HOUSES.reduce((sum, h) => sum + houseScore(sav, h), 0);
}

export function KundliAshtakvargaTab({ chartData }: { chartData: Record<string, unknown> | null }) {
  const tk = useTranslations('results.kundli');
  const astro = useAstroDisplay();
  const data = parseAshtakvarga(chartData);

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center text-gray-600">
          {tk('ashtakvargaNoData')}
        </CardContent>
      </Card>
    );
  }

  const rows: { key: string; label: string; scores: Record<string, number>; highlight?: boolean }[] =
    [
      ...ASHTAKVARGA_PLANETS.map((p) => ({
        key: p,
        label: astro.planetName(p),
        scores: data.bav[p as AshtakvargaPlanet],
      })),
      { key: 'asc', label: tk('ashtakvargaLagna'), scores: data.asc },
      {
        key: 'sav',
        label: tk('ashtakvargaSav'),
        scores: data.sav,
        highlight: true,
      },
    ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{tk('ashtakvargaTitle')}</h2>
        <p className="text-sm text-gray-600">
          {tk('ashtakvargaSavTotal')}:{' '}
          <span className="font-medium tabular-nums text-gray-900">{savTotal(data.sav)}</span>
        </p>
      </div>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 font-semibold text-gray-900 text-left sticky left-0 bg-white">
                    {tk('ashtakvargaRow')}
                  </th>
                  {HOUSES.map((h) => (
                    <th key={h} className="py-2 px-1.5 font-semibold text-gray-900 tabular-nums">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className={`border-b border-gray-100 ${row.highlight ? 'bg-primary/5 font-medium' : ''}`}
                  >
                    <td className="py-2 px-2 text-left text-gray-900 whitespace-nowrap sticky left-0 bg-inherit">
                      {row.label}
                    </td>
                    {HOUSES.map((h) => (
                      <td key={h} className="py-2 px-1.5 text-gray-700 tabular-nums">
                        {houseScore(row.scores, h)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">{tk('ashtakvargaHouseHint')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
