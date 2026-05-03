'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export function MatchmakingHowItWorks() {
  const t = useTranslations('services.matchmaking.howItWorks');
  const steps: { step: number; titleKey: 'step1Title' | 'step2Title' | 'step3Title' | 'step4Title'; descKey: 'step1Desc' | 'step2Desc' | 'step3Desc' | 'step4Desc' }[] = [
    { step: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
    { step: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
    { step: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
    { step: 4, titleKey: 'step4Title', descKey: 'step4Desc' },
  ];
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">{t('title')}</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, titleKey, descKey }) => (
            <Card key={step} className="border-2 border-gray-100 bg-white shadow-sm">
              <CardContent>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
