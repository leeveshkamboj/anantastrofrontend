'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MatchmakingWhatYouGet() {
  const t = useTranslations('services.matchmaking.whatYouGet');
  const itemKeys = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">{t('title')}</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">{t('subtitle')}</p>
        <ul className="max-w-2xl mx-auto space-y-4">
          {itemKeys.map((key, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span className="text-gray-700 text-lg">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
