'use client';

import { useState } from 'react';
import {
  useCreateAdminChatAstrologerMutation,
  useDeleteAdminChatAstrologerMutation,
  useGetAdminChatAstrologersQuery,
  useUpdateAdminChatAstrologerMutation,
} from '@/store/api/chatApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminAiAstrologersPage() {
  const { data, isLoading, refetch } = useGetAdminChatAstrologersQuery();
  const [createItem] = useCreateAdminChatAstrologerMutation();
  const [updateItem] = useUpdateAdminChatAstrologerMutation();
  const [deleteItem] = useDeleteAdminChatAstrologerMutation();

  const [newRow, setNewRow] = useState({
    userId: '',
    displayName: '',
    slug: '',
    systemPrompt: '',
    coinsPerMinute: '5',
  });

  const list = data?.data || [];

  const create = async () => {
    try {
      await createItem({
        userId: Number(newRow.userId),
        displayName: newRow.displayName,
        slug: newRow.slug,
        systemPrompt: newRow.systemPrompt,
        coinsPerMinute: Number(newRow.coinsPerMinute),
      }).unwrap();
      setNewRow({ userId: '', displayName: '', slug: '', systemPrompt: '', coinsPerMinute: '5' });
      refetch();
      toast.success('Astrologer created');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Create failed');
    }
  };

  const toggle = async (id: number, isActive: boolean) => {
    await updateItem({ id, body: { isActive: !isActive } }).unwrap();
    refetch();
  };

  const updatePrice = async (id: number, coinsPerMinute: number) => {
    await updateItem({ id, body: { coinsPerMinute } }).unwrap();
    refetch();
  };

  const remove = async (id: number) => {
    await deleteItem({ id }).unwrap();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Astrologers</h1>
        <p className="text-gray-600 mt-1">Manage personalities, prompts, pricing and availability.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <Input placeholder="User ID (astrologer user)" value={newRow.userId} onChange={(e) => setNewRow((s) => ({ ...s, userId: e.target.value }))} />
          <Input placeholder="Display name" value={newRow.displayName} onChange={(e) => setNewRow((s) => ({ ...s, displayName: e.target.value }))} />
          <Input placeholder="Slug" value={newRow.slug} onChange={(e) => setNewRow((s) => ({ ...s, slug: e.target.value }))} />
          <Input placeholder="Coins per minute" value={newRow.coinsPerMinute} onChange={(e) => setNewRow((s) => ({ ...s, coinsPerMinute: e.target.value }))} />
          <Input className="md:col-span-2" placeholder="System prompt" value={newRow.systemPrompt} onChange={(e) => setNewRow((s) => ({ ...s, systemPrompt: e.target.value }))} />
          <Button onClick={create} className="md:col-span-2">Create</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All AI Astrologers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            list.map((row) => (
              <div key={row.id} className="border rounded p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>
                  <div className="font-semibold">{row.displayName}</div>
                  <div className="text-sm text-gray-600">{row.slug}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{row.systemPrompt}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={row.isActive ? 'default' : 'outline'}>
                    {row.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Input
                    className="w-24"
                    defaultValue={row.coinsPerMinute}
                    onBlur={(e) => updatePrice(row.id, Number(e.target.value))}
                  />
                  <Button variant="outline" onClick={() => toggle(row.id, row.isActive)}>
                    Toggle
                  </Button>
                  <Button variant="destructive" onClick={() => remove(row.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
