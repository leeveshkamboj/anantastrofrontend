"use client"

import type { RefObject } from "react"
import { useTranslations } from "next-intl"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { cn } from "@/lib/utils"
import type { ChatAstrologer, ChatMessage } from "@/store/api/chatApi"

type ChatMessageListProps = {
  messages: ChatMessage[]
  astrologer?: ChatAstrologer
  isAstrologerTyping: boolean
  isSessionClosed: boolean
  isLoading: boolean
  viewportRef: RefObject<HTMLDivElement | null>
}

export function ChatMessageList({
  messages,
  astrologer,
  isAstrologerTyping,
  isSessionClosed,
  isLoading,
  viewportRef,
}: ChatMessageListProps) {
  const t = useTranslations("chatSession")

  return (
    <div
      ref={viewportRef}
      className="min-h-[50vh] flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50/80 to-white p-3 sm:min-h-[58vh] sm:p-4"
    >
      {isSessionClosed ? (
        <p className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          {t("closedReadOnly")}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="mr-auto h-10 w-[72%] rounded-2xl bg-white/80" />
          <div className="ml-auto h-12 w-[64%] rounded-2xl bg-astro-purple/15" />
          <div className="mr-auto h-11 w-[58%] rounded-2xl bg-white/80" />
          <div className="ml-auto h-10 w-[70%] rounded-2xl bg-astro-purple/15" />
        </div>
      ) : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 px-4 py-8 text-center text-sm text-gray-600">
          {t("emptyPrompt")}
        </p>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} astrologer={astrologer} />
        ))
      )}

      {isAstrologerTyping && astrologer ? (
        <div className="my-2 flex items-end gap-2">
          <AstrologerAvatar astrologer={astrologer} variant="directory" size={24} className="mb-1 border" />
          <div className="mr-auto inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-astro-orange/70" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-astro-orange/70 [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-astro-orange/70 [animation-delay:240ms]" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MessageBubble({
  message,
  astrologer,
}: {
  message: ChatMessage
  astrologer?: ChatAstrologer
}) {
  const t = useTranslations("chatSession")
  const isUser = message.senderType === "user"
  const isSystem = message.senderType === "system"

  const body =
    message.text ||
    (message.contentType === "image"
      ? t("imageSent")
      : message.contentType === "video"
        ? t("videoSent")
        : "")

  if (isSystem) {
    return (
      <div className="my-2 flex justify-center">
        <div className="max-w-[92%] rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-900">
          <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("my-2 flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && astrologer ? (
        <AstrologerAvatar astrologer={astrologer} variant="directory" size={24} className="mb-1 shrink-0 border" />
      ) : null}

      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:max-w-[82%]",
          isUser
            ? "bg-linear-to-r from-astro-purple to-[#4a1a8a] text-white"
            : "border border-gray-200 bg-white text-gray-800",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
        <time
          className={cn("mt-1 block text-[10px] tabular-nums", isUser ? "text-white/75" : "text-gray-400")}
          dateTime={message.createdAt}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </div>
    </div>
  )
}
