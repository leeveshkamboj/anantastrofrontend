'use client';

import { User, Lock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProfileTab = 'basic' | 'kundli' | 'password';

const TABS: { id: ProfileTab; label: string; icon: typeof User }[] = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'kundli', label: 'Kundli Profile', icon: BookOpen },
  { id: 'password', label: 'Manage Password', icon: Lock },
];

type SettingsSidebarProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
};

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav className="bg-white/95 border-0 shadow-xl rounded-xl p-2 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-700 hover:bg-primary/10 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
