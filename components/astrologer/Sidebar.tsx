'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMyProfileQuery } from '@/store/api/astrologerProfileApi';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/astrologer',
    icon: LayoutDashboard,
  },
  {
    title: 'My Profile',
    href: '/astrologer/profile',
    icon: User,
  },
  {
    title: 'Services & Pricing',
    href: '/astrologer/services',
    icon: DollarSign,
  },
  {
    title: 'Settings',
    href: '/astrologer/settings',
    icon: Settings,
  },
];

export function AstrologerSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();
  const { data: profileData } = useGetMyProfileQuery();

  const unreadCount = profileData?.data?.unreadNotificationsCount || 0;

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      router.push('/auth/login');
    } catch (error) {
      // Even if logout fails, clear local state
      dispatch(logout());
      router.push('/auth/login');
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
        <h1 className="text-xl font-bold text-gray-900">AnantAstro</h1>
        <p className="text-xs text-gray-600 mt-1 font-medium">Astrologer Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          );
        })}
        {unreadCount > 0 && (
          <div className="px-4 py-2.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 font-medium mt-3 shadow-sm">
            <span className="text-base">🔔</span>
            <span>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
