/**
 * Deep-merge plain JSON objects for i18n: `override` wins; missing keys fall back to `base`.
 * Does not mutate inputs. Nested objects merge recursively; arrays and primitives are replaced.
 */
export function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined) return base;
  if (override === null || typeof override !== 'object' || Array.isArray(override)) return override;
  if (base === null || typeof base !== 'object' || Array.isArray(base)) return override;

  const b = base as Record<string, unknown>;
  const o = override as Record<string, unknown>;
  const keys = new Set([...Object.keys(b), ...Object.keys(o)]);
  const out: Record<string, unknown> = {};

  for (const k of keys) {
    const hasO = Object.prototype.hasOwnProperty.call(o, k) && o[k] !== undefined;
    const hasB = Object.prototype.hasOwnProperty.call(b, k);
    if (hasO) {
      const bv = b[k];
      const ov = o[k];
      if (
        bv !== null &&
        typeof bv === 'object' &&
        !Array.isArray(bv) &&
        ov !== null &&
        typeof ov === 'object' &&
        !Array.isArray(ov)
      ) {
        out[k] = deepMerge(bv, ov);
      } else {
        out[k] = ov;
      }
    } else if (hasB) {
      out[k] = b[k];
    }
  }

  return out;
}
