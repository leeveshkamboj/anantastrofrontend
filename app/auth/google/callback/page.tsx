'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/store/hooks/useAuth';
import { setToken } from '@/lib/auth';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { refetchProfile } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error(error || 'Authentication failed');
        router.push('/auth/login');
        return;
      }

      if (token) {
        setToken(token);
        // Fetch user profile to update auth state
        try {
          const profileResult = await refetchProfile();
          
          // Ensure Redux state is updated with user data
          if (profileResult?.data?.data) {
            dispatch(setCredentials({
              user: profileResult.data.data,
              token: token,
            }));
          }
          
          toast.success('Successfully signed in with Google!');
          
          // Redirect admin users to admin dashboard
          const userData = profileResult?.data?.data;
          if (userData?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          return;
        } catch (err) {
          console.error('Profile fetch error:', err);
          // If profile fetch fails, still redirect (token is set)
          toast.success('Successfully signed in with Google!');
          router.push('/');
        }
      } else {
        toast.error('Authentication failed');
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [searchParams, router, refetchProfile, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading...</h2>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}

