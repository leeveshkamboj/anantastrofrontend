'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { useExitImpersonationMutation } from '@/store/api/authApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { impersonationBannerTopClass } from '@/lib/impersonation-layout';

export function ImpersonationBanner() {
  const t = useTranslations('admin');
  const router = useRouter();
  const user = useSelector(selectUser);
  const [exitImpersonation, { isLoading }] = useExitImpersonationMutation();

  if (!user?.impersonation?.active) {
    return null;
  }

  const handleExit = async () => {
    try {
      await exitImpersonation().unwrap();
      toast.success(t('impersonationExited'));
      router.push('/admin');
    } catch {
      toast.error(t('impersonationExitFailed'));
    }
  };

  return (
    <div
      className={`fixed inset-x-0 ${impersonationBannerTopClass} z-40 flex h-10 items-center border-b border-amber-600/30 bg-amber-400 px-4 text-sm text-amber-950 shadow-sm`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          {t('impersonationBanner', { userName: user.name })}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-amber-800/30 bg-white/80 text-amber-950 hover:bg-white"
          onClick={handleExit}
          disabled={isLoading}
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          {isLoading ? t('impersonationExiting') : t('exitImpersonation')}
        </Button>
      </div>
    </div>
  );
}
