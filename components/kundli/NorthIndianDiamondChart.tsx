'use client';

import { useState, useEffect } from 'react';
import type { KundliChartData, PlanetPosition } from './KundliChart';

/** Planet name to abbreviation (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke, Ur, Ne, Pl, Asc). */
const PLANET_ABBREV: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Uranus: 'Ur',
  Neptune: 'Ne',
  Pluto: 'Pl',
  Ascendant: 'Asc',
};

interface PlanetWithHouse extends PlanetPosition {
  house?: number;
}

function getAbbrev(name: string): string {
  return PLANET_ABBREV[name] ?? name.slice(0, 2);
}

/** Build house number (1–12) to list of planet abbreviations from chart data. */
function buildHouseToPlanets(chartData: KundliChartData): Record<number, string[]> {
  const planets = (chartData.planets ?? []) as PlanetWithHouse[];
  const houseToPlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseToPlanets[h] = [];

  for (const p of planets) {
    if (!p?.name) continue;
    const house = p.house != null && p.house >= 1 && p.house <= 12 ? p.house : (p.name === 'Ascendant' ? 1 : undefined);
    if (house == null) continue;
    const abbrev = getAbbrev(p.name);
    if (!houseToPlanets[house].includes(abbrev)) {
      houseToPlanets[house].push(abbrev);
    }
  }

  return houseToPlanets;
}

/** 12 path definitions for North Indian diamond chart (square with central diamond + 4 edge diamonds + 8 triangles).
 * Path order in reference SVG: 8, 6, 9, 7, 5, 10, 4, 11, 1, 2, 12, 3
 * Each path is M x,y L x,y ... with coordinates in 0..S (S = size).
 */
function getChartPaths(S: number): string[] {
  const h = S / 2;   // 175 for 350
  const q = S / 4;   // 87.5
  const t = (3 * S) / 4; // 262.5
  return [
    `M0,0 L${h},0 L${q},${q} L0,0`,
    `M${h},0 L${S},0 L${t},${q} L${h},0`,
    `M0,0 L${q},${q} L0,${h} L0,0`,
    `M${h},0 L${q},${q} L${h},${h} L${t},${q} L${h},0`,
    `M${S},0 L${t},${q} L${S},${h} L${S},0`,
    `M0,${h} L${q},${q} L${h},${h} L${q},${t} L0,${h}`,
    `M${h},${h} L${t},${q} L${S},${h} L${t},${t} L${h},${h}`,
    `M0,${h} L${q},${t} L0,${S} L0,${h}`,
    `M${q},${t} L${h},${h} L${t},${t} L${h},${S} L${q},${t}`,
    `M${t},${t} L${S},${h} L${S},${S} L${t},${t}`,
    `M0,${S} L${q},${t} L${h},${S} L0,${S}`,
    `M${h},${S} L${t},${t} L${S},${S} L${h},${S}`,
  ];
}

const SCALE_REF = 350;

/** Path order in getChartPaths maps to houses: pathIdx -> house number */
const PATH_TO_HOUSE = [8, 6, 9, 7, 5, 10, 4, 11, 1, 2, 12, 3];

/** Polygon vertices for each of the 12 cells (S=350). Order matches getChartPaths. */
function getCellVertices(S: number): number[][][] {
  const h = S / 2, q = S / 4, t = (3 * S) / 4;
  return [
    [[0, 0], [h, 0], [q, q]],
    [[h, 0], [S, 0], [t, q]],
    [[0, 0], [q, q], [0, h]],
    [[h, 0], [q, q], [h, h], [t, q]],
    [[S, 0], [t, q], [S, h]],
    [[0, h], [q, q], [h, h], [q, t]],
    [[h, h], [t, q], [S, h], [t, t]],
    [[0, h], [q, t], [0, S]],
    [[q, t], [h, h], [t, t], [h, S]],
    [[t, t], [S, h], [S, S]],
    [[0, S], [q, t], [h, S]],
    [[h, S], [t, t], [S, S]],
  ];
}

/** Centroid of a polygon (vertices as [x,y][]). */
function polygonCentroid(verts: number[][]): { x: number; y: number } {
  let cx = 0, cy = 0, n = verts.length;
  for (const [x, y] of verts) {
    cx += x;
    cy += y;
  }
  return { x: cx / n, y: cy / n };
}

