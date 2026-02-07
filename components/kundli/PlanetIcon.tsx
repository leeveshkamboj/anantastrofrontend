'use client';

import { TbMars, TbMoon, TbPlanet, TbSun, TbVenus } from 'react-icons/tb';

const PLANET_ICONS: Record<string, React.ComponentType<{ className?: string; stroke?: string }>> = {
  Sun: TbSun,
  Moon: TbMoon,
  Mercury: TbPlanet,
  Venus: TbVenus,
  Mars: TbMars,
  Jupiter: TbPlanet,
  Saturn: TbPlanet,
};

/** Planet icons from Tabler (react-icons/tb). Sun, Moon, Venus, Mars use specific icons; Mercury/Jupiter/Saturn use generic planet. */
export function PlanetIcon({
  name,
  className = 'w-4 h-4',
  stroke = 'currentColor',
}: {
  name: string;
  className?: string;
  stroke?: string;
}) {
  const Icon = PLANET_ICONS[name] ?? TbPlanet;
  return <Icon className={className} stroke={stroke} />;
}
