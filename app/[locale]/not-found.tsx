'use client';

import { Link } from "@/i18n/navigation";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowRight } from 'lucide-react';
import { CelestialBackground } from '@/components/CelestialBackground';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <CelestialBackground className="flex items-cente justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center">
            <div className="text-9xl font-bold text-primary opacity-20 mb-4">404</div>
            <CardTitle className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {t('description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                className="bg-primary hover:bg-[#d6682a] text-white px-8 py-6 text-lg"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {t('returnHome')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
              >
                <Link href="/services/ai-reports" className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  {t('exploreServices')}
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4 text-center">{t('quickLinks')}</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/about" className="text-primary hover:underline">
                  {tFooter('aboutUs')}
                </Link>
                <Link href="/contact" className="text-primary hover:underline">
                  {tNav('contact')}
                </Link>
                <Link href="/astrologers" className="text-primary hover:underline">
                  {tNav('astrologers')}
                </Link>
                <Link href="/pricing" className="text-primary hover:underline">
                  {tNav('pricing')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
