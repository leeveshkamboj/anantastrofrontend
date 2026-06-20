'use client';

import { useTranslations } from 'next-intl';
import { ServiceFaqSection } from '@/components/services';

export function MatchmakingFaq() {
  const t = useTranslations('services.matchmaking.faq');
  const pairs = [
    { q: 'q1' as const, a: 'a1' as const },
    { q: 'q2' as const, a: 'a2' as const },
    { q: 'q3' as const, a: 'a3' as const },
    { q: 'q4' as const, a: 'a4' as const },
  ];
  return (
    <ServiceFaqSection
      eyebrow="FAQ"
      title={t('title')}
      subtitle={t('subtitle')}
      items={pairs.map(({ q, a }) => ({ question: t(q), answer: t(a) }))}
    />
  );
}
