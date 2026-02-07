'use client';

import {
  TbZodiacAquarius,
  TbZodiacAries,
  TbZodiacCancer,
  TbZodiacCapricorn,
  TbZodiacGemini,
  TbZodiacLeo,
  TbZodiacLibra,
  TbZodiacPisces,
  TbZodiacSagittarius,
  TbZodiacScorpio,
  TbZodiacTaurus,
  TbZodiacVirgo,
} from 'react-icons/tb';

const ZODIAC_ICONS: Record<string, React.ComponentType<{ className?: string; stroke?: string }>> = {
  Aries: TbZodiacAries,
  Taurus: TbZodiacTaurus,
  Gemini: TbZodiacGemini,
  Cancer: TbZodiacCancer,
  Leo: TbZodiacLeo,
  Virgo: TbZodiacVirgo,
  Libra: TbZodiacLibra,
  Scorpio: TbZodiacScorpio,
  Sagittarius: TbZodiacSagittarius,
  Capricorn: TbZodiacCapricorn,
  Aquarius: TbZodiacAquarius,
  Pisces: TbZodiacPisces,
};

/** Zodiac / rashi icons from Tabler (react-icons/tb). */
export function ZodiacIcon({
  sign,
  className = 'w-5 h-5',
  stroke = 'currentColor',
}: {
  sign: string;
  className?: string;
  stroke?: string;
}) {
  const Icon = ZODIAC_ICONS[sign] ?? null;
  if (!Icon) return null;
  return <Icon className={className} stroke={stroke} />;
}
