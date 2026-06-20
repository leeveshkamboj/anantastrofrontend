'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ServiceHeroSection } from '@/components/services';

export function HoroscopeHero() {
  const th = useTranslations('services.horoscope');
  const tFeatures = useTranslations('home.features');

  return (
    <ServiceHeroSection
      badge={tFeatures('horoscope')}
      title={th('title')}
      subtitle={th('heroSubtitle')}
      subtitle2={th('heroSubtitle2')}
      icon={Sparkles}
      spritePosition="top-right"
    />
  );
}
