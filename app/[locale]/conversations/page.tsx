'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useGetMyChatSessionsQuery } from '@/store/api/chatApi';
import { useAuth } from '@/store/hooks/useAuth';
import {
  ConversationsHeroSection,
  ConversationsListSection,
} from '@/components/conversations';

export default function ConversationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetMyChatSessionsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const sessions = data?.data ?? [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const totalCoins = sessions.reduce((sum, s) => sum + (s.totalCoinsDebited ?? 0), 0);

  return (
    <div className="bg-white text-gray-900">
      <ConversationsHeroSection
        sessionCount={sessions.length}
        activeCount={activeCount}
        totalCoins={totalCoins}
      />
      <ConversationsListSection sessions={sessions} isLoading={isLoading} />
    </div>
  );
}
