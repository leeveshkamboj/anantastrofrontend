'use client';

import { PlanetIcon } from './PlanetIcon';
import { ZodiacIcon } from './ZodiacIcon';

/** Ascendant / Lagna icon: rising horizon line. */
function LagnaIcon({ className, stroke }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke ?? 'currentColor'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 14h16M12 14V6l4 4-4 4" />
    </svg>
  );
}

/** Vedic / North Indian Janam Kundli: 12 house grid. House 1 = Lagna (top center), anti-clockwise. */

const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

/** Planet display names for legend */
const GRAHA_LABELS: Record<string, string> = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mercury: 'Mercury',
  Venus: 'Venus',
  Mars: 'Mars',
  Jupiter: 'Jupiter',
  Saturn: 'Saturn',
};

/** North Indian chart: [row][col] = house number 1–12; null = Lagna (center). */
const HOUSE_GRID: (number | null)[][] = [
  [12, 1, 2],
  [11, null, 3],
  [10, 9, 8],
  [7, 6, 5, 4],
];

export interface PlanetPosition {
  name: string;
  longitude?: number;
  latitude?: number;
  sign: string;
  signIndex?: number;
  degreeInSign?: number;
  signSidereal?: string;
  degreeInSignSidereal?: number;
  longitudeSidereal?: number;
}

export interface KundliChartData {
  planets?: PlanetPosition[];
  birthDate?: string;
  birthTime?: string;
  ayanamsa?: string;
  lagnaSignIndex?: number;
  lagnaSign?: string;
  lagnaDegreeInSign?: number;
}

interface KundliChartProps {
  chartData: KundliChartData | null;
  useSidereal?: boolean;
  className?: string;
}

const cellSize = 112;
const gridGap = 6;

export function KundliChart({ chartData, useSidereal = true, className = '' }: KundliChartProps) {
  if (!chartData?.planets?.length) return null;

  const planets = chartData.planets;
  const lagnaSignIndex =
    chartData.lagnaSignIndex ?? (chartData.lagnaSign ? ZODIAC_SIGNS.indexOf(chartData.lagnaSign) : 0);
  const safeLagna = lagnaSignIndex >= 0 && lagnaSignIndex < 12 ? lagnaSignIndex : 0;

  const houseSign = (houseNum: number) => ZODIAC_SIGNS[(safeLagna + houseNum - 1) % 12];

  const signToPlanets: Record<string, { name: string; degree: number }[]> = {};
  ZODIAC_SIGNS.forEach((s) => (signToPlanets[s] = []));
  planets.forEach((p) => {
    const sign = useSidereal && p.signSidereal ? p.signSidereal : p.sign;
    const degree =
      useSidereal && p.degreeInSignSidereal != null ? p.degreeInSignSidereal : (p.degreeInSign ?? 0);
    if (sign && signToPlanets[sign]) {
      signToPlanets[sign].push({ name: p.name, degree });
    }
  });

  const flatCells = HOUSE_GRID.flatMap((row) => {
    const cells = [...row];
    if (cells.length === 3) cells.push(null);
    return cells;
  });

  return (
    <div className={className}>
      <div className="relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/80 shadow-lg ring-2 ring-amber-800/30 ring-offset-2 ring-offset-amber-50">
        {/* Outer double-line effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-700/40 pointer-events-none" />
        <div className="absolute inset-1.5 rounded-xl border border-amber-600/30 pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-5 pb-3 text-center border-b-2 border-amber-700/40 bg-gradient-to-r from-amber-200/60 via-amber-100/80 to-amber-200/60">
          <h3 className="text-lg font-bold tracking-wide text-amber-950 drop-shadow-sm">
            Janam Kundli
          </h3>
          <p className="text-xs mt-1 text-amber-800/90 font-medium">
            Vedic Birth Chart · Lahiri Ayanamsa
          </p>
        </div>

        {/* Chart grid */}
        <div className="p-5">
          <div
            className="grid justify-items-stretch mx-auto bg-amber-900/10 rounded-lg overflow-hidden border-2 border-amber-800/50"
            style={{
              gridTemplateColumns: `repeat(4, ${cellSize}px)`,
              width: 4 * cellSize + 3 * gridGap,
              gap: gridGap,
            }}
          >
            {flatCells.map((houseNum, idx) => {
              if (houseNum === null && idx !== 5) {
                return (
                  <div
                    key={`e-${idx}`}
                    className="bg-amber-900/5 border border-amber-700/20"
                    style={{ width: cellSize, height: cellSize, minWidth: cellSize, minHeight: cellSize }}
                  />
                );
              }
              if (houseNum === null) {
                return (
                  <div
                    key="lagna"
                    className="flex flex-col items-center justify-center border-2 border-amber-600 bg-gradient-to-br from-amber-200 to-amber-300/90 shadow-inner"
                    style={{ width: cellSize, height: cellSize, minWidth: cellSize, minHeight: cellSize }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Lagna</span>
                    <LagnaIcon className="w-9 h-9 mt-2 text-yellow-500" stroke="currentColor" />
                  </div>
                );
              }
              const sign = houseSign(houseNum);
              const list = signToPlanets[sign] ?? [];
              const isLagnaHouse = houseNum === 1;
              return (
                <div
                  key={houseNum}
                  className={`flex flex-col overflow-hidden border border-amber-700/40 bg-white/90 ${
                    isLagnaHouse ? 'ring-2 ring-amber-600 ring-offset-1 ring-offset-amber-100 shadow-sm' : ''
                  }`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    minWidth: cellSize,
                    minHeight: cellSize,
                  }}
                >
                  {/* House header: number + rashi */}
                  <div className="flex items-center justify-center gap-2 w-full py-2 border-b border-amber-700/30 bg-amber-100/70">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-amber-800 text-amber-50 text-xs font-bold">
                      {houseNum}
                    </span>
                    <ZodiacIcon sign={sign} className="w-5 h-5 text-yellow-500 shrink-0" stroke="currentColor" />
                    <span className="text-[11px] font-semibold text-amber-900 truncate max-w-16" title={sign}>
                      {sign.slice(0, 3)}
                    </span>
                  </div>
                  {/* Planets in house */}
                  <div className="flex-1 flex flex-col items-center justify-center py-2 gap-1 min-h-0">
                    {list.length === 0 ? (
                      <span className="text-[10px] text-amber-600/50">—</span>
                    ) : (
                      list.slice(0, 5).map((pl) => (
                        <span
                          key={pl.name}
                          className="inline-flex items-center gap-2 text-xs text-amber-900 leading-tight"
                        >
                          <PlanetIcon name={pl.name} className="w-4 h-4 shrink-0 text-yellow-500" stroke="currentColor" />
                          <span className="font-medium tabular-nums">{pl.degree.toFixed(2)}°</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 pb-6 pt-3 border-t-2 border-amber-700/30 bg-amber-50/50">
          <p className="text-xs font-semibold text-amber-800/80 uppercase tracking-wider text-center mb-3">
            Grahas (Planets)
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-amber-900/90">
            {Object.entries(GRAHA_LABELS).map(([name, label]) => (
              <span key={name} className="inline-flex items-center gap-2.5">
                <PlanetIcon name={name} className="w-5 h-5 text-yellow-500 shrink-0" stroke="currentColor" />
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
