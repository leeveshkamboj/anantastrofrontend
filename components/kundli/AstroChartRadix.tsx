'use client';

import { useEffect, useId, useRef } from 'react';
import type { KundliChartData, PlanetPosition } from './KundliChart';

/** Site theme colors – matches globals.css (primary, primary-light, primary-dark) and KundliChart amber palette */
const THEME_SETTINGS = {
  COLOR_BACKGROUND: '#fffbeb',
  POINTS_COLOR: '#78350f',
  SIGNS_COLOR: '#ffffff',
  CIRCLE_COLOR: '#92400e',
  LINE_COLOR: '#92400e',
  CUSPS_FONT_COLOR: '#78350f',
  SYMBOL_AXIS_FONT_COLOR: '#ca8a04',
  COLORS_SIGNS: [
    '#b45309', '#92400e', '#b45309', '#92400e', '#b45309', '#92400e',
    '#b45309', '#92400e', '#b45309', '#92400e', '#b45309', '#92400e',
  ],
  POINTS_STROKE: 1.8,
  SIGNS_STROKE: 1.5,
  CIRCLE_STRONG: 2,
};

function normalizeLon(lon: number): number {
  let l = lon % 360;
  if (l < 0) l += 360;
  return l;
}

/** Convert KundliChartData to @astrodraw/astrochart radix format (planets + cusps). */
function toAstroData(chartData: KundliChartData, useSidereal: boolean): { planets: Record<string, number[]>; cusps: number[] } {
  const planets = chartData.planets ?? [];
  const lagnaSignIndex = chartData.lagnaSignIndex ?? (chartData.lagnaSign ? ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(chartData.lagnaSign) : 0);
  const lagnaDegree = chartData.lagnaDegreeInSign ?? 0;
  const lagnaLongitude = normalizeLon((lagnaSignIndex >= 0 ? lagnaSignIndex : 0) * 30 + lagnaDegree);

  const cusps = Array.from({ length: 12 }, (_, i) => normalizeLon(lagnaLongitude + i * 30));

  const points: Record<string, number[]> = {};
  const order = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu', 'Neptune', 'Uranus', 'Pluto'];
  for (const name of order) {
    const p = planets.find((x: PlanetPosition) => x.name === name) as PlanetPosition | undefined;
    if (!p) continue;
    const lon = useSidereal && p.longitudeSidereal != null
      ? p.longitudeSidereal
      : (p.longitude ?? (p.signIndex != null ? p.signIndex * 30 + (p.degreeInSign ?? 0) : 0));
    points[name] = [normalizeLon(lon)];
  }

  return { planets: points, cusps };
}

interface AstroChartRadixProps {
  chartData: KundliChartData | null;
  useSidereal?: boolean;
  size?: number;
  className?: string;
}

export function AstroChartRadix({
  chartData,
  useSidereal = true,
  size = 520,
  className = '',
}: AstroChartRadixProps) {
  const id = useId().replace(/:/g, '');
  const chartElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartData?.planets?.length) return;
    const el = chartElRef.current ?? document.getElementById(id);
    if (!el) return;

    try {
      const { Chart } = require('@astrodraw/astrochart') as { Chart: new (el: string, w: number, h: number, s?: object) => { radix: (data: { planets: Record<string, number[]>; cusps: number[] }) => void } };
      const astroData = toAstroData(chartData, useSidereal);
      el.innerHTML = '';
      const chart = new Chart(id, size, size, THEME_SETTINGS);
      chart.radix(astroData);
    } catch (e) {
      console.error('AstroChart radix error', e);
    }
  }, [chartData, useSidereal, size, id]);

  if (!chartData?.planets?.length) return null;

  return (
    <div className={className} aria-hidden>
      <div ref={chartElRef} id={id} style={{ width: size, height: size }} />
    </div>
  );
}
