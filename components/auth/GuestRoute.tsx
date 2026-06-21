'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectSessionChecked,
  selectUserRole,
} from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/api/authApi';

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionChecked = useSelector(selectSessionChecked);
  const userRole = useSelector(selectUserRole);

  const { isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isProfileLoading || !sessionChecked) {
      return;
    }

    setHasChecked(true);

    if (isAuthenticated) {
      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, userRole, router, isProfileLoading, sessionChecked]);

  if (!hasChecked || isProfileLoading || !sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
