'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useGetMatchmakingByShareTokenQuery } from '@/store/api/kundliApi';
import type { MatchmakingReportResponse } from '@/store/api/kundliApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MatchmakingResult, MatchmakingPartnerKundlis } from '@/components/matchmaking';
import { MatchmakingResultHeader } from '@/components/matchmaking/result';
import { KundliResultStatusPanel } from '@/components/kundli/result';
import { Container } from '@/components/layout/Container';
import { shareViaInstagram } from '@/lib/social-share';

export default function MatchmakingSharePage() {
  const t = useTranslations('shareView.matchmaking');
  const tr = useTranslations('results.matchmaking');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const result = useGetMatchmakingByShareTokenQuery(token, { skip: !token });
  const data = result.data as MatchmakingReportResponse | undefined;
  const report = data?.data;
  const { isLoading, isFetching, isError, isUninitialized } = result;

  const waitingForData = Boolean(token) && !report && (isLoading || isFetching || isUninitialized);

  const [pageShareUrl, setPageShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageShareUrl(window.location.href);
  }, []);

  const copyLink = useCallback(() => {
    if (!pageShareUrl) return;
    navigator.clipboard.writeText(pageShareUrl).then(() => {
      setCopied(true);
      toast.success(tc('shareLinkCopied'));
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pageShareUrl, tc]);

  const shareOnInstagram = useCallback(async () => {
    if (!pageShareUrl) return;
    const shareResult = await shareViaInstagram(pageShareUrl);
    if (shareResult === 'copied') {
      toast.success(tc('instagramShareCopied'));
    } else {
      toast.error(tc('instagramShareFailed'));
    }
  }, [pageShareUrl, tc]);

  const ctaButton = (
    <Button
      asChild
      variant="outline"
      className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
    >
      <Link href="/services/matchmaking">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('ctaOwn')}
      </Link>
    </Button>
  );

  if (!token) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
        message={t('invalidOrMissing')}
        action={ctaButton}
      />
    );
  }

  if (waitingForData) {
    return (
      <KundliResultStatusPanel
        variant="loading"
        icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
        message={t('loadingReport')}
      />
    );
  }

  if (isError || !report || report.status !== 'COMPLETED' || !report.result) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
        message={t('disabled')}
        action={ctaButton}
      />
    );
  }

  return (
    <div className="overflow-x-hidden">
      <MatchmakingResultHeader
        view="share"
        report={report}
        result={report.result}
        shareUrl={pageShareUrl}
        copied={copied}
        onCopyLink={copyLink}
        onShareInstagram={shareOnInstagram}
      />

      <section className="relative bg-gray-50/80 px-6 pb-20 pt-6 lg:px-24 lg:pt-8">
        <Container className="relative z-10 space-y-6">
          <MatchmakingPartnerKundlis
            partner1Name={report.partner1Name || tr('partner1')}
            partner2Name={report.partner2Name || tr('partner2')}
            partner1ChartData={report.partner1ChartData ?? null}
            partner2ChartData={report.partner2ChartData ?? null}
          />
          <MatchmakingResult result={report.result} />
        </Container>
      </section>
    </div>
  );
}
