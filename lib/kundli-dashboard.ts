import type { VimshottariDashaData } from '@/store/api/kundliApi';

/** All starter planetary yogas stored on chartData.planetaryYogas (matches backend). */
export const YOG_HIGHLIGHT_KEYS = [
  'Raj Yoga',
  'Dhana Yoga',
  'Gajakesari',
  'Budhaditya',
  'Chandra-Mangal',
  'Kemadruma',
  'Neecha Bhanga',
  'Viparita Raja',
  'Panch Mahapurusha Mars',
  'Panch Mahapurusha Mercury',
  'Panch Mahapurusha Jupiter',
  'Panch Mahapurusha Venus',
  'Panch Mahapurusha Saturn',
  'Adhi Yoga',
] as const;

export type YogHighlightKey = (typeof YOG_HIGHLIGHT_KEYS)[number];

/** Inauspicious yogas — present is unfavourable (red), absent is favourable (green). */
export const INAUSPICIOUS_YOG_HIGHLIGHT_KEYS = new Set<YogHighlightKey>(['Kemadruma']);

export type YogHighlightStatus = 'present' | 'absent' | 'unavailable';

export interface YogHighlightRow {
  key: YogHighlightKey;
  status: YogHighlightStatus;
}

export type DashboardSectionKey = 'career' | 'marriage' | 'wealth' | 'health' | 'mahadasha';

export interface DashboardSectionContent {
  key: DashboardSectionKey;
  text: string | null;
  subtitle: string | null;
}

const DOMAIN_KEYS = ['mahadasha', 'yog', 'career', 'marriage', 'wealth'] as const;

const DASHA_MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function getDomainsObject(parsed: Record<string, unknown>): Record<string, unknown> | null {
  const nested = parsed.domains;
  if (typeof nested === 'object' && nested !== null) {
    return nested as Record<string, unknown>;
  }
  const legacy = parsed.mahadasha;
  if (typeof legacy === 'object' && legacy !== null && 'prediction' in legacy) {
    const out: Record<string, unknown> = {};
    for (const key of DOMAIN_KEYS) {
      const section = parsed[key];
      if (typeof section === 'object' && section !== null) out[key] = section;
    }
    return Object.keys(out).length ? out : null;
  }
  return null;
}

function getDomainPrediction(
  domains: Record<string, unknown> | null,
  key: (typeof DOMAIN_KEYS)[number],
): string | null {
  if (!domains) return null;
  const section = domains[key];
  if (typeof section !== 'object' || section === null) return null;
  const prediction = (section as { prediction?: string }).prediction;
  return typeof prediction === 'string' && prediction.trim() ? prediction.trim() : null;
}

function getTopLevelString(parsed: Record<string, unknown>, key: string): string | null {
  const v = parsed[key];
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

/** First ~3 sentences or ~320 chars for dashboard excerpt. */
export function excerptDashboardText(text: string, maxChars = 320): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    let acc = '';
    for (const s of sentences.slice(0, 3)) {
      if ((acc + s).length > maxChars) break;
      acc += s;
    }
    if (acc.trim()) return acc.trim();
  }
  return `${trimmed.slice(0, maxChars).trim()}…`;
}

export function getYogHighlights(
  chartData: Record<string, unknown> | null,
): YogHighlightRow[] {
  const raw = chartData?.planetaryYogas;
  if (!raw || typeof raw !== 'object') {
    return YOG_HIGHLIGHT_KEYS.map((key) => ({ key, status: 'unavailable' }));
  }
  const yogas = raw as Record<string, unknown>;
  return YOG_HIGHLIGHT_KEYS.map((key) => {
    const val = yogas[key];
    if (typeof val !== 'boolean') return { key, status: 'unavailable' as const };
    return { key, status: val ? ('present' as const) : ('absent' as const) };
  });
}

function parseDashaDate(value: string, birthDob: string): number | null {
  if (value === 'Birth') {
    const [y, m, d] = birthDob.split('-').map(Number);
    if (!y || !m || !d) return null;
    return Date.UTC(y, m - 1, d);
  }
  const match = value.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = DASHA_MONTHS[match[2]];
  const year = Number(match[3]);
  if (month == null || Number.isNaN(day) || Number.isNaN(year)) return null;
  return Date.UTC(year, month, day);
}

export function formatCurrentDashaSubtitle(
  vimshottari: VimshottariDashaData | null,
  birthDob: string,
  formatLord: (lord: string) => string,
): string | null {
  if (!vimshottari?.allMahadashas?.length) {
    if (vimshottari?.birthMahadasha?.lord) {
      return `${formatLord(vimshottari.birthMahadasha.lord)} MD · ends ${vimshottari.birthMahadasha.endDate}`;
    }
    return null;
  }
  const now = Date.now();
  const birthMs = parseDashaDate('Birth', birthDob) ?? now;

  for (const md of vimshottari.allMahadashas) {
    const startMs = md.startDate === 'Birth'
      ? birthMs
      : parseDashaDate(md.startDate, birthDob);
    const endMs = parseDashaDate(md.endDate, birthDob);
    if (startMs == null || endMs == null) continue;
    if (now >= startMs && now <= endMs) {
      let antarLord: string | null = null;
      for (const ad of md.antardashas ?? []) {
        const adStart = ad.startDate === 'Birth'
          ? birthMs
          : parseDashaDate(ad.startDate, birthDob);
        const adEnd = parseDashaDate(ad.endDate, birthDob);
        if (adStart != null && adEnd != null && now >= adStart && now <= adEnd) {
          antarLord = ad.lord;
          break;
        }
      }
      const mdLabel = `${formatLord(md.lord)} Mahadasha · until ${md.endDate}`;
      return antarLord ? `${mdLabel} · ${formatLord(antarLord)} Antardasha` : mdLabel;
    }
  }

  const last = vimshottari.allMahadashas[vimshottari.allMahadashas.length - 1];
  return last ? `${formatLord(last.lord)} Mahadasha · until ${last.endDate}` : null;
}

export function mapDashboardSections(
  interpretation: string | null,
  vimshottariSubtitle: string | null,
): DashboardSectionContent[] {
  let parsed: Record<string, unknown> = {};
  if (interpretation?.trim()) {
    try {
      parsed = JSON.parse(interpretation) as Record<string, unknown>;
    } catch {
      parsed = {};
    }
  }
  const domains = getDomainsObject(parsed);

  const career =
    getDomainPrediction(domains, 'career') ?? getTopLevelString(parsed, 'career');
  const marriage =
    getDomainPrediction(domains, 'marriage') ?? getTopLevelString(parsed, 'relationships');
  const wealth = getDomainPrediction(domains, 'wealth');
  const health = getTopLevelString(parsed, 'health');
  return [
    { key: 'career', text: career, subtitle: null },
    { key: 'marriage', text: marriage, subtitle: null },
    { key: 'wealth', text: wealth, subtitle: null },
    { key: 'health', text: health, subtitle: null },
    {
      key: 'mahadasha',
      text: getDomainPrediction(domains, 'mahadasha'),
      subtitle: vimshottariSubtitle,
    },
  ];
}
