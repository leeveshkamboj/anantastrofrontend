'use client';

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CelestialBackground } from '@/components/CelestialBackground';
import { useTranslations } from 'next-intl';

export default function VerifyEmailSuccessPage() {
  const t = useTranslations('auth');

  return (
    <CelestialBackground className="flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{t('verifySuccess.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('verifySuccess.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button asChild className="w-full bg-primary hover:bg-[#d6682a] text-white">
              <Link href="/auth/login">{t('verifySuccess.signIn')}</Link>
            </Button>
            <Link href="/" className="text-sm text-primary hover:underline">
              {t('verifySuccess.backHome')}
            </Link>
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
