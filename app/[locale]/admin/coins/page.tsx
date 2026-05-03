'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useGetAdminCoinSettingsQuery,
  usePatchAdminCoinSettingsMutation,
  useGetAdminServiceCoinCostsQuery,
  usePutAdminServiceCoinCostMutation,
} from '@/store/api/coinsApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatInrFromPaise } from '@/hooks/useServiceRunPrice';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';
import { BookOpen, Coins, Gift, HeartHandshake, Loader2, Sparkles, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const SERVICE_META: Record<
  string,
  { label: string; description: string; icon: LucideIcon; ring: string; iconBg: string }
> = {
  kundli: {
    label: 'Kundli generation',
    description: 'Birth chart generation flow',
    icon: BookOpen,
    ring: 'ring-violet-200/80',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  matchmaking: {
    label: 'Matchmaking',
    description: 'Gun Milan / compatibility report',
    icon: HeartHandshake,
    ring: 'ring-rose-200/80',
    iconBg: 'bg-rose-100 text-rose-700',
  },
  horoscope: {
    label: 'Horoscope',
    description: 'Daily / weekly / monthly reports',
    icon: Sparkles,
    ring: 'ring-amber-200/80',
    iconBg: 'bg-amber-100 text-amber-800',
  },
  horoscope_detailed: {
    label: 'Horoscope (detailed)',
    description: 'Long-form horoscope report',
    icon: Sparkles,
    ring: 'ring-fuchsia-200/80',
    iconBg: 'bg-fuchsia-100 text-fuchsia-800',
  },
  kundli_horoscope_addon: {
    label: 'Kundli horoscope add-on',
    description: 'Paid horoscope tab unlock for kundli',
    icon: BookOpen,
    ring: 'ring-indigo-200/80',
    iconBg: 'bg-indigo-100 text-indigo-800',
  },
};

export default function AdminCoinsPage() {
  const t = useTranslations('admin');
  const { data: settingsRes, isLoading: loadingSettings, refetch: refetchSettings } = useGetAdminCoinSettingsQuery();
  const { data: costsRes, isLoading: loadingCosts, refetch: refetchCosts } = useGetAdminServiceCoinCostsQuery();
  const [patchSettings] = usePatchAdminCoinSettingsMutation();
  const [putCost] = usePutAdminServiceCoinCostMutation();

  const [signupBonus, setSignupBonus] = useState('');
  const [defaultPaise, setDefaultPaise] = useState('');

  const settings = settingsRes?.data;
  const costs = costsRes?.data ?? [];
  const pageLoading = loadingSettings || loadingCosts;

  const defaultPaiseNum = settings?.defaultInrPerCoinPaise;

  const totalDebitCoins = useMemo(
    () => costs.reduce((sum, c) => sum + (c.coinCost ?? 0), 0),
    [costs],
  );

  const saveSettings = async () => {
    try {
      await patchSettings({
        ...(signupBonus !== '' && { signupBonusCoins: parseInt(signupBonus, 10) }),
        ...(defaultPaise !== '' && { defaultInrPerCoinPaise: parseInt(defaultPaise, 10) }),
      }).unwrap();
      toast.success(t('settingsUpdated'));
      setSignupBonus('');
      setDefaultPaise('');
      refetchSettings();
    } catch {
      toast.error(t('settingsFailed'));
    }
  };

  const saveCost = async (serviceKey: string, coinCost: number) => {
    try {
      await putCost({ serviceKey, coinCost }).unwrap();
      toast.success(t('costUpdated', { label: SERVICE_META[serviceKey]?.label ?? serviceKey }));
      refetchCosts();
    } catch {
      toast.error(t('costFailed'));
    }
  };

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-6xl pb-12">
        <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading coin overview…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-100/90 via-white to-amber-50/80 px-6 py-10 shadow-lg shadow-violet-950/10 sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-md shadow-violet-950/10 ring-1 ring-violet-200/80">
            <CoinGlyph className="h-9 w-9 text-amber-600" />
          </span>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Coin overview</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Wallet defaults power signup grants and public ₹ hints. Per-service costs control how many coins each
              report run spends.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-violet-100/90 bg-white/90 p-5 shadow-sm shadow-violet-950/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Gift className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Signup bonus</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">{settings?.signupBonusCoins ?? '—'}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Coins granted to eligible new accounts</p>
        </div>
        <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Coins className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reference ₹ / coin</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">
                {defaultPaiseNum != null ? formatInrFromPaise(defaultPaiseNum) : '—'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {defaultPaiseNum != null ? `${defaultPaiseNum} paise · used for UI estimates` : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100/90 bg-white/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Services priced</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">{costs.length}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Kundli, matchmaking, horoscope, detailed horoscope, kundli add-on
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sum of debits</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">{totalDebitCoins}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Total coins if one run each (reference)</p>
        </div>
      </div>

      {/* Platform settings */}
      <div className="overflow-hidden rounded-3xl border border-violet-100/90 bg-white shadow-md shadow-violet-950/5">
        <div className="border-b border-violet-100/80 bg-gradient-to-r from-violet-50/80 via-white to-amber-50/40 px-6 py-5 sm:px-8">
          <h2 className="font-serif text-xl font-semibold text-gray-900">Platform settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes apply to new signups and to how we convert coins to rupees in product copy (100 paise = ₹1 per coin
            at reference rate).
          </p>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:gap-12">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Live values</p>
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-white p-5">
              <dl className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-violet-100/80 pb-4">
                  <dt className="text-sm text-muted-foreground">Signup bonus</dt>
                  <dd className="font-semibold tabular-nums text-gray-900">
                    {settings?.signupBonusCoins ?? '—'}{' '}
                    <span className="font-normal text-muted-foreground">coins</span>
                  </dd>
                </div>
                <div className="flex flex-1 items-start justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Default INR per coin</dt>
                  <dd className="text-right">
                    <span className="block font-semibold tabular-nums text-gray-900">
                      {defaultPaiseNum != null ? formatInrFromPaise(defaultPaiseNum) : '—'}
                    </span>
                    {defaultPaiseNum != null && (
                      <span className="text-xs text-muted-foreground">{defaultPaiseNum} paise</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Update</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-bonus">New signup bonus (coins)</Label>
                <Input
                  id="signup-bonus"
                  value={signupBonus}
                  onChange={(e) => setSignupBonus(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="h-11 rounded-xl border-violet-200/80 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-paise">New default INR per coin (paise)</Label>
                <Input
                  id="default-paise"
                  value={defaultPaise}
                  onChange={(e) => setDefaultPaise(e.target.value)}
                  placeholder="e.g. 100 (= ₹1 per coin)"
                  className="h-11 rounded-xl border-violet-200/80 bg-white"
                />
              </div>
              <Button
                type="button"
                onClick={saveSettings}
                className="mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 shadow-md shadow-violet-900/15 hover:from-violet-700 hover:to-indigo-700"
              >
                Save settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service costs */}
      <div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-gray-900">Service coin costs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Coins debited per successful run. Approximate INR uses the reference rate above.
            </p>
          </div>
          {defaultPaiseNum != null && (
            <Badge variant="secondary" className="w-fit border-violet-200 bg-violet-50 text-violet-900">
              Est. ₹ = coins × {formatInrFromPaise(defaultPaiseNum)} / coin
            </Badge>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {costs.map((c) => (
            <ServiceCostCard
              key={c.serviceKey}
              serviceKey={c.serviceKey}
              initial={c.coinCost}
              defaultInrPerCoinPaise={defaultPaiseNum}
              onSave={saveCost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCostCard({
  serviceKey,
  initial,
  defaultInrPerCoinPaise,
  onSave,
}: {
  serviceKey: string;
  initial: number;
  defaultInrPerCoinPaise: number | undefined;
  onSave: (k: string, v: number) => void;
}) {
  const [v, setV] = useState(String(initial));
  useEffect(() => {
    setV(String(initial));
  }, [initial]);

  const meta = SERVICE_META[serviceKey];
  const Icon = meta?.icon ?? Sparkles;
  const coinVal = parseInt(v, 10);
  const estimatedPaise =
    defaultInrPerCoinPaise != null && Number.isFinite(coinVal) && coinVal >= 1
      ? coinVal * defaultInrPerCoinPaise
      : null;

  return (
    <Card
      className={cn(
        'overflow-hidden border-violet-100/90 shadow-md shadow-violet-950/5 transition-shadow hover:shadow-lg',
        meta?.ring && `ring-1 ${meta.ring}`,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-3 border-b border-violet-100/80 bg-gradient-to-br from-violet-50/95 via-white to-amber-50/30 px-5 py-4">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              meta?.iconBg ?? 'bg-violet-100 text-violet-700',
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight text-gray-900">{meta?.label ?? serviceKey}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{meta?.description ?? 'Service key'}</p>
            <code className="mt-2 inline-block rounded-md bg-white/80 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-violet-100">
              {serviceKey}
            </code>
          </div>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <Label htmlFor={`cost-${serviceKey}`} className="text-xs uppercase tracking-wide text-muted-foreground">
              Coins per run
            </Label>
            <Input
              id={`cost-${serviceKey}`}
              value={v}
              onChange={(e) => setV(e.target.value)}
              inputMode="numeric"
              min={1}
              className="h-12 rounded-xl border-violet-200/80 text-lg font-semibold tabular-nums"
            />
          </div>
          {estimatedPaise != null && (
            <p className="text-sm text-muted-foreground">
              ≈ <span className="font-medium text-gray-900">{formatInrFromPaise(estimatedPaise)}</span> per run at
              reference rate
            </p>
          )}
          <Button
            type="button"
            size="sm"
            className="w-full cursor-pointer rounded-xl"
            onClick={() => {
              const n = parseInt(v, 10);
              onSave(serviceKey, Number.isFinite(n) && n >= 1 ? n : 1);
            }}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
