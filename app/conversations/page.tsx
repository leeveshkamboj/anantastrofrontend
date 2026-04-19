'use client';

import Link from 'next/link';
import { useGetMyChatSessionsQuery } from '@/store/api/chatApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowUpRight, Clock3, Coins, MessageCircleMore } from 'lucide-react';

export default function ConversationsPage() {
  const { data, isLoading } = useGetMyChatSessionsQuery();
  const sessions = data?.data || [];

  return (
    <div className="container mx-auto max-w-5xl px-3 py-5 sm:px-4 sm:py-8">
      <Card className="border-0 bg-white/90 shadow-xl backdrop-blur">
        <CardHeader className="border-b bg-linear-to-r from-violet-50 via-fuchsia-50 to-indigo-50 pt-8">
          <CardTitle className="inline-flex items-center gap-2 text-xl">
            <MessageCircleMore className="h-5 w-5 text-violet-700" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-5">
          {isLoading ? (
            <p className="text-gray-500">Loading conversations...</p>
          ) : sessions.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-8 text-center text-gray-500">
              No conversations yet.
            </div>
          ) : (
            sessions.map((s: any) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        s.aiAstrologer?.avatarUrl?.trim()
                          ? s.aiAstrologer.avatarUrl
                          : `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
                              s.aiAstrologer?.slug || s.aiAstrologer?.displayName || `session-${s.id}`,
                            )}`
                      }
                      alt={s.aiAstrologer?.displayName || 'Astrologer'}
                      width={30}
                      height={30}
                      className="rounded-full border bg-white"
                    />
                    <p className="truncate font-semibold text-gray-900">
                      {s.aiAstrologer?.displayName || `Session #${s.id}`}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2 py-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(s.startedAt).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2 py-1">
                      <Coins className="h-3.5 w-3.5 text-amber-600" />
                      {s.totalCoinsDebited} coins debited
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Badge
                    variant={s.status === 'active' ? 'default' : 'secondary'}
                    className={s.status === 'active' ? '' : 'bg-gray-100 text-gray-700'}
                  >
                    {s.status}
                  </Badge>
                  <Button asChild variant="outline">
                    <Link href={`/chat/${s.uuid}`} className="inline-flex items-center gap-1.5">
                      Open
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
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
