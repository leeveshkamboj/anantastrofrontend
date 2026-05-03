'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  useGetMyKundliGenerationsQuery,
  useGetMyMatchmakingReportsQuery,
  useGetMyHoroscopeReportsQuery,
} from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Loader2, BookOpen, Heart, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const t = useTranslations('reports');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: kundliData, isLoading: loadingKundli } = useGetMyKundliGenerationsQuery(
    { status: 'COMPLETED' },
    { skip: !isAuthenticated },
  );
  const { data: matchmakingData, isLoading: loadingMatchmaking } = useGetMyMatchmakingReportsQuery(
    { status: 'COMPLETED' },
    { skip: !isAuthenticated },
  );
  const { data: horoscopeData, isLoading: loadingHoroscope } = useGetMyHoroscopeReportsQuery(
    { status: 'COMPLETED' },
    { skip: !isAuthenticated },
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const kundliReports = kundliData?.data ?? [];
  const matchmakingReports = matchmakingData?.data ?? [];
  const horoscopeReports = horoscopeData?.data ?? [];
  const isLoading = loadingKundli || loadingMatchmaking || loadingHoroscope;
  const hasAny =
    kundliReports.length > 0 || matchmakingReports.length > 0 || horoscopeReports.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 text-sm mt-0.5">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="default">
              <Link href="/services/kundli/generate" className="gap-2">
                <BookOpen className="h-4 w-4" />
                {t('newKundli')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services/horoscope" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t('horoscope')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services/matchmaking" className="gap-2">
                <Heart className="h-4 w-4" />
                {t('gunMilan')}
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : !hasAny ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('emptyTitle')}</h2>
              <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">{t('emptyHint')}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/services/kundli/generate" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('ctaCreateKundli')}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/services/horoscope" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {t('ctaGetHoroscope')}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/services/matchmaking" className="gap-2">
                    <Heart className="h-4 w-4" />
                    {t('ctaCreateGunMilan')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('headingKundli')}
              </h2>
              {kundliReports.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-600 text-sm">
                    {t('kundliSectionEmpty')}{' '}
                    <Link href="/services/kundli/generate" className="text-primary font-medium hover:underline">
                      {t('kundliSectionLink')}
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {kundliReports.map((report) => (
                    <Link key={report.uuid} href={`/services/kundli/result/${report.uuid}`}>
                      <Card className="group transition-shadow hover:shadow-md cursor-pointer h-full">
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {report.name || t('fallbackKundliTitle')}
                              </h3>
                              <dl className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex flex-wrap gap-x-2">
                                  <dt className="sr-only">{t('srDob')}</dt>
                                  <dd>{report.dob}</dd>
                                  <span aria-hidden>·</span>
                                  <dt className="sr-only">{t('srTime')}</dt>
                                  <dd>{report.time}</dd>
                                </div>
                                {report.placeOfBirth && (
                                  <div>
                                    <dt className="sr-only">{t('srPlace')}</dt>
                                    <dd className="truncate">{report.placeOfBirth}</dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('headingHoroscope')}
              </h2>
              {horoscopeReports.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-600 text-sm">
                    {t('horoscopeSectionEmpty')}{' '}
                    <Link href="/services/horoscope" className="text-primary font-medium hover:underline">
                      {t('horoscopeSectionLink')}
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {horoscopeReports.map((report) => (
                    <Link key={report.uuid} href={`/services/horoscope/result/${report.uuid}`}>
                      <Card className="group transition-shadow hover:shadow-md cursor-pointer h-full">
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {report.name || t('fallbackHoroscopeTitle')}
                              </h3>
                              <dl className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex flex-wrap gap-x-2 capitalize">
                                  <dd>{report.period}</dd>
                                  <span aria-hidden>·</span>
                                  <dd>{report.dob}</dd>
                                </div>
                                {report.placeOfBirth && (
                                  <div>
                                    <dt className="sr-only">{t('srPlace')}</dt>
                                    <dd className="truncate">{report.placeOfBirth}</dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                {t('headingGunMilan')}
              </h2>
              {matchmakingReports.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-600 text-sm">
                    {t('gunMilanSectionEmpty')}{' '}
                    <Link href="/services/matchmaking" className="text-primary font-medium hover:underline">
                      {t('gunMilanSectionLink')}
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {matchmakingReports.map((report) => (
                    <Link key={report.uuid} href={`/services/matchmaking/result/${report.uuid}`}>
                      <Card className="group transition-shadow hover:shadow-md cursor-pointer h-full">
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {report.partner1Name && report.partner2Name
                                  ? `${report.partner1Name} & ${report.partner2Name}`
                                  : t('fallbackGunMilanTitle')}
                              </h3>
                              <dl className="mt-2 space-y-1 text-sm text-gray-600">
                                {report.result != null && (
                                  <div className="flex flex-wrap gap-x-2">
                                    <dd>
                                      {t('scoreLine', {
                                        score: report.result.totalPoints,
                                        max: report.result.maxPoints,
                                        pct: report.result.percentage,
                                      })}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
