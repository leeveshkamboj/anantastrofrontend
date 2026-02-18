'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetMyKundliGenerationsQuery } from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Loader2, BookOpen } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetMyKundliGenerationsQuery(
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

  const reports = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Reports</h1>
              <p className="text-gray-600 text-sm mt-0.5">
                Your completed kundli reports and interpretations
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/kundli/generate" className="gap-2">
              <BookOpen className="h-4 w-4" />
              New Kundli Report
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h2>
              <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                Generate your first kundli to get a personalized chart and AI-powered interpretation report.
              </p>
              <Button asChild>
                <Link href="/kundli/generate" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Create Kundli Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Link key={report.uuid} href={`/kundli/result/${report.uuid}`}>
                <Card className="group transition-shadow hover:shadow-md cursor-pointer h-full">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {report.name || 'Kundli Report'}
                        </h3>
                        <dl className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="sr-only">Date of birth</dt>
                            <dd>{report.dob}</dd>
                            <span aria-hidden>·</span>
                            <dt className="sr-only">Time</dt>
                            <dd>{report.time}</dd>
                          </div>
                          {report.placeOfBirth && (
                            <div>
                              <dt className="sr-only">Place</dt>
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
      </div>
    </div>
  );
}
