'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  History,
  Loader2,
  RefreshCw,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/store/hooks/useAuth';
import {
  useGetMyWalletQuery,
  useGetMyCoinTransactionsQuery,
  useGetMyPaymentHistoryQuery,
} from '@/store/api/coinsApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function formatInr(paise: number | undefined) {
  const n = Number(paise);
  if (!Number.isFinite(n)) return '—';
  const rupees = n / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    rupees,
  );
}

function paymentStatusBadgeClass(status: string | null | undefined): string {
  const s = (status ?? '').toUpperCase();
  if (s === 'PAID') {
    return 'border-transparent bg-emerald-600 text-white shadow-sm hover:bg-emerald-600';
  }
  if (s === 'PENDING') {
    return 'border-amber-300/80 bg-amber-50 text-amber-950 shadow-sm hover:bg-amber-50';
  }
  if (s === 'FAILED') {
    return 'border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-600';
  }
  return 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100';
}

function humanizeReference(ref: string | null | undefined): string {
  if (!ref) return '';
  const map: Record<string, string> = {
    razorpay_payment: 'Purchase',
    kundli: 'Kundli',
    matchmaking: 'Matchmaking',
    horoscope: 'Horoscope',
    admin_adjustment: 'Admin',
  };
  return map[ref] ?? ref.replace(/_/g, ' ');
}

function humanizeCoinType(type: string | null | undefined): string {
  if (type == null || type === '') return 'Unknown';
  const map: Record<string, string> = {
    PURCHASE: 'Purchase',
    SIGNUP_BONUS: 'Signup bonus',
    DEBIT: 'Spent',
    REFUND: 'Refund',
    ADMIN_ADJUST: 'Adjustment',
  };
  return map[type] ?? type.replace(/_/g, ' ');
}

export default function WalletPage() {
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
    <div className="min-h-[60vh] bg-linear-to-b from-violet-50/70 via-white to-violet-50/30 py-10 md:py-14 px-4">
      <div className="container mx-auto max-w-4xl space-y-8 md:space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-violet-800 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
              Coins & billing
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 md:text-4xl flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-amber-50 shadow-inner ring-1 ring-violet-200/60">
                <CoinGlyph className="h-7 w-7 text-amber-600" />
              </span>
              Wallet
            </h1>
            <p className="text-muted-foreground max-w-md text-sm md:text-base">
              Your balance, Razorpay purchases, and how you&apos;ve used coins across the app.
            </p>
          </div>
          <Button asChild size="lg" className="cursor-pointer shrink-0 shadow-md shadow-violet-500/15">
            <Link href="/pricing">
              <CreditCard className="mr-2 h-4 w-4" />
              Buy coins
            </Link>
          </Button>
        </div>

        {/* Balance hero */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200/40 bg-linear-to-br from-violet-600 via-violet-700 to-indigo-800 p-8 text-white shadow-xl shadow-violet-900/20 md:p-10">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-medium text-violet-100">
                <Wallet className="h-4 w-4 opacity-90" />
                Available balance
              </p>
              {walletLoading ? (
                <div className="h-14 w-40 animate-pulse rounded-lg bg-white/20" />
              ) : (
                <p className="text-5xl font-bold tabular-nums tracking-tight md:text-6xl">{balance}</p>
              )}
              <p className="text-sm text-violet-200">coins ready to use on reports &amp; charts</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={walletFetching}
              onClick={() => refetchWallet()}
              className="cursor-pointer border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              {walletFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Payments */}
          <Card className="border-violet-100/80 shadow-md shadow-violet-950/5 overflow-hidden">
            <CardHeader className="border-b border-violet-100/80 bg-linear-to-r from-violet-50/50 to-transparent pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Payments</CardTitle>
                  <CardDescription>Razorpay orders linked to your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-2">
              {paysLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/60" />
                  ))}
                </div>
              )}
              {!paysLoading && payments.length === 0 && (
                <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-10 text-center">
                  <CreditCard className="mx-auto h-10 w-10 text-violet-300" />
                  <p className="mt-3 text-sm font-medium text-gray-700">No payments yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Buy a coin pack to see receipts here.</p>
                  <Button asChild variant="link" className="mt-2 cursor-pointer text-violet-700">
                    <Link href="/pricing">Browse packs</Link>
                  </Button>
                </div>
              )}
              {!paysLoading &&
                payments.map((p) => (
                  <div
                    key={p.id}
                    className="group flex flex-col gap-3 rounded-xl border border-transparent bg-muted/30 px-4 py-3.5 transition-colors hover:border-violet-100 hover:bg-violet-50/50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-lg font-semibold tabular-nums text-gray-900">{formatInr(p.amountPaise)}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-violet-900">
                          +{Number(p.coinsCredited || p.coinsToCredit) || 0}
                        </span>{' '}
                        coins
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
                      <Badge variant="outline" className={cn('capitalize font-semibold', paymentStatusBadgeClass(p.status))}>
                        {(p.status ?? 'unknown').toLowerCase()}
                      </Badge>
                      <time
                        className="text-xs text-muted-foreground tabular-nums"
                        dateTime={typeof p.createdAt === 'string' ? p.createdAt : undefined}
                      >
                        {format(new Date(p.createdAt), 'd MMM yyyy, HH:mm')}
                        <span className="hidden sm:inline">
                          {' · '}
                          {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                        </span>
                      </time>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border-violet-100/80 shadow-md shadow-violet-950/5 overflow-hidden">
            <CardHeader className="border-b border-violet-100/80 bg-linear-to-r from-amber-50/40 to-transparent pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Coin activity</CardTitle>
                  <CardDescription>Credits, debits, and balance after each move</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-2">
              {txLoading && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-18 animate-pulse rounded-xl bg-muted/60" />
                  ))}
                </div>
              )}
              {!txLoading && items.length === 0 && (
                <div className="rounded-xl border border-dashed border-amber-200/80 bg-amber-50/30 px-4 py-10 text-center">
                  <History className="mx-auto h-10 w-10 text-amber-300" />
                  <p className="mt-3 text-sm font-medium text-gray-700">No activity yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Earn or spend coins to build your timeline.</p>
                </div>
              )}
              {!txLoading &&
                items.map((r) => (
                  <div
                    key={r.id}
                    className="group flex gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-violet-100/80 hover:bg-muted/25"
                  >
                      <div
                        className={cn(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          r.delta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
                        )}
                      >
                        {r.delta >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p
                            className={cn(
                              'font-semibold tabular-nums',
                              r.delta >= 0 ? 'text-emerald-800' : 'text-rose-800',
                            )}
                          >
                            {r.delta >= 0 ? '+' : ''}
                            {r.delta} coins
                          </p>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            balance {r.balanceAfter}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {humanizeCoinType(r.type)}
                          {r.referenceType ? (
                            <>
                              {' · '}
                              <span className="text-gray-600">{humanizeReference(r.referenceType)}</span>
                            </>
                          ) : null}
                        </p>
                        <time
                          className="mt-1 block text-xs text-muted-foreground"
                          dateTime={typeof r.createdAt === 'string' ? r.createdAt : undefined}
                        >
                          {format(new Date(r.createdAt), 'd MMM yyyy, HH:mm')} ·{' '}
                          {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Need help?{' '}
          <Link href="/pricing" className="font-medium text-violet-700 underline-offset-4 hover:underline">
            View pricing
          </Link>
        </p>
      </div>
    </div>
  );
}
