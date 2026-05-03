/**
 * After machine translation (EN → locale), many astrology terms stay in English.
 * Replace known English labels with the same localized strings used in charts (messages.astro).
 */

type AstroBlock = Record<string, string> | undefined;

export type AstroMessagesShape = Record<string, AstroBlock>;

/**
 * Only groups safe in running prose. Excludes e.g. tatva (Air, Fire), yoni (Cat, Dog)
 * that would false-positive in normal English after MT.
 */
const ALLOW_GROUPS = new Set([
  'signs',
  'planets',
  'nakshatras',
  'nakshatra_lords',
  'avastha',
  'status',
  'yoga',
  'chart_terms',
]);

/** Minimum English term length. */
const MIN_TERM_LEN = 2;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectPairs(en: AstroMessagesShape, target: AstroMessagesShape): { from: string; to: string }[] {
  const out: { from: string; to: string }[] = [];
  for (const group of Object.keys(en)) {
    if (!ALLOW_GROUPS.has(group)) continue;
    const enBlock = en[group];
    const toBlock = target[group];
    if (!enBlock || !toBlock) continue;
    for (const slug of Object.keys(enBlock)) {
      const from = enBlock[slug]?.trim();
      const to = toBlock[slug]?.trim();
      if (!from || !to || from.length < MIN_TERM_LEN || from === to) continue;
      out.push({ from, to });
    }
  }
  return out;
}

function dedupeAndSort(pairs: { from: string; to: string }[]): { from: string; to: string }[] {
  const byLower = new Map<string, { from: string; to: string }>();
  for (const p of pairs) {
    const k = p.from.toLowerCase();
    const prev = byLower.get(k);
    if (!prev || p.from.length > prev.from.length) byLower.set(k, p);
  }
  return [...byLower.values()].sort((a, b) => b.from.length - a.from.length);
}

/**
 * Apply glossary: longest English phrases first (e.g. "Purva Phalguni" before "Mula").
 * Uses word boundaries for single-token English; substring replace for phrases with spaces.
 */
export function applyAstroGlossaryPostTranslate(
  text: string,
  locale: string,
  enAstro: AstroMessagesShape,
  targetAstro: AstroMessagesShape,
): string {
  if (!text || locale === 'en') return text;
  const pairs = dedupeAndSort(collectPairs(enAstro, targetAstro));
  let out = text;
  for (const { from, to } of pairs) {
    const escaped = escapeRegExp(from);
    const hasSpace = /\s/.test(from);
    const re = hasSpace ? new RegExp(escaped, 'gi') : new RegExp(`\\b${escaped}\\b`, 'gi');
    out = out.replace(re, to);
  }
  return out;
}
