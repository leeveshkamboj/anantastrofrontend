'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ServiceHeroSection } from '@/components/services';

export function MatchmakingHero() {
  const t = useTranslations('services.matchmaking.hero');
  const tFeatures = useTranslations('home.features');

  return (
    <ServiceHeroSection
      badge={tFeatures('matchmaking')}
      title={t('title')}
      subtitle={t('subtitle')}
      subtitle2={t('subtitle2')}
      icon={Heart}
      spritePosition="bottom-left"
    />
  );
}
