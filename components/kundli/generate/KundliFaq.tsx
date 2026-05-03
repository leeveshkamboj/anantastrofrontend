'use client';

import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function KundliFaq() {
  const t = useTranslations('services.kundli.faq');
  const pairs = [
    { q: 'q1' as const, a: 'a1' as const },
    { q: 'q2' as const, a: 'a2' as const },
    { q: 'q3' as const, a: 'a3' as const },
  ];
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="h-9 w-9 text-primary" />
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('subtitle')}</p>
        <div className="max-w-3xl mx-auto space-y-6">
          {pairs.map(({ q, a }, i) => (
            <Card key={i} className="border border-gray-200 bg-white">
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(q)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(a)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
