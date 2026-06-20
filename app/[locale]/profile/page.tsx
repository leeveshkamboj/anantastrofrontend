'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useAuth } from '@/store/hooks/useAuth';
import { Container } from '@/components/layout/Container';
import { ProfileHeroSection } from '@/components/profile';
import {
  SettingsSidebar,
  BasicInfoTab,
  KundliProfileTab,
  ManagePasswordTab,
  type ProfileTab,
} from '@/components/settings';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic');

  const { data: profileData, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const profile = profileData?.data;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-astro-purple" />
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900">
      <ProfileHeroSection
        name={profile?.name}
        email={profile?.email}
        profileImage={profile?.profileImage}
      />

      <section className="bg-gray-50/80 px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="min-w-0 flex-1">
              {activeTab === 'basic' && <BasicInfoTab />}
              {activeTab === 'kundli' && <KundliProfileTab />}
              {activeTab === 'password' && <ManagePasswordTab />}
            </main>
          </div>
        </Container>
      </section>
    </div>
  );
}
