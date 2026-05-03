'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MatchmakingFinalCta() {
  const t = useTranslations('services.matchmaking.finalCta');
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-primary/5 border-t border-primary/10">
      <div className="max-w-3xl mx-auto text-center">
        <Star className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-6">{t('subtitle')}</p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          size="lg"
        >
          <a href="#get-matchmaking">{t('button')}</a>
        </Button>
      </div>
    </section>
  );
}
