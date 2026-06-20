'use client';

import { useTranslations } from 'next-intl';
import { ServiceInfoSection } from '@/components/services';

export function WhatIsKundli() {
  const t = useTranslations('services.kundli.whatIs');
  return (
    <ServiceInfoSection
      eyebrow="Overview"
      title={t('title')}
      paragraphs={[t('p1'), t('p2'), t('p3')]}
      aside={t('aside')}
    />
  );
}
