'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't show Navbar and Footer for admin routes
  if (isAdminRoute) {
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
