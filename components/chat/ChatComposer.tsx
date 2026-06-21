"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useMotion } from "@/components/motion/MotionProvider"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Input } from "@/components/ui/input"
import { getTapProps } from "@/lib/motion"

type ChatComposerProps = {
  text: string
  onTextChange: (value: string) => void
  onSubmit: () => void
  onPrimeAudio?: () => void
  sending: boolean
  isSessionClosed: boolean
  isLoading: boolean
}

export function ChatComposer({
  text,
  onTextChange,
  onSubmit,
  onPrimeAudio,
  sending,
  isSessionClosed,
  isLoading,
}: ChatComposerProps) {
  const t = useTranslations("chatSession")
  const { reduced } = useMotion()

  return (
    <motion.div
      className="space-y-2"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
    >
      <motion.div
        animate={sending && !reduced ? { scale: [1, 0.985, 1] } : { scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
      >
        <Input
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onFocus={onPrimeAudio}
          onKeyDown={(e) => {
            onPrimeAudio?.()
            if (e.key === "Enter") onSubmit()
          }}
          placeholder={isSessionClosed ? t("placeholderClosed") : t("placeholderType")}
          className="h-10 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 sm:h-11"
          disabled={isSessionClosed || isLoading}
        />
        <motion.div
          {...getTapProps(reduced)}
          animate={
            sending && !reduced
              ? { scale: [1, 0.92, 1], rotate: [0, -4, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <CosmicButton
            type="button"
            size="sm"
            onClick={() => {
              onPrimeAudio?.()
              onSubmit()
            }}
            disabled={sending || !text.trim() || isSessionClosed || isLoading}
            className="shrink-0 normal-case tracking-normal"
          >
            {isSessionClosed ? t("closed") : isLoading ? t("loading") : sending ? t("sending") : t("send")}
          </CosmicButton>
        </motion.div>
      </motion.div>
      <p className="text-center text-xs text-gray-500">
        {isSessionClosed ? t("billingStopped") : t("billingActive")}
      </p>
    </motion.div>
  )
}
