'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useGetMyKundlisQuery } from '@/store/api/kundliApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { serviceFormCardClassName } from '@/components/services';
import { BookOpen } from 'lucide-react';

export function KundliProfileTab() {
  const tk = useTranslations('settingsKundli');
  const tc = useTranslations('commonUi');
  const { data: kundlisData } = useGetMyKundlisQuery();
  const kundlis = kundlisData?.data ?? [];

  return (
    <Card className={serviceFormCardClassName}>
      <div
        className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
        aria-hidden="true"
      />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
          <BookOpen className="h-5 w-5 text-astro-orange" />
          {tk('title')}
        </CardTitle>
        <CardDescription>{tk('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {kundlis.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 py-10 text-center text-gray-500">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-astro-purple/25" />
            <p className="font-semibold text-gray-800">{tk('emptyTitle')}</p>
            <p className="mt-1 text-sm">{tk('emptyHint')}</p>
            <CosmicButton asChild variant="outline" className="mt-4">
              <Link href="/">{tc('goHome')}</Link>
            </CosmicButton>
          </div>
        ) : (
          <ul className="space-y-3">
            {kundlis.map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-transparent bg-gray-50 px-4 py-3.5 transition-colors hover:border-astro-purple/10 hover:bg-white"
              >
                <div>
                  <p className="font-medium text-gray-900">{k.name}</p>
                  <p className="text-sm text-gray-500">
                    {k.gender && `${k.gender === 'Female' ? tk('genderFemale') : tk('genderMale')}`}
                    {k.gender && (k.dateOfBirth || k.timeOfBirth || k.placeOfBirth) && ' • '}
                    {k.dateOfBirth && `${tk('dob')} ${k.dateOfBirth}`}
                    {k.timeOfBirth && ` • ${tk('time')} ${k.timeOfBirth}`}
                    {k.placeOfBirth && ` • ${k.placeOfBirth}`}
                    {k.timezoneOffsetHours != null && !Number.isNaN(Number(k.timezoneOffsetHours)) && (() => {
                      const h = Number(k.timezoneOffsetHours);
                      const sign = h >= 0 ? '+' : '-';
                      const abs = Math.abs(h);
                      const hrs = Math.floor(abs);
                      const mins = Math.round((abs - hrs) * 60);
                      const tzStr = mins ? `GMT${sign}${hrs}:${mins.toString().padStart(2, '0')}` : `GMT${sign}${hrs}:00`;
                      return <span> • {tzStr}</span>;
                    })()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
