'use client';

import { useTranslations } from 'next-intl';
import { ServiceChecklistSection } from '@/components/services';

export function WhatYouGet() {
  const t = useTranslations('services.kundli.whatYouGet');
  const itemKeys = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;
  return (
    <ServiceChecklistSection
      eyebrow="Deliverables"
      title={t('title')}
      subtitle={t('subtitle')}
      items={itemKeys.map((key) => t(key))}
    />
  );
}
