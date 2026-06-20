'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  useGetMyKundliGenerationsQuery,
  useGetMyMatchmakingReportsQuery,
  useGetMyHoroscopeReportsQuery,
} from '@/store/api/kundliApi';
import { useAuth } from '@/store/hooks/useAuth';
import { ReportsHeroSection, ReportsListSection } from '@/components/reports';

export default function ReportsPage() {
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

  return (
    <div className="bg-white text-gray-900">
      <ReportsHeroSection />
      <ReportsListSection
        kundliReports={kundliReports}
        horoscopeReports={horoscopeReports}
        matchmakingReports={matchmakingReports}
        isLoading={isLoading}
      />
    </div>
  );
}
