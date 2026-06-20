'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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
import {
  ChatComposer,
  ChatMessageList,
  ChatSessionHeader,
  ChatSessionShell,
  ChatSessionSkeleton,
} from '@/components/chat';
import NotFound from '@/app/[locale]/not-found';

export default function ChatSessionPage() {
  const tc = useTranslations('chatSession');
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
  const coinsPerMinute = astrologer?.coinsPerMinute ?? 0;
  const lowCoinsForNextMinute =
    session?.status === 'active' && coinsPerMinute > 0 && balance < coinsPerMinute;
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
  const nextBillCountdown =
    session?.status === 'active'
      ? elapsedIntoCurrentMinute === 0 && elapsedSeconds > 0
        ? 60
        : 60 - elapsedIntoCurrentMinute
      : 0;
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
    return <ChatSessionSkeleton />;
  }

  return (
    <ChatSessionShell>
      <ChatSessionHeader
        astrologer={astrologer}
        balance={balance}
        coinsPerMinute={coinsPerMinute}
        elapsedLabel={elapsedLabel}
        nextBillLabel={nextBillLabel}
        billedSecondsLive={billedSecondsLive}
        isSessionClosed={isSessionClosed}
        ending={ending}
        onEndChat={() => void closeSession()}
      />

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        {lowCoinsForNextMinute ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950">
            {tc('lowBalance')}
          </p>
        ) : null}

        <ChatMessageList
          messages={messages}
          astrologer={astrologer}
          isAstrologerTyping={isAstrologerTyping}
          isSessionClosed={isSessionClosed}
          isLoading={isLoading}
          viewportRef={messagesViewportRef}
        />

        <ChatComposer
          text={text}
          onTextChange={setText}
          onSubmit={() => void submit()}
          sending={sending}
          isSessionClosed={isSessionClosed}
          isLoading={isLoading}
        />
      </div>
    </ChatSessionShell>
  );
}
