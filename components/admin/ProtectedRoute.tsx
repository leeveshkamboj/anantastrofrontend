'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "@/i18n/navigation";
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectSessionChecked,
  selectUserRole,
} from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useGetMyProfileQuery } from '@/store/api/astrologerProfileApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAstrologer?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAstrologer = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionChecked = useSelector(selectSessionChecked);
  const userRole = useSelector(selectUserRole);

  const { isLoading: isProfileLoading, isError } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: astrologerProfile, isLoading: isAstrologerProfileLoading } = useGetMyProfileQuery(
    undefined,
    {
      skip: !requireAstrologer || !isAuthenticated || userRole !== 'astrologer',
    },
  );

  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isProfileLoading || !sessionChecked || (requireAstrologer && isAstrologerProfileLoading)) {
      return;
    }

    if (isError || !isAuthenticated) {
      setHasChecked(true);
      router.push('/auth/login');
      return;
    }

    if (requireAdmin && userRole !== 'admin') {
      setHasChecked(true);
      router.push('/');
      return;
    }

    if (requireAstrologer) {
      if (userRole !== 'astrologer') {
        setHasChecked(true);
        router.push('/');
        return;
      }
      if (astrologerProfile?.data && !astrologerProfile.data.isActive) {
        setHasChecked(true);
        router.push('/?error=account_deactivated');
        return;
      }
    }

    setHasChecked(true);
  }, [
    isAuthenticated,
    userRole,
    router,
    requireAdmin,
    requireAstrologer,
    isProfileLoading,
    isAstrologerProfileLoading,
    isError,
    sessionChecked,
    astrologerProfile,
  ]);

  if (
    !hasChecked ||
    isProfileLoading ||
    !sessionChecked ||
    (requireAstrologer && isAstrologerProfileLoading)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (requireAdmin && userRole !== 'admin') ||
    (requireAstrologer && userRole !== 'astrologer')
  ) {
    return null;
  }

  if (requireAstrologer && astrologerProfile?.data && !astrologerProfile.data.isActive) {
    return null;
  }

  return <>{children}</>;
}
