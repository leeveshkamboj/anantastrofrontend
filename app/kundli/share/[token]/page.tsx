'use client';

import { useParams } from 'next/navigation';
import { useGetKundliByShareTokenQuery } from '@/store/api/kundliApi';
import type { KundliGenerationResponse } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { KundliResultContent } from '../../result/KundliResultContent';

export default function KundliSharePage() {
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const result = useGetKundliByShareTokenQuery(token, {
    skip: !token,
  });
  const data = result.data as KundliGenerationResponse | undefined;
  const { isLoading, isError } = result;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Invalid share link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading shared kundli…</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">This link is invalid or has been disabled.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gen = data.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shared Kundli</h1>
            <p className="text-gray-600 text-sm">
              DOB: {gen.dob} • Time: {gen.time}
            </p>
          </div>
        </div>

        <KundliResultContent gen={gen} />
      </div>
    </div>
  );
}
