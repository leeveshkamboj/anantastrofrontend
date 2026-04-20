'use client';

import { useState } from 'react';
import {
  type ChatAstrologer,
  useCreateAdminChatAstrologerMutation,
  useDeleteAdminChatAstrologerMutation,
  useGetAdminChatAstrologersQuery,
  useUpdateAdminChatAstrologerMutation,
} from '@/store/api/chatApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  CalendarClock,
  Coins,
  MapPin,
  Pencil,
  Plus,
  ScanText,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  VenusAndMars,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

type AdminAstrologerForm = {
  userId: string;
  displayName: string;
  slug: string;
  persona: string;
  specialtiesText: string;
  systemPrompt: string;
  coinsPerMinute: string;
  gender: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  activeStartHour: string;
  activeEndHour: string;
  maxResponseDelayMs: string;
  isActive: boolean;
};

const defaultNewRow: AdminAstrologerForm = {
  userId: '',
  displayName: '',
  slug: '',
  persona: '',
  specialtiesText: '',
  systemPrompt: '',
  coinsPerMinute: '5',
  gender: '',
  locationCity: '',
  locationState: '',
  locationCountry: 'India',
  activeStartHour: '9',
  activeEndHour: '21',
  maxResponseDelayMs: '2500',
  isActive: true,
};

const hourOptions = Array.from({ length: 24 }, (_, h) => ({
  value: String(h),
  label: `${String(h).padStart(2, '0')}:00`,
}));

