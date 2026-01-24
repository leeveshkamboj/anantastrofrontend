'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/api/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Always fetch profile if we have a token (handles refresh case)
  const { isLoading: isProfileLoading, isError } = useGetProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for profile query to complete
    if (isProfileLoading) {
      return;
    }

    // If we have a token but profile fetch failed, user is not authenticated
    if (token && isError) {
      setHasChecked(true);
      router.push('/auth/login');
      return;
    }

    // If no token, redirect to login
    if (!token) {
      setHasChecked(true);
      router.push('/auth/login');
      return;
    }

    // Wait a bit for Redux state to update after profile fetch
    const timer = setTimeout(() => {
      setHasChecked(true);
      
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      if (requireAdmin && userRole !== 'admin') {
        router.push('/');
        return;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, userRole, router, requireAdmin, isProfileLoading, isError, token]);

  // Show loading state while checking auth
  if (!hasChecked || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin (redirect is in progress)
  if (!isAuthenticated || (requireAdmin && userRole !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
