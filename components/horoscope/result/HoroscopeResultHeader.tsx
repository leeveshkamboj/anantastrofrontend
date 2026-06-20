'use client';

import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Facebook,
  Instagram,
  Link2,
  Linkedin,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { ZodiacIcon } from '@/components/kundli/ZodiacIcon';
import { WhatsAppIcon } from '@/components/reports/WhatsAppIcon';
import { buildWhatsAppShareUrl } from '@/lib/social-share';
import { useAstroDisplay } from '@/hooks/useAstroDisplay';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { HoroscopeReport } from '@/store/api/kundliApi';
import { FadeIn } from '@/components/motion/FadeIn';
import { useMotion } from '@/components/motion/MotionProvider';
import { getChoreographyDelay } from '@/lib/motion';
import { cn } from '@/lib/utils';

type HoroscopeResultHeaderProps = {
  report: HoroscopeReport;
  view?: 'owner' | 'share';
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onShareInstagram: () => void;
  shareLoading?: boolean;
  shareEnabled?: boolean;
  onEnableShare?: () => void;
  onDisableShare?: () => void;
};

function getChartHighlights(chartData: Record<string, unknown> | null) {
  const lagnaSign = typeof chartData?.lagnaSign === 'string' ? chartData.lagnaSign : '';
  const avakhada =
    chartData?.avakhada && typeof chartData.avakhada === 'object'
      ? (chartData.avakhada as Record<string, string>)
      : null;
  const nakshatra = avakhada?.nakshatra ?? '';
  const planets = chartData?.planets;
  let moonSign = '';
  if (Array.isArray(planets)) {
    const moon = planets.find(
      (p) => p && typeof p === 'object' && (p as { name?: string }).name === 'Moon',
    ) as { signSidereal?: string; sign?: string } | undefined;
    moonSign = moon?.signSidereal ?? moon?.sign ?? '';
  }
  return { lagnaSign, moonSign, nakshatra };
}

function periodLabel(period: string, t: ReturnType<typeof useTranslations<'results.horoscope'>>) {
  const pl = period.toLowerCase();
  if (pl === 'daily') return t('periodDaily');
  if (pl === 'weekly') return t('periodWeekly');
  if (pl === 'monthly') return t('periodMonthly');
  return period;
}

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex min-w-0 items-center gap-2 text-sm text-purple-100/90">
      <Icon className="h-4 w-4 shrink-0 text-astro-yellow/80" aria-hidden="true" />
      <span className="truncate font-medium text-white/95">{children}</span>
    </li>
  );
}

