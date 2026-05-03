'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/store/hooks/useAuth';
import { setToken } from '@/lib/auth';
import { setCredentials, setAuthToken } from '@/store/slices/authSlice';
import { selectKundliFormData } from '@/store/slices/kundliFormSlice';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function GoogleCallbackContent() {
  const t = useTranslations('auth');
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
        toast.error(error || t('googleCallback.authFailed'));
        router.push('/auth/login');
        return;
      }

      if (token) {
        setToken(token);
        dispatch(setAuthToken(token));
        try {
          const profileResult = await refetchProfile();

          if (profileResult?.data?.data) {
            dispatch(setCredentials({
              user: profileResult.data.data,
              token: token,
            }));
          }

          toast.success(t('googleCallback.success'));

          const userData = profileResult?.data?.data;
          if (userData?.role === 'admin') {
            router.push('/admin');
          } else if (kundliForm.name?.trim()) {
            router.push('/services/kundli/generate');
          } else {
            router.push('/');
          }
          return;
        } catch (err) {
          console.error('Profile fetch error:', err);
          toast.success(t('googleCallback.success'));
          router.push('/');
        }
      } else {
        toast.error(t('googleCallback.authFailed'));
        router.push('/auth/login');
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount with token from URL
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t('googleCallback.completing')}</h2>
        <p className="text-gray-600 mt-2">{t('googleCallback.pleaseWait')}</p>
      </div>
    </div>
  );
}

function GoogleCallbackFallback() {
  const t = useTranslations('auth');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t('googleCallback.loading')}</h2>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<GoogleCallbackFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
