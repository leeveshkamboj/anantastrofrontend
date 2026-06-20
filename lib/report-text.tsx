import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function renderBoldMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

function normalizeReportText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/^remedies\s*:?\s*/i, '');
}

const NUMBERED_ITEM_RE = /(?:^|\s)(\d+)[.)]\s+/g;

/** Split "1. first 2. second" or newline-separated numbered items into list entries. */
export function splitNumberedListItems(text: string): string[] | null {
  const normalized = normalizeReportText(text);
  if (!normalized) return null;

  const lineItems = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lineItems.length >= 2 && lineItems.every((line) => /^\d+[.)]\s/.test(line))) {
    return lineItems.map((line) => line.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
  }

  const markers = [...normalized.matchAll(NUMBERED_ITEM_RE)];
  if (markers.length < 2) return null;

  const items: string[] = [];
  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    const contentStart = (marker.index ?? 0) + marker[0].length;
    const contentEnd =
      i + 1 < markers.length ? (markers[i + 1].index ?? normalized.length) : normalized.length;
    const item = normalized.slice(contentStart, contentEnd).trim();
    if (item) items.push(item);
  }

  return items.length >= 2 ? items : null;
}

type ReportBodyTextProps = {
  text: string;
  className?: string;
  /** When true, try harder to render numbered remedies as a vertical list. */
  preferList?: boolean;
};

function NumberedList({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-astro-orange/10 text-xs font-bold text-astro-orange"
          >
            {idx + 1}
          </span>
          <div className="min-w-0 flex-1 text-justify leading-relaxed text-gray-700">
            {renderBoldMarkdown(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportBodyText({ text, className, preferList = false }: ReportBodyTextProps) {
  const items = splitNumberedListItems(text);

  if (items) {
    return <NumberedList items={items} className={className} />;
  }

  if (preferList) {
    const normalized = normalizeReportText(text);
    const segments = normalized
      .split(/(?=\d+[.)]\s)/)
      .map((segment) => segment.replace(/^\d+[.)]\s*/, '').trim())
      .filter(Boolean);
    if (segments.length >= 2) {
      return <NumberedList items={segments} className={className} />;
    }
  }

  return (
    <p className={cn('text-justify leading-relaxed whitespace-pre-wrap text-gray-700', className)}>
      {renderBoldMarkdown(text)}
    </p>
  );
}