const indiaCityStateOptions = [
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Ujjain', state: 'Madhya Pradesh' },
  { city: 'Haridwar', state: 'Uttarakhand' },
  { city: 'Rishikesh', state: 'Uttarakhand' },
  { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Prayagraj', state: 'Uttar Pradesh' },
  { city: 'Mathura', state: 'Uttar Pradesh' },
];

const indiaStateOptions = Array.from(new Set(indiaCityStateOptions.map((item) => item.state)));

function toForm(row: ChatAstrologer): AdminAstrologerForm {
  return {
    userId: String(row.userId ?? ''),
    displayName: row.displayName ?? '',
    slug: row.slug ?? '',
    persona: row.persona ?? '',
    specialtiesText: (row.specialties || []).join(', '),
    systemPrompt: row.systemPrompt ?? '',
    coinsPerMinute: String(row.coinsPerMinute ?? 5),
    gender: row.gender ?? '',
    locationCity: row.locationCity ?? '',
    locationState: row.locationState ?? '',
    locationCountry: row.locationCountry ?? 'India',
    activeStartHour: String(row.activeStartHour ?? 9),
    activeEndHour: String(row.activeEndHour ?? 21),
    maxResponseDelayMs: String(row.maxResponseDelayMs ?? 2500),
    isActive: row.isActive ?? true,
  };
}

function parseSpecialties(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminAiAstrologersPage() {
  const { data, isLoading, refetch } = useGetAdminChatAstrologersQuery();
  const [createItem, { isLoading: creating }] = useCreateAdminChatAstrologerMutation();
  const [updateItem, { isLoading: updating }] = useUpdateAdminChatAstrologerMutation();
  const [deleteItem, { isLoading: deleting }] = useDeleteAdminChatAstrologerMutation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<AdminAstrologerForm | null>(null);

  const [newRow, setNewRow] = useState<AdminAstrologerForm>(defaultNewRow);

  const list = data?.data || [];

  const create = async () => {
    try {
      await createItem({
        userId: Number(newRow.userId),
        displayName: newRow.displayName,
        slug: newRow.slug,
        persona: newRow.persona || undefined,
        specialties: parseSpecialties(newRow.specialtiesText),
        systemPrompt: newRow.systemPrompt,
        coinsPerMinute: Number(newRow.coinsPerMinute),
        gender: newRow.gender || undefined,
        locationCity: newRow.locationCity || undefined,
        locationState: newRow.locationState || undefined,
        locationCountry: newRow.locationCountry || undefined,
        activeStartHour: Number(newRow.activeStartHour),
        activeEndHour: Number(newRow.activeEndHour),
        maxResponseDelayMs: Number(newRow.maxResponseDelayMs),
        isActive: newRow.isActive,
      }).unwrap();
      setNewRow(defaultNewRow);
      setShowCreateDialog(false);
      refetch();
      toast.success('Astrologer created');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Create failed');
    }
  };

  const openEdit = (row: ChatAstrologer) => {
    setEditingRowId(row.id);
    setEditRow(toForm(row));
  };

  const saveEdit = async () => {
    if (!editingRowId || !editRow) return;
    try {
      await updateItem({
        id: editingRowId,
        body: {
          displayName: editRow.displayName,
          slug: editRow.slug,
          persona: editRow.persona || undefined,
          specialties: parseSpecialties(editRow.specialtiesText),
          systemPrompt: editRow.systemPrompt,
          coinsPerMinute: Number(editRow.coinsPerMinute),
          gender: editRow.gender || undefined,
          locationCity: editRow.locationCity || undefined,
          locationState: editRow.locationState || undefined,
          locationCountry: editRow.locationCountry || undefined,
          activeStartHour: Number(editRow.activeStartHour),
          activeEndHour: Number(editRow.activeEndHour),
          maxResponseDelayMs: Number(editRow.maxResponseDelayMs),
          isActive: editRow.isActive,
        },
      }).unwrap();
      refetch();
      setEditingRowId(null);
      setEditRow(null);
      toast.success('Astrologer updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Update failed');
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteItem({ id }).unwrap();
      refetch();
      toast.success('Astrologer deleted');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">AI Astrologers</h1>
          <p className="text-gray-600 mt-1">Manage personalities, prompts, pricing and availability.</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create AI Astrologer</DialogTitle>
            <DialogDescription>Add a new AI astrologer profile with full settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>User ID</Label>
              <Input value={newRow.userId} onChange={(e) => setNewRow((s) => ({ ...s, userId: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Display Name</Label>
              <Input value={newRow.displayName} onChange={(e) => setNewRow((s) => ({ ...s, displayName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={newRow.slug} onChange={(e) => setNewRow((s) => ({ ...s, slug: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <select
                value={newRow.gender}
                onChange={(e) => setNewRow((s) => ({ ...s, gender: e.target.value }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Coins Per Minute</Label>
              <Input value={newRow.coinsPerMinute} onChange={(e) => setNewRow((s) => ({ ...s, coinsPerMinute: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <select
                value={newRow.locationCity}
                onChange={(e) => {
                  const selected = indiaCityStateOptions.find((opt) => opt.city === e.target.value);
                  setNewRow((s) => ({
                    ...s,
                    locationCity: e.target.value,
                    locationState: selected?.state || s.locationState,
                    locationCountry: 'India',
                  }));
                }}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="">Select city</option>
                {indiaCityStateOptions.map((location) => (
                  <option key={`create-city-${location.city}`} value={location.city}>
                    {location.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <select
                value={newRow.locationState}
                onChange={(e) => setNewRow((s) => ({ ...s, locationState: e.target.value }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="">Select state</option>
                {indiaStateOptions.map((state) => (
                  <option key={`create-state-${state}`} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <select
                value={newRow.locationCountry}
                onChange={(e) => setNewRow((s) => ({ ...s, locationCountry: e.target.value }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="India">India</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Max Response Delay (ms)</Label>
              <Input value={newRow.maxResponseDelayMs} onChange={(e) => setNewRow((s) => ({ ...s, maxResponseDelayMs: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Active Start Hour (0-23)</Label>
              <select
                value={newRow.activeStartHour}
                onChange={(e) => setNewRow((s) => ({ ...s, activeStartHour: e.target.value }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                {hourOptions.map((opt) => (
                  <option key={`create-start-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Active End Hour (0-23)</Label>
              <select
                value={newRow.activeEndHour}
                onChange={(e) => setNewRow((s) => ({ ...s, activeEndHour: e.target.value }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                {hourOptions.map((opt) => (
                  <option key={`create-end-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Persona</Label>
              <Input value={newRow.persona} onChange={(e) => setNewRow((s) => ({ ...s, persona: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Specialties (comma-separated)</Label>
              <Input value={newRow.specialtiesText} onChange={(e) => setNewRow((s) => ({ ...s, specialtiesText: e.target.value }))} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>System Prompt</Label>
              <textarea
                className="min-h-32 w-full rounded-md border px-3 py-2 text-sm"
                value={newRow.systemPrompt}
                onChange={(e) => setNewRow((s) => ({ ...s, systemPrompt: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={create} disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingRowId != null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRowId(null);
            setEditRow(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit AI Astrologer</DialogTitle>
            <DialogDescription>Update profile, pricing, availability and prompt settings.</DialogDescription>
          </DialogHeader>
          {editRow && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Display Name</Label>
                <Input value={editRow.displayName} onChange={(e) => setEditRow((s) => (s ? { ...s, displayName: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={editRow.slug} onChange={(e) => setEditRow((s) => (s ? { ...s, slug: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <select
                  value={editRow.gender}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, gender: e.target.value } : s))}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Coins Per Minute</Label>
                <Input value={editRow.coinsPerMinute} onChange={(e) => setEditRow((s) => (s ? { ...s, coinsPerMinute: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <select
                  value={editRow.locationCity}
                  onChange={(e) =>
                    setEditRow((s) => {
                      if (!s) return s;
                      const selected = indiaCityStateOptions.find((opt) => opt.city === e.target.value);
                      return {
                        ...s,
                        locationCity: e.target.value,
                        locationState: selected?.state || s.locationState,
                        locationCountry: 'India',
                      };
                    })
                  }
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  <option value="">Select city</option>
                  {indiaCityStateOptions.map((location) => (
                    <option key={`edit-city-${location.city}`} value={location.city}>
                      {location.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <select
                  value={editRow.locationState}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, locationState: e.target.value } : s))}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  <option value="">Select state</option>
                  {indiaStateOptions.map((state) => (
                    <option key={`edit-state-${state}`} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <select
                  value={editRow.locationCountry}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, locationCountry: e.target.value } : s))}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  <option value="India">India</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Response Delay (ms)</Label>
                <Input value={editRow.maxResponseDelayMs} onChange={(e) => setEditRow((s) => (s ? { ...s, maxResponseDelayMs: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5">
                <Label>Active Start Hour (0-23)</Label>
                <select
                  value={editRow.activeStartHour}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, activeStartHour: e.target.value } : s))}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  {hourOptions.map((opt) => (
                    <option key={`edit-start-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Active End Hour (0-23)</Label>
                <select
                  value={editRow.activeEndHour}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, activeEndHour: e.target.value } : s))}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  {hourOptions.map((opt) => (
                    <option key={`edit-end-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Persona</Label>
                <Input value={editRow.persona} onChange={(e) => setEditRow((s) => (s ? { ...s, persona: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Specialties (comma-separated)</Label>
                <Input value={editRow.specialtiesText} onChange={(e) => setEditRow((s) => (s ? { ...s, specialtiesText: e.target.value } : s))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>System Prompt</Label>
                <textarea
                  className="min-h-32 w-full rounded-md border px-3 py-2 text-sm"
                  value={editRow.systemPrompt}
                  onChange={(e) => setEditRow((s) => (s ? { ...s, systemPrompt: e.target.value } : s))}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between gap-2">
                <Button
                  variant={editRow.isActive ? 'outline' : 'default'}
                  onClick={() => setEditRow((s) => (s ? { ...s, isActive: !s.isActive } : s))}
                >
                  {editRow.isActive ? 'Set Inactive' : 'Set Active'}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => editingRowId && remove(editingRowId)}
                    disabled={deleting}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button onClick={saveEdit} disabled={updating} className="inline-flex items-center gap-1.5">
                    <Save className="h-4 w-4" />
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All AI Astrologers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            list.map((row) => (
              <div key={row.id} className="relative border rounded-xl p-4 space-y-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-3 top-3 h-8 w-8"
                  onClick={() => openEdit(row)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-between gap-2 pr-10">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        row.avatarUrl?.trim()
                          ? row.avatarUrl
                          : `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(row.slug || row.displayName || String(row.id))}`
                      }
                      alt={row.displayName}
                      width={56}
                      height={56}
                      className="rounded-full border bg-white"
                    />
                    <div>
                    <div className="font-semibold">{row.displayName}</div>
                    <div className="text-xs text-gray-600">{row.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={row.isOnlineNow ? 'default' : 'secondary'}
                      className={row.isOnlineNow ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-gray-100 text-gray-700'}
                    >
                      {row.isOnlineNow ? 'Online' : 'Offline'}
                    </Badge>
                    <Badge variant={row.isActive ? 'default' : 'outline'}>
                      {row.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Availability: {String(row.activeStartHour ?? 9).padStart(2, '0')}:00 -{' '}
                  {String(row.activeEndHour ?? 21).padStart(2, '0')}:00 IST
                </p>
                <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                  <p className="inline-flex items-center gap-1.5">
                    <UserRound className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500">Persona:</span> {row.persona || '—'}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <VenusAndMars className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500">Gender:</span> {row.gender || '—'}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500">Location:</span>{' '}
                    {row.locationCity || row.locationState || row.locationCountry
                      ? [row.locationCity, row.locationState, row.locationCountry].filter(Boolean).join(', ')
                      : '—'}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-amber-600" />
                    <span className="text-gray-500">Price:</span> {row.coinsPerMinute} coins/min
                  </p>
                  <p className="inline-flex items-center gap-1.5 md:col-span-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-500">Specialties:</span>{' '}
                    {(row.specialties || []).length ? (row.specialties || []).join(', ') : '—'}
                  </p>
                  <p className="inline-flex items-start gap-1.5 md:col-span-2 line-clamp-2 text-xs text-gray-500">
                    <ScanText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>
                      <span className="text-gray-500">Prompt:</span> {row.systemPrompt}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
