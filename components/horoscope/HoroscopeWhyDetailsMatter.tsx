'use client';

import { useTranslations } from 'next-intl';
import { ServiceFeatureCardsSection } from '@/components/services';

export function HoroscopeWhyDetailsMatter() {
  const t = useTranslations('services.horoscope.whyDetails');
  return (
    <ServiceFeatureCardsSection
      eyebrow="Accuracy"
      title={t('title')}
      subtitle={t('subtitle')}
      features={[
        { title: t('dateTitle'), description: t('dateDesc') },
        { title: t('timeTitle'), description: t('timeDesc') },
        { title: t('placeTitle'), description: t('placeDesc') },
      ]}
    />
  );
}
