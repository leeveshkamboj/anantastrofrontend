'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import { useVerifyEmailMutation } from '@/store/api/authApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthPageBrand } from '@/components/auth/AuthPageBrand';
import { CelestialBackground } from '@/components/CelestialBackground';
import { FadeIn } from '@/components/motion/FadeIn';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { useMotion } from '@/components/motion/MotionProvider';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

function VerifyEmailContent({
  isSuccess,
  isError,
  done,
}: {
  isSuccess: boolean;
  isError: boolean;
  done: boolean;
}) {
  const t = useTranslations('auth');
  const { reduced } = useMotion();

  return (
    <Card className="w-full shadow-2xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isSuccess || done ? t('verifyFlow.titleVerified') : t('verifyFlow.titleVerifying')}
        </CardTitle>
        <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.1}>
          <CardDescription className="text-center">
            {isSuccess || done
              ? t('verifyFlow.redirecting')
              : t('verifyFlow.waitMessage')}
          </CardDescription>
        </FadeIn>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {!isError && (
          <FadeIn preset="scaleIn" inView={false} delay={reduced ? 0 : 0.05}>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>{t('verifyFlow.spinner')}</span>
            </div>
          </FadeIn>
        )}
        {isError && (
          <>
            <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.1}>
              <p className="text-sm text-red-600 text-center">
                {t('verifyFlow.failedMessage')}
              </p>
            </FadeIn>
            <Link href="/auth/login" className="text-sm text-primary hover:underline">
              {t('verifyFlow.goToSignIn')}
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [verifyEmail, { isSuccess, isError }] = useVerifyEmailMutation();
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!token?.trim()) {
      router.replace('/auth/verify-email/error');
      return;
    }
    started.current = true;
    verifyEmail({ token: token.trim() })
      .unwrap()
      .then(() => {
        setDone(true);
        router.replace('/');
      })
      .catch(() => {
        setDone(true);
        router.replace('/auth/verify-email/error');
      });
  }, [token, router, verifyEmail]);

  return (
    <MotionProvider tier="auth">
      <CelestialBackground className="flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
        <div className="w-full max-w-lg mx-auto">
          <AuthPageBrand />
          <FadeIn preset="scaleIn" inView={false}>
            <VerifyEmailContent isSuccess={isSuccess} isError={isError} done={done} />
          </FadeIn>
        </div>
      </CelestialBackground>
    </MotionProvider>
  );
}
