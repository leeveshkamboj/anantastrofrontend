'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/store/hooks/useAuth';
import {
  useGetMyWalletQuery,
  useGetMyCoinTransactionsQuery,
  useGetMyPaymentHistoryQuery,
} from '@/store/api/coinsApi';
import {
  WalletHeroSection,
  WalletLowBalanceBanner,
  WalletQuickActionsSection,
  WalletHistorySection,
  WalletBottomSection,
} from '@/components/wallet';

export default function WalletPage() {
  const tw = useTranslations('wallet');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: wallet,
    refetch: refetchWallet,
    isFetching: walletFetching,
    isLoading: walletLoading,
  } = useGetMyWalletQuery(undefined, { skip: !isAuthenticated });
  const { data: tx, isLoading: txLoading } = useGetMyCoinTransactionsQuery(
    { limit: 40 },
    { skip: !isAuthenticated },
  );
  const { data: pays, isLoading: paysLoading } = useGetMyPaymentHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });

  const humanizeReference = useCallback(
    (ref: string | null | undefined): string => {
      if (!ref) return '';
      const map: Record<string, string> = {
        razorpay_payment: tw('refPurchase'),
        kundli: tw('refKundli'),
        matchmaking: tw('refMatchmaking'),
        horoscope: tw('refHoroscope'),
        admin_adjustment: tw('refAdmin'),
      };
      return map[ref] ?? ref.replace(/_/g, ' ');
    },
    [tw],
  );

  const humanizeCoinType = useCallback(
    (type: string | null | undefined): string => {
      if (type == null || type === '') return tw('typeUnknown');
      const map: Record<string, string> = {
        PURCHASE: tw('typePurchase'),
        SIGNUP_BONUS: tw('typeSignupBonus'),
        DEBIT: tw('typeDebit'),
        REFUND: tw('typeRefund'),
        ADMIN_ADJUST: tw('typeAdminAdjust'),
      };
      return map[type] ?? type.replace(/_/g, ' ');
    },
    [tw],
  );

  const paymentStatusLabel = useCallback(
    (status: string | null | undefined): string => {
      const s = (status ?? '').toUpperCase();
      if (s === 'PAID') return tw('statusPaid');
      if (s === 'PENDING') return tw('statusPending');
      if (s === 'FAILED') return tw('statusFailed');
      return (status ?? 'unknown').toLowerCase();
    },
    [tw],
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth/login?next=${encodeURIComponent('/wallet')}`);
    }
  }, [authLoading, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const balance = wallet?.data?.balance ?? 0;
  const items = tx?.data?.items ?? [];
  const payments = pays?.data ?? [];

  return (
    <div className="bg-white text-gray-900">
      <WalletHeroSection
        balance={balance}
        isLoading={walletLoading}
        isFetching={walletFetching}
        onRefresh={() => refetchWallet()}
      />
      <WalletLowBalanceBanner balance={balance} isLoading={walletLoading} />
      <WalletQuickActionsSection />
      <WalletHistorySection
        payments={payments}
        transactions={items}
        paymentsLoading={paysLoading}
        transactionsLoading={txLoading}
        humanizeReference={humanizeReference}
        humanizeCoinType={humanizeCoinType}
        paymentStatusLabel={paymentStatusLabel}
      />
      <WalletBottomSection />
    </div>
  );
}
