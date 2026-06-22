'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ReportLanguageStyle } from '@/lib/report-locale';

export type HindiReportLanguageChoiceProps = {
  value: ReportLanguageStyle;
  onChange: (style: ReportLanguageStyle) => void;
  className?: string;
  labels: {
    title: string;
    simple: string;
    hinglish: string;
  };
};

export function HindiReportLanguageChoice({
  value,
  onChange,
  className,
  labels,
}: HindiReportLanguageChoiceProps) {
  return (
    <fieldset className={cn('space-y-2 rounded-lg border border-amber-200/80 bg-amber-50/40 p-3', className)}>
      <legend className="text-sm font-medium text-amber-950 px-1">{labels.title}</legend>
      <div className="flex flex-col sm:flex-row gap-3">
        {(['simple', 'hinglish'] as const).map((style) => (
          <label
            key={style}
            className={cn(
              'flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer',
              value === style
                ? 'border-amber-500 bg-white text-amber-950'
                : 'border-transparent bg-white/60 text-gray-700',
            )}
          >
            <input
              type="radio"
              name="reportLanguageStyle"
              value={style}
              checked={value === style}
              onChange={() => onChange(style)}
              className="accent-amber-600"
            />
            <span>{style === 'simple' ? labels.simple : labels.hinglish}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