function HighlightCell({
  label,
  value,
  sign,
  icon: Icon = Sparkles,
}: {
  label: string;
  value: string;
  sign?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  if (!value || value === '—') return null;
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 px-3 py-4 text-center sm:px-4 sm:py-5">
      {sign ? (
        <ZodiacIcon sign={sign} className="h-8 w-8 text-astro-yellow sm:h-9 sm:w-9" stroke="currentColor" />
      ) : (
        <Icon className="h-8 w-8 text-astro-yellow sm:h-9 sm:w-9" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200/60">{label}</p>
        <p className="truncate text-sm font-extrabold capitalize text-white sm:text-base">{value}</p>
      </div>
    </div>
  );
}

function ShareMenuItems({
  shareUrl,
  copied,
  onCopyLink,
  onShareInstagram,
  shareMessage,
}: {
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onShareInstagram: () => void;
  shareMessage: string;
}) {
  const tc = useTranslations('commonUi');

  return (
    <>
      <DropdownMenuItem onClick={onCopyLink}>
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        {copied ? tc('copied') : tc('copyLink')}
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a
          href={buildWhatsAppShareUrl(shareMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          {tc('shareWhatsApp')}
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => void onShareInstagram()}>
        <Instagram className="h-4 w-4 text-[#E4405F]" />
        {tc('shareInstagram')}
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </DropdownMenuItem>
    </>
  );
}

export function HoroscopeResultHeader({
  report,
  view = 'owner',
  shareUrl,
  copied,
  onCopyLink,
  onShareInstagram,
  shareLoading = false,
  shareEnabled = false,
  onEnableShare,
  onDisableShare,
}: HoroscopeResultHeaderProps) {
  const { reduced } = useMotion();
  const t = useTranslations('results.horoscope');
  const ts = useTranslations('shareView.horoscope');
  const tc = useTranslations('commonUi');
  const astro = useAstroDisplay();
  const isShareView = view === 'share';
  const displayName = report.name?.trim() || t('yourHoroscope');
  const hasPlace = Boolean(report.placeOfBirth?.trim());
  const { lagnaSign, moonSign, nakshatra } = getChartHighlights(report.chartData);

  const highlights = [
    {
      key: 'period',
      label: t('periodLabel'),
      value: periodLabel(report.period, t),
      sign: undefined,
      icon: Calendar,
    },
    {
      key: 'detail',
      label: t('detailLabel'),
      value: report.detailLevel === 'detailed' ? t('detailed') : t('summary'),
      sign: undefined,
      icon: Sparkles,
    },
    {
      key: 'moon',
      label: 'Moon',
      value: moonSign ? astro.sign(moonSign) : lagnaSign ? astro.sign(lagnaSign) : nakshatra ? astro.nakshatra(nakshatra) : '',
      sign: moonSign || lagnaSign || undefined,
      icon: Sparkles,
    },
  ].filter((h) => h.value && h.value !== '—');

  const shareMessage = tc('shareHoroscopeMessage', { url: shareUrl });

  return (
    <header className="relative overflow-hidden rounded-b-4xl bg-astro-dark stars-bg text-white md:rounded-b-[2.5rem]">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-astro-purple/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-astro-orange/25 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative px-6 pb-14 pt-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/services/horoscope"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:border-white/25 hover:bg-white/10 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {isShareView ? ts('ctaOwn') : t('backToHoroscope')}
            </span>
          </Link>

          <DropdownMenu>
            <FadeIn preset="fadeIn" inView={false} delay={getChoreographyDelay("content", reduced)}>
              <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white',
                  !isShareView && shareEnabled && 'border-emerald-400/30 bg-emerald-500/10',
                )}
                disabled={!isShareView && shareLoading}
              >
                {!isShareView && shareLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {tc('share')}
                {!isShareView && shareEnabled ? (
                  <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            </FadeIn>
            <DropdownMenuContent align="end" className="w-52">
              {isShareView ? (
                <ShareMenuItems
                  shareUrl={shareUrl}
                  copied={copied}
                  onCopyLink={onCopyLink}
                  onShareInstagram={onShareInstagram}
                  shareMessage={shareMessage}
                />
              ) : !shareEnabled ? (
                <DropdownMenuItem onClick={onEnableShare} disabled={shareLoading}>
                  <Link2 className="h-4 w-4" />
                  {tc('createShareableLink')}
                </DropdownMenuItem>
              ) : (
                <>
                  <ShareMenuItems
                    shareUrl={shareUrl}
                    copied={copied}
                    onCopyLink={onCopyLink}
                    onShareInstagram={onShareInstagram}
                    shareMessage={shareMessage}
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDisableShare} disabled={shareLoading} variant="destructive">
                    {tc('disableLink')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <FadeIn preset="fadeUp" inView={false}>
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-astro-yellow/25 bg-astro-yellow/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-astro-yellow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isShareView ? ts('title') : t('reportTitle')}
            </p>

            <h1 className="font-serif text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
              {displayName}
            </h1>

            <p className="mt-2 text-sm text-purple-100/75">
              {t('predictionLine', {
                period: periodLabel(report.period, t),
                level: report.detailLevel === 'detailed' ? t('detailed') : t('summary'),
              })}
            </p>

            <ul className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 lg:items-start lg:justify-start">
              <MetaItem icon={Calendar}>{report.dob}</MetaItem>
              <MetaItem icon={Clock}>{report.time}</MetaItem>
              {hasPlace ? <MetaItem icon={MapPin}>{report.placeOfBirth}</MetaItem> : null}
            </ul>
          </div>

          {highlights.length > 0 ? (
            <div
              className={cn(
                'mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:mx-0',
                highlights.length === 1 && 'max-w-xs',
                highlights.length === 2 && 'max-w-md',
                highlights.length >= 3 && 'max-w-2xl lg:max-w-none',
              )}
            >
              <div
                className={cn(
                  'grid divide-white/10',
                  highlights.length === 1 && 'grid-cols-1',
                  highlights.length === 2 && 'grid-cols-2 divide-x',
                  highlights.length >= 3 && 'grid-cols-3 divide-x',
                )}
              >
                {highlights.map((h) => (
                  <HighlightCell
                    key={h.key}
                    label={h.label}
                    value={h.value}
                    sign={h.sign}
                    icon={h.icon}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        </FadeIn>
      </Container>
    </header>
  );
}
