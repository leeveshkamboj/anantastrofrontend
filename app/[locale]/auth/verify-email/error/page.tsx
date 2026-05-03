'use client';

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CelestialBackground } from '@/components/CelestialBackground';
import { useTranslations } from 'next-intl';

export default function VerifyEmailErrorPage() {
  const t = useTranslations('auth');

  return (
    <CelestialBackground className="flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-600">{t('verifyError.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('verifyError.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">{t('verifyError.goToSignIn')}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/register">{t('verifyError.register')}</Link>
            </Button>
            <Link href="/" className="text-sm text-primary hover:underline">
              {t('verifyError.backHome')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
