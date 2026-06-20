'use client';

import { useTranslations } from 'next-intl';
import { ServiceFinalCtaSection } from '@/components/services';

export function MatchmakingFinalCta() {
  const t = useTranslations('services.matchmaking.finalCta');
  return (
    <ServiceFinalCtaSection
      title={t('title')}
      subtitle={t('subtitle')}
      buttonLabel={t('button')}
      href="#get-matchmaking"
    />
  );
}
