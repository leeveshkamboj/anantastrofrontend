'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AstrologerSidebar } from '@/components/astrologer/Sidebar';

export default function AstrologerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegisterRoute = pathname?.startsWith('/astrologer/register');
  
  // Prevent body scrolling when in dashboard
  useEffect(() => {
    if (!isRegisterRoute) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isRegisterRoute]);
  
  // Register route doesn't require astrologer status (users are applying to become astrologers)
  if (isRegisterRoute) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute requireAstrologer={true}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <AstrologerSidebar />
        <main className="flex-1 ml-64 bg-gray-50 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-8 py-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
