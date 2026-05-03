'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WhyDetailsMatter() {
  const t = useTranslations('services.kundli.whyDetails');
  const items = [
    { icon: Calendar, titleKey: 'dateTitle' as const, descKey: 'dateDesc' as const },
    { icon: Clock, titleKey: 'timeTitle' as const, descKey: 'timeDesc' as const },
    { icon: MapPin, titleKey: 'placeTitle' as const, descKey: 'placeDesc' as const },
  ];
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">{t('title')}</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map(({ icon: Icon, titleKey, descKey }) => (
            <Card key={titleKey} className="border-0 shadow-lg bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
