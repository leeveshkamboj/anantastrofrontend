'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useAuth } from '@/store/hooks/useAuth';
import { CelestialBackground } from '@/components/CelestialBackground';
import {
  SettingsSidebar,
  BasicInfoTab,
  KundliProfileTab,
  ManagePasswordTab,
  type ProfileTab,
} from '@/components/settings';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic');

  const { isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

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
      <CelestialBackground className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading profile...</div>
      </CelestialBackground>
    );
  }

  return (
    <CelestialBackground className="min-h-screen">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 max-w-6xl mx-auto">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 min-w-0">
          {activeTab === 'basic' && <BasicInfoTab />}
          {activeTab === 'kundli' && <KundliProfileTab />}
          {activeTab === 'password' && <ManagePasswordTab />}
        </main>
      </div>
    </CelestialBackground>
  );
}
