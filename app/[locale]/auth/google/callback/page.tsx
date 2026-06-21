'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/store/hooks/useAuth';
import { setCredentials } from '@/store/slices/authSlice';
import { selectKundliFormData } from '@/store/slices/kundliFormSlice';
import {
  useExchangeOAuthCodeMutation,
  useEstablishSessionMutation,
} from '@/store/api/authApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function GoogleCallbackContent() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const kundliForm = useSelector(selectKundliFormData);
  const { refetchProfile } = useAuth();
  const [exchangeOAuthCode] = useExchangeOAuthCodeMutation();
  const [establishSession] = useEstablishSessionMutation();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const legacyToken = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error(error || t('googleCallback.authFailed'));
        router.push('/auth/login');
        return;
      }

      try {
        if (code) {
          await exchangeOAuthCode({ code }).unwrap();
        } else if (legacyToken) {
          await establishSession({ token: legacyToken }).unwrap();
        } else {
          toast.error(t('googleCallback.authFailed'));
          router.push('/auth/login');
          return;
        }

        const profileResult = await refetchProfile();
        if (profileResult?.data?.data) {
          dispatch(setCredentials({ user: profileResult.data.data }));
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
      } catch (err) {
        console.error('OAuth callback error:', err);
        toast.error(t('googleCallback.authFailed'));
        router.push('/auth/login');
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount with code from URL
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
