'use client';

import { useEffect } from 'react';
import { Link } from "@/i18n/navigation";
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import { CoinGlyph } from './CoinGlyph';
import { cn } from '@/lib/utils';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

export function CoinNavPill({ className }: { className?: string }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isFetching, refetch } = useGetMyWalletQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const balance = data?.data?.balance;

  useEffect(() => {
    if (!isAuthenticated) return;
    const wsBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const socket = io(`${wsBase}/realtime`, { withCredentials: true });
    const onBalanceUpdate = () => {
      void refetch();
    };
    socket.on('wallet:balanceUpdated', onBalanceUpdate);
    return () => {
      socket.off('wallet:balanceUpdated', onBalanceUpdate);
      socket.disconnect();
    };
  }, [isAuthenticated, refetch]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/wallet"
      className={cn(
        "link-reset inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-white",
        className
      )}
    >
      <CoinGlyph className="h-4 w-4 text-astro-orange" />
      <span className="tabular-nums">{isFetching && balance == null ? '…' : (balance ?? '—')}</span>
    </Link>
  );
}
