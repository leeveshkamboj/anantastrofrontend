'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import { useGetMatchmakingReportQuery, useUpdateMatchmakingShareMutation, kundliApi } from '@/store/api/kundliApi';
import type { MatchmakingReportStatus, MatchmakingReportResponse } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, ArrowLeft, Loader2, AlertCircle, User, Calendar, Clock, MapPin, Share2, Link2, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MatchmakingResult, MatchmakingPartnerKundlis } from '@/components/matchmaking';

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
  const { isLoading, isError, refetch } = result;
  const data = result.data as MatchmakingReportResponse | undefined;
  const report = data?.data;

  const [updateShare, { data: shareResult, isLoading: shareLoading }] = useUpdateMatchmakingShareMutation();
  const [copied, setCopied] = useState(false);
  const shareToken = report?.shareToken ?? shareResult?.data?.shareToken ?? null;
  const shareEnabled = report?.shareEnabled ?? shareResult?.data?.shareEnabled ?? false;
  const shareUrl = typeof window !== 'undefined' && shareToken
    ? `${window.location.origin}/services/matchmaking/share/${shareToken}`
    : '';
  const copyLink = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success(tc('shareLinkCopied'));
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

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

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-600">{t('invalidLink')}</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/services/matchmaking')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToMatchmaking')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">{t('loadingReport')}</p>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('loadError')}</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/services/matchmaking')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToMatchmaking')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = report.status as MatchmakingReportStatus;

  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {status === 'PENDING' ? t('queue') : t('computing')}
            </h2>
            <p className="text-gray-600 text-sm">
              {t('processingHintCompat')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('generationFailed')}</h2>
            <p className="text-gray-600 text-sm mb-4">{report.errorMessage || tc('genericError')}</p>
            <Button variant="outline" onClick={() => router.push('/services/matchmaking')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToMatchmaking')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report.result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-600">{t('noResultData')}</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/services/matchmaking')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToMatchmaking')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => router.push('/services/matchmaking')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToMatchmaking')}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('reportTitle')}</h1>
              <p className="text-gray-600 text-sm">{t('reportSubtitle')}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={shareLoading}>
                {shareLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                {tc('share')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {!shareEnabled ? (
                <DropdownMenuItem
                  onClick={() => updateShare({ uuid: id, enabled: true })}
                  disabled={shareLoading}
                >
                  <Link2 className="h-4 w-4" />
                  {tc('createShareableLink')}
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={copyLink}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? tc('copied') : tc('copyLink')}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => updateShare({ uuid: id, enabled: false })}
                    disabled={shareLoading}
                    className="text-red-600"
                  >
                    {tc('disableLink')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{report.partner1Name || t('partner1')}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{report.partner1Dob || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{report.partner1Time || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{report.partner1PlaceOfBirth || '—'}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{report.partner2Name || t('partner2')}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{report.partner2Dob || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{report.partner2Time || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{report.partner2PlaceOfBirth || '—'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <MatchmakingPartnerKundlis
          partner1Name={report.partner1Name || t('partner1')}
          partner2Name={report.partner2Name || t('partner2')}
          partner1ChartData={report.partner1ChartData ?? null}
          partner2ChartData={report.partner2ChartData ?? null}
        />

        <MatchmakingResult result={report.result} />
      </div>
    </div>
  );
}
