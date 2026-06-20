'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ResultCard, CardContent, CardHeader, CardTitle } from '@/components/kundli/result';
import { HoverLift } from '@/components/motion/HoverLift';
import { PulseSoft } from '@/components/motion/PulseSoft';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { Button } from '@/components/ui/button';
import {
  excerptDashboardText,
  formatCurrentDashaSubtitle,
  mapDashboardSections,
  type DashboardSectionKey,
} from '@/lib/kundli-dashboard';
import { YogHighlightStrip } from './YogHighlightStrip';
import { parseVimshottariDasha } from './KundliDashaTab';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import {
  useSimplifyKundliTextMutation,
  useSimplifyKundliTextByShareMutation,
  type KundliGeneration,
} from '@/store/api/kundliApi';
import type { ReactNode } from 'react';
import {
  Briefcase,
  Clock,
  Heart,
  HeartPulse,
  IndianRupee,
  type LucideIcon,
} from 'lucide-react';

function renderBoldMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

const SECTION_ICONS: Record<DashboardSectionKey, LucideIcon> = {
  career: Briefcase,
  marriage: Heart,
  wealth: IndianRupee,
  health: HeartPulse,
  mahadasha: Clock,
};

export interface KundliDashboardTabProps {
  gen: KundliGeneration;
  interpretationLoading?: boolean;
  shareToken?: string | null;
  onReadMore?: (section: DashboardSectionKey) => void;
}

export function KundliDashboardTab({
  gen,
  interpretationLoading = false,
  shareToken = null,
  onReadMore,
}: KundliDashboardTabProps) {
  const tk = useTranslations('results.kundli.dashboard');
  const astro = useAstroDisplay();
  const chartData = gen.chartData as Record<string, unknown> | null;
  const vimshottari = parseVimshottariDasha(chartData);
  const formatLord = useCallback((lord: string) => astro.graha(lord), [astro]);
  const dashaSubtitle = formatCurrentDashaSubtitle(vimshottari, gen.dob, formatLord);
  const sections = mapDashboardSections(gen.interpretation, dashaSubtitle);

  const [simplifyAuth, { isLoading: simplifyingAuth }] = useSimplifyKundliTextMutation();
  const [simplifyShare, { isLoading: simplifyingShare }] = useSimplifyKundliTextByShareMutation();
  const simplifying = simplifyingAuth || simplifyingShare;

  const [simpleBySection, setSimpleBySection] = useState<Partial<Record<DashboardSectionKey, string>>>({});
  const [showSimple, setShowSimple] = useState<Partial<Record<DashboardSectionKey, boolean>>>({});

  const handleExplain = async (sectionKey: DashboardSectionKey, originalText: string) => {
    if (simpleBySection[sectionKey]) {
      setShowSimple((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
      return;
    }
    try {
      const body = { text: originalText, sectionKey, languageMode: 'hinglish' as const };
      const result = shareToken
        ? await simplifyShare({ shareToken, body }).unwrap()
        : await simplifyAuth({ uuid: gen.uuid, body }).unwrap();
      const simplified = result.data?.simplifiedText;
      if (simplified) {
        setSimpleBySection((prev) => ({ ...prev, [sectionKey]: simplified }));
        setShowSimple((prev) => ({ ...prev, [sectionKey]: true }));
      }
    } catch {
      // UI stays on original text
    }
  };

  return (
    <div className="space-y-6">
      <ResultCard>
        <CardContent className="pt-0">
          <YogHighlightStrip chartData={chartData} />
        </CardContent>
      </ResultCard>

      {interpretationLoading && (
        <PulseSoft className="rounded-2xl border border-astro-orange/20 bg-astro-orange/10 px-4 py-3 text-sm text-astro-purple">
          {tk('interpretationLoading')}
        </PulseSoft>
      )}

      <Stagger inView={false} className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const chartOnlySection = section.key === 'mahadasha';
          const waitingForReport =
            interpretationLoading && !chartOnlySection && !section.text?.trim();

          const original = section.text?.trim() ?? '';
          const displayOriginal = original ? excerptDashboardText(original) : null;
          const isSimple = showSimple[section.key] && simpleBySection[section.key];
          const displayText = isSimple ? simpleBySection[section.key]! : displayOriginal;
          const hasContent = !!displayText || !!section.subtitle;

          const SectionIcon = SECTION_ICONS[section.key];

          return (
            <StaggerItem key={section.key}>
              <HoverLift className="h-full">
                <ResultCard className="flex h-full flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                  <SectionIcon className="h-4 w-4 shrink-0 text-astro-orange" aria-hidden />
                  {tk(`sections.${section.key}`)}
                </CardTitle>
                {section.key === 'mahadasha' && section.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{section.subtitle}</p>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                {waitingForReport ? (
                  <PulseSoft className="flex-1 text-sm text-gray-500">{tk('sectionLoading')}</PulseSoft>
                ) : hasContent ? (
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {displayText ? renderBoldMarkdown(displayText) : section.subtitle}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 flex-1">{tk('sectionEmpty')}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {original && !waitingForReport && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={simplifying}
                      onClick={() => void handleExplain(section.key, original)}
                    >
                      {simplifying
                        ? tk('explaining')
                        : isSimple
                          ? tk('showOriginal')
                          : simpleBySection[section.key]
                            ? tk('showSimple')
                            : tk('explainSimply')}
                    </Button>
                  )}
                  {original && onReadMore && !waitingForReport && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onReadMore(section.key)}
                    >
                      {tk('readMore')}
                    </Button>
                  )}
                </div>
              </CardContent>
                </ResultCard>
              </HoverLift>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
