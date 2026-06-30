'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  useEndChatSessionMutation,
  useGetChatMessagesQuery,
  useGetChatSessionDetailsQuery,
  useSendChatMessageMutation,
} from '@/store/api/chatApi';
import { useGetMyWalletQuery } from '@/store/api/coinsApi';
import { useCoinLaunchFlags } from '@/hooks/useServiceRunPrice';
import {
  ChatComposer,
  ChatMessageList,
  ChatSessionHeader,
  ChatSessionShell,
  ChatSessionSkeleton,
} from '@/components/chat';
import { useChatSounds } from '@/hooks/useChatSounds';
import NotFound from '@/app/[locale]/not-found';

export default function ChatSessionPage() {
  const tc = useTranslations('chatSession');
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionUuid = String(params?.sessionId || '');
  const [text, setText] = useState('');
  const [isAstrologerTyping, setIsAstrologerTyping] = useState(false);
  const [nowTs, setNowTs] = useState(Date.now());
  const sessionEndedRef = useRef(false);
  const autoEndCleanupArmedRef = useRef(false);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const messagesBottomRef = useRef<HTMLDivElement | null>(null);
  const messagesPrimedRef = useRef(false);
  const prevTypingRef = useRef(false);
  const knownMessageIdsRef = useRef(new Set<number>());
  const { prime: primeChatAudio, playSend, playReceive, playTyping } = useChatSounds();
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
    if (isAuthenticated) return;
    const next = `/chat/${encodeURIComponent(sessionUuid)}`;
    router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
  }, [isAuthenticated, router, sessionUuid]);

  useEffect(() => {
    if (!sessionUuid || !isAuthenticated) return;
    const wsBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const socket = io(`${wsBase}/chat`, { withCredentials: true });
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
  }, [sessionUuid, isAuthenticated, refetchMessages, refetchSession, refetchWallet]);

  const submit = async () => {
    const message = text.trim();
    if (!message) return;
    playSend();
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
  const { freeServicesEnabled } = useCoinLaunchFlags();
  const coinsPerMinute = astrologer?.coinsPerMinute ?? 0;
  const lowCoinsForNextMinute =
    !freeServicesEnabled &&
    session?.status === 'active' &&
    coinsPerMinute > 0 &&
    balance < coinsPerMinute;
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
    messagesPrimedRef.current = false;
    knownMessageIdsRef.current = new Set();
    prevTypingRef.current = false;
  }, [sessionUuid]);

  useEffect(() => {
    if (isAstrologerTyping && !prevTypingRef.current) {
      playTyping();
    }
    prevTypingRef.current = isAstrologerTyping;
  }, [isAstrologerTyping, playTyping]);

  useEffect(() => {
    if (messages.length === 0) return;

    if (!messagesPrimedRef.current) {
      messages.forEach((message) => knownMessageIdsRef.current.add(message.id));
      messagesPrimedRef.current = true;
      return;
    }

    for (const message of messages) {
      if (knownMessageIdsRef.current.has(message.id)) continue;
      knownMessageIdsRef.current.add(message.id);
      if (message.senderType === 'astrologer') {
        playReceive();
      }
    }
  }, [messages, playReceive]);

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
    const anchor = messagesBottomRef.current;
    if (!anchor) return;

    const behavior: ScrollBehavior = messagesPrimedRef.current ? 'smooth' : 'auto';
    requestAnimationFrame(() => {
      anchor.scrollIntoView({ behavior, block: 'end' });
    });
  }, [messages, isAstrologerTyping, sending]);

  useEffect(() => {
    autoEndCleanupArmedRef.current = false;
    const armCleanupTimer = window.setTimeout(() => {
      autoEndCleanupArmedRef.current = true;
    }, 0);
    return () => {
      window.clearTimeout(armCleanupTimer);
      if (!autoEndCleanupArmedRef.current) return;
      if (!sessionUuid || !isAuthenticated || sessionEndedRef.current) return;
      sessionEndedRef.current = true;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiBase}/api/chat/sessions/${encodeURIComponent(sessionUuid)}/end`;
      void fetch(url, {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
      }).catch(() => undefined);
    };
  }, [sessionUuid, isAuthenticated]);

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
        freeServicesEnabled={freeServicesEnabled}
        elapsedLabel={elapsedLabel}
        nextBillLabel={nextBillLabel}
        billedSecondsLive={billedSecondsLive}
        isSessionClosed={isSessionClosed}
        ending={ending}
        onEndChat={() => void closeSession()}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <AnimatePresence mode="wait">
          {lowCoinsForNextMinute ? (
            <motion.p
              key="low-balance"
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950"
            >
              {tc('lowBalance')}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <ChatMessageList
          messages={messages}
          astrologer={astrologer}
          isAstrologerTyping={isAstrologerTyping}
          isSessionClosed={isSessionClosed}
          isLoading={isLoading}
          viewportRef={messagesViewportRef}
          bottomRef={messagesBottomRef}
        />

        <div className="shrink-0">
          <ChatComposer
            text={text}
            onTextChange={setText}
            onSubmit={() => void submit()}
            onPrimeAudio={primeChatAudio}
            sending={sending}
            isSessionClosed={isSessionClosed}
            isLoading={isLoading}
          />
        </div>
      </div>
    </ChatSessionShell>
  );
}
