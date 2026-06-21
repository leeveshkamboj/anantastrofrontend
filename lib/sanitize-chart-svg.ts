import DOMPurify from 'isomorphic-dompurify';

const SVG_PURIFY_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  ADD_TAGS: ['linearGradient', 'radialGradient', 'clipPath'],
};

/** Client-side defense-in-depth before rendering chart SVG as HTML. */
export function sanitizeChartSvg(svg: string | null | undefined): string | null {
  if (svg == null) return null;
  const trimmed = String(svg).trim();
  if (!trimmed) return null;

  const cleaned = DOMPurify.sanitize(trimmed, SVG_PURIFY_CONFIG).trim();
  if (!cleaned || !/<svg[\s>]/i.test(cleaned)) {
    return null;
  }

  return cleaned;
}
