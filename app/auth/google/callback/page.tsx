'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/store/hooks/useAuth';
import { setToken } from '@/lib/auth';
import { setCredentials, setAuthToken } from '@/store/slices/authSlice';
import { selectKundliFormData } from '@/store/slices/kundliFormSlice';
import { toast } from 'sonner';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const kundliForm = useSelector(selectKundliFormData);
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
        // Put token in Redux so baseApi sends it with the profile request
        dispatch(setAuthToken(token));
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
          } else if (kundliForm.name?.trim()) {
            // Came from hero kundli form: go to kundli generation page
            router.push('/kundli/generate');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount with token from URL
  }, [searchParams]);

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

