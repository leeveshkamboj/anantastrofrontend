'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import {
  useGetAdminCoinPlansQuery,
  useCreateAdminCoinPlanMutation,
  usePatchAdminCoinPlanMutation,
  useDeleteAdminCoinPlanMutation,
} from '@/store/api/coinsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatInrFromPaise } from '@/hooks/useServiceRunPrice';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { cn } from '@/lib/utils';
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  TrendingDown,
  Wallet,
  Zap,
} from 'lucide-react';

type PlanRow = {
  id: number;
  name: string;
  coinQuantity: number;
  pricePaise: number;
  originalPricePaise: number | null;
  discountLabel: string | null;
  currency: string;
  isActive: boolean;
  sortOrder: number;
};

function costPerCoinPaise(p: PlanRow) {
  if (p.coinQuantity < 1) return null;
  return Math.round(p.pricePaise / p.coinQuantity);
}

export default function AdminCoinPlansPage() {
  const t = useTranslations('admin');
  const { data: plansRes, isLoading, refetch } = useGetAdminCoinPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreateAdminCoinPlanMutation();
  const [patchPlan, { isLoading: isSaving }] = usePatchAdminCoinPlanMutation();
  const [deletePlan] = useDeleteAdminCoinPlanMutation();

  const plans = (plansRes?.data ?? []) as PlanRow[];

  const activePlans = useMemo(() => plans.filter((p) => p.isActive), [plans]);

  const bestValueId = useMemo(() => {
    const candidates = activePlans.filter((p) => p.coinQuantity > 0);
    if (candidates.length < 2) return null;
    let best = candidates[0];
    let bestCpp = costPerCoinPaise(best) ?? Infinity;
    for (const p of candidates) {
      const cpp = costPerCoinPaise(p);
      if (cpp != null && cpp < bestCpp) {
        bestCpp = cpp;
        best = p;
      }
    }
    return best?.id ?? null;
  }, [activePlans]);

  const stats = useMemo(() => {
    const cppList = activePlans
      .map((p) => costPerCoinPaise(p))
      .filter((n): n is number => n != null && Number.isFinite(n));
    const bestCpp = cppList.length ? Math.min(...cppList) : null;
    const maxCoins = activePlans.length ? Math.max(...activePlans.map((p) => p.coinQuantity)) : 0;
    return {
      activeCount: activePlans.length,
      totalCount: plans.length,
      bestCpp,
      maxCoins,
    };
  }, [activePlans, plans.length]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);

  const emptyForm = {
    name: '',
    coinQuantity: '',
    pricePaise: '',
    originalPricePaise: '',
    discountLabel: '',
    sortOrder: '0',
    isActive: true,
  };

  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    const nextSort =
      plans.length > 0 ? String(Math.max(...plans.map((p) => p.sortOrder), 0) + 1) : '0';
    setForm({ ...emptyForm, sortOrder: nextSort });
    setDialogOpen(true);
  };

  const openEdit = (p: PlanRow) => {
    setEditing(p);
    setForm({
      name: p.name,
      coinQuantity: String(p.coinQuantity),
      pricePaise: String(p.pricePaise),
      originalPricePaise: p.originalPricePaise != null ? String(p.originalPricePaise) : '',
      discountLabel: p.discountLabel ?? '',
      sortOrder: String(p.sortOrder),
      isActive: p.isActive,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    const coinQuantity = parseInt(form.coinQuantity, 10);
    const pricePaise = parseInt(form.pricePaise, 10);
    const sortOrder = parseInt(form.sortOrder, 10) || 0;
    if (!form.name.trim()) {
      toast.error(t('packName'));
      return;
    }
    if (!Number.isFinite(coinQuantity) || coinQuantity < 1) {
      toast.error(t('coinMin'));
      return;
    }
    if (!Number.isFinite(pricePaise) || pricePaise < 1) {
      toast.error(t('priceMin'));
      return;
    }

    const originalRaw = form.originalPricePaise.trim();
    const originalPricePaise =
      originalRaw === '' ? undefined : parseInt(originalRaw, 10);
    if (originalRaw !== '' && (!Number.isFinite(originalPricePaise) || (originalPricePaise ?? 0) < 0)) {
      toast.error(t('originalPrice'));
      return;
    }

    try {
      if (editing) {
        await patchPlan({
          id: editing.id,
          body: {
            name: form.name.trim(),
            coinQuantity,
            pricePaise,
            sortOrder,
            isActive: form.isActive,
            discountLabel: form.discountLabel.trim() || null,
            originalPricePaise: originalRaw === '' ? null : originalPricePaise,
          },
        }).unwrap();
        toast.success(t('packUpdated'));
      } else {
        await createPlan({
          name: form.name.trim(),
          coinQuantity,
          pricePaise,
          sortOrder,
          isActive: form.isActive,
          discountLabel: form.discountLabel.trim() || undefined,
          originalPricePaise: originalRaw === '' ? undefined : originalPricePaise,
        }).unwrap();
        toast.success(t('packCreated'));
      }
      closeDialog();
      refetch();
    } catch {
      toast.error(t('packSaveFailed'));
    }
  };

  const handleDelete = async (p: PlanRow) => {
    if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    try {
      await deletePlan(p.id).unwrap();
      toast.success(t('packDeleted'));
      refetch();
    } catch {
      toast.error(t('deleteFailed'));
    }
  };

  const previewCpp = useMemo(() => {
    const q = parseInt(form.coinQuantity, 10);
    const pr = parseInt(form.pricePaise, 10);
    if (!Number.isFinite(q) || q < 1 || !Number.isFinite(pr) || pr < 1) return null;
    return Math.round(pr / q);
  }, [form.coinQuantity, form.pricePaise]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-10">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading coin packs…</p>
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
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Coin packs
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Design packs the way users see them on{' '}
              <Link
                href="/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-violet-700 underline-offset-4 hover:underline"
              >
                the pricing page
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              . Add a pack below. Sort order controls left-to-right / top-to-bottom display.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-violet-100/90 bg-white/90 p-5 shadow-sm shadow-violet-950/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Live packs</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">{stats.activeCount}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {stats.totalCount} total including hidden
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-5 shadow-sm shadow-emerald-950/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingDown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best ₹ / coin</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">
                {stats.bestCpp != null ? formatInrFromPaise(stats.bestCpp) : '—'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Lowest effective rate among active packs</p>
        </div>
        <div className="rounded-2xl border border-amber-100/90 bg-white/90 p-5 shadow-sm shadow-amber-950/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Largest pack</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900">
                {stats.maxCoins > 0 ? `${stats.maxCoins} coins` : '—'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Max coins in any active pack</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Checkout</p>
              <p className="text-sm font-medium leading-snug text-gray-800">Razorpay · same plans as live site</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pack grid */}
      {plans.length === 0 ? (
        <button
          type="button"
          onClick={openCreate}
          className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-violet-300/80 bg-violet-50/40 px-8 py-20 text-center transition-all hover:border-violet-400 hover:bg-violet-50/70"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-violet-200 transition-transform group-hover:scale-105">
            <Plus className="h-8 w-8 text-violet-600" />
          </div>
          <p className="mt-6 font-serif text-xl font-semibold text-gray-900">No packs yet</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Create your first coin pack — it will appear on the pricing page when marked active.
          </p>
          <span className="mt-6 inline-flex items-center text-sm font-semibold text-violet-700">
            Create pack
            <Sparkles className="ml-2 h-4 w-4" />
          </span>
        </button>
      ) : (
        <div
          className={cn(
            'grid gap-6 sm:grid-cols-2',
            plans.length === 1 && 'max-w-md mx-auto',
            plans.length >= 3 && 'lg:grid-cols-3',
          )}
        >
          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-gradient-to-b from-violet-50/50 to-white p-6 text-center transition-all hover:border-violet-400/80 hover:shadow-md hover:shadow-violet-950/10"
          >
            <Plus className="h-10 w-10 text-violet-500" />
            <span className="mt-4 font-semibold text-violet-900">Add pack</span>
            <span className="mt-1 text-xs text-muted-foreground">Create a new coin pack</span>
          </button>

          {plans.map((p) => {
            const cpp = costPerCoinPaise(p);
            const isBest = bestValueId === p.id && activePlans.length > 1 && p.isActive;
            return (
              <div
                key={p.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md shadow-violet-950/5 transition-all hover:shadow-xl hover:shadow-violet-950/10',
                  isBest && 'ring-2 ring-violet-400/70 ring-offset-2 ring-offset-violet-50/50',
                  !p.isActive && 'opacity-75',
                )}
              >
                {isBest && (
                  <div className="absolute right-3 top-3 z-10">
                    <Badge className="border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm">
                      Best value
                    </Badge>
                  </div>
                )}
                <div
                  className={cn(
                    'border-b border-violet-100/80 bg-gradient-to-br from-violet-50/95 via-white to-amber-50/50 px-5 pb-5 pt-6',
                    !p.isActive && 'grayscale-[0.35]',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 pr-2">
                    <h2 className="font-serif text-xl font-bold leading-tight text-gray-900">{p.name}</h2>
                  </div>
                  {p.discountLabel && (
                    <Badge
                      variant="secondary"
                      className="mt-2 w-fit border-amber-200/80 bg-amber-50 text-amber-900"
                    >
                      {p.discountLabel}
                    </Badge>
                  )}
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-serif text-4xl font-bold tabular-nums tracking-tight text-violet-950 sm:text-5xl">
                      {p.coinQuantity}
                    </span>
                    <span className="text-lg font-medium text-muted-foreground">coins</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{formatInrFromPaise(p.pricePaise)}</p>
                  {p.originalPricePaise != null && p.originalPricePaise > p.pricePaise && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatInrFromPaise(p.originalPricePaise)}
                    </p>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      Sort {p.sortOrder}
                    </Badge>
                    {cpp != null && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                        {formatInrFromPaise(cpp)} / coin
                      </span>
                    )}
                    {!p.isActive ? (
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                        Hidden
                      </Badge>
                    ) : (
                      <Badge className="border-0 bg-emerald-600/90 text-white">Live</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1 rounded-xl"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" className="rounded-xl text-red-700 hover:bg-red-50" onClick={() => handleDelete(p)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editing ? 'Edit pack' : 'New coin pack'}
            </DialogTitle>
            <DialogDescription>
              Amounts use paise (₹499 → 49900). Users see packs on the pricing page when active.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Display name</Label>
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Starter"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="plan-qty">Coins</Label>
                <Input
                  id="plan-qty"
                  inputMode="numeric"
                  value={form.coinQuantity}
                  onChange={(e) => setForm((f) => ({ ...f, coinQuantity: e.target.value }))}
                  className="rounded-xl tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price (paise)</Label>
                <Input
                  id="plan-price"
                  inputMode="numeric"
                  value={form.pricePaise}
                  onChange={(e) => setForm((f) => ({ ...f, pricePaise: e.target.value }))}
                  className="rounded-xl tabular-nums"
                />
              </div>
            </div>
            {form.pricePaise !== '' && (
              <p className="text-sm text-muted-foreground">
                Charged amount:{' '}
                <span className="font-medium text-foreground">
                  {formatInrFromPaise(parseInt(form.pricePaise, 10) || 0)}
                </span>
                {previewCpp != null && (
                  <>
                    {' '}
                    · <span className="tabular-nums">{formatInrFromPaise(previewCpp)}</span> per coin
                  </>
                )}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="plan-original">Original price (paise, optional)</Label>
              <Input
                id="plan-original"
                inputMode="numeric"
                value={form.originalPricePaise}
                onChange={(e) => setForm((f) => ({ ...f, originalPricePaise: e.target.value }))}
                placeholder="For strikethrough on site"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-discount">Discount label (optional)</Label>
              <Input
                id="plan-discount"
                value={form.discountLabel}
                onChange={(e) => setForm((f) => ({ ...f, discountLabel: e.target.value }))}
                placeholder="e.g. 20% off"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="plan-sort">Sort order</Label>
                <Input
                  id="plan-sort"
                  inputMode="numeric"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  className="rounded-xl tabular-nums"
                />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Label htmlFor="plan-active" className="text-sm">
                  Visible on pricing
                </Label>
                <div className="flex h-10 items-center gap-2">
                  <Switch
                    id="plan-active"
                    checked={form.isActive}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                  />
                  <span className="text-sm text-muted-foreground">{form.isActive ? 'Active' : 'Hidden'}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-4">
            <Button type="button" variant="outline" className="cursor-pointer" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="button" className="cursor-pointer" onClick={handleSubmit} disabled={isCreating || isSaving}>
              {(isCreating || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create pack'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
