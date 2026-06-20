'use client';

import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Facebook,
  Heart,
  Instagram,
  Link2,
  Linkedin,
  Loader2,
  MapPin,
  Share2,
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
import type { MatchmakingReport, MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion';
import { useMotion } from '@/components/motion/MotionProvider';
import { getChoreographyDelay } from '@/lib/motion';
import { cn } from '@/lib/utils';

type MatchmakingResultHeaderProps = {
  report: MatchmakingReport;
  result?: MatchmakingResultType | null;
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

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex min-w-0 items-center gap-2 text-sm text-purple-100/90">
      <Icon className="h-3.5 w-3.5 shrink-0 text-astro-yellow/80" aria-hidden="true" />
      <span className="truncate font-medium text-white/95">{children}</span>
    </li>
  );
}

function PartnerMetaColumn({
  label,
  dob,
  time,
  place,
}: {
  label: string;
  dob: string;
  time: string;
  place: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-purple-200/60">{label}</p>
      <ul className="space-y-1">
        <MetaItem icon={Calendar}>{dob}</MetaItem>
        <MetaItem icon={Clock}>{time}</MetaItem>
        {place?.trim() ? <MetaItem icon={MapPin}>{place}</MetaItem> : null}
      </ul>
    </div>
  );
}

function PartnerHighlight({
  label,
  rashi,
  nakshatra,
}: {
  label: string;
  rashi: string;
  nakshatra: string;
}) {
  const t = useTranslations('results.matchmaking.result');
  const astro = useAstroDisplay();
  const displayRashi = astro.sign(rashi);
  const displayNakshatra = nakshatra.includes('-')
    ? astro.nakshatraCharan(nakshatra)
    : astro.nakshatra(nakshatra);

  return (
    <div className="flex min-w-0 flex-col items-center gap-2 px-3 py-4 text-center sm:px-4 sm:py-5">
      {rashi ? (
        <ZodiacIcon sign={rashi} className="h-8 w-8 text-astro-yellow sm:h-9 sm:w-9" stroke="currentColor" />
      ) : (
        <Heart className="h-8 w-8 text-astro-yellow/80 sm:h-9 sm:w-9" aria-hidden="true" />
      )}
      <div className="min-w-0 w-full">
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-purple-200/60">{label}</p>
        <p className="truncate text-sm font-extrabold text-white sm:text-base">{displayRashi || '—'}</p>
        {displayNakshatra ? (
          <p className="mt-0.5 truncate text-xs text-purple-100/70">
            {t('nakshatra')} {displayNakshatra}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function formatScorePoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

function ScoreHighlight({ result }: { result: MatchmakingResultType }) {
  const t = useTranslations('results.matchmaking.result');

  const scoreTone =
    result.percentage >= 25
      ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-100'
      : result.percentage >= 18
        ? 'border-astro-yellow/40 bg-astro-yellow/20 text-astro-yellow'
        : 'border-red-400/40 bg-red-500/20 text-red-100';

  return (
    <div className="flex min-w-27 flex-col items-center justify-center gap-2 px-3 py-4 text-center sm:min-w-28 sm:px-5 sm:py-5">
      <div
        className={cn(
          'flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 px-1 sm:h-21 sm:w-21',
          scoreTone,
        )}
      >
        <span className="text-2xl font-extrabold leading-none tabular-nums">
          {formatScorePoints(result.totalPoints)}
        </span>
        <span className="mt-0.5 text-[11px] font-semibold leading-none opacity-80 sm:text-xs">
          /{result.maxPoints}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200/60">{t('title')}</p>
        <p className="text-sm font-extrabold text-white sm:text-base">
          {t('percentMatch', { pct: result.percentage })}
        </p>
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

export function MatchmakingResultHeader({
  report,
  result,
  view = 'owner',
  shareUrl,
  copied,
  onCopyLink,
  onShareInstagram,
  shareLoading = false,
  shareEnabled = false,
  onEnableShare,
  onDisableShare,
}: MatchmakingResultHeaderProps) {
  const { reduced } = useMotion();
  const t = useTranslations('results.matchmaking');
  const ts = useTranslations('shareView.matchmaking');
  const tc = useTranslations('commonUi');
  const isShareView = view === 'share';

  const partner1Label = report.partner1Name?.trim() || t('partner1');
  const partner2Label = report.partner2Name?.trim() || t('partner2');
  const shareMessage = tc('shareMatchmakingMessage', { url: shareUrl });

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
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/services/matchmaking"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:border-white/25 hover:bg-white/10 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {isShareView ? ts('ctaOwn') : t('backToMatchmaking')}
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
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-astro-yellow/25 bg-astro-yellow/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-astro-yellow">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {isShareView ? ts('title') : t('reportTitle')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
              <h1 className="font-serif text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
                {partner1Label}
              </h1>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-astro-orange/30 bg-astro-orange/15"
                aria-hidden="true"
              >
                <Heart className="h-5 w-5 fill-astro-orange/40 text-astro-orange" />
              </span>
              <h1 className="font-serif text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
                {partner2Label}
              </h1>
            </div>

            <p className="mt-2 text-sm text-purple-100/75">{t('reportSubtitle')}</p>
          </div>

          {result ? (
            <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:max-w-none">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] divide-x divide-white/10">
                <PartnerHighlight
                  label={partner1Label}
                  rashi={result.partner1Summary.rashi}
                  nakshatra={result.partner1Summary.nakshatra}
                />
                <FadeIn preset="scaleIn" inView={false} delay={getChoreographyDelay("icon", reduced)}>
                  <ScoreHighlight result={result} />
                </FadeIn>
                <PartnerHighlight
                  label={partner2Label}
                  rashi={result.partner2Summary.rashi}
                  nakshatra={result.partner2Summary.nakshatra}
                />
              </div>
            </div>
          ) : null}

          <Stagger inView={false} className="grid grid-cols-1 gap-5 border-t border-white/10 pt-5 sm:grid-cols-2 sm:gap-8">
            <StaggerItem>
              <PartnerMetaColumn
                label={partner1Label}
                dob={report.partner1Dob}
                time={report.partner1Time}
                place={report.partner1PlaceOfBirth}
              />
            </StaggerItem>
            <StaggerItem>
              <PartnerMetaColumn
                label={partner2Label}
                dob={report.partner2Dob}
                time={report.partner2Time}
                place={report.partner2PlaceOfBirth}
              />
            </StaggerItem>
          </Stagger>
        </div>
        </FadeIn>
      </Container>
    </header>
  );
}
