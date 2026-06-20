'use client';

import { useTranslations } from 'next-intl';
import { User, Lock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProfileTab = 'basic' | 'kundli' | 'password';

const TABS: { id: ProfileTab; labelKey: 'basic' | 'kundli' | 'password'; icon: typeof User }[] = [
  { id: 'basic', labelKey: 'basic', icon: User },
  { id: 'kundli', labelKey: 'kundli', icon: BookOpen },
  { id: 'password', labelKey: 'password', icon: Lock },
];

type SettingsSidebarProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const t = useTranslations('settingsSidebar');
  return (
    <aside className="w-full shrink-0 md:w-72">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md">
        <div
          className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
          aria-hidden="true"
        />
        <nav className="space-y-1 p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-astro-purple text-white shadow-sm'
                    : 'text-gray-700 hover:bg-astro-purple/10 hover:text-gray-900',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
