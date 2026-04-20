'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectToken } from '@/store/slices/authSlice';
import {
  useEndChatSessionMutation,
  useGetChatMessagesQuery,
  useGetChatSessionDetailsQuery,
  useSendChatMessageMutation,
} from '@/store/api/chatApi';
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { MapPin, PhoneOff } from 'lucide-react';
import NotFound from '@/app/not-found';

export default function ChatSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const token = useSelector(selectToken);
  const sessionUuid = String(params?.sessionId || '');
  const [text, setText] = useState('');
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);
  const [nowTs, setNowTs] = useState(Date.now());
  const sessionEndedRef = useRef(false);
  const autoEndCleanupArmedRef = useRef(false);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const { data, refetch: refetchMessages, isLoading } = useGetChatMessagesQuery(
    { sessionUuid },
    { skip: !sessionUuid },
  );
  const { data: sessionData, error: sessionError, refetch: refetchSession } = useGetChatSessionDetailsQuery(
    { sessionUuid },
    { skip: !sessionUuid },
  );
  const { data: walletData, refetch: refetchWallet } = useGetMyWalletQuery();
  const [sendMessage, { isLoading: sending }] = useSendChatMessageMutation();
  const [endSession, { isLoading: ending }] = useEndChatSessionMutation();

  useEffect(() => {
    if (token) return;
    const next = `/chat/${encodeURIComponent(sessionUuid)}`;
    router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
  }, [token, router, sessionUuid]);

  useEffect(() => {
    if (!sessionUuid || !token) return;
    const wsBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const socket = io(`${wsBase}/chat`, { auth: { token } });
    socket.emit('chat:join', { sessionId: sessionUuid });
    const syncFromServer = () => {
      void refetchMessages();
      void refetchSession();
      void refetchWallet();
    };
    socket.on('chat:message', syncFromServer);
    socket.on('chat:session-ended', syncFromServer);
    socket.on('chat:typing', (payload: { isTyping?: boolean }) => {
      setIsAstrologerTyping(Boolean(payload?.isTyping));
    });
    return () => {
      socket.disconnect();
    };
  }, [sessionUuid, token, refetchMessages, refetchSession, refetchWallet]);

  const submit = async () => {
    const message = text.trim();
    if (!message) return;
    try {
      await sendMessage({ sessionUuid, contentType: 'text', text: message }).unwrap();
      setText('');
    } catch {
      setIsAstrologerTyping(false);
    }
  };

  const closeSession = async () => {
    sessionEndedRef.current = true;
    await endSession({ sessionUuid }).unwrap();
    setIsAstrologerTyping(false);
    await refetchSession();
    await refetchMessages();
  };

  const messages = data?.data || [];
  const balance = walletData?.data?.balance ?? 0;
  const session = sessionData?.data;
  const astrologer = session?.aiAstrologer;
  const astroName = astrologer?.displayName || 'Astrologer';
  const astroAvatar =
    astrologer?.avatarUrl && astrologer.avatarUrl.trim()
      ? astrologer.avatarUrl
      : `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(astrologer?.slug || astroName)}`;
  const coinsPerMinute = astrologer?.coinsPerMinute ?? 0;
  const lowCoinsForNextMinute =
    session?.status === 'active' && coinsPerMinute > 0 && balance < coinsPerMinute;
  const specialtyText = astrologer?.specialties?.length
    ? astrologer.specialties.slice(0, 3).join(' • ')
    : 'Personalized astrological guidance';
  const locationText = [astrologer?.locationCity, astrologer?.locationState, astrologer?.locationCountry]
    .filter(Boolean)
    .join(', ');
  const elapsedSeconds = session?.startedAt
    ? Math.max(
        0,
        Math.floor(
          ((session?.status === 'active' ? nowTs : new Date(session?.endedAt || session.startedAt).getTime()) -
            new Date(session.startedAt).getTime()) /
            1000,
        ),
      )
    : 0;
  const elapsedIntoCurrentMinute = elapsedSeconds % 60;
  const nextBillCountdown = session?.status === 'active' ? (elapsedIntoCurrentMinute === 0 && elapsedSeconds > 0 ? 60 : 60 - elapsedIntoCurrentMinute) : 0;
  const billedSecondsLive =
    session?.status === 'active'
      ? Math.max(60, Math.floor(elapsedSeconds / 60) * 60 + 60)
      : (session?.billedSeconds ?? 0);
  const elapsedLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;
  const nextBillLabel = `${String(Math.floor(nextBillCountdown / 60)).padStart(2, '0')}:${String(nextBillCountdown % 60).padStart(2, '0')}`;
  const isSessionClosed = session?.status === 'ended';
  const isSessionNotFound =
    (sessionError as { status?: number; originalStatus?: number } | undefined)?.status === 404 ||
    (sessionError as { status?: number; originalStatus?: number } | undefined)?.originalStatus === 404;

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.senderType === 'astrologer' || last?.senderType === 'system') {
      setIsAstrologerTyping(false);
    }
  }, [messages]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const node = messagesViewportRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, isAstrologerTyping]);

  useEffect(() => {
    autoEndCleanupArmedRef.current = false;
    const armCleanupTimer = window.setTimeout(() => {
      autoEndCleanupArmedRef.current = true;
    }, 0);
    return () => {
      window.clearTimeout(armCleanupTimer);
      if (!autoEndCleanupArmedRef.current) return;
      if (!sessionUuid || !token || sessionEndedRef.current) return;
      sessionEndedRef.current = true;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiBase}/api/chat/sessions/${encodeURIComponent(sessionUuid)}/end`;
      void fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        keepalive: true,
      }).catch(() => undefined);
    };
  }, [sessionUuid, token]);

  if (isSessionNotFound) {
    return <NotFound />;
  }

  if (isLoading || !session) {
    return (
      <div className="container mx-auto max-w-5xl px-2 py-2 sm:px-4 sm:py-4 md:py-6">
        <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur supports-backdrop-filter:bg-white/70">
          <CardHeader className="border-b bg-linear-to-r from-violet-50 via-fuchsia-50 to-indigo-50">
            <div className="animate-pulse space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 rounded bg-gray-200" />
                    <div className="h-3 w-52 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-9 w-24 rounded-md bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                <div className="h-6 w-28 rounded-full bg-gray-200" />
                <div className="h-6 w-32 rounded-full bg-gray-200" />
                <div className="h-6 w-24 rounded-full bg-gray-200" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-2.5 sm:p-3 md:space-y-4 md:p-5">
            <div className="h-[58vh] overflow-y-auto rounded-2xl border bg-linear-to-b from-slate-50 to-white p-2.5 sm:h-[60vh] sm:p-3 md:h-[64vh] md:p-4">
              <div className="space-y-3 animate-pulse">
                <div className="mr-auto h-10 w-[72%] rounded-2xl border bg-white/80" />
                <div className="ml-auto h-12 w-[64%] rounded-2xl bg-violet-200/60" />
                <div className="mr-auto h-11 w-[58%] rounded-2xl border bg-white/80" />
                <div className="ml-auto h-10 w-[70%] rounded-2xl bg-violet-200/60" />
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
              <div className="h-10 flex-1 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-10 w-20 rounded-md bg-gray-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-2 py-2 sm:px-4 sm:py-4 md:py-6">
      <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur supports-backdrop-filter:bg-white/70">
        <CardHeader className="border-b bg-linear-to-r from-violet-50 via-fuchsia-50 to-indigo-50">
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:pt-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="relative">
                <Image
                  src={astroAvatar}
                  alt={astroName}
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white shadow"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    astrologer?.isOnlineNow ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate text-base text-slate-900 sm:text-lg">{astroName}</CardTitle>
                <p className="mt-0.5 text-xs text-slate-500">{specialtyText}</p>
                {locationText ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {locationText}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-slate-700">
                    <CoinGlyph className="h-3.5 w-3.5" />
                    {coinsPerMinute}/min
                  </span>
                  <span className="inline-flex items-center rounded-full border bg-white px-2.5 py-1 text-slate-700">
                    Wallet: {balance}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={closeSession}
              disabled={ending || isSessionClosed}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 sm:h-10 sm:w-auto"
            >
              <PhoneOff className="h-4 w-4" />
              {isSessionClosed ? 'Chat ended' : ending ? 'Ending...' : 'End chat'}
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:mt-3 sm:flex sm:flex-wrap sm:items-center">
            <span className="rounded-full border bg-white px-2.5 py-1 text-slate-700">Session: {elapsedLabel}</span>
            <span className="rounded-full border bg-white px-2.5 py-1 text-slate-700">Next bill in: {nextBillLabel}</span>
            <span className="rounded-full border bg-white px-2.5 py-1 text-slate-700">Billed: {billedSecondsLive}s</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-2.5 sm:p-3 md:space-y-4 md:p-5">
          {lowCoinsForNextMinute && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              Your wallet doesn&apos;t cover the next minute at this rate. Add coins soon — the chat will end
              automatically when billing can&apos;t debit your balance.
            </p>
          )}
          <div
            ref={messagesViewportRef}
            className="h-[58vh] overflow-y-auto rounded-2xl border bg-linear-to-b from-slate-50 to-white p-2.5 sm:h-[60vh] sm:p-3 md:h-[64vh] md:p-4"
          >
            {isSessionClosed && (
              <p className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                This conversation is closed. You can read previous messages, but can&apos;t send new ones.
              </p>
            )}
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="mr-auto h-10 w-[72%] rounded-2xl border bg-white/80" />
                <div className="ml-auto h-12 w-[64%] rounded-2xl bg-violet-200/60" />
                <div className="mr-auto h-11 w-[58%] rounded-2xl border bg-white/80" />
                <div className="ml-auto h-10 w-[70%] rounded-2xl bg-violet-200/60" />
              </div>
            ) : messages.length === 0 ? (
              <p className="rounded-xl border border-dashed bg-white px-3 py-2 text-sm text-slate-500">
                Conversation start karo - astrologer aapki details ke basis pe guide karega.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={m.senderType === 'system' ? 'my-2 flex justify-center' : 'my-1.5 flex items-end gap-1.5 sm:gap-2'}
                >
                  {m.senderType === 'astrologer' && (
                    <Image
                      src={astroAvatar}
                      alt={astroName}
                      width={24}
                      height={24}
                      className="mb-1 rounded-full border bg-white"
                    />
                  )}
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[86%] sm:px-3.5 sm:py-2.5 ${
                      m.senderType === 'user'
                        ? 'ml-auto bg-linear-to-r from-violet-600 to-indigo-600 text-white'
                        : m.senderType === 'system'
                          ? 'mx-auto border border-amber-200 bg-amber-50 text-amber-900'
                          : 'mr-auto border bg-white text-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.text ||
                        (m.contentType === 'image' ? 'Image sent' : m.contentType === 'video' ? 'Video sent' : '')}
                    </p>
                    <div
                      className={`mt-1 text-[10px] ${
                        m.senderType === 'user' ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isAstrologerTyping && (
              <div className="my-1.5 flex items-end gap-2">
                <Image src={astroAvatar} alt={astroName} width={24} height={24} className="mb-1 rounded-full border bg-white" />
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isSessionClosed ? 'This chat is closed' : 'Type your message...'}
              className="h-10 border-0 text-sm shadow-none focus-visible:ring-0 sm:h-11"
              disabled={isSessionClosed || isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
            />
            <Button
              onClick={submit}
              disabled={sending || !text.trim() || isSessionClosed || isLoading}
              className="h-10 px-3 text-sm bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 sm:h-11 sm:px-4"
            >
              {isSessionClosed ? 'Closed' : isLoading ? 'Loading...' : sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500">
            {isSessionClosed
              ? 'Billing has stopped for this conversation.'
              : 'Per-minute charging is applied automatically while this session is active.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
