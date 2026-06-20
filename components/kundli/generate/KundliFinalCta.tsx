'use client';

import { useTranslations } from 'next-intl';
import { ServiceFinalCtaSection } from '@/components/services';

export function KundliFinalCta() {
  const t = useTranslations('services.kundli.finalCta');
  return (
    <ServiceFinalCtaSection
      title={t('title')}
      subtitle={t('subtitle')}
      buttonLabel={t('button')}
      href="#get-kundli"
    />
  );
}
