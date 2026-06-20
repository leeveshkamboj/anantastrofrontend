'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import { useGetMatchmakingReportQuery, useUpdateMatchmakingShareMutation, kundliApi } from '@/store/api/kundliApi';
import type { MatchmakingReportStatus, MatchmakingReportResponse } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { useAuth } from '@/store/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MatchmakingResult, MatchmakingPartnerKundlis } from '@/components/matchmaking';
import { MatchmakingResultHeader } from '@/components/matchmaking/result';
import { Stagger, StaggerItem } from '@/components/motion';
import { KundliResultStatusPanel } from '@/components/kundli/result';
import { Container } from '@/components/layout/Container';
import { shareViaInstagram } from '@/lib/social-share';

export default function MatchmakingResultPage() {
  const t = useTranslations('results.matchmaking');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = typeof params?.id === 'string' ? params.id : '';

  const cachedStatus = useSelector((state: RootState) =>
    id ? kundliApi.endpoints.getMatchmakingReport.select(id)(state)?.data?.data?.status : undefined,
  );
  const stopPolling = cachedStatus === 'COMPLETED' || cachedStatus === 'FAILED';

  const result = useGetMatchmakingReportQuery(id, {
    skip: !id,
    pollingInterval: id && !stopPolling ? 2500 : 0,
  });
  const { isLoading, isFetching, isError, refetch, isUninitialized } = result;
  const data = result.data as MatchmakingReportResponse | undefined;
  const report = data?.data;

  const waitingForData = Boolean(id) && !report && (isLoading || isFetching || isUninitialized);

  const [updateShare, { data: shareResult, isLoading: shareLoading }] = useUpdateMatchmakingShareMutation();
  const [copied, setCopied] = useState(false);
  const shareToken = report?.shareToken ?? shareResult?.data?.shareToken ?? null;
  const shareEnabled = report?.shareEnabled ?? shareResult?.data?.shareEnabled ?? false;
  const shareUrl =
    typeof window !== 'undefined' && shareToken
      ? `${window.location.origin}/services/matchmaking/share/${shareToken}`
      : '';

  const copyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success(tc('shareLinkCopied'));
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl, tc]);

  const shareOnInstagram = useCallback(async () => {
    if (!shareUrl) return;
    const shareResult = await shareViaInstagram(shareUrl);
    if (shareResult === 'copied') {
      toast.success(tc('instagramShareCopied'));
    } else {
      toast.error(tc('instagramShareFailed'));
    }
  }, [shareUrl, tc]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!id) return;
    refetch();
  }, [id, refetch]);

  const backButton = (
    <Button
      asChild
      variant="outline"
      className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
    >
      <Link href="/services/matchmaking">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToMatchmaking')}
      </Link>
    </Button>
  );

  if (!id) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
        message={t('invalidLink')}
        action={backButton}
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

  if (isError || !report) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
        message={t('loadError')}
        action={backButton}
      />
    );
  }

  const status = report.status as MatchmakingReportStatus;

  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <KundliResultStatusPanel
        variant="loading"
        icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
        title={status === 'PENDING' ? t('queue') : t('computing')}
        message={t('processingHintCompat')}
      />
    );
  }

  if (status === 'FAILED') {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
        title={t('generationFailed')}
        message={report.errorMessage || tc('genericError')}
        action={backButton}
      />
    );
  }

  if (!report.result) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
        message={t('noResultData')}
        action={backButton}
      />
    );
  }

  return (
    <div className="overflow-x-hidden">
      <MatchmakingResultHeader
        report={report}
        result={report.result}
        shareUrl={shareUrl}
        copied={copied}
        onCopyLink={copyLink}
        onShareInstagram={shareOnInstagram}
        shareLoading={shareLoading}
        shareEnabled={shareEnabled}
        onEnableShare={() => updateShare({ uuid: id, enabled: true })}
        onDisableShare={() => updateShare({ uuid: id, enabled: false })}
      />

      <section className="relative bg-gray-50/80 px-6 pb-20 pt-6 lg:px-24 lg:pt-8">
        <Container className="relative z-10 space-y-6">
          <Stagger inView={false} className="space-y-6">
            <StaggerItem>
              <MatchmakingPartnerKundlis
                partner1Name={report.partner1Name || t('partner1')}
                partner2Name={report.partner2Name || t('partner2')}
                partner1ChartData={report.partner1ChartData ?? null}
                partner2ChartData={report.partner2ChartData ?? null}
              />
            </StaggerItem>
            <StaggerItem>
              <MatchmakingResult result={report.result} />
            </StaggerItem>
          </Stagger>
        </Container>
      </section>
    </div>
  );
}
