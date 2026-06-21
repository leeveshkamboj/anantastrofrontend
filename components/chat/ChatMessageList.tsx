"use client"

import { useEffect, useRef, type RefObject } from "react"
import { AnimatePresence, motion, type Transition } from "framer-motion"
import { useTranslations } from "next-intl"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { FadeIn } from "@/components/motion"
import { useMotion } from "@/components/motion/MotionProvider"
import { getPresetForTier, getReducedPreset } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { ChatAstrologer, ChatMessage } from "@/store/api/chatApi"

type ChatMessageListProps = {
  messages: ChatMessage[]
  astrologer?: ChatAstrologer
  isAstrologerTyping: boolean
  isSessionClosed: boolean
  isLoading: boolean
  viewportRef: RefObject<HTMLDivElement | null>
  bottomRef?: RefObject<HTMLDivElement | null>
}

const sendSpring: Transition = { type: "spring", stiffness: 520, damping: 32, mass: 0.75 }
const receiveSpring: Transition = { type: "spring", stiffness: 420, damping: 28, mass: 0.85 }

export function ChatMessageList({
  messages,
  astrologer,
  isAstrologerTyping,
  isSessionClosed,
  isLoading,
  viewportRef,
  bottomRef,
}: ChatMessageListProps) {
  const t = useTranslations("chatSession")
  const primedRef = useRef(false)
  const seenIdsRef = useRef(new Set<number>())

  useEffect(() => {
    if (primedRef.current || messages.length === 0) return
    messages.forEach((message) => seenIdsRef.current.add(message.id))
    primedRef.current = true
  }, [messages])

  const shouldAnimateMessage = (messageId: number) => {
    if (seenIdsRef.current.has(messageId)) return false
    seenIdsRef.current.add(messageId)
    return true
  }

  return (
    <div
      ref={viewportRef}
      className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50/80 to-white p-3 sm:p-4"
    >
      {isSessionClosed ? (
        <FadeIn preset="fadeDown" className="mb-3">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            {t("closedReadOnly")}
          </p>
        </FadeIn>
      ) : null}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="mr-auto h-10 w-[72%] rounded-2xl bg-white/80" />
          <div className="ml-auto h-12 w-[64%] rounded-2xl bg-astro-purple/15" />
          <div className="mr-auto h-11 w-[58%] rounded-2xl bg-white/80" />
          <div className="ml-auto h-10 w-[70%] rounded-2xl bg-astro-purple/15" />
        </div>
      ) : messages.length === 0 ? (
        <FadeIn preset="scaleIn">
          <p className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 px-4 py-8 text-center text-sm text-gray-600">
            {t("emptyPrompt")}
          </p>
        </FadeIn>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            astrologer={astrologer}
            animate={shouldAnimateMessage(message.id)}
          />
        ))
      )}

      <AnimatePresence mode="popLayout">
        {isAstrologerTyping && astrologer ? (
          <TypingIndicator key="typing" astrologer={astrologer} />
        ) : null}
      </AnimatePresence>
      <div ref={bottomRef} aria-hidden="true" className="h-px w-full shrink-0" />
    </div>
  )
}

function TypingIndicator({ astrologer }: { astrologer: ChatAstrologer }) {
  const { reduced } = useMotion()

  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, x: -16, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={reduced ? undefined : { opacity: 0, x: -8, y: 4, scale: 0.97 }}
      transition={reduced ? { duration: 0.15 } : receiveSpring}
      className="my-2 flex items-end gap-2"
    >
      <motion.div
        animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <AstrologerAvatar astrologer={astrologer} variant="directory" size={24} className="mb-1 border" />
      </motion.div>
      <div className="mr-auto inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-2 w-2 rounded-full bg-astro-orange/80"
            animate={reduced ? undefined : { y: [0, -6, 0], opacity: [0.4, 1, 0.4], scale: [0.92, 1.08, 0.92] }}
            transition={
              reduced
                ? undefined
                : { duration: 0.6, repeat: Infinity, delay: index * 0.13, ease: "easeInOut" }
            }
          />
        ))}
      </div>
    </motion.div>
  )
}

function MessageBubble({
  message,
  astrologer,
  animate,
}: {
  message: ChatMessage
  astrologer?: ChatAstrologer
  animate: boolean
}) {
  const t = useTranslations("chatSession")
  const { reduced } = useMotion()
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
    const systemVariants = reduced
      ? getReducedPreset("fadeIn")
      : getPresetForTier("fadeIn", "instrument")
    return (
      <motion.div
        layout
        initial={animate && !reduced ? "hidden" : "visible"}
        animate="visible"
        variants={systemVariants}
        className="my-2 flex justify-center"
      >
        <div className="max-w-[92%] rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-900">
          <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
        </div>
      </motion.div>
    )
  }

  const enterMotion = reduced
    ? { opacity: 1, x: 0, y: 0, scale: 1 }
    : isUser
      ? { opacity: 0, x: 48, y: 14, scale: 0.82 }
      : { opacity: 0, x: -36, y: 10, scale: 0.88 }

  const visibleMotion = { opacity: 1, x: 0, y: 0, scale: 1 }

  return (
    <motion.div
      layout
      initial={animate && !reduced ? enterMotion : visibleMotion}
      animate={visibleMotion}
      transition={reduced ? { duration: 0.12 } : isUser ? sendSpring : receiveSpring}
      className={cn("my-2 flex items-end gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && astrologer ? (
        <AstrologerAvatar astrologer={astrologer} variant="directory" size={24} className="mb-1 shrink-0 border" />
      ) : null}

      <motion.div
        initial={false}
        animate={
          animate && !reduced && !isUser
            ? {
                boxShadow: [
                  "0 1px 2px rgb(0 0 0 / 0.06)",
                  "0 8px 22px rgb(124 58 237 / 0.14)",
                  "0 1px 2px rgb(0 0 0 / 0.06)",
                ],
              }
            : undefined
        }
        transition={{ duration: 0.55, ease: "easeOut" }}
        whileHover={reduced ? undefined : { scale: 1.015 }}
        className={cn(
          "relative overflow-hidden max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:max-w-[82%]",
          isUser
            ? "bg-linear-to-r from-astro-purple to-[#4a1a8a] text-white"
            : "border border-gray-200 bg-white text-gray-800",
        )}
      >
        {isUser && animate && !reduced ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20"
            initial={{ opacity: 0.45, scale: 0.85 }}
            animate={{ opacity: 0, scale: 1.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        ) : null}
        <p className="relative whitespace-pre-wrap leading-relaxed">{body}</p>
        <time
          className={cn("relative mt-1 block text-[10px] tabular-nums", isUser ? "text-white/75" : "text-gray-400")}
          dateTime={message.createdAt}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </motion.div>
    </motion.div>
  )
}
