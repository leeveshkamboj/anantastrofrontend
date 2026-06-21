'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useGetMyKundlisQuery } from '@/store/api/kundliApi';
import type { Kundli } from '@/store/api/kundliApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { serviceFormCardClassName } from '@/components/services';
import { KundliProfileManageDialogs, KundliProfileRow } from '@/components/settings/KundliProfileManage';
import { BookOpen, Loader2 } from 'lucide-react';

export function KundliProfileTab() {
  const tk = useTranslations('settingsKundli');
  const tc = useTranslations('commonUi');
  const { data: kundlisData, isLoading } = useGetMyKundlisQuery();
  const kundlis = kundlisData?.data ?? [];
  const [editProfile, setEditProfile] = useState<Kundli | null>(null);
  const [deleteProfile, setDeleteProfile] = useState<Kundli | null>(null);

  return (
    <>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-astro-purple" />
              {tk('loading')}
            </div>
          ) : kundlis.length === 0 ? (
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
                <KundliProfileRow
                  key={k.id}
                  profile={k}
                  dobPrefix={tk('dob')}
                  onEdit={setEditProfile}
                  onDelete={setDeleteProfile}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <KundliProfileManageDialogs
        editProfile={editProfile}
        deleteProfile={deleteProfile}
        onCloseEdit={() => setEditProfile(null)}
        onCloseDelete={() => setDeleteProfile(null)}
      />
    </>
  );
}
