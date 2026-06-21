'use client';

import { usePathname } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  impersonationChatMainTopClass,
  impersonationMainMinHeightClass,
  impersonationMainTopPaddingClass,
} from '@/lib/impersonation-layout';
import { cn } from '@/lib/utils';
import { selectIsImpersonating } from '@/store/slices/authSlice';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isImpersonating = useSelector(selectIsImpersonating);
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAstrologerRoute = pathname === '/astrologer' || pathname?.startsWith('/astrologer/');
  const isRegisterRoute = pathname?.startsWith('/astrologer/register');
  const isChatRoute = pathname?.startsWith('/chat');

  // Don't show Navbar and Footer for admin routes or astrologer dashboard routes
  // But show them for astrologer registration routes
  if (isAdminRoute || (isAstrologerRoute && !isRegisterRoute)) {
    return <>{children}</>;
  }

  if (isChatRoute) {
    return (
      <>
        <Navbar />
        <main
          className={cn(
            'fixed inset-x-0 bottom-0 overflow-hidden bg-gray-50/80',
            isImpersonating ? impersonationChatMainTopClass : 'top-16',
          )}
        >
          {children}
        </main>
      </>
    );
  }

  // Show Navbar and Footer for regular routes
  return (
    <>
      <Navbar />
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] pt-16',
          isImpersonating && `${impersonationMainTopPaddingClass} ${impersonationMainMinHeightClass}`,
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
