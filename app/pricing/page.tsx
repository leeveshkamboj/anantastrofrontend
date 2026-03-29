'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Coins,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useGetCoinPlansPublicQuery, useCreateCoinCheckoutOrderMutation } from '@/store/api/coinsApi';
import { useAuth } from '@/store/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay-checkout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function formatInr(paise: number | undefined) {
  const n = Number(paise);
  if (!Number.isFinite(n)) return '—';
  const rupees = n / 100;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    rupees,
  );
}

const perks = ['Kundli & chart generation', 'Horoscope reports', 'Matchmaking compatibility'];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data, isLoading } = useGetCoinPlansPublicQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateCoinCheckoutOrderMutation();
  const [checkoutPlanId, setCheckoutPlanId] = useState<number | null>(null);

  const plans = data?.data ?? [];

  const bestValuePlanId = useMemo(() => {
    if (plans.length === 0) return null;
    return plans.reduce((best, p) => (p.costPerCoinPaise < best.costPerCoinPaise ? p : best), plans[0]).id;
  }, [plans]);

  const handleBuy = async (planId: number) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=${encodeURIComponent('/pricing')}`);
      return;
    }
    setCheckoutPlanId(planId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not load payment widget. Check your connection and try again.');
        return;
      }
      const res = await createOrder({ planId }).unwrap();
      const d = res.data;
      openRazorpayCheckout({
        keyId: d.keyId,
        orderId: d.orderId,
        currency: d.currency,
        name: 'AnantAstro',
        description: `${d.plan.name} — ${d.plan.coinQuantity} coins`,
        userEmail: user?.email,
        userName: user?.name,
        onSuccess: () => {
          toast.success('Payment received. Coins are added to your wallet shortly after confirmation.');
        },
      });
    } catch {
      toast.error('Could not start checkout. Try again or contact support.');
    } finally {
      setCheckoutPlanId(null);
    }
  };

  return (
    <div className="min-h-[60vh] bg-linear-to-b from-violet-50/70 via-white to-amber-50/20 py-10 md:py-16 px-4">
      <div className="container mx-auto max-w-5xl space-y-12 md:space-y-14">
        {/* Hero */}
        <div className="relative text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-violet-800 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
              Simple, transparent packs
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 to-amber-50 shadow-inner ring-1 ring-violet-200/60">
                <CoinGlyph className="h-9 w-9 text-amber-600" />
              </span>
              <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
                Coin packs
              </h1>
            </div>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
              One balance for every report. Buy a pack, pay securely with Razorpay, and spend coins on kundli,
              horoscope, and matchmaking — no subscriptions required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Razorpay checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-violet-600" />
                <Link href="/wallet" className="font-medium text-violet-700 underline-offset-4 hover:underline">
                  Wallet & receipts
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* What coins unlock */}
        <div className="rounded-2xl border border-violet-100/80 bg-white/70 p-5 shadow-sm shadow-violet-950/5 backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">What you can unlock</p>
                <p className="text-sm text-muted-foreground">Coins debit when you generate or download eligible reports.</p>
              </div>
            </div>
            <ul className="flex flex-col gap-2 sm:items-end">
              {perks.map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Plans grid */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl border border-violet-100/80 bg-card shadow-md"
              >
                <div className="h-24 animate-pulse bg-muted/70" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 w-1/2 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted/80" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && plans.length === 0 && (
          <Card className="border-dashed border-violet-200 bg-violet-50/30">
            <CardContent className="flex flex-col items-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-400">
                <Coins className="h-7 w-7" />
              </div>
              <p className="mt-4 font-medium text-gray-900">No packs live yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your administrator hasn&apos;t published coin plans. Check back soon or contact support.
              </p>
              <Button asChild variant="outline" className="mt-6 cursor-pointer">
                <Link href="/wallet">Go to wallet</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && plans.length > 0 && (
          <div
            className={cn(
              'grid gap-6',
              plans.length === 1 ? 'max-w-md mx-auto' : 'sm:grid-cols-2',
              plans.length >= 3 && 'lg:grid-cols-3',
            )}
          >
            {plans.map((p) => {
              const isBestValue = bestValuePlanId === p.id && plans.length > 1;
              return (
                <Card
                  key={p.id}
                  className={cn(
                    'relative flex flex-col overflow-hidden border-violet-100/90 shadow-md shadow-violet-950/5 transition-shadow hover:shadow-lg hover:shadow-violet-950/10',
                    isBestValue && 'ring-2 ring-violet-400/60 ring-offset-2 ring-offset-violet-50/50',
                  )}
                >
                  {isBestValue && (
                    <div className="absolute right-4 top-4 z-10">
                      <Badge className="border-0 bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-sm">
                        Best value
                      </Badge>
                    </div>
                  )}
                  <CardHeader
                    className={cn(
                      'space-y-1 border-b border-violet-100/80 pb-4',
                      'bg-linear-to-br from-violet-50/90 via-white to-amber-50/40',
                    )}
                  >
                    <div className={cn('flex items-start justify-between gap-2', isBestValue && 'pr-24 sm:pr-28')}>
                      <CardTitle className="text-xl font-serif leading-tight">{p.name}</CardTitle>
                    </div>
                    {p.discountLabel && (
                      <Badge variant="secondary" className="mt-2 w-fit border-amber-200/80 bg-amber-50 text-amber-900">
                        {p.discountLabel}
                      </Badge>
                    )}
                    <CardDescription className="text-xs sm:text-sm">One-time purchase · credited after payment</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5 pt-6">
                    <div>
                      <p className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 md:text-4xl">
                        {formatInr(p.pricePaise)}
                      </p>
                      {p.originalPricePaise != null && p.originalPricePaise > p.pricePaise && (
                        <p className="mt-1 text-sm text-muted-foreground line-through">{formatInr(p.originalPricePaise)}</p>
                      )}
                    </div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm">
                      <p className="font-semibold text-violet-950">
                        {p.coinQuantity} <span className="font-normal text-violet-800/90">coins</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        ≈ {formatInr(p.costPerCoinPaise)} per coin
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-col gap-3 border-t border-violet-100/80 bg-muted/20 pt-6">
                    <Button
                      size="lg"
                      className="w-full cursor-pointer shadow-md shadow-violet-500/15"
                      onClick={() => handleBuy(p.id)}
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder && checkoutPlanId === p.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening checkout…
                        </>
                      ) : isAuthenticated ? (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Buy Now
                        </>
                      ) : (
                        <>
                          Sign in to buy
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer links */}
        <div className="rounded-2xl border border-violet-100/60 bg-white/60 px-4 py-6 text-center text-sm text-muted-foreground backdrop-blur-sm">
          <p className="font-medium text-gray-800">Already purchased?</p>
          <p className="mt-1">
            <Link href="/wallet" className="font-semibold text-violet-700 underline-offset-4 hover:underline">
              View wallet & payment history
            </Link>
            <span className="mx-2 text-violet-200">·</span>
            <Link
              href="/services/kundli/generate"
              className="font-semibold text-violet-700 underline-offset-4 hover:underline"
            >
              Use coins on services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
