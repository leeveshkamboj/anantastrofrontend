'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WhatIsGunMilan() {
  const t = useTranslations('services.matchmaking.whatIs');
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('title')}</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">{t('p1')}</p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">{t('p2')}</p>
            <p className="text-lg text-gray-600 leading-relaxed">{t('p3')}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-primary/10 p-8 md:p-12 border border-primary/20">
              <Sparkles className="h-24 w-24 text-primary mx-auto opacity-80" />
              <p className="text-center text-gray-600 mt-4 font-medium">{t('aside')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
