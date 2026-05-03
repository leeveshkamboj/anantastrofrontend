'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useGetMatchmakingByShareTokenQuery } from '@/store/api/kundliApi';
import type { MatchmakingReportResponse } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, User, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Link } from "@/i18n/navigation";
import { MatchmakingResult, MatchmakingPartnerKundlis } from '@/components/matchmaking';

export default function MatchmakingSharePage() {
  const t = useTranslations('shareView.matchmaking');
  const tr = useTranslations('results.matchmaking');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const { data, isLoading, isError } = useGetMatchmakingByShareTokenQuery(token, { skip: !token });
  const report = (data as MatchmakingReportResponse | undefined)?.data;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('invalidOrMissing')}</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/">{tc('goHome')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600">{t('loadingReport')}</p>
      </div>
    );
  }

  if (isError || !report || report.status !== 'COMPLETED' || !report.result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">{t('disabled')}</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/">{tc('goHome')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('reportTitle')}</h1>
            <p className="text-gray-600 text-sm">{t('subtitleShared')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{report.partner1Name || tr('partner1')}</h3>
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
                <h3 className="text-lg font-semibold text-gray-900">{report.partner2Name || tr('partner2')}</h3>
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
          partner1Name={report.partner1Name || tr('partner1')}
          partner2Name={report.partner2Name || tr('partner2')}
          partner1ChartData={report.partner1ChartData ?? null}
          partner2ChartData={report.partner2ChartData ?? null}
        />

        <MatchmakingResult result={report.result} />

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/services/matchmaking">{t('ctaOwn')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
