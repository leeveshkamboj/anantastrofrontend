'use client';

import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ServiceHeroSection } from '@/components/services';

export function KundliGenerateHero() {
  const t = useTranslations('services.kundli.hero');
  const tFeatures = useTranslations('home.features');

  return (
    <ServiceHeroSection
      badge={tFeatures('kundli')}
      title={t('title')}
      subtitle={t('subtitle')}
      subtitle2={t('subtitle2')}
      icon={BookOpen}
      spritePosition="top-left"
    />
  );
}