/** Houses 3 and 4: centroid can sit on cell edge. Use visual center (bbox center) so text stays inside. */
function effectiveCenter(houseNum: number, pathIdx: number, verts: number[][][], c: { x: number; y: number }): { x: number; y: number } {
  if (houseNum !== 3 && houseNum !== 4) return c;
  const vs: [number, number][] = verts[pathIdx] as [number, number][];
  const xs = vs.map(([x]) => x);
  const ys = vs.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

/** Unit vector for offsetting number vs planet. Houses 5,6 are small top-right triangles — use smaller vertical offset. */
function cellUpVector(houseNum: number): { dx: number; dy: number; gapScale?: number } {
  const up: Record<number, [number, number]> = {
    1: [0, -1], 2: [0, -1], 3: [0, -1], 4: [0, -1], 5: [0, -1], 6: [0, -1],
    7: [0, -1], 8: [0, -1], 9: [-1, 0], 10: [-1, 0], 11: [-1, 0], 12: [0, -1],
  };
  const [dx, dy] = up[houseNum] ?? [0, -1];
  const gapScale = [5, 6].includes(houseNum) ? 0.6 : 1; // smaller offset for small triangles
  return { dx, dy, gapScale };
}

/** All houses use middle anchor so text is centered in each cell. */
function anchorForHouse(_houseNum: number): 'start' | 'middle' | 'end' {
  return 'middle';
}

function planetFontSizeFor(S: number): number {
  return S <= 300 ? 10 : 11.67;
}

/** House number and planet positions from cell centroids with clear separation. */
function getTextPositions(S: number): {
  number: { x: number; y: number }[];
  planet: { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' }[];
} {
  const verts = getCellVertices(SCALE_REF);
  const scale = S / SCALE_REF;
  const gap = 14;
  const numberPos: { x: number; y: number }[] = [];
  const planetPos: { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' }[] = [];
  const minY = planetFontSizeFor(S) + 4;
  const maxY = S - 14;

  for (let pathIdx = 0; pathIdx < 12; pathIdx++) {
    const houseNum = PATH_TO_HOUSE[pathIdx];
    const c = polygonCentroid(verts[pathIdx]);
    const e = effectiveCenter(houseNum, pathIdx, verts, c);
    const { dx, dy, gapScale = 1 } = cellUpVector(houseNum);
    const g = gap * gapScale;
    numberPos.push({
      x: (e.x - dx * g) * scale,
      y: (e.y - dy * g) * scale,
    });
    let py = (e.y + dy * g) * scale;
    py = Math.max(minY, Math.min(maxY, py));
    planetPos.push({
      x: (e.x + dx * g) * scale,
      y: py,
      textAnchor: anchorForHouse(houseNum),
    });
  }

  const byHouseNum: { x: number; y: number }[] = [];
  const byHousePlanet: { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' }[] = [];
  for (let h = 1; h <= 12; h++) {
    const idx = PATH_TO_HOUSE.indexOf(h);
    byHouseNum.push(numberPos[idx]);
    byHousePlanet.push(planetPos[idx]);
  }
  return { number: byHouseNum, planet: byHousePlanet };
}

const CHART_SIZE = 350;
const MOBILE_BREAKPOINT = 640;

function useChartSize() {
  const [chartSize, setChartSize] = useState(CHART_SIZE);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 400;
      setChartSize(w < MOBILE_BREAKPOINT ? Math.min(300, w - 32) : CHART_SIZE);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return chartSize;
}

export interface NorthIndianDiamondChartProps {
  chartData: KundliChartData | null;
  /** Chart title (e.g. "Lagna" or "Navamsa (D-9)"). */
  title?: string;
  className?: string;
}

/** North Indian Vedic kundli: square with central diamond, 4 edge diamonds, 8 triangles. Same layout as reference. */
export function NorthIndianDiamondChart({ chartData, title = 'Lagna', className = '' }: NorthIndianDiamondChartProps) {
  const size = useChartSize();

  if (!chartData?.planets?.length) return null;

  const houseToPlanets = buildHouseToPlanets(chartData);
  const paths = getChartPaths(size);
  const { number: labelPositions, planet: planetPositions } = getTextPositions(size);

  const strokeWidth = 2;
  const houseFontSize = size <= 300 ? 11 : 12.5;
  const planetFontSize = planetFontSizeFor(size);

  return (
    <div className={`w-full max-w-full overflow-x-auto flex justify-center ${className}`}>
      <div className="inline-block rounded-lg overflow-hidden border border-amber-800/40 shadow-md bg-[rgb(255,246,230)]">
        <div className="text-center border-b border-amber-700/40 bg-amber-100/80 px-3 py-2">
          <h3 className="text-sm font-bold text-amber-950">{title}</h3>
        </div>
        <svg
          id="lagna-chart-svg"
          width={size}
          height={size}
          style={{ backgroundColor: 'rgb(255, 246, 230)' }}
          className="block"
        >
          {paths.map((d, pathIndex) => (
            <path
              key={pathIndex}
              d={d}
              stroke="black"
              strokeWidth={strokeWidth}
              fill="none"
            />
          ))}
          {labelPositions.map((pos, i) => {
            const houseNum = i + 1;
            return (
              <text
                key={`h-${houseNum}`}
                fontSize={houseFontSize}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fill: 'black' }}
              >
                {houseNum}
              </text>
            );
          })}
          {planetPositions.map((pos, i) => {
            const houseNum = i + 1;
            const list = houseToPlanets[houseNum] ?? [];
            const lineHeight = planetFontSize * 1.35;
            if (list.length === 0) return null;
            const text = list.join(' ');
            // If many planets, show on two lines to avoid overflow
            const oneLine = list.length <= 3 ? [text] : [list.slice(0, 2).join(' '), list.slice(2).join(' ')];
            return (
              <g key={`p-${houseNum}`}>
                {oneLine.map((line, lineIdx) => (
                  <text
                    key={lineIdx}
                    fontSize={planetFontSize}
                    x={pos.x}
                    y={pos.y + lineIdx * lineHeight}
                    textAnchor={pos.textAnchor}
                    dominantBaseline="middle"
                    style={{ fill: 'black' }}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
