'use client';

import { useTranslations } from 'next-intl';
import { ServiceFinalCtaSection } from '@/components/services';

export function HoroscopeFinalCta() {
  const t = useTranslations('services.horoscope.finalCta');
  return (
    <ServiceFinalCtaSection
      title={t('title')}
      subtitle={t('subtitle')}
      buttonLabel={t('button')}
      href="#get-horoscope"
    />
  );
}
