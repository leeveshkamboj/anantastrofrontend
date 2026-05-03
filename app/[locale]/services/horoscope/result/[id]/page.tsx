'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import {
  useGetHoroscopeReportQuery,
  useUpdateHoroscopeShareMutation,
  kundliApi,
} from '@/store/api/kundliApi';
import type {
  HoroscopeReportStatus,
  HoroscopeReportResponse,
  HoroscopeResult,
} from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { AiTranslateBar } from '@/components/reports/AiTranslateBar';
import { useAuth } from '@/store/hooks/useAuth';
import { useTranslateSections } from '@/hooks/useTranslateSections';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Link2,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const SECTION_KEYS: { key: keyof HoroscopeResult; labelKey: 'sectionOverview' | 'sectionCareer' | 'sectionHealth' | 'sectionRelationships' | 'sectionFinance' | 'sectionRemedies' }[] = [
  { key: 'overview', labelKey: 'sectionOverview' },
  { key: 'career', labelKey: 'sectionCareer' },
  { key: 'health', labelKey: 'sectionHealth' },
  { key: 'relationships', labelKey: 'sectionRelationships' },
  { key: 'finance', labelKey: 'sectionFinance' },
  { key: 'remedies', labelKey: 'sectionRemedies' },
];

function parseHoroscopeSections(result: HoroscopeResult | Record<string, unknown> | null): Record<string, string> | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const { key } of SECTION_KEYS) {
    const raw = r[key as string] ?? r[String(key).charAt(0).toUpperCase() + String(key).slice(1)];
    if (typeof raw === 'string' && raw.trim()) out[key as string] = raw;
  }
  return Object.keys(out).length ? out : null;
}

function ReportContent({
  result,
  translatedByKey,
}: {
  result: HoroscopeResult | Record<string, unknown> | null;
  translatedByKey?: Record<string, string> | null;
}) {
  const t = useTranslations('results.horoscope');
  const renderBoldMarkdown = (text: string): ReactNode[] => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.filter(Boolean).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, string | undefined>;
  return (
    <div className="space-y-6">
      {SECTION_KEYS.map(({ key, labelKey }) => {
        const raw = r[key] ?? r[key.charAt(0).toUpperCase() + key.slice(1)];
        const base = typeof raw === 'string' ? raw : '';
        const text = translatedByKey?.[key as string] ?? base;
        if (!text?.trim()) return null;
        return (
          <Card key={key} className="border border-gray-200">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t(labelKey)}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">{renderBoldMarkdown(text)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function HoroscopeResultPage() {
  const t = useTranslations('results.horoscope');
  const tc = useTranslations('commonUi');
  const params = useParams();
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
  const { isLoading, isError, refetch } = result;
  const data = result.data as HoroscopeReportResponse | undefined;
  const report = data?.data;

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

  useEffect(() => {
    aiTranslate.reset();
  }, [id, aiTranslate.reset]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-600">{t('invalidLink')}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push('/services/horoscope')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHoroscope')}
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
            <p className="text-gray-600">
              {t('loadError')}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push('/services/horoscope')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHoroscope')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = report.status as HoroscopeReportStatus;

  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {status === 'PENDING' ? t('queue') : t('generating')}
            </h2>
            <p className="text-gray-600 text-sm">
              {t('processingHintBuild')}
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
            <p className="text-gray-600 text-sm mb-4">
              {report.errorMessage || tc('genericError')}
            </p>
            <Button variant="outline" onClick={() => router.push('/services/horoscope')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHoroscope')}
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
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push('/services/horoscope')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHoroscope')}
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
          onClick={() => router.push('/services/horoscope')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToHoroscope')}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('reportTitle')}</h1>
              <p className="text-gray-600 text-sm capitalize">
                {t('predictionLine', {
                  period: (() => {
                    const pl = (report.period ?? '').toLowerCase();
                    if (pl === 'daily') return t('periodDaily');
                    if (pl === 'weekly') return t('periodWeekly');
                    if (pl === 'monthly') return t('periodMonthly');
                    return report.period ?? '';
                  })(),
                  level: report.detailLevel === 'detailed' ? t('detailed') : t('summary'),
                })}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={shareLoading}>
                {shareLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
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
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
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

        <Card className="border border-gray-200 mb-8">
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {report.name || t('birthDetails')}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{report.dob || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{report.time || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{report.placeOfBirth || '—'}</span>
            </div>
          </CardContent>
        </Card>

        {report.result && parseHoroscopeSections(report.result) ? (
          <AiTranslateBar
            visible={aiTranslate.needsUi && aiTranslate.translatedByKey == null}
            isTranslating={aiTranslate.loading}
            onTranslate={() => {
              const s = parseHoroscopeSections(report.result);
              if (s) void aiTranslate.translateSections(s);
            }}
          />
        ) : null}

        <ReportContent
          result={report.result}
          translatedByKey={aiTranslate.translatedByKey}
        />
      </div>
    </div>
  );
}
