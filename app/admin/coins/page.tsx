'use client';

import { useState } from 'react';
import {
  useGetAdminCoinSettingsQuery,
  usePatchAdminCoinSettingsMutation,
  useGetAdminServiceCoinCostsQuery,
  usePutAdminServiceCoinCostMutation,
  useGetAdminCoinPlansQuery,
  useCreateAdminCoinPlanMutation,
  usePatchAdminCoinPlanMutation,
  useDeleteAdminCoinPlanMutation,
} from '@/store/api/coinsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminCoinsPage() {
  const { data: settingsRes, refetch: refetchSettings } = useGetAdminCoinSettingsQuery();
  const { data: costsRes, refetch: refetchCosts } = useGetAdminServiceCoinCostsQuery();
  const { data: plansRes, refetch: refetchPlans } = useGetAdminCoinPlansQuery();
  const [patchSettings] = usePatchAdminCoinSettingsMutation();
  const [putCost] = usePutAdminServiceCoinCostMutation();
  const [createPlan] = useCreateAdminCoinPlanMutation();
  const [patchPlan] = usePatchAdminCoinPlanMutation();
  const [deletePlan] = useDeleteAdminCoinPlanMutation();

  const [signupBonus, setSignupBonus] = useState('');
  const [defaultPaise, setDefaultPaise] = useState('');
  const [newPlan, setNewPlan] = useState({ name: '', coinQuantity: '', pricePaise: '', sortOrder: '0' });

  const settings = settingsRes?.data;
  const costs = costsRes?.data ?? [];
  const plans = plansRes?.data ?? [];

  const saveSettings = async () => {
    try {
      await patchSettings({
        ...(signupBonus !== '' && { signupBonusCoins: parseInt(signupBonus, 10) }),
        ...(defaultPaise !== '' && { defaultInrPerCoinPaise: parseInt(defaultPaise, 10) }),
      }).unwrap();
      toast.success('Settings updated');
      setSignupBonus('');
      setDefaultPaise('');
      refetchSettings();
    } catch {
      toast.error('Failed to update settings');
    }
  };

  const saveCost = async (serviceKey: string, coinCost: number) => {
    try {
      await putCost({ serviceKey, coinCost }).unwrap();
      toast.success(`Updated ${serviceKey}`);
      refetchCosts();
    } catch {
      toast.error('Failed to update cost');
    }
  };

  const addPlan = async () => {
    try {
      await createPlan({
        name: newPlan.name,
        coinQuantity: parseInt(newPlan.coinQuantity, 10),
        pricePaise: parseInt(newPlan.pricePaise, 10),
        sortOrder: parseInt(newPlan.sortOrder, 10) || 0,
      }).unwrap();
      toast.success('Plan created');
      setNewPlan({ name: '', coinQuantity: '', pricePaise: '', sortOrder: '0' });
      refetchPlans();
    } catch {
      toast.error('Failed to create plan');
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Coin management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Platform settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Signup bonus: <strong>{settings?.signupBonusCoins}</strong> · Default ₹/coin (paise):{' '}
            <strong>{settings?.defaultInrPerCoinPaise}</strong> (100 = ₹1)
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>New signup bonus (coins)</Label>
              <Input value={signupBonus} onChange={(e) => setSignupBonus(e.target.value)} placeholder="e.g. 50" />
            </div>
            <div>
              <Label>New default INR per coin (paise)</Label>
              <Input value={defaultPaise} onChange={(e) => setDefaultPaise(e.target.value)} placeholder="e.g. 100" />
            </div>
          </div>
          <Button type="button" onClick={saveSettings} className="cursor-pointer">
            Save settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service coin costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {costs.map((c) => (
            <CostRow key={c.serviceKey} serviceKey={c.serviceKey} initial={c.coinCost} onSave={saveCost} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={newPlan.name} onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Coins</Label>
              <Input
                value={newPlan.coinQuantity}
                onChange={(e) => setNewPlan((p) => ({ ...p, coinQuantity: e.target.value }))}
              />
            </div>
            <div>
              <Label>Price (paise)</Label>
              <Input
                value={newPlan.pricePaise}
                onChange={(e) => setNewPlan((p) => ({ ...p, pricePaise: e.target.value }))}
              />
            </div>
            <div>
              <Label>Sort</Label>
              <Input
                value={newPlan.sortOrder}
                onChange={(e) => setNewPlan((p) => ({ ...p, sortOrder: e.target.value }))}
              />
            </div>
          </div>
          <Button type="button" onClick={addPlan} className="cursor-pointer">
            Add plan
          </Button>

          <div className="space-y-3 border-t pt-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-3 text-sm"
              >
                <PlanEditRow
                  plan={p}
                  onSave={async (body) => {
                    try {
                      await patchPlan({ id: p.id, body }).unwrap();
                      toast.success('Plan updated');
                      refetchPlans();
                    } catch {
                      toast.error('Update failed');
                    }
                  }}
                  onDelete={async () => {
                    if (!confirm('Delete this plan?')) return;
                    try {
                      await deletePlan(p.id).unwrap();
                      toast.success('Deleted');
                      refetchPlans();
                    } catch {
                      toast.error('Delete failed');
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CostRow({
  serviceKey,
  initial,
  onSave,
}: {
  serviceKey: string;
  initial: number;
  onSave: (k: string, v: number) => void;
}) {
  const [v, setV] = useState(String(initial));
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-sm w-32">{serviceKey}</span>
      <Input className="w-24" value={v} onChange={(e) => setV(e.target.value)} />
      <Button type="button" size="sm" variant="secondary" className="cursor-pointer" onClick={() => onSave(serviceKey, parseInt(v, 10) || 0)}>
        Save
      </Button>
    </div>
  );
}

function PlanEditRow({
  plan,
  onSave,
  onDelete,
}: {
  plan: {
    id: number;
    name: string;
    coinQuantity: number;
    pricePaise: number;
    isActive: boolean;
    sortOrder: number;
    discountLabel: string | null;
  };
  onSave: (body: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(plan.name);
  const [qty, setQty] = useState(String(plan.coinQuantity));
  const [price, setPrice] = useState(String(plan.pricePaise));
  const [sort, setSort] = useState(String(plan.sortOrder));
  const [active, setActive] = useState(plan.isActive);
  return (
    <>
      <Input className="w-40" value={name} onChange={(e) => setName(e.target.value)} />
      <Input className="w-20" value={qty} onChange={(e) => setQty(e.target.value)} />
      <Input className="w-24" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Input className="w-16" value={sort} onChange={(e) => setSort(e.target.value)} />
      <label className="flex items-center gap-1 text-xs">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        active
      </label>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() =>
          onSave({
            name,
            coinQuantity: parseInt(qty, 10),
            pricePaise: parseInt(price, 10),
            sortOrder: parseInt(sort, 10),
            isActive: active,
          })
        }
      >
        Save
      </Button>
      <Button size="sm" variant="destructive" className="cursor-pointer" onClick={onDelete}>
        Delete
      </Button>
    </>
  );
}
