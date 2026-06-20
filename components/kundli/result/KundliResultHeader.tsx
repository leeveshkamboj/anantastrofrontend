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
import { FadeIn } from '@/components/motion/FadeIn';
import { useMotion } from '@/components/motion/MotionProvider';
import { getChoreographyDelay } from '@/lib/motion';
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
import type { KundliGeneration } from '@/store/api/kundliApi';
import { cn } from '@/lib/utils';

type KundliResultHeaderProps = {
  gen: KundliGeneration;
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

export type { KundliResultHeaderProps };

function getChartHighlights(gen: KundliGeneration) {
  const chartData = gen.chartData as Record<string, unknown> | null;
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
  sign,
  displaySign,
}: {
  label: string;
  sign?: string;
  displaySign: string;
}) {
  if (!displaySign || displaySign === '—') return null;
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 px-2 py-4 text-center sm:px-4 sm:py-5">
      {sign ? (
        <ZodiacIcon sign={sign} className="h-8 w-8 text-astro-yellow sm:h-9 sm:w-9" stroke="currentColor" />
      ) : (
        <Sparkles className="h-8 w-8 text-astro-yellow sm:h-9 sm:w-9" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200/60">{label}</p>
        <p className="truncate text-sm font-extrabold text-white sm:text-base">{displaySign}</p>
      </div>
    </div>
  );
}

function ShareMenuItems({
  shareUrl,
  copied,
  onCopyLink,
  onShareInstagram,
  shareKundliMessage,
}: {
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
  onShareInstagram: () => void;
  shareKundliMessage: string;
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
          href={buildWhatsAppShareUrl(shareKundliMessage)}
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

export function KundliResultHeader({
  gen,
  view = 'owner',
  shareUrl,
  copied,
  onCopyLink,
  onShareInstagram,
  shareLoading = false,
  shareEnabled = false,
  onEnableShare,
  onDisableShare,
}: KundliResultHeaderProps) {

  const t = useTranslations('results.kundli');
  const ts = useTranslations('shareView.kundli');
  const tc = useTranslations('commonUi');
  const { reduced } = useMotion();
  const astro = useAstroDisplay();
  const { lagnaSign, moonSign, nakshatra } = getChartHighlights(gen);
  const displayName = gen.name?.trim() || t('yourKundli');
  const hasPlace = Boolean(gen.placeOfBirth?.trim());
  const isShareView = view === 'share';

  const highlights = [
    { key: 'lagna', label: 'Lagna', sign: lagnaSign, displaySign: astro.sign(lagnaSign) },
    { key: 'moon', label: 'Moon', sign: moonSign, displaySign: astro.sign(moonSign) },
    {
      key: 'nakshatra',
      label: t('panchang.nakshatra'),
      sign: undefined,
      displaySign: nakshatra ? astro.nakshatra(nakshatra) : '',
    },
  ].filter((h) => h.displaySign && h.displaySign !== '—');

  const shareKundliMessage = tc('shareKundliMessage', { url: shareUrl });

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
            href="/services/kundli/generate"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:border-white/25 hover:bg-white/10 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {isShareView ? ts('ctaOwn') : t('backToKundli')}
            </span>
          </Link>

          <FadeIn preset="fadeIn" inView={false} delay={getChoreographyDelay("content", reduced)}>
            <DropdownMenu>
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
            <DropdownMenuContent align="end" className="w-52">
              {isShareView ? (
                <ShareMenuItems
                  shareUrl={shareUrl}
                  copied={copied}
                  onCopyLink={onCopyLink}
                  onShareInstagram={onShareInstagram}
                  shareKundliMessage={shareKundliMessage}
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
                    shareKundliMessage={shareKundliMessage}
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDisableShare}
                    disabled={shareLoading}
                    variant="destructive"
                  >
                    {tc('disableLink')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </FadeIn>
        </div>

        <FadeIn preset="fadeUp" inView={false}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 text-center lg:text-left">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-astro-yellow/25 bg-astro-yellow/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-astro-yellow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isShareView ? ts('title') : t('yourKundli')}
            </p>

            <h1 className="font-serif text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
              {displayName}
            </h1>

            <ul className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 lg:items-start lg:justify-start">
              <MetaItem icon={Calendar}>{gen.dob}</MetaItem>
              <MetaItem icon={Clock}>{gen.time}</MetaItem>
              {hasPlace ? <MetaItem icon={MapPin}>{gen.placeOfBirth}</MetaItem> : null}
            </ul>
          </div>

          {highlights.length > 0 ? (
            <div
              className={cn(
                'w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:w-auto lg:min-w-[min(100%,22rem)]',
                highlights.length === 1 && 'mx-auto max-w-xs lg:mx-0',
                highlights.length === 2 && 'mx-auto max-w-md lg:mx-0',
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
                    sign={h.sign}
                    displaySign={h.displaySign}
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
