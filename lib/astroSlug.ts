/** Normalize backend English astrology labels to message keys (matches chart.service.ts output). */
export function astroSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
