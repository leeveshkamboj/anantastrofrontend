'use client';

import { useTranslations } from 'next-intl';
import { ServiceStepsSection } from '@/components/services';

export function HowItWorks() {
  const t = useTranslations('services.kundli.howItWorks');
  const steps = [
    { step: 1, title: t('step1Title'), description: t('step1Desc') },
    { step: 2, title: t('step2Title'), description: t('step2Desc') },
    { step: 3, title: t('step3Title'), description: t('step3Desc') },
    { step: 4, title: t('step4Title'), description: t('step4Desc') },
  ];
  return (
    <ServiceStepsSection
      eyebrow="Process"
      title={t('title')}
      subtitle={t('subtitle')}
      steps={steps}
    />
  );
}
