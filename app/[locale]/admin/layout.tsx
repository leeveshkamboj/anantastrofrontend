'use client';

import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Sidebar } from '@/components/admin/Sidebar';
import { FadeIn } from '@/components/motion/FadeIn';
import { MotionProvider } from '@/components/motion/MotionProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prevent body scrolling when in dashboard
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-64 bg-gray-50 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-8 py-6">
              <MotionProvider tier="instrument">
                <FadeIn preset="fadeIn" inView={false}>
                  {children}
                </FadeIn>
              </MotionProvider>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
