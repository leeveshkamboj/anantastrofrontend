'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAstrologerRoute = pathname?.startsWith('/astrologer');
  const isRegisterRoute = pathname?.startsWith('/astrologer/register');

  // Don't show Navbar and Footer for admin routes or astrologer dashboard routes
  // But show them for astrologer registration routes
  if (isAdminRoute || (isAstrologerRoute && !isRegisterRoute)) {
    return <>{children}</>;
  }

  // Show Navbar and Footer for regular routes
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
