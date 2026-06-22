import { BookOpen, HeartHandshake, Languages, MessageCircle, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ServiceCoinMeta = {
  label: string;
  description: string;
  icon: LucideIcon;
  ring: string;
  iconBg: string;
};

const SERVICE_COIN_META: Record<string, ServiceCoinMeta> = {
  kundli: {
    label: 'Kundli generation',
    description: 'Birth chart generation flow',
    icon: BookOpen,
    ring: 'ring-violet-200/80',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  matchmaking: {
    label: 'Matchmaking',
    description: 'Gun Milan / compatibility report',
    icon: HeartHandshake,
    ring: 'ring-rose-200/80',
    iconBg: 'bg-rose-100 text-rose-700',
  },
  horoscope: {
    label: 'Horoscope',
    description: 'Daily / weekly / monthly reports',
    icon: Sparkles,
    ring: 'ring-amber-200/80',
    iconBg: 'bg-amber-100 text-amber-800',
  },
  horoscope_detailed: {
    label: 'Horoscope (detailed)',
    description: 'Long-form horoscope report',
    icon: Sparkles,
    ring: 'ring-fuchsia-200/80',
    iconBg: 'bg-fuchsia-100 text-fuchsia-800',
  },
  kundli_horoscope_addon: {
    label: 'Kundli horoscope add-on',
    description: 'Paid horoscope tab unlock for kundli',
    icon: BookOpen,
    ring: 'ring-indigo-200/80',
    iconBg: 'bg-indigo-100 text-indigo-800',
  },
  kundli_translate: {
    label: 'Kundli report translation',
    description: 'Paid translation of kundli report to the user’s language',
    icon: Languages,
    ring: 'ring-sky-200/80',
    iconBg: 'bg-sky-100 text-sky-800',
  },
  kundli_horoscope_addon_translate: {
    label: 'Kundli horoscope add-on translation',
    description: 'Paid translation of the kundli horoscope add-on',
    icon: Languages,
    ring: 'ring-cyan-200/80',
    iconBg: 'bg-cyan-100 text-cyan-800',
  },
  horoscope_translate: {
    label: 'Horoscope report translation',
    description: 'Paid translation of horoscope report to the user’s language',
    icon: Languages,
    ring: 'ring-teal-200/80',
    iconBg: 'bg-teal-100 text-teal-800',
  },
  matchmaking_translate: {
    label: 'Matchmaking report translation',
    description: 'Paid translation of matchmaking report to the user’s language',
    icon: Languages,
    ring: 'ring-emerald-200/80',
    iconBg: 'bg-emerald-100 text-emerald-800',
  },
  chat_minute: {
    label: 'Live chat (per minute)',
    description: 'Coins debited per minute of astrologer consultation',
    icon: MessageCircle,
    ring: 'ring-blue-200/80',
    iconBg: 'bg-blue-100 text-blue-800',
  },
};

const FALLBACK_META: ServiceCoinMeta = {
  label: '',
  description: 'Service coin debit',
  icon: Sparkles,
  ring: 'ring-violet-200/80',
  iconBg: 'bg-violet-100 text-violet-700',
};

function humanizeServiceKey(serviceKey: string): string {
  return serviceKey
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getServiceCoinMeta(serviceKey: string): ServiceCoinMeta {
  const known = SERVICE_COIN_META[serviceKey];
  if (known) return known;

  return {
    ...FALLBACK_META,
    label: humanizeServiceKey(serviceKey),
  };
}

export function getServiceCoinLabel(serviceKey: string): string {
  return getServiceCoinMeta(serviceKey).label;
}
