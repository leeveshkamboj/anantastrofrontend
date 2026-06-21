export const AI_ASTROLOGER_TYPES = [
  'vedic',
  'numerology',
  'vastu',
  'tarot',
  'lal_kitab',
] as const;

export type AiAstrologerType = (typeof AI_ASTROLOGER_TYPES)[number];

export function isAiAstrologerType(value: string | null | undefined): value is AiAstrologerType {
  return !!value && (AI_ASTROLOGER_TYPES as readonly string[]).includes(value);
}

export function normalizeAiAstrologerType(value: string | null | undefined): AiAstrologerType {
  return isAiAstrologerType(value) ? value : 'vedic';
}
