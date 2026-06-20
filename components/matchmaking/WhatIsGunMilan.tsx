'use client';

import { useTranslations } from 'next-intl';
import { ServiceInfoSection } from '@/components/services';

export function WhatIsGunMilan() {
  const t = useTranslations('services.matchmaking.whatIs');
  return (
    <ServiceInfoSection
      eyebrow="Overview"
      title={t('title')}
      paragraphs={[t('p1'), t('p2'), t('p3')]}
      aside={t('aside')}
    />
  );
}
