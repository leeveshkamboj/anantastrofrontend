'use client';

import { useParams } from 'next/navigation';
import { useGetHoroscopeByShareTokenQuery } from '@/store/api/kundliApi';
import type {
  HoroscopeReportResponse,
  HoroscopeResult,
} from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const SECTIONS: { key: keyof HoroscopeResult; title: string }[] = [
  { key: 'overview', title: 'Overview' },
  { key: 'career', title: 'Career' },
  { key: 'health', title: 'Health' },
  { key: 'relationships', title: 'Relationships' },
  { key: 'finance', title: 'Finance' },
  { key: 'remedies', title: 'Remedies' },
];

function ReportContent({ result }: { result: HoroscopeResult | Record<string, unknown> | null }) {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, string | undefined>;
  return (
    <div className="space-y-6">
      {SECTIONS.map(({ key, title }) => {
        const text = r[key] ?? r[key.charAt(0).toUpperCase() + key.slice(1)];
        if (!text?.trim()) return null;
        return (
          <Card key={key} className="border border-gray-200">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function HoroscopeSharePage() {
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
            <p className="text-gray-600">Invalid or missing share link.</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/">Go to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600">Loading shared report…</p>
      </div>
    );
  }

  if (isError || !report || report.status !== 'COMPLETED' || !report.result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">This link is invalid or has been disabled.</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/">Go to home</Link>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Horoscope Report</h1>
            <p className="text-gray-600 text-sm capitalize">{report.period} prediction (shared)</p>
          </div>
        </div>

        <Card className="border border-gray-200 mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {report.name || 'Birth details'}
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
            <Link href="/services/horoscope">Get your own horoscope</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
