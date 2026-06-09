'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import {
  getYogHighlights,
  INAUSPICIOUS_YOG_HIGHLIGHT_KEYS,
  type YogHighlightKey,
  type YogHighlightStatus,
} from '@/lib/kundli-dashboard';

const YOG_I18N_KEYS: Record<YogHighlightKey, string> = {
  'Raj Yoga': 'rajYoga',
  'Dhana Yoga': 'dhanaYoga',
  Gajakesari: 'gajKesari',
  Budhaditya: 'budhaditya',
  'Chandra-Mangal': 'chandraMangal',
  Kemadruma: 'kemadruma',
  'Neecha Bhanga': 'neechaBhanga',
  'Viparita Raja': 'viparitaRaja',
  'Panch Mahapurusha Mars': 'ruchaka',
  'Panch Mahapurusha Mercury': 'bhadra',
  'Panch Mahapurusha Jupiter': 'hamsa',
  'Panch Mahapurusha Venus': 'malavya',
  'Panch Mahapurusha Saturn': 'sasa',
  'Adhi Yoga': 'adhiYoga',
};

function statusClasses(status: YogHighlightStatus): string {
  switch (status) {
    case 'present':
      return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    case 'absent':
      return 'border-red-300 bg-red-50 text-red-900';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-600';
  }
}

/** Map stored boolean to badge colours (invert for inauspicious yogas). */
function colourStatus(key: YogHighlightKey, status: YogHighlightStatus): YogHighlightStatus {
  if (status === 'unavailable' || !INAUSPICIOUS_YOG_HIGHLIGHT_KEYS.has(key)) {
    return status;
  }
  if (status === 'present') return 'absent';
  if (status === 'absent') return 'present';
  return status;
}

export function YogHighlightStrip({
  chartData,
}: {
  chartData: Record<string, unknown> | null;
}) {
  const tk = useTranslations('results.kundli.yogHighlights');
  const rows = getYogHighlights(chartData);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-900">{tk('title')}</h2>
      <div className="flex flex-wrap gap-2" role="list" aria-label={tk('title')}>
        {rows.map(({ key, status }) => (
          <Badge
            key={key}
            variant="outline"
            role="listitem"
            className={`px-3 py-1.5 text-sm font-medium ${statusClasses(colourStatus(key, status))}`}
          >
            <span className="font-semibold">{tk(YOG_I18N_KEYS[key])}</span>
            <span className="mx-1.5 text-gray-400" aria-hidden>
              ·
            </span>
            <span>
              {status === 'present'
                ? tk('present')
                : status === 'absent'
                  ? tk('notFormed')
                  : tk('unavailable')}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
