'use client';

import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import { useGetKundliGenerationQuery, useUpdateKundliShareMutation, kundliApi } from '@/store/api/kundliApi';
import type { KundliGenerationStatus, KundliGenerationResponse } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { useAuth } from '@/store/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { KundliResultContent } from '../KundliResultContent';
import { KundliResultHeader, KundliResultStatusPanel } from '@/components/kundli/result';
import { KundliJourneyExperience } from '@/components/kundli/result/KundliJourneyExperience';
import { Container } from '@/components/layout/Container';
import { shareViaInstagram } from '@/lib/social-share';
import { AnimatePresence, motion } from 'framer-motion';

export default function KundliResultPage() {
  const t = useTranslations('results.kundli');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = typeof params?.id === 'string' ? params.id : '';

  const cachedStatus = useSelector((state: RootState) =>
    id ? kundliApi.endpoints.getKundliGeneration.select(id)(state)?.data?.data?.status : undefined,
  );
  const stopPolling = cachedStatus === 'COMPLETED' || cachedStatus === 'FAILED';

  const result = useGetKundliGenerationQuery(id, {
    skip: !id,
    pollingInterval: id && !stopPolling ? 2500 : 0,
  });
  const { isLoading, isFetching, isError, refetch, isUninitialized } = result;
  const data = result.data as KundliGenerationResponse | undefined;

  const waitingForData = Boolean(id) && !data?.data && (isLoading || isFetching || isUninitialized);

  const [updateShare, { data: shareResult, isLoading: shareLoading }] = useUpdateKundliShareMutation();
  const [copied, setCopied] = useState(false);

  const genOrUndefined = data?.data;
  const shareUrlForCopy =
    typeof window !== 'undefined' && (genOrUndefined?.shareToken ?? shareResult?.data?.shareToken)
      ? `${window.location.origin}/services/kundli/share/${genOrUndefined?.shareToken ?? shareResult?.data?.shareToken ?? ''}`
      : '';
  const copyLink = useCallback(() => {
    if (!shareUrlForCopy) return;
    navigator.clipboard.writeText(shareUrlForCopy).then(() => {
      setCopied(true);
      toast.success(tc('shareLinkCopied'));
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrlForCopy, tc]);

  const shareOnInstagram = useCallback(async () => {
    if (!shareUrlForCopy) return;
    const result = await shareViaInstagram(shareUrlForCopy);
    if (result === 'copied') {
      toast.success(tc('instagramShareCopied'));
    } else {
      toast.error(tc('instagramShareFailed'));
    }
  }, [shareUrlForCopy, tc]);

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
      variant="outline"
      className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
      onClick={() => router.push('/services/kundli/generate')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {t('backToKundli')}
    </Button>
  );

  const gen = data?.data;
  const status = gen?.status as KundliGenerationStatus | undefined;
  const shareEnabled = gen?.shareEnabled ?? shareResult?.data?.shareEnabled ?? false;
  const shareUrl = shareUrlForCopy;
  const hasJourneyMode = searchParams.get('journey') === '1';

  let phaseKey = 'loading';
  if (!id) phaseKey = 'invalid';
  else if (waitingForData) phaseKey = 'loading';
  else if (isError || !gen) phaseKey = 'error';
  else if (status === 'PENDING') phaseKey = 'pending';
  else if (status === 'PROCESSING') phaseKey = 'processing';
  else if (status === 'FAILED') phaseKey = 'failed';
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
              <KundliJourneyExperience
                phase="loading"
                title={t('loading')}
                message={t('processingHint')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                message={t('loading')}
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
              <KundliJourneyExperience
                phase="pending"
                title={t('queue')}
                message={t('processingHint')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                title={t('queue')}
                message={t('processingHint')}
              />
            )
          ) : null}

          {phaseKey === 'processing' ? (
            hasJourneyMode ? (
              <KundliJourneyExperience
                phase="processing"
                title={t('generating')}
                message={t('processingHint')}
              />
            ) : (
              <KundliResultStatusPanel
                variant="loading"
                icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
                title={t('generating')}
                message={t('processingHint')}
              />
            )
          ) : null}

          {phaseKey === 'failed' && gen ? (
            <KundliResultStatusPanel
              icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
              title={t('generationFailed')}
              message={gen.errorMessage || tc('genericError')}
              action={backButton}
            />
          ) : null}

          {phaseKey === 'result' && gen ? (
            <div>
              <KundliResultHeader
                gen={gen}
                shareLoading={shareLoading}
                shareEnabled={shareEnabled}
                shareUrl={shareUrl}
                copied={copied}
                onCopyLink={copyLink}
                onShareInstagram={shareOnInstagram}
                onEnableShare={() => updateShare({ uuid: id, enabled: true })}
                onDisableShare={() => updateShare({ uuid: id, enabled: false })}
              />

              <section className="relative bg-gray-50/80 px-6 pb-20 pt-6 lg:px-24 lg:pt-8">
                <Container className="relative z-10">
                  <KundliResultContent gen={gen} />
                </Container>
              </section>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
