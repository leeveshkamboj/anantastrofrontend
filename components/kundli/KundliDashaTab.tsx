'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import type {
  DashaPeriodRow,
  VimshottariDashaData,
  YoginiDashaData,
} from '@/store/api/kundliApi';

function isDashaPeriodRow(v: unknown): v is DashaPeriodRow {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.lord === 'string' && typeof o.endDate === 'string';
}

interface MahadashaWithAntardashas extends DashaPeriodRow {
  antardashas: DashaPeriodRow[];
}

export function parseVimshottariDasha(
  chartData: Record<string, unknown> | null,
): VimshottariDashaData | null {
  const raw = chartData?.vimshottariDasha;
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const birthMd = o.birthMahadasha as Record<string, unknown> | undefined;
  const birthAd = o.birthAntardasha as Record<string, unknown> | undefined;
  const mahadashas = Array.isArray(o.mahadashas)
    ? o.mahadashas.filter(isDashaPeriodRow)
    : [];
  if (!birthMd || typeof birthMd.lord !== 'string' || mahadashas.length === 0) return null;
  return {
    birthMahadasha: {
      lord: birthMd.lord,
      endDate: typeof birthMd.endDate === 'string' ? birthMd.endDate : '—',
    },
    birthAntardasha: {
      lord: typeof birthAd?.lord === 'string' ? birthAd.lord : '—',
      endDate: typeof birthAd?.endDate === 'string' ? birthAd.endDate : '—',
    },
    mahadashas,
    birthMahadashaAntardashas: Array.isArray(o.birthMahadashaAntardashas)
      ? o.birthMahadashaAntardashas.filter(isDashaPeriodRow)
      : [],
    allMahadashas: Array.isArray(o.allMahadashas)
      ? o.allMahadashas
          .filter((m): m is MahadashaWithAntardashas => {
            if (!isDashaPeriodRow(m)) return false;
            const row = m as DashaPeriodRow & { antardashas?: unknown };
            return Array.isArray(row.antardashas);
          })
          .map((m) => ({
            lord: m.lord,
            startDate: m.startDate,
            endDate: m.endDate,
            antardashas: (m as MahadashaWithAntardashas).antardashas.filter(isDashaPeriodRow),
          }))
      : undefined,
  };
}

export function parseYoginiDasha(chartData: Record<string, unknown> | null): YoginiDashaData | null {
  const raw = chartData?.yoginiDasha;
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.birthYogini !== 'string' || !Array.isArray(o.dashas) || o.dashas.length === 0) {
    return null;
  }
  const dashas = o.dashas.filter((d): d is YoginiDashaData['dashas'][number] => {
    if (!d || typeof d !== 'object') return false;
    const row = d as Record<string, unknown>;
    return typeof row.lord === 'string' && typeof row.endDate === 'string';
  });
  if (!dashas.length) return null;
  return {
    birthYogini: o.birthYogini,
    birthYoginiPlanet: typeof o.birthYoginiPlanet === 'string' ? o.birthYoginiPlanet : o.birthYogini,
    dashas,
  };
}

function DashaPeriodTable({
  rows,
  lordLabel,
  formatLord,
  formatDate,
}: {
  rows: DashaPeriodRow[];
  lordLabel: string;
  formatLord: (lord: string) => string;
  formatDate: (d: 'Birth' | string) => string;
}) {
  const tk = useTranslations('results.kundli');
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse min-w-[360px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 pr-2 font-semibold text-gray-900">{lordLabel}</th>
            <th className="py-2 pr-2 font-semibold text-gray-900">{tk('dashaColStart')}</th>
            <th className="py-2 pr-2 font-semibold text-gray-900">{tk('dashaColEnd')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${row.lord}-${idx}`} className="border-b border-gray-100">
              <td className="py-2 pr-2 font-medium text-gray-900">{formatLord(row.lord)}</td>
              <td className="py-2 pr-2 text-gray-700 whitespace-nowrap">{formatDate(row.startDate)}</td>
              <td className="py-2 pr-2 text-gray-700 whitespace-nowrap">{formatDate(row.endDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KundliDashaTab({ chartData }: { chartData: Record<string, unknown> | null }) {
  const tk = useTranslations('results.kundli');
  const astro = useAstroDisplay();
  const vim = parseVimshottariDasha(chartData);
  const yogini = parseYoginiDasha(chartData);

  const formatDashaDate = (d: 'Birth' | string) => (d === 'Birth' ? tk('dashaBirth') : d);
  const formatYogini = (raw: string) => astro.yogini(raw);

  if (!vim && !yogini) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center text-gray-600">{tk('dashaNoData')}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {vim && (
        <>
          <h2 className="text-lg font-semibold text-gray-900">{tk('vimshottariTitle')}</h2>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('dashaAtBirth')}</h3>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">{tk('dashaMahadasha')}</dt>
                  <dd className="text-gray-900">{astro.graha(vim.birthMahadasha.lord)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">{tk('dashaMahadashaEnd')}</dt>
                  <dd className="text-gray-900">{vim.birthMahadasha.endDate}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">{tk('dashaAntardasha')}</dt>
                  <dd className="text-gray-900">{astro.graha(vim.birthAntardasha.lord)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">{tk('dashaAntardashaEnd')}</dt>
                  <dd className="text-gray-900">{vim.birthAntardasha.endDate}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('vimshottariMahadasha')}</h3>
              <DashaPeriodTable
                rows={vim.mahadashas}
                lordLabel={tk('dashaMahadasha')}
                formatLord={(l) => astro.graha(l)}
                formatDate={formatDashaDate}
              />
            </CardContent>
          </Card>
          {vim.birthMahadashaAntardashas.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {tk('vimshottariAntardashaBirth')}
                </h3>
                <DashaPeriodTable
                  rows={vim.birthMahadashaAntardashas}
                  lordLabel={tk('dashaAntardasha')}
                  formatLord={(l) => astro.graha(l)}
                  formatDate={formatDashaDate}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {yogini && (
        <>
          <h2 className="text-lg font-semibold text-gray-900">{tk('yoginiTitle')}</h2>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('dashaAtBirth')}</h3>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">{tk('yoginiLord')}</dt>
                  <dd className="text-gray-900">{formatYogini(yogini.birthYogini)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{tk('yoginiPeriods')}</h3>
              <DashaPeriodTable
                rows={yogini.dashas}
                lordLabel={tk('yoginiLord')}
                formatLord={formatYogini}
                formatDate={formatDashaDate}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
