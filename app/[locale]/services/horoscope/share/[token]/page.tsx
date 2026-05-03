'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useGetHoroscopeByShareTokenQuery } from '@/store/api/kundliApi';
import type {
  HoroscopeReportResponse,
  HoroscopeResult,
} from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from "@/i18n/navigation";

const SECTION_KEYS: { key: keyof HoroscopeResult; labelKey: 'sectionOverview' | 'sectionCareer' | 'sectionHealth' | 'sectionRelationships' | 'sectionFinance' | 'sectionRemedies' }[] = [
  { key: 'overview', labelKey: 'sectionOverview' },
  { key: 'career', labelKey: 'sectionCareer' },
  { key: 'health', labelKey: 'sectionHealth' },
  { key: 'relationships', labelKey: 'sectionRelationships' },
  { key: 'finance', labelKey: 'sectionFinance' },
  { key: 'remedies', labelKey: 'sectionRemedies' },
];

function ReportContent({ result }: { result: HoroscopeResult | Record<string, unknown> | null }) {
  const t = useTranslations('results.horoscope');
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, string | undefined>;
  return (
    <div className="space-y-6">
      {SECTION_KEYS.map(({ key, labelKey }) => {
        const text = r[key] ?? r[key.charAt(0).toUpperCase() + key.slice(1)];
        if (!text?.trim()) return null;
        return (
          <Card key={key} className="border border-gray-200">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t(labelKey)}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function HoroscopeSharePage() {
  const t = useTranslations('shareView.horoscope');
  const th = useTranslations('results.horoscope');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const { data, isLoading, isError } = useGetHoroscopeByShareTokenQuery(token, { skip: !token });
  const report = (data as HoroscopeReportResponse | undefined)?.data;

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
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('reportTitle')}</h1>
            <p className="text-gray-600 text-sm capitalize">
              {t('sharedPeriodLine', {
                period: (() => {
                  const pl = (report.period ?? '').toLowerCase();
                  if (pl === 'daily') return th('periodDaily');
                  if (pl === 'weekly') return th('periodWeekly');
                  if (pl === 'monthly') return th('periodMonthly');
                  return report.period ?? '';
                })(),
              })}
            </p>
          </div>
        </div>

        <Card className="border border-gray-200 mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {report.name || th('birthDetails')}
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

        <ReportContent result={report.result} />

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/services/horoscope">{t('ctaOwn')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
