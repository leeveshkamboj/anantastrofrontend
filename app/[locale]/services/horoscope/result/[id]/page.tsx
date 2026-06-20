'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import {
  useGetHoroscopeReportQuery,
  useUpdateHoroscopeShareMutation,
  kundliApi,
} from '@/store/api/kundliApi';
import type { HoroscopeReportStatus, HoroscopeReportResponse } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { AiTranslateBar } from '@/components/reports/AiTranslateBar';
import { useAuth } from '@/store/hooks/useAuth';
import { useTranslateSections } from '@/hooks/useTranslateSections';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  HoroscopeResultHeader,
  HoroscopeReportContent,
  parseHoroscopeSections,
} from '@/components/horoscope/result';
import { HoroscopeJourneyExperience, KundliResultStatusPanel } from '@/components/kundli/result';
import { Container } from '@/components/layout/Container';
import { shareViaInstagram } from '@/lib/social-share';
import { AnimatePresence, motion } from 'framer-motion';

export default function HoroscopeResultPage() {
  const t = useTranslations('results.horoscope');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = typeof params?.id === 'string' ? params.id : '';
  const aiTranslate = useTranslateSections();

  const cachedStatus = useSelector((state: RootState) =>
    id ? kundliApi.endpoints.getHoroscopeReport.select(id)(state)?.data?.data?.status : undefined,
  );
  const stopPolling = cachedStatus === 'COMPLETED' || cachedStatus === 'FAILED';

  const result = useGetHoroscopeReportQuery(id, {
    skip: !id,
    pollingInterval: id && !stopPolling ? 2500 : 0,
  });
  const { isLoading, isFetching, isError, refetch, isUninitialized } = result;
  const data = result.data as HoroscopeReportResponse | undefined;
  const report = data?.data;

  const waitingForData = Boolean(id) && !report && (isLoading || isFetching || isUninitialized);

  const [updateShare, { data: shareResult, isLoading: shareLoading }] =
    useUpdateHoroscopeShareMutation();
  const [copied, setCopied] = useState(false);
  const shareToken = report?.shareToken ?? shareResult?.data?.shareToken ?? null;
  const shareEnabled = report?.shareEnabled ?? shareResult?.data?.shareEnabled ?? false;
  const shareUrl =
    typeof window !== 'undefined' && shareToken
      ? `${window.location.origin}/services/horoscope/share/${shareToken}`
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

  useEffect(() => {
    aiTranslate.reset();
  }, [id, aiTranslate.reset]);

  const backButton = (
    <Button
      asChild
      variant="outline"
      className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
    >
      <Link href="/services/horoscope">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToHoroscope')}
      </Link>
    </Button>
  );

  const status = report?.status as HoroscopeReportStatus | undefined;
  const hasJourneyMode = searchParams.get('journey') === '1';

  let phaseKey = 'loading';
  if (!id) phaseKey = 'invalid';
  else if (waitingForData) phaseKey = 'loading';
  else if (isError || !report) phaseKey = 'error';
  else if (status === 'PENDING') phaseKey = 'pending';
  else if (status === 'PROCESSING') phaseKey = 'processing';
  else if (status === 'FAILED') phaseKey = 'failed';
  else if (!report.result) phaseKey = 'empty';
  else phaseKey = 'result';

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseKey}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {phaseKey === 'invalid' ? (
            <KundliResultStatusPanel
              icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
              message={t('invalidLink')}
              action={backButton}
            />
          ) : null}

          {phaseKey === 'loading' ? (
            hasJourneyMode ? (
              <HoroscopeJourneyExperience
                phase="loading"
                title={t('loadingReport')}
                message={t('processingHintBuild')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                message={t('loadingReport')}
              />
            )
          ) : null}

          {phaseKey === 'error' ? (
            <KundliResultStatusPanel
              icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
              message={t('loadError')}
              action={backButton}
            />
          ) : null}

          {phaseKey === 'pending' ? (
            hasJourneyMode ? (
              <HoroscopeJourneyExperience
                phase="pending"
                title={t('queue')}
                message={t('processingHintBuild')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                title={t('queue')}
                message={t('processingHintBuild')}
              />
            )
          ) : null}

          {phaseKey === 'processing' ? (
            hasJourneyMode ? (
              <HoroscopeJourneyExperience
                phase="processing"
                title={t('generating')}
                message={t('processingHintBuild')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                title={t('generating')}
                message={t('processingHintBuild')}
              />
            )
          ) : null}

          {phaseKey === 'failed' && report ? (
            <KundliResultStatusPanel
              icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
              title={t('generationFailed')}
              message={report.errorMessage || tc('genericError')}
              action={backButton}
            />
          ) : null}

          {phaseKey === 'empty' ? (
            <KundliResultStatusPanel
              icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
              message={t('noResultData')}
              action={backButton}
            />
          ) : null}

          {phaseKey === 'result' && report?.result ? (
            <div>
              <HoroscopeResultHeader
                report={report}
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
                  {parseHoroscopeSections(report.result) ? (
                    <AiTranslateBar
                      visible={aiTranslate.needsUi && aiTranslate.translatedByKey == null}
                      isTranslating={aiTranslate.loading}
                      onTranslate={() => {
                        const s = parseHoroscopeSections(report.result);
                        if (s) void aiTranslate.translateSections(s);
                      }}
                    />
                  ) : null}

                  <HoroscopeReportContent
                    result={report.result}
                    translatedByKey={aiTranslate.translatedByKey}
                  />
                </Container>
              </section>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
