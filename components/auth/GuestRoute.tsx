'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectToken } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/api/authApi';

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const token = useSelector(selectToken);
  
  // Check profile if we have a token (handles refresh case)
  const { isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for profile query to complete
    if (isProfileLoading) {
      return;
    }

    // If we have a token, wait a bit for Redux state to update
    if (token) {
      const timer = setTimeout(() => {
        setHasChecked(true);
        
        if (isAuthenticated) {
          // Redirect admin users to admin dashboard, others to home
          if (userRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // No token, user is not authenticated, allow access
      setHasChecked(true);
    }
  }, [isAuthenticated, userRole, router, isProfileLoading, token]);

  // Show loading state while checking auth
  if (!hasChecked || (token && isProfileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (redirect is in progress)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
