'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetKundliGenerationQuery, kundliApi } from '@/store/api/kundliApi';
import type { KundliGenerationStatus } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KundliChart, AstroChartRadix } from '@/components/kundli';
import { BookOpen, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';

const INTERPRETATION_SECTIONS = [
  { key: 'personality', title: 'Personality' },
  { key: 'career', title: 'Career' },
  { key: 'relationships', title: 'Relationships' },
] as const;

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
      <div className="flex flex-wrap items-center gap-4">
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

      {/* Panchang Details */}
      {chartData?.avakhada && typeof chartData.avakhada === 'object' && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Panchang Details</h3>
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
        </div>
      )}

      {/* Avakhada Details */}
      {chartData?.avakhada && typeof chartData.avakhada === 'object' && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Avakhada Details</h3>
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
        </div>
      )}
    </div>
  );
}

function InterpretationBlock({ content }: { content: string }) {
  let data: Record<string, string> | null = null;
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object' && ('personality' in parsed || 'career' in parsed || 'relationships' in parsed)) {
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

export default function KundliResultPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = typeof params?.id === 'string' ? params.id : '';

  const cachedStatus = useSelector((state: RootState) =>
    id ? kundliApi.endpoints.getKundliGeneration.select(id)(state)?.data?.data?.status : undefined,
  );
  const stopPolling = cachedStatus === 'COMPLETED' || cachedStatus === 'FAILED';

  const { data, isLoading, isError, refetch } = useGetKundliGenerationQuery(id, {
    skip: !id,
    pollingInterval: id && !stopPolling ? 2500 : 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!id) return;
    refetch();
  }, [id, refetch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-600">Invalid kundli ID.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your kundli…</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Could not load this kundli. It may not exist or you may not have access.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gen = data.data;
  const status = gen.status as KundliGenerationStatus;

  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {status === 'PENDING' ? 'Your kundli is in the queue' : 'Generating your kundli…'}
            </h2>
            <p className="text-gray-600 text-sm">
              We’re calculating your chart. This usually takes a few seconds. The page will update automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generation failed</h2>
            <p className="text-gray-600 text-sm mb-4">{gen.errorMessage || 'Something went wrong. Please try again.'}</p>
            <Button variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => router.push('/kundli/generate')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Kundli
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Kundli</h1>
            <p className="text-gray-600 text-sm">
              DOB: {gen.dob} • Time: {gen.time}
            </p>
          </div>
        </div>

        {chartImageSrc && (
          <Card className="mb-8 overflow-hidden">
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
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div
                className="max-w-lg mx-auto bg-white [&_svg]:max-w-full [&_svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: chartSvg }}
              />
            </CardContent>
          </Card>
        )}

        {hasPlanetsData && !chartImageSrc && !chartSvg && (
          <Card className="mb-8 overflow-hidden">
            <CardContent className="pt-6 pb-6">
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

        {!chartImageSrc && !chartSvg && chartData && !hasPlanetsData && (
          <Card className="mb-8">
            <CardContent className="pt-6 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Chart data</h2>
              <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(chartData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {interpretation && (
          <Card>
            <CardContent className="pt-6 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interpretation</h2>
              <InterpretationBlock content={interpretation} />
            </CardContent>
          </Card>
        )}

        {!chartImageSrc && !chartSvg && !chartData && !interpretation && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center text-gray-600">
              No chart or interpretation data available yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
