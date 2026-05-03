/** Stay under backend @MaxLength(15000) with margin for network encoding. */
const MAX_CHUNK = 12_000;

/**
 * Split long text for multiple translate API calls. Prefers paragraph and sentence boundaries.
 */
export function chunkForTranslate(text: string): string[] {
  const t = text.trim();
  if (t.length === 0) return [];
  if (t.length <= MAX_CHUNK) return [t];

  const parts: string[] = [];
  let rest = t;
  while (rest.length > MAX_CHUNK) {
    let slice = rest.slice(0, MAX_CHUNK);
    const para = slice.lastIndexOf('\n\n');
    const sent = Math.max(
      slice.lastIndexOf('. '),
      slice.lastIndexOf('? '),
      slice.lastIndexOf('! '),
    );
    const minBreak = Math.floor(MAX_CHUNK * 0.45);
    let breakAt = MAX_CHUNK;
    if (para >= minBreak) breakAt = para + 2;
    else if (sent >= minBreak) breakAt = sent + 2;
    parts.push(rest.slice(0, breakAt).trimEnd());
    rest = rest.slice(breakAt).trimStart();
  }
  if (rest.length > 0) parts.push(rest);
  return parts;
}
