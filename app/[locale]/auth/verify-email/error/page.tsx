'use client';

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthPageBrand } from '@/components/auth/AuthPageBrand';
import { CelestialBackground } from '@/components/CelestialBackground';
import { FadeIn } from '@/components/motion/FadeIn';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { useMotion } from '@/components/motion/MotionProvider';
import { XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

function VerifyEmailErrorContent() {
  const t = useTranslations('auth');
  const { reduced } = useMotion();

  return (
    <FadeIn preset="scaleIn" inView={false}>
      <Card className="w-full shadow-2xl border-0 bg-white">
        <CardHeader>
          <FadeIn preset="scaleIn" inView={false} delay={reduced ? 0 : 0.1} className="flex justify-center mb-2">
            <XCircle className="h-14 w-14 text-red-500" aria-hidden="true" />
          </FadeIn>
          <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.15}>
            <CardTitle className="text-2xl font-bold text-center text-red-600">{t('verifyError.title')}</CardTitle>
          </FadeIn>
          <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.2}>
            <CardDescription className="text-center">
              {t('verifyError.description')}
            </CardDescription>
          </FadeIn>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.25} className="w-full space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">{t('verifyError.goToSignIn')}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/register">{t('verifyError.register')}</Link>
            </Button>
          </FadeIn>
          <Link href="/" className="text-sm text-primary hover:underline">
            {t('verifyError.backHome')}
          </Link>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default function VerifyEmailErrorPage() {
  return (
    <MotionProvider tier="auth">
      <CelestialBackground className="flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
        <div className="w-full max-w-lg mx-auto">
          <AuthPageBrand />
          <VerifyEmailErrorContent />
        </div>
      </CelestialBackground>
    </MotionProvider>
  );
}
