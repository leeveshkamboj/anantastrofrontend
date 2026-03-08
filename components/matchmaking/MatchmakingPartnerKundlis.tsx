'use client';

import { Card, CardContent } from '@/components/ui/card';
import { NorthIndianDiamondChart } from '@/components/kundli';

interface MatchmakingPartnerKundlisProps {
  partner1Name: string;
  partner2Name: string;
  partner1ChartData: Record<string, unknown> | null;
  partner2ChartData: Record<string, unknown> | null;
}

function hasPlanets(chartData: Record<string, unknown> | null): boolean {
  const planets = chartData?.planets;
  return Array.isArray(planets) && planets.length > 0;
}

export function MatchmakingPartnerKundlis({
  partner1Name,
  partner2Name,
  partner1ChartData,
  partner2ChartData,
}: MatchmakingPartnerKundlisProps) {
  const has1 = hasPlanets(partner1ChartData);
  const has2 = hasPlanets(partner2ChartData);
  if (!has1 && !has2) return null;

  return (
    <Card className="mb-8 border border-gray-200">
      <CardContent className="pt-6 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Partner Kundlis</h2>
        <p className="text-sm text-gray-600 text-center mb-6 max-w-2xl mx-auto">
          Birth charts (Lagna D-1) for both partners, as used in the Gun Milan compatibility analysis.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">{partner1Name || 'Partner 1'}</h3>
            {has1 ? (
              <div className="flex flex-col items-center gap-6">
                <NorthIndianDiamondChart
                  chartData={partner1ChartData as Record<string, unknown>}
                  title="Lagna (D-1)"
                  className="max-w-full"
                />
                {partner1ChartData?.navamsa &&
                typeof partner1ChartData.navamsa === 'object' &&
                Array.isArray((partner1ChartData.navamsa as { planets?: unknown }).planets) &&
                (partner1ChartData.navamsa as { planets: unknown[] }).planets.length > 0 ? (
                  <NorthIndianDiamondChart
                    chartData={partner1ChartData.navamsa as Record<string, unknown>}
                    title="Navamsa (D-9)"
                    className="max-w-full"
                  />
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">No chart data</p>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">{partner2Name || 'Partner 2'}</h3>
            {has2 ? (
              <div className="flex flex-col items-center gap-6">
                <NorthIndianDiamondChart
                  chartData={partner2ChartData as Record<string, unknown>}
                  title="Lagna (D-1)"
                  className="max-w-full"
                />
                {partner2ChartData?.navamsa &&
                typeof partner2ChartData.navamsa === 'object' &&
                Array.isArray((partner2ChartData.navamsa as { planets?: unknown }).planets) &&
                (partner2ChartData.navamsa as { planets: unknown[] }).planets.length > 0 ? (
                  <NorthIndianDiamondChart
                    chartData={partner2ChartData.navamsa as Record<string, unknown>}
                    title="Navamsa (D-9)"
                    className="max-w-full"
                  />
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">No chart data</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
